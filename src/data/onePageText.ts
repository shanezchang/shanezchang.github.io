/**
 * Plain-text rendering of the one-page resume, for pasting into resume apps
 * and job-board forms. Same data as the PDF (`zhOnePage` / `enOnePage`), so
 * the two can never drift.
 *
 * Markdown markers are stripped: `**bold**` → plain, `[text](url)` → "text (url)".
 */
import type { OnePageResume } from './resume';

const plain = (s: string) =>
  s
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '$1（$2）')
    // the Latin space that followed the markdown link is wrong after a full-width bracket
    .replace(/）\s+(?=[\u4e00-\u9fff])/g, '）')
    .replace(/\*\*(.+?)\*\*/g, '$1');

export function onePageText(d: OnePageResume, lang: 'zh' | 'en'): string {
  const L =
    lang === 'zh'
      ? { stack: '技术栈：', project: (i: number) => `项目${['一', '二', '三', '四', '五', '六'][i]}：`, links: '链接：' }
      : { stack: 'Tech stack: ', project: (i: number) => `Project ${i + 1} · `, links: 'Links: ' };
  const out: string[] = [];
  const h = (t: string) => out.push('', `【${t}】`);

  out.push(d.name, [...d.meta, ...d.contacts.map((c) => c.label)].join('  |  '));
  h(d.sectionTitles.summary);
  out.push(d.summary);

  h(d.sectionTitles.education);
  out.push([d.education.school, d.education.detail, d.education.date].join('  |  '));

  h(d.sectionTitles.openSource);
  for (const o of d.openSource) {
    out.push([o.title, o.inline, o.meta].filter(Boolean).join(' — '));
    if (o.detail) out.push(o.detail);
    if (o.links?.length) out.push(`  ${L.links}${o.links.map((l) => `${l.label} ${l.url}`).join('  |  ')}`);
  }

  h(d.sectionTitles.experience);
  for (const j of d.experience) {
    out.push('', [j.company, j.role, j.date].join('  |  '));
    if (j.scope) out.push(j.scope);
    if (j.stack) out.push(L.stack + j.stack);
    for (const b of j.bullets ?? []) out.push(`- ${plain(b)}`);
    for (const [i, p] of (j.projects ?? []).entries()) {
      out.push('', L.project(i) + p.name, L.stack + p.stack);
      for (const b of p.bullets) out.push(`- ${plain(b)}`);
    }
  }
  return out.join('\n').trim() + '\n';
}
