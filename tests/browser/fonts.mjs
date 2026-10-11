import { expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Optional offline QA: reuse installed, unmodified Geist variable font files.
// This replaces only the font transport, never production CSS or font metrics.
export async function guardNetwork(context) {
  const dir = process.env.RESUME_TEST_FONT_DIR;
  const faces = [['Geist', 'Geist-Variable.woff2'], ['Geist Mono', 'GeistMono-Variable.woff2']];
  const fonts = dir ? await Promise.all(faces.map(async ([family, file]) => ({ family, file, body: await readFile(join(dir, file)) }))) : [];
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (dir && url.hostname === 'fonts.googleapis.com') {
      return route.fulfill({ contentType: 'text/css', body: fonts.map(({ family, file }) => `@font-face{font-family:'${family}';font-style:normal;font-weight:100 900;font-display:swap;src:url(https://fonts.gstatic.com/${file}) format('woff2')}`).join('\n') });
    }
    if (dir && url.hostname === 'fonts.gstatic.com') {
      const font = fonts.find(({ file }) => url.pathname === `/${file}`);
      return font ? route.fulfill({ contentType: 'font/woff2', body: font.body, headers: { 'access-control-allow-origin': '*' } }) : route.abort();
    }
    return !dir && ['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname) ? route.continue() : route.abort();
  });
}

export async function expectLoadedFonts(page) {
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family.replaceAll('"', '')));
  // A CSS family declaration and fonts.ready alone also pass on fallback.
  expect(loaded, 'font transport: Geist must actually load').toContain('Geist');
  expect(loaded, 'font transport: Geist Mono must actually load').toContain('Geist Mono');
  return loaded;
}
