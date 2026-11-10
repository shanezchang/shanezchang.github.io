import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';

test('font artifacts match their audited coverage and checksums', async () => {
  const manifest = JSON.parse(await readFile('public/fonts/manifest.json', 'utf8'));
  for (const [name, info] of Object.entries(manifest.files)) {
    const body = await readFile(`dist/fonts/${name}`);
    assert.equal(body.toString('ascii', 0, 4), 'wOF2');
    assert.equal(body.length, info.bytes);
    assert.equal(createHash('sha256').update(body).digest('hex'), info.sha256);
  }
  const covered = new Set([...manifest.latinCodepoints, ...manifest.cjkCodepoints, 9, 10, 13]);
  for (const path of ['index.html', '404.html', ...['en', 'zh', 'en-1p', 'zh-1p'].map((lang) => `resume/${lang}/index.html`)]) {
    const $ = load(await readFile(`dist/${path}`, 'utf8'));
    $('script,style').remove();
    const missing = [...new Set([...$('body').text()].filter((char) => !covered.has(char.codePointAt(0))))];
    assert.deepEqual(missing, [], `${path}: regenerate the Maple CN subset for new text`);
  }
});
