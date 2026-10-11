import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set the production site URL in astro.config.mjs');
  // HTML copies remain crawlable so crawlers can read their noindex metadata.
  // Pages cannot set X-Robots-Tag on static .txt files: disallow fetching them,
  // omit them from the sitemap, and do not claim this guarantees deindexing.
  return new Response(`User-agent: *\nDisallow: /resume/en-1p.txt\nDisallow: /resume/zh-1p.txt\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
