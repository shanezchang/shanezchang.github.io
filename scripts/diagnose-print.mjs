// Temporary SHA-180 probe. Removed after comparing today's Linux baseline.
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const out = '.ci-print-evidence';
await mkdir(out, { recursive: true });
const servers = [];
for (const [port, dir] of [[8880, process.env.BASELINE_ROOT ?? '.ci-baseline/dist'], [8881, 'dist']]) {
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      const file = join(dir, path, path.endsWith('/') ? 'index.html' : '');
      const body = await readFile(file);
      res.setHeader('Content-Type', { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' }[extname(file)] ?? 'application/octet-stream');
      res.end(body);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  servers.push(server);
}
const linuxFonts = {
  'geist-latin.woff2': 'https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFU.woff2',
  'geist-mono-latin.woff2': 'https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2',
};
const browser = await chromium.launch();
let baseline;
for (const [name, port] of [
  ['main-live', 8880], ['main-maple-files', 8880], ['maple', 8881],
  ['maple-linux-files', 8881], ['maple-print-first', 8881],
  ['maple-static-face-ranges', 8881], ['maple-geometric', 8881],
]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const requests = [];
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (name === 'main-maple-files' && url.hostname === 'fonts.googleapis.com') {
      return route.fulfill({ contentType: 'text/css', body: [['Geist','geist-latin.woff2'],['Geist Mono','geist-mono-latin.woff2']].map(([family, file]) => `@font-face{font-family:'${family}';font-weight:100 900;src:url(http://127.0.0.1:8881/fonts/${file})}`).join('') });
    }
    if (name === 'maple-linux-files' && linuxFonts[url.pathname.split('/').at(-1)]) {
      const response = await route.fetch({ url: linuxFonts[url.pathname.split('/').at(-1)] });
      return route.fulfill({ response });
    }
    if (name === 'maple-static-face-ranges' && url.pathname.endsWith('.css')) {
      const response = await route.fetch();
      const css = (await response.text()).replace(/@font-face\s*\{[^}]+\}/g, (rule) => /font-family:[^;}]*Geist/.test(rule)
        ? [400,500,600,700].map(weight => rule.replace(/font-weight:100 900/, `font-weight:${weight}`)).join('') : rule);
      return route.fulfill({ response, body: css });
    }
    return route.continue();
  });
  const page = await context.newPage();
  const responseTasks = [];
  page.on('response', (response) => {
    if (response.url().endsWith('.woff2')) responseTasks.push((async () => {
      const body = await response.body();
      requests.push({ url: response.url(), status: response.status(), bytes: body.length, sha256: createHash('sha256').update(body).digest('hex') });
    })());
  });
  if (name === 'maple-print-first') await page.emulateMedia({ media: 'print' });
  await page.goto(`http://127.0.0.1:${port}/resume/zh-1p/`);
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  if (name === 'maple-geometric') await page.addStyleTag({ content: '@media print{body{text-rendering:geometricPrecision}}' });
  const cdp = await context.newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  const nodes = await page.locator('.sheet *').evaluateAll(els => els.map((e,i) => {
    const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return { i, tag: e.tagName, class: e.className, text: e.textContent, rect: { x:r.x,y:r.y,width:r.width,height:r.height }, family:s.fontFamily,size:s.fontSize,weight:s.fontWeight,lineHeight:s.lineHeight,spacing:s.letterSpacing,synthesis:s.fontSynthesis };
  }));
  const fonts = [];
  for (const selector of ['.summary','.job-title','.job-role','.date','.project-title','.bullets li']) {
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId:root.nodeId, selector });
    fonts.push({ selector, ...await cdp.send('CSS.getPlatformFontsForNode', { nodeId }) });
  }
  const height = await page.locator('.sheet').evaluate(el => el.getBoundingClientRect().height);
  const file = `${out}/${name}.pdf`;
  await page.pdf({ path:file,preferCSSPageSize:true,printBackground:true });
  const pages = Number(execFileSync('pdfinfo',[file],{encoding:'utf8'}).match(/Pages:\s+(\d+)/)[1]);
  await Promise.all(responseTasks);
  const loaded = await page.evaluate(() => [...document.fonts].filter(f=>f.status==='loaded').map(f=>[f.family,f.weight]));
  const result = { name,height,pages,fonts,loaded,requests,browser:browser.version(),nodes };
  if (!baseline) baseline = result;
  const differences = nodes.flatMap((node,i) => JSON.stringify(node.rect) === JSON.stringify(baseline.nodes[i]?.rect) ? [] : [{ text:node.text.slice(0,55),class:node.class,old:baseline.nodes[i]?.rect,new:node.rect }]);
  await writeFile(`${out}/${name}.json`,JSON.stringify(result,null,2));
  console.log('LINUX_PRINT_DIAG', JSON.stringify({ ...result,nodes:undefined,differences:differences.slice(0,22) }));
  await context.close();
}
await browser.close();
for (const server of servers) server.close();
