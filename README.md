# shanezchang.github.io

Shane Chang's public homepage and bilingual résumé. This is a **static Astro site**, published at `https://shanezchang.github.io/` by GitHub Pages. There is no application server, account system, database, or analytics collector.

## Local development

Use Node **22.20.0** (`.node-version`) and its bundled npm. Dependencies, including the test tools, are pinned by `package-lock.json`.

```sh
npm ci
npm run dev                 # http://localhost:4321
```

Production-mode verification:

```sh
npm run typecheck           # Astro + TypeScript diagnostics
npm test                    # fresh static build, then artifact/workflow regression
npx playwright install chromium
npm run test:browser        # serves dist/ on 127.0.0.1:4438, then stops the server
npm run build
npm run preview             # inspect the built site, normally http://localhost:4321
```

On a Linux runner, install browser system dependencies with `npx playwright install --with-deps chromium`. PDF inspection also requires Poppler (`sudo apt-get install poppler-utils` on Ubuntu; `brew install poppler` on macOS), including `pdftotext` and `pdftoppm`. Missing PDF tools fail the gate rather than skip it. Browser checks cover English/Chinese navigation, theme persistence, keyboard activation, real 404 status/recovery, local resources, 320/390/1280px layouts in light/dark mode, and A4 printing. They block third-party requests except the existing Google Fonts service. Screenshots/PDFs and machine-readable results are written to ignored `test-results/`; they are not published. Do not start another preview on port 4438 while running the suite.

For offline QA, set `RESUME_TEST_FONT_DIR` to a directory containing existing, unmodified `Geist-Variable.woff2` and `GeistMono-Variable.woff2`. Tests fulfill the existing font requests from those local files and block every other external request; no production font/CSS changes are made. Record the local font source/version when comparing output. Font gates require both faces to be **loaded**, not merely named in CSS; unavailable fonts fail separately from layout checks.

`npm run test:artifact` can recheck an existing `dist/`. It checks canonical/hreflang, the sitemap allowlist, noindex boundaries, every generated HTML route, all local links/fragments/assets, and the CI contract. External availability is deliberately not a flaky network-based PR gate. Review outbound links separately: a 403/999 or login wall does not prove the target is missing.

There is no ESLint configuration in this repository. `astro check` is the source diagnostic gate. If installed, run `actionlint .github/workflows/deploy.yml` for the workflow's additional syntax/expression lint.

## Routes and indexing

Publicly accessible is not the same as searchable. `src/data/search.ts` is the explicit allowlist; adding a route does **not** automatically put it in search.

| Route | Language | Purpose | Search policy |
| --- | --- | --- | --- |
| `/` | English | Homepage | Self-canonical; in sitemap; no hreflang because there is no translated homepage |
| `/resume/en/` | English | Full résumé | Self-canonical; in sitemap; reciprocal `en`, `zh`, `x-default` |
| `/resume/zh/` | Chinese (`zh`) | Full résumé | Self-canonical; in sitemap; reciprocal `en`, `zh`, `x-default` |
| `/en/` | English | Compatibility redirect to `/resume/en/` | `noindex`; destination canonical; no hreflang/sitemap |
| `/zh/` | Chinese | Compatibility redirect to `/resume/zh/` | `noindex`; destination canonical; no hreflang/sitemap |
| `/resume/` | English | Default redirect to `/resume/en/` | `noindex`; destination canonical; no hreflang/sitemap |
| `/resume/en-1p/` | English | Print-first A4 copy | `noindex`; no canonical/hreflang/sitemap |
| `/resume/zh-1p/` | Chinese (`zh-CN`) | Print-first A4 copy | `noindex`; no canonical/hreflang/sitemap |
| `/resume/en-1p.txt` | English | Plain-text copy | Excluded from sitemap; fetching disallowed by robots |
| `/resume/zh-1p.txt` | Chinese | Plain-text copy | Excluded from sitemap; fetching disallowed by robots |
| `/preview/v3/`, `/preview/v5/` | English | Archived design experiments | `noindex`; no canonical/hreflang/sitemap |
| `/404.html` | English + Chinese message | GitHub Pages missing-page document | `noindex`; no canonical/hreflang/sitemap; unknown URLs retain HTTP 404 |
| `/sitemap.xml`, `/robots.txt` | Not applicable | Crawler metadata | Sitemap contains exactly the three formal pages |

