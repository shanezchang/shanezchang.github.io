import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { guardNetwork, expectLoadedFonts } from './fonts.mjs';

const paths = ['/', '/resume/en/', '/resume/zh/', '/resume/en-1p/', '/resume/zh-1p/'];
test.beforeEach(async ({ context }) => guardNetwork(context));

for (const path of paths) {
  test(`real rendered fonts, including CJK and emphasis: ${path}`, async ({ page, context }, info) => {
    const requests = [];
    page.on('request', (request) => { if (request.url().endsWith('.woff2')) requests.push(request.url()); });
    await page.goto(path);
    await expectLoadedFonts(page);
    const client = await context.newCDPSession(page);
    await client.send('DOM.enable');
    await client.send('CSS.enable');
    const { root } = await client.send('DOM.getDocument');
    const evidence = [];
    for (const selector of ['h1', '.summary', '.project-detail', '.bullets', '.pub-title', '.job-title', '.nav a', '.hero .tagline']) {
      const { nodeId } = await client.send('DOM.querySelector', { nodeId: root.nodeId, selector });
      if (!nodeId) continue;
      const { fonts } = await client.send('CSS.getPlatformFontsForNode', { nodeId });
      evidence.push({ selector, fonts });
      expect(fonts.length).toBeGreaterThan(0);
      for (const font of fonts) {
        expect(font.isCustomFont, `${selector}: ${font.familyName} is a fallback`).toBe(true);
        expect(font.familyName).toMatch(/^Maple Mono/);
      }
    }
    await writeFile(info.outputPath('rendered-fonts.json'), JSON.stringify(evidence, null, 2));
    expect(requests.some((url) => url.includes('geist-')), 'paper fonts must not download on screen').toBe(false);
    if (!path.includes('/zh')) expect(requests.some((url) => url.includes('maple-cn-text-')), 'English pages should only fetch the tiny CN UI subset').toBe(false);
  });

  test(`font 404 and delayed swap remain readable at 320px: ${path}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const failures = [];
    page.on('pageerror', (error) => failures.push(error.message));
    await page.route('**/fonts/*.woff2', (route) => route.fulfill({ status: 404, body: '' }));
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const fallback = await page.locator('main').innerText();
    expect(fallback.trim().length).toBeGreaterThan(100);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
    await expect(page.locator('h1')).toBeVisible();
    // Delay real requests on a fresh navigation so measurements include the
    // actual fallback → Maple swap, rather than a warmed-cache screenshot.
    await page.unroute('**/fonts/*.woff2');
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await page.route('**/fonts/*.woff2', async (route) => { await gate; await route.continue(); });
    await page.addInitScript(() => {
      window.fontShifts = [];
      new PerformanceObserver((list) => window.fontShifts.push(...list.getEntries().filter((entry) => !entry.hadRecentInput).map((entry) => entry.value)))
        .observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const measure = () => page.locator('h1, .summary, .hero-cta, .hero .tagline').evaluateAll((els) => els.map((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return { selector: el.className || el.tagName, width: rect.width, height: rect.height, lineHeight: parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.32 };
    }));
    const paint = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await paint();
    const before = await measure();
    release();
    await expectLoadedFonts(page);
    await paint();
    const after = await measure();
    expect(await page.locator('main').innerText()).toBe(fallback);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
    const cls = await page.evaluate(() => window.fontShifts.reduce((a, b) => a + b, 0));
    await writeFile(info.outputPath('font-swap.json'), JSON.stringify({ before, after, cls, failures }, null, 2));
    for (let i = 0; i < before.length; i++) {
      // A line of rounding/reflow is tolerable; losing multiple lines is not.
      expect(Math.abs(after[i].height - before[i].height)).toBeLessThanOrEqual(after[i].lineHeight + 1);
    }
    expect(failures).toEqual([]);
  });
}
