# Technical SEO improvements — 2026-10-04

Base: main 7eb7d466ac7ac7873e06614903cfc6a8ce8dd3c0, matching the READY production deployment dpl_3YSmcq1Aw7vNRpvaUMhAbDzbuyAP in Vercel project prj_GvzTCMz7VvyslHpXgfxjBUApCZnS. Canonical origin: https://www.lusaill.online.

## Findings and changes

- Category pagination reused titles and descriptions, and its CollectionPage schema always identified page one. Give subsequent pages distinct metadata and self-identifying schema URLs. Link to the canonical first-page path and mark the active page accessibly.
- Invalid page numbers silently displayed the first or last category page. Return HTTP 404 instead; regression checks cover zero, negative, malformed, and excessive page numbers.
- Homepage metadata applied the layout brand suffix to an already branded title. Use an absolute title to avoid repeating the brand.
- Specific crawler groups did not inherit wildcard exclusions. Share the same /api/ and /admin/ exclusions across the existing crawler list. See https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec.
- Normalize course sitemap image URLs through absoluteUrl, supporting both local and remote assets.
- SEO source QA used POSIX path separators to find pages, skipping page-level checks on Windows, and traversed dependency/build directories before excluding files. Match filenames portably and prune those directories before traversal.

## Validation

- npm run lint: passed.
- npm run seo:qa: passed, with page checks active on Windows.
- npm run seo:audit:test: passed.
- npm run build: passed, including TypeScript.
- Built HTTP crawl: passed on 159 sitemap pages, 105 articles, 161 internal links, and 137 image URLs; external Wikimedia images were excluded from local image fetching. Also checks pagination titles, schema, canonical first-page links, invalid-page 404s, robots exclusions, and absolute sitemap image URLs.
- Running the new pagination check against unchanged production failed on duplicate category titles, confirming the regression test detects the original issue.
- Production audit of the first 100 sitemap pages: all returned 200 and were technically indexable; no missing/duplicate titles or descriptions, canonical errors, H1 errors, or invalid JSON-LD. Two requests for the same remote driving-course image returned 400 during the initial HEAD audit; a subsequent GET returned 200. Treat remote image availability as intermittent, not a confirmed missing asset.

## Limits

No Search Console data was available. Technical indexability does not prove Google indexing, rankings, or traffic. No new articles, unsupported search-demand claims, or publication dates were added. Changes are proposed for review; production has not been updated by this work.
