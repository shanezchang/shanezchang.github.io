import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';

export const normalize = (text) => text.normalize('NFKC').replace(/[\s\u200b\u00ad]/gu, '');

// Poppler is a test-only system tool; never decode site images or alter the PDF.
export async function inspectPdf(file, prefix) {
  const text = execFileSync('pdftotext', ['-raw', file, '-'], { encoding: 'utf8' });
  // Preserve content-stream order: layout heuristics reorder mixed CJK/Latin faces.
  const xml = execFileSync('pdftotext', ['-raw', '-bbox', file, '-'], { encoding: 'utf8' });
  const $ = load(xml, { xml: true });
  const pages = $('page').toArray().map((page, index) => ({
    width: Number($(page).attr('width')), height: Number($(page).attr('height')),
    words: $(page).find('word').toArray().map((word) => ({
      page: index, text: $(word).text(),
      ...Object.fromEntries(['xMin', 'yMin', 'xMax', 'yMax'].map((key) => [key, Number($(word).attr(key))])),
    })),
  }));
  execFileSync('pdftoppm', ['-gray', '-r', '144', file, prefix]);
  execFileSync('pdftoppm', ['-png', '-r', '144', file, prefix]);
  const rasters = await Promise.all(pages.map(async (_, index) => {
    const data = await readFile(`${prefix}-${index + 1}.pgm`);
    let offset = 0;
    const token = () => {
      while (/\s/.test(String.fromCharCode(data[offset]))) offset++;
      if (data[offset] === 35) { while (data[offset] !== 10) offset++; return token(); }
      const start = offset;
      while (!/\s/.test(String.fromCharCode(data[offset]))) offset++;
      return data.subarray(start, offset).toString();
    };
    const magic = token(), width = Number(token()), height = Number(token()), max = Number(token());
    if (magic !== 'P5' || max !== 255 || data.length - offset - 1 !== width * height) throw new Error('Unexpected Poppler raster format');
    return { width, height, pixels: data.subarray(offset + 1) };
  }));
  const words = pages.flatMap((page) => page.words);
  let length = 0;
  const indexed = words.map((word) => {
    const start = length;
    length += normalize(word.text).length;
    return { ...word, start, end: length };
  });
  const joined = words.map((word) => normalize(word.text)).join('');
  const match = (text) => {
    const needle = normalize(text), start = joined.lastIndexOf(needle);
    return start < 0 ? [] : indexed.filter((word) => word.end > start && word.start < start + needle.length);
  };
  const darkFraction = (box) => {
    const raster = rasters[box.page];
    const scaleX = raster.width / pages[box.page].width, scaleY = raster.height / pages[box.page].height;
    let count = 0, dark = 0;
    for (let y = Math.max(0, Math.floor(box.yMin * scaleY)); y < Math.min(raster.height, Math.ceil(box.yMax * scaleY)); y++) {
      for (let x = Math.max(0, Math.floor(box.xMin * scaleX)); x < Math.min(raster.width, Math.ceil(box.xMax * scaleX)); x++) {
        count++;
        if (raster.pixels[y * raster.width + x] < 128) dark++;
      }
    }
    return count ? dark / count : 0;
  };
  return { text, pages, match, darkFraction };
}
