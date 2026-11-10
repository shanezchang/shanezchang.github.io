import { expect } from '@playwright/test';
// All production fonts are local. Never substitute fonts in regression tests:
// a successful fallback must not masquerade as successful Maple transport.
export async function guardNetwork(context) {
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1') return route.continue();
    return route.abort();
  });
}

export async function expectLoadedFonts(page, media = 'screen') {
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family.replaceAll('"', '')));
  // A CSS family declaration and fonts.ready alone also pass on fallback.
  for (const family of media === 'print' ? ['Geist', 'Geist Mono'] : ['Maple Mono']) {
    expect(loaded, `font transport: ${family} must actually load`).toContain(family);
  }
  if (media === 'screen' && (await page.locator('html').getAttribute('lang')).startsWith('zh')) {
    expect(loaded, 'Chinese must use real Maple CN glyphs').toContain('Maple Mono CN');
  }
  return loaded;
}
