# Crawl and indexation verification — 4 October 2026

Main and production were compared before editing: main `7eb7d466ac7ac7873e06614903cfc6a8ce8dd3c0`, READY deployment `dpl_3YSmcq1Aw7vNRpvaUMhAbDzbuyAP`, allowed project `prj_GvzTCMz7VvyslHpXgfxjBUApCZnS`.

## Changes

- `/sitemap.xml` is an index of the requested articles/categories/guides/entities files plus a pages file for home, directory and policy pages. The URL inventory remains 159, including 105 published articles. Draft and retired URLs remain excluded. XML values are escaped; images use absolute URLs.
- Dates come from recorded content updates. Unknown dates on static pages are omitted. The article template's fixed 4 October date records the actual addition of next-step links/schema in this change; it never advances on deployment. Sitemap index dates are omitted rather than fabricated. Guide collections use their linked articles' content dates.
- Query and filter URLs and `/search` are excluded from crawling. Numeric category pagination has explicit crawl exceptions, so blocking query strings cannot strand category pages. Next image/static and image assets remain allowed, including CSS/JS with version query strings.
- Every indexable page has self-referencing `ar-EG` and `x-default` alternate links. Arabic `lang="ar" dir="rtl"` remains present.
- Proxy combines non-www, forwarded HTTP, trailing slash and old alias normalization into one 301 to the final URL, preserving queries. Local request matrices confirm this. Vercel's platform HTTP-to-HTTPS redirect occurs before application code and must be reported separately.

## Account evidence

Private Search Console performance and indexing observations are saved in the local user-facing report, outside the public repository. Do not equate passing technical checks with indexing.

## Validation

Lint, TypeScript, SEO QA, build and SEO audit integration passed. HTTP crawl of the built site passed on all 159 pages, 105 articles, 161 internal paths and 137 images (remote Wikimedia images skipped). All 105 article links are present in the server HTML of `/articles`, linked directly from home: maximum two clicks. Category pagination remains ordinary server-rendered anchors.

The server HTML contains article answer, steps, sources, FAQs and related links before JavaScript runs. This is independent evidence of SSR, not proof of Google's stored crawl or indexing. Google URL Inspection stored crawl checks and production deployment results are recorded separately below after completion.

References: [Google robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec), [Google sitemap date guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

