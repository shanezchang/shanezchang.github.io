# Site fonts

Screen text uses Maple Mono 7.9 throughout the landing page, full résumés,
one-page résumés and error page. `SiteFonts.astro` loads one stylesheet;
components consume `--font-body` and `--font-mono` from `src/styles/typography.css`.
The existing palette, content and section structure are retained.

Paper uses the previous Geist / Geist Mono hierarchy and system CJK fallbacks.
Those faces are self-hosted and declared inside `@media print`, so screen visits
do not download them. The one-page screen layout has readable 14px body text;
its A4 print sizes and page-break rules remain independent.

## Sources and licenses

| Files | Official source | Version / license |
| --- | --- | --- |
| `maple-latin.woff2` | [Maple v7.9 variable WOFF2](https://github.com/subframe7536/maple-font/blob/v7.9/woff2/var/MapleMono%5Bwght%5D-VF.woff2) | 7.900; unmodified, weight axis 100–800; `OFL-Maple.txt` |
| `maple-cn-{ui,text}-{400,500,600,700}.woff2` | [Maple v7.9 CN release](https://github.com/subframe7536/maple-font/releases/tag/v7.9), `MapleMono-CN-unhinted.zip` | 7.900; static subsets with original copyright/name metadata; `OFL-Maple.txt` |
| `geist-latin.woff2` | [Google Fonts Geist WOFF2](https://fonts.gstatic.com/s/geist/v5/gyByhwUxId8gMEwcGFWNOITd.woff2) | 1.800; unmodified variable Latin subset, 100–900; `OFL-geist.txt` |
| `geist-mono-latin.woff2` | [Google Fonts Geist Mono WOFF2](https://fonts.gstatic.com/s/geistmono/v6/or3nQ6H-1_WfwkMZI_qYFrcdmhHkjko.woff2) | 1.701; unmodified variable Latin subset, 100–900; `OFL-geistmono.txt` |

Geist files are the exact Latin variable files returned by the site's previous
Google Fonts CSS query, downloaded 2026-11-10. Their OFL texts are from
`google/fonts`' `ofl/geist/OFL.txt` and `ofl/geistmono/OFL.txt`.
Maple's supplied OFL specifies no Reserved Font Name. Subsetting is the only
CN modification; no Nerd Fonts or desktop TTFs are shipped.
`manifest.json` records coverage, byte sizes and SHA-256 for every shipped font.

## Loading and maintenance

- One 130,908-byte Latin variable face is preloaded. Normal upright text uses
  real weights; screen project titles are upright rather than synthetic italic.
- The small CN UI shard is about 3.5 KB per weight. The résumé vocabulary shard
  is about 126–128 KB per weight. `unicode-range` and actual text/weight use
  determine which files download; English pages do not fetch the vocabulary.
- The CN subsets cover the static site's current characters, including the
  CSS-generated fullwidth role separator. New unsupported text falls back to
  system fonts. The artifact coverage check fails when page text outgrows the
  manifest, so regenerate after adding Chinese content.
- `font-display: swap` keeps text available. Courier New matches Maple's 0.6em
  Latin cells; a local CJK fallback adjusted to 1.2em limits reflow. Platform
  availability varies, so keep system fallbacks and test failure as well as load.

To regenerate CN files, download the two official source files above to a local
directory as `MapleMono-Variable.woff2` and `MapleMono-CN-unhinted.zip`. The script
verifies their hashes before processing; it does not download sources at build
time. Keep the existing Geist assets and licenses in `public/fonts/`.

```sh
npm ci
npm run build
uv run scripts/subset-maple.py --source-dir .qa/font-source
npm run typecheck
npm test
npm run test:browser
```

Normal builds only copy the committed WOFF2 files; Python/uv is needed solely
for regeneration. Browser tests block external requests, verify actual rendered
Maple faces through CDP, exercise font 404/delayed swaps, and inspect genuine
PDFs after print fonts finish loading. PDF checks retain full text, A4 bounds,
page counts, heading/logo ink and embedded-font assertions.
