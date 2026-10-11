import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { load } from 'cheerio';

const origin = 'https://shanezchang.github.io';
const formal = [['/', 'en'], ['/resume/en/', 'en'], ['/resume/zh/', 'zh']];
const html = async (path) => load(await readFile(new URL(`../dist${path}index.html`, import.meta.url), 'utf8'));
const alternates = [
  ['en', `${origin}/resume/en/`],
  ['zh', `${origin}/resume/zh/`],
  ['x-default', `${origin}/resume/en/`],
];

for (const [path, lang] of formal) {
  test(`${path}: self canonical, language and real public metadata`, async () => {
    const $ = await html(path);
    assert.equal($('html').attr('lang'), lang);
    assert.equal($('link[rel="canonical"]').length, 1);
    assert.equal($('link[rel="canonical"]').attr('href'), origin + path);
    assert.ok($('title').text().trim());
    assert.ok($('meta[name="description"]').attr('content')?.trim());
    assert.doesNotMatch($('meta[name="robots"]').attr('content') ?? '', /noindex|none/);
  });
}

for (const path of ['/resume/en/', '/resume/zh/']) {
  test(`${path}: complete reciprocal hreflang including itself`, async () => {
    const $ = await html(path);
    assert.deepEqual($('link[rel="alternate"][hreflang]').map((_, el) => [[$(el).attr('hreflang'), $(el).attr('href')]]).get(), alternates);
  });
}

const excluded = ['/en/', '/zh/', '/resume/', '/resume/en-1p/', '/resume/zh-1p/', '/preview/v3/', '/preview/v5/'];
for (const path of excluded) {
  test(`${path}: intentionally unindexed; never a language alternate`, async () => {
    const $ = await html(path);
    assert.match($('meta[name="robots"]').attr('content') ?? '', /(?:^|[,\s])noindex(?:$|[,\s])/);
    assert.equal($('link[hreflang]').length, 0);
  });
}

for (const [path, target] of [['/en/', '/resume/en/'], ['/zh/', '/resume/zh/'], ['/resume/', '/resume/en/']]) {
  test(`${path}: backward-compatible redirect has a working fallback`, async () => {
    const $ = await html(path);
    assert.equal($('meta[http-equiv="refresh"]').attr('content'), `0;url=${target}`);
    assert.equal($('link[rel="canonical"]').attr('href'), origin + target);
    assert.equal($(`a[href="${target}"]`).length, 1);
  });
}

test('sitemap includes exactly the three formal canonical pages', async () => {
  const $ = load(await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8'), { xml: true });
  assert.equal($('urlset').attr('xmlns'), 'http://www.sitemaps.org/schemas/sitemap/0.9');
  const locations = $('urlset > url > loc').map((_, el) => $(el).text()).get();
  assert.deepEqual(locations.sort(), formal.map(([path]) => origin + path).sort());
  assert.equal($('urlset > url').length, formal.length);
});

test('robots advertises the sitemap and allows HTML noindex to be read', async () => {
  const robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Sitemap: https:\/\/shanezchang\.github\.io\/sitemap\.xml$/m);
  const disallows = robots.split('\n').filter((line) => line.startsWith('Disallow:')).map((line) => line.slice(9).trim());
  assert.deepEqual(disallows.sort(), ['/resume/en-1p.txt', '/resume/zh-1p.txt']);
  assert.doesNotMatch(robots, /^Noindex:/im);
});

test('404 artifact is unindexed and provides real recovery links', async () => {
  const $ = load(await readFile(new URL('../dist/404.html', import.meta.url), 'utf8'));
  assert.match($('meta[name="robots"]').attr('content') ?? '', /noindex/);
  assert.equal($('link[rel="canonical"], link[hreflang]').length, 0);
  assert.match($('h1').text(), /404/);
  for (const path of ['/', '/resume/en/', '/resume/zh/']) assert.equal($(`a[href="${path}"]`).length, 1);
});

test('homepage identifies the actual canonical site, not an unconfigured domain', async () => {
  const $ = await html('/');
  assert.equal($('.hero .kicker').text().trim(), '// shanezchang.github.io');
});

test('every generated HTML route has an explicit indexing classification', async () => {
  const files = (await readdir(new URL('../dist/', import.meta.url), { recursive: true })).filter((file) => file.endsWith('.html')).sort();
  assert.deepEqual(files, ['404.html', ...formal.map(([path]) => `${path.slice(1)}index.html`), ...excluded.map((path) => `${path.slice(1)}index.html`)].sort());
});

test('built local navigation, fragments, styles, scripts and images resolve', async () => {
  const files = new Set(await readdir(new URL('../dist/', import.meta.url), { recursive: true }));
  let checked = 0;
  for (const file of [...files].filter((name) => name.endsWith('.html'))) {
    const $ = load(await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8'));
    const base = new URL(file === 'index.html' ? '/' : '/' + file.replace(/index\.html$/, ''), origin);
    for (const el of $('[href], [src]').toArray()) {
      const value = $(el).attr('href') ?? $(el).attr('src');
      assert.ok(value, `${file}: empty link or asset`);
      const target = new URL(value, base);
      assert.ok(['https:', 'mailto:', 'tel:', 'data:'].includes(target.protocol), `${file}: unsupported URL ${value}`);
      if (target.origin !== origin) continue;
      const path = decodeURIComponent(target.pathname).slice(1);
      const targetFile = target.pathname.endsWith('/') ? `${path}index.html` : path;
      assert.ok(files.has(targetFile), `${file}: missing local target ${value}`);
      if (target.hash) {
        const destination = load(await readFile(new URL(`../dist/${targetFile}`, import.meta.url), 'utf8'));
        assert.ok(destination('[id]').toArray().some((node) => destination(node).attr('id') === decodeURIComponent(target.hash.slice(1))), `${file}: missing fragment ${value}`);
      }
      checked++;
    }
  }
  assert.ok(checked > 50, 'coverage must include assets, redirects and resume navigation');
});

for (const [path] of formal) {
  test(`${path}: no experimental placeholders or tracking scripts`, async () => {
    const $ = await html(path);
    for (const el of $('a[href]').toArray()) assert.doesNotMatch($(el).attr('href'), /example\.(com|org)|^#$/);
    assert.equal($('script[data-sdkn], script[src*="analytics"], script[src*="googletagmanager"]').length, 0);
    const fonts = $('link[href*="fonts.googleapis.com/css2"]').attr('href');
    assert.match(fonts, /family=Geist:/);
    assert.match(fonts, /family=Geist\+Mono:/);
  });
}

test('the English-only homepage does not pretend to have translated homepages', async () => {
  assert.equal((await html('/'))('link[hreflang]').length, 0);
});
