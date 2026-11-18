# Lusaill Search Recovery — measured actions (17 November 2026)

## Evidence and interpretation

- Technical source: `lusaill-seo-audit-2026-11-17.md`. On 17 Nov, URL Inspection showed **7 indexed of 30** inspected pages, **15 unknown**, and **8 discovered but not indexed**. This is a **sample**, not the site's measured global indexing rate.
- Search Console Search Analytics, property `sc-domain:lusaill.online`, **20 Oct–15 Nov 2026**: the 28 page-level result rows returned by the connected analytics source showed **0 clicks**, with sparse impressions dominated by electricity, driving licences and tax-card guides. Do not infer stable rankings or CTR from a one- or two-impression page.
- Search Console sitemap record (read 17 Nov): `https://www.lusaill.online/sitemap.xml` was last submitted **5 Nov** and last downloaded **15 Nov**. The connector returned a historical submitted count of **203**; this should not be presented as today's indexable URL count. Verify the newest sitemap after deployment.
- Google indexing and crawling decisions are separate from build status. **READY** and valid canonical/robots/JSON-LD do **not** prove Google indexing.

## Deployment gate — before any indexing request

1. Review and merge PR #105 only after its current Vercel preview builds successfully and QA checks pass. Use only the authorised production project `prj_GvzTCMz7VvyslHpXgfxjBUApCZnS`.
2. Re-crawl changed pages and record `200`, canonical, robots, OG image, 1 H1, JSON-LD parseability, and internal links. Verify `/knowledge` page weight and `/team` cache headers compared with the 17 Nov baseline (473 KB for knowledge, no-store for team).
3. Confirm `/articles/alexandria-electricity` qualifies under `isArticleSearchReady` and appears in its sitemap. The latest addition contains specific Alexandria geography, 121 and complaints channels sourced to the company and the electricity holding company.
4. Keep medical pages and the 18 short Qatar maths lesson notes `noindex` until separately reviewed. The maths index hub is linked and indexed; the individual notes remain reachable for readers but are not added to the sitemap.
5. Do not change dateModified or lastmod without verifiable page changes; no bulk lift of `noindex`.

## Manual Google Search Console actions — not performed by code changes

Request indexing through URL Inspection **only after** the public deployment and QA pass. Stage 5–10 URLs/day, avoiding repeated identical requests and recording each actual action. Initial candidate order:

| Group | URL | Prior reason |
|---|---|---|
| Priority entity and services | `/entities`, `/services/website-design` | Unknown in 17 Nov inspection |
| Core navigation | `/guides`, `/categories`, `/knowledge` | Unknown in 17 Nov inspection |
| Early content that Google has discovered | `/guides/personal-records`, `/guides/driving-licences` | Discovered, not indexed |
| Real-demand Egyptian service | `/articles/alexandria-electricity` | Low-volume impressions; only after new editorial QA |
| Additional hub | `/topics/vehicles`, `/topics/science` | Unknown; prioritise only when the page has enough search-ready content |

Then inspect and record `Last crawl`, `Google-selected canonical`, `Page indexing`, `Sitemap`, and date of the indexing request. No guarantee of indexing or a particular latency.

## Editorial backlog, in demand order

- `/articles/alexandria-electricity`: upgraded in PR #105 using separate official sources and structured sections; check the new QA gate and live page.
- `/articles/private-driving-license-renewal`: verify renewal procedure and consolidation with the existing licence decision guide before lifting noindex.
- `/articles/tax-card-first-time-egypt`, `/articles/tax-registration-cancel-suspend`, `/articles/tax-card-lost-damaged-replacement`: independently re-check current tax authority procedures, scope, sources and any fee claims. A word-count increase by itself does not approve them.
- `/articles/old-rent-housing-track`: legal and deadline review required; do not infer an extension from older publications.
- `/food-safety/rice-food-poisoning`: retain noindex pending documented independent qualified medical review.

The 404/410 pages with historical impressions should not be redirected without comparing the old and target article meanings. `personal-budget` and `read-scientific-graph-axis` are candidates, **not approved redirects**.

## Crawl architecture backlog

- **Implemented in PR #105:** `categories/[slug]` and `topics/[slug]` first pages are prerendered with ISR (`revalidate=3600`); page 2+ uses `/page/N`. Subtopic filters use collision-checked stable ASCII `/section/s-...` URLs because Unicode static segments returned 404 in the first preview test. Old `?page=N` URLs redirect to the corresponding path; old `?section=العنوان` links are normalized through `proxy.ts` to the correct topic section. Paginated and filtered pages remain `noindex,follow`, excluded from XML sitemaps until content review. The authorized protected preview returned HTTP 200 for `/topics/education/section/s-r85vfv` and for the old section query after same-origin redirect, as well as for category and topic page 2, and HTTP 404 for out-of-range category pages. **Repeat all checks after production merge.**
- Vercel domain settings: apex `lusaill.online` should redirect directly to `www.lusaill.online`; project domain records were read but not modified by this PR.
- A stronger nonce-based CSP should be staged and tested with analytics, embeds and interactive pages; current baseline policy is not a complete XSS defence.
- HSTS `includeSubDomains; preload` must not be enabled without verifying HTTPS and long-term control of **all** subdomains.
- Outreach: acquire legitimate, contextually relevant external references to verified Egyptian service guides. No link schemes or artificial indexing promises.

## Tracking after deployment

| Check | 17 Nov baseline | Remeasure target |
|---|---:|---|
| GSC sample indexed | 7/30 | Same sample after 2–4 weeks |
| URLs unknown to Google | 15/30 | Trend down, verify cause |
| `/knowledge` raw HTML | 473 KB | Measure reduced payload; avoid invented target result |
| Team `Cache-Control` | no-store | Verify actual shared cache behaviour |
| Homepage PSI mobile | 99 | Keep performance/regression score |
| Bing sitemap verification | Not confirmed | Verify actual action and date |

Record metrics in this document as dated observations, not claims of completed indexing.
