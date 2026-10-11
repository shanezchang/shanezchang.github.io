import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { guardNetwork, expectLoadedFonts } from './fonts.mjs';

const routes = [
  { path: '/', lang: 'en', title: 'Shane Chang', theme: true },
  { path: '/resume/en/', lang: 'en', title: 'Shane Chang', theme: true },
  { path: '/resume/zh/', lang: 'zh', title: '张帅', theme: true },
  { path: '/resume/en-1p/', lang: 'en', title: 'Shane Chang', theme: false },
  { path: '/resume/zh-1p/', lang: 'zh-CN', title: '张帅', theme: false },
  { path: '/missing-page-for-regression/', lang: 'en', title: '404', theme: false },
];

test.beforeEach(async ({ context }) => guardNetwork(context));

for (const route of routes) for (const width of [320, 390, 1280]) for (const scheme of ['light', 'dark']) {
  test(`${route.path} ${width}px ${scheme}`, async ({ page }, testInfo) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: scheme });
    const response = await page.goto(route.path);
    expect(response.status()).toBe(route.title === '404' ? 404 : 200);
    await expectLoadedFonts(page);
    await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
    await expect(page.locator('h1')).toHaveText(route.title);
    const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
    await expect(page.locator('body')).toHaveCSS('font-family', /Geist/);
    expect(await page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || !image.naturalWidth).map((image) => image.src))).toEqual([]);
    if (route.theme) {
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      const separation = await page.locator('.nav').evaluate((nav) => {
        const brand = nav.querySelector('.logo').getBoundingClientRect();
        const links = nav.querySelector('.nav-actions').getBoundingClientRect();
        return links.left - brand.right;
      });
      expect(separation, 'brand and navigation need a visible gap').toBeGreaterThanOrEqual(8);
    }
    if (route.path.includes('-1p') || route.title === '404') await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true, animations: 'disabled' });
    expect(errors).toEqual([]);
  });
}

for (const width of [320, 390, 1280]) {
  test(`home → EN → 中文 → EN, theme persistence and keyboard: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByRole('link', { name: 'Read the full resume' }).click();
    await expect(page).toHaveURL(/\/resume\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const chinese = page.locator('.lang-switch');
    await chinese.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/resume\/zh\/$/);
    await expect(page.locator('h1')).toHaveText('张帅');
    await page.locator('.lang-switch').click();
    await expect(page).toHaveURL(/\/resume\/en\/$/);
    await page.getByRole('button', { name: 'Toggle theme' }).click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/:4438\/$/);
    await page.getByRole('link', { name: 'Connect', exact: true }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();
  });
}

for (const [path, target] of [['/en/', '/resume/en/'], ['/zh/', '/resume/zh/'], ['/resume/', '/resume/en/']]) {
  test(`legacy ${path} redirects to ${target} without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await guardNetwork(context);
    const page = await context.newPage();
    try {
      await page.goto(`http://127.0.0.1:4438${path}`);
      await expect(page).toHaveURL(`http://127.0.0.1:4438${target}`);
      await expect(page.locator('h1')).toHaveText(target.includes('/zh/') ? '张帅' : 'Shane Chang');
    } finally { await context.close(); }
  });
}

test('404 is an actual error, remains on the requested URL and recovers home', async ({ page }) => {
  const response = await page.goto('/missing-page-for-regression/');
  expect(response.status()).toBe(404);
  await expect(page).toHaveURL(/\/missing-page-for-regression\/$/);
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Shane Chang');
});

test('static robots, XML and plain-text resume resources are served as their real types', async ({ request }) => {
  for (const [path, type] of [['/robots.txt', /text\/plain/], ['/sitemap.xml', /(?:application|text)\/xml/], ['/resume/en-1p.txt', /text\/plain/], ['/resume/zh-1p.txt', /text\/plain/]]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(type);
    expect(await response.text()).not.toContain('<!DOCTYPE html>');
  }
});

for (const path of ['/resume/en/', '/resume/zh/', '/resume/en-1p/', '/resume/zh-1p/']) for (const scheme of ['light', 'dark']) {
  test(`A4 print content and bounds: ${path} ${scheme}`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(path);
    await expectLoadedFonts(page);
    await page.emulateMedia({ media: 'print' });
    const onePage = path.includes('-1p');
    const content = await page.locator('main').innerText();
    for (const term of path.includes('/zh') ? ['张帅', '深圳大学', '腾讯', '扬腾', 'PeopleSearchBench'] : ['Shane Chang', 'Shenzhen University', 'Tencent', 'Yangteng', 'PeopleSearchBench']) expect(content).toContain(term);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    if (!onePage) {
      await expect(page.locator('nav')).toBeHidden();
      await expect(page.locator('footer')).toBeHidden();
    } else {
      const bounds = await page.locator('.sheet').evaluate((sheet) => {
        const rect = sheet.getBoundingClientRect();
        const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT);
        const overflow = [];
        let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          for (const box of range.getClientRects()) if (box.right > rect.right + 1 || box.left < rect.left - 1 || box.bottom > rect.top + 1123) overflow.push(node.textContent);
        }
        return { width: rect.width, height: rect.height, overflow };
      });
      expect(bounds.width).toBeCloseTo(793.7, 0);
      expect(bounds.height).toBeLessThanOrEqual(1123);
      expect(bounds.overflow).toEqual([]);
    }
    const pdf = await page.pdf({ path: testInfo.outputPath('resume.pdf'), preferCSSPageSize: true, printBackground: true });
    const raw = pdf.toString('latin1');
    const pages = (raw.match(/\/Type\s*\/Page\b/g) ?? []).length;
    const mediaBoxes = [...raw.matchAll(/\/MediaBox\s*\[0 0 ([\d.]+) ([\d.]+)\]/g)];
    expect(mediaBoxes.length).toBe(pages);
    for (const [, width, height] of mediaBoxes) {
      // Chromium serializes floating-point page dimensions differently by OS.
      expect(Number(width)).toBeCloseTo(594.96, 1);
      expect(Number(height)).toBeCloseTo(841.92, 1);
    }
    if (onePage) expect(pages).toBe(1); else expect(pages).toBeGreaterThan(0);
    await writeFile(testInfo.outputPath('print.json'), JSON.stringify({ path, scheme, pages, content }, null, 2));
    await page.screenshot({ path: testInfo.outputPath('print.png'), fullPage: true, animations: 'disabled' });
  });
}
