import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { guardNetwork, expectLoadedFonts } from './fonts.mjs';
import { inspectPdf, normalize } from './pdf.mjs';

test.beforeEach(async ({ context }) => guardNetwork(context));

for (const language of ['en', 'zh']) for (const onePage of [false, true]) for (const scheme of ['light', 'dark']) {
  const path = `/resume/${language}${onePage ? '-1p' : ''}/`;
  test(`print visibility and real PDF: ${path} ${scheme}`, async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.emulateMedia({ colorScheme: scheme });
    expect((await page.goto(path)).status()).toBe(200);
    const fonts = await expectLoadedFonts(page);
    if (!onePage) await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
    await page.emulateMedia({ media: 'print' });
    // Wait for existing transitions rather than injecting visual CSS.
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    const observed = await page.locator('main').evaluate((main) => {
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      const fields = [];
      let node;
      while ((node = walker.nextNode())) {
        // Only chrome is intentionally absent from paper. Hidden résumé content
        // must fail PDF completeness, not silently disappear from expectations.
        if (!node.textContent.trim() || node.parentElement.closest('nav,footer')) continue;
        const transform = getComputedStyle(node.parentElement).textTransform;
        const text = node.textContent.trim();
        fields.push(transform === 'uppercase' ? text.toUpperCase() : transform === 'lowercase' ? text.toLowerCase() : text);
      }
      const headings = [...main.querySelectorAll('.pub-title,.company,.project-name,.os-title,.job-title,.project-title')].map((element) => {
        const color = getComputedStyle(element).color;
        const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((value) => {
          const c = value / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        const luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
        return { text: element.textContent.trim(), color, contrastOnWhite: 1.05 / (luminance + 0.05) };
      });
      const logos = [...main.querySelectorAll('.company-logo,.school-logo,img.logo')].map((image) => {
        const title = image.parentElement.querySelector('.company,.school,.edu-school,.job-title');
        const a = image.getBoundingClientRect(), b = title.getBoundingClientRect();
        return { src: image.getAttribute('src'), title: title.textContent.trim(), loaded: image.complete && image.naturalWidth > 0,
          filter: getComputedStyle(image).filter, width: a.width, height: a.height, dx: a.left - b.left };
      });
      return { fields, headings, logos, background: getComputedStyle(document.body).backgroundColor,
        tokens: Object.fromEntries(['--bg', '--bg-elev', '--ink', '--ink-soft', '--ink-mute'].map((key) => [key, getComputedStyle(document.documentElement).getPropertyValue(key)])) };
    });
    await page.screenshot({ path: testInfo.outputPath('print.png'), fullPage: true, animations: 'disabled' });
    const file = testInfo.outputPath('resume.pdf');
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });
    const pdf = await inspectPdf(file, testInfo.outputPath('pdf-page'));
    const missing = observed.fields.filter((field) => !normalize(pdf.text).includes(normalize(field)));
    const outOfBounds = pdf.pages.flatMap((sheet) => sheet.words.filter((word) => word.xMin < 0 || word.yMin < 0 || word.xMax > sheet.width || word.yMax > sheet.height));
    const headingInk = observed.headings.map((heading) => {
      const words = pdf.match(heading.text);
      return { ...heading, words: words.length, minDarkFraction: words.length ? Math.min(...words.map(pdf.darkFraction)) : 0 };
    });
    const logoInk = observed.logos.map((logo) => {
      const anchor = pdf.match(logo.title)[0];
      // PDF points = CSS px * 0.75. Company/school marks sit beside their title.
      const box = anchor && { page: anchor.page, xMin: anchor.xMin + logo.dx * 0.75,
        xMax: anchor.xMin + (logo.dx + logo.width) * 0.75,
        yMin: (anchor.yMin + anchor.yMax - logo.height * 0.75) / 2,
        yMax: (anchor.yMin + anchor.yMax + logo.height * 0.75) / 2 };
      return { ...logo, box, darkFraction: box ? pdf.darkFraction(box) : 0 };
    });
    const evidence = { path, scheme, fonts, ...observed, pages: pdf.pages, missing, outOfBounds, headingInk, logoInk, errors };
    await writeFile(testInfo.outputPath('print.json'), JSON.stringify(evidence, null, 2));
    await writeFile(testInfo.outputPath('pdf-text.txt'), pdf.text);
    // Soft assertions retain all PDF/raster evidence even in the RED case.
    expect.soft(observed.background).toBe('rgb(255, 255, 255)');
    expect.soft(pdf.pages.length).toBe(onePage ? 1 : 4);
    for (const sheet of pdf.pages) {
      expect.soft(sheet.width).toBeCloseTo(594.96, 1);
      expect.soft(sheet.height).toBeCloseTo(841.92, 1);
    }
    expect.soft(missing, 'all visible print fields must survive PDF text extraction').toEqual([]);
    expect.soft(outOfBounds, 'all PDF glyph boxes must stay inside the page').toEqual([]);
    expect.soft(headingInk.length).toBeGreaterThan(0);
    for (const heading of headingInk) {
      expect.soft(heading.contrastOnWhite, `computed contrast: ${heading.text}`).toBeGreaterThanOrEqual(4.5);
      expect.soft(heading.minDarkFraction, `actual PDF ink: ${heading.text}`).toBeGreaterThan(0.01);
    }
    expect.soft(logoInk.length).toBe(4);
    for (const logo of logoInk) {
      expect.soft(logo.loaded, `logo loaded: ${logo.src}`).toBe(true);
      expect.soft(logo.filter, `no dark-screen inversion in print: ${logo.src}`).not.toContain('invert');
      expect.soft(logo.darkFraction, `actual PDF logo ink: ${logo.src}`).toBeGreaterThan(0.01);
    }
    expect.soft(errors).toEqual([]);
  });
}