The résumé alternates include themselves, each other, and `x-default` pointing to the English résumé. The homepage is not a translation of the résumé.

HTML copies remain crawlable so search engines can see their `noindex`. Do **not** disallow those HTML paths in `robots.txt`. GitHub Pages cannot configure an `X-Robots-Tag` for the static `.txt` exports; robots disallow is only a crawl restriction, not a guarantee that an externally linked URL will never appear in search. Do not put private information on any of these routes. Preview experiments retain old sample links; they are not promoted from formal pages and are not verified current portfolio claims.

## Content and visual baseline

- Résumé facts: `src/data/resume.ts`. Full and one-page versions are separately edited data; fact changes must remain consistent in both languages and both versions.
- Full résumé: `ResumeLayout.astro` and `ResumeBody.astro`.
- One-page print copy: `OnePage.astro`, A4 with zero page margin and internal padding. Keep it one physical A4 page; do not hide overflow or shrink away missing content to pass a check.
- Homepage: `src/pages/index.astro`.
- Preserve Geist + Geist Mono and the existing light/dark tokens. The homepage and full-résumé chrome intentionally mirror each other.

For PDF export, build and start preview, confirm HTTP 200, wait for fonts to load, then print `/resume/en-1p/` or `/resume/zh-1p/` on A4 with browser headers/footers disabled. The automated browser suite emits PDFs for both languages and screen themes: full résumés remain **four A4 pages**, and one-page copies remain **one A4 page**. It checks loaded fonts, print navigation visibility, every visible print text field in extracted PDF text, PDF glyph bounds, title contrast on white, and actual raster ink for titles/company/school logos. Saved PNGs are rasterized PDF pages, not just print-media DOM screenshots. Screen dark mode must not leak near-white ink or inverted monochrome logos onto paper; these checks do not justify changing résumé content, font sizes or pagination to fit.

## GitHub Pages delivery

`.github/workflows/deploy.yml` runs on pushes to `main`, pull requests targeting `main`, and manual dispatch:

1. **`build`** is the required PR check. It uses `npm ci`, runs type diagnostics, rebuilds and validates generated artifacts/workflow, then exercises the production static build in Chromium. It has only `contents: read`; checkout does not persist credentials.
2. Only a non-PR run on **`main`** uploads `dist/` (including `.nojekyll`).
3. **`deploy`** requires `build` and is restricted to non-PR `main` runs. Only this job has `pages: write` and `id-token: write`, scoped to the `github-pages` environment. **Do not make `deploy` a required PR check**: it intentionally does not run on PRs.

All four official Actions are pinned to audited full commit SHAs, with release-version comments. When updating a pin, verify its official repository/tag and `action.yml`, review permissions/runtime/input changes, and update the workflow regression's allowlist. PR queues are separate from the production deployment concurrency group.

Repository Settings → Pages must use **GitHub Actions** (`build_type: workflow`), not legacy branch publishing. This workflow does not change that setting. Read-only verification:

```sh
gh api repos/shanezchang/shanezchang.github.io/pages --jq '{build_type,html_url,status}'
```

No custom domain/CNAME is configured. `astro.config.mjs` sets the production origin. After an approved merge, verify the Actions run, Pages deployment, HTTP 404 behavior, all three canonical pages, `robots.txt`, and `sitemap.xml` on the published site. Local preview and passing tests are not proof of a live deployment. To roll back, revert the reviewed change through the same PR/build/deploy path rather than switching Pages to branch publishing.
