# SEO recovery — 11 November 2026

## Scope and factual constraints
- Canonical: https://www.lusaill.online
- Vercel production project ID: prj_GvzTCMz7VvyslHpXgfxjBUApCZnS
- Production deploy succeeded from merged PR #97 (squash commit `8efc65056f9c463a8df31d604809b1299d91fe5e`). Change logs below distinguish completed from unresolved external dashboard actions.
- Publication limit: **at most 1–2 individually verified articles per Qatar calendar day**; no automatic batch publishing. Improve existing pages first.
- Target: practical Egyptian electricity, civil-registry, traffic, ration-card and Digital Egypt guides; keep broader encyclopedia available in separate navigation.
- Do not manufacture source checks, `lastmod`, ranking data, or backlink successes. Dates must reflect real changes.

## T1/T2 URL recovery
Verified topical 301 candidate (implemented in `next.config.ts`):
- `/articles/active-recall` → `/knowledge/active-recall-retrieval-practice-self-testing`

Candidate redirects requiring manual full-content comparison (NOT implemented):
- `/articles/evaluate-sources` → consider `/knowledge/primary-secondary-tertiary-sources-research` (source classification is narrower than evaluation)
- `/articles/ecosystems` → consider `/knowledge/energy-flow-ecosystem` (energy flow is narrower than ecology)
- `/articles/energy-forms` → locate true content-equivalent replacement
- `/articles/record-observation-before-inference` → locate original section and replacement
- `/articles/pricing-basics` → locate original section and replacement

The previously visible URLs `/articles/weather-climate` (historical 28 impressions) and `/articles/solar-system` (22) have been rebuilt with new evidence-led articles (over 1,000 Arabic words each), metadata, Article/BreadcrumbList JSON-LD, sitemap entries, internal discovery links and search entries on the live production website. Their original deleted bodies were unavailable, so this is **newly written replacement content on historical paths**, not a verbatim restoration. Production verification: both routes return HTTP 200 and are indexable; sitemap includes both. A truly retired URL without replacement may return 410.

Do not claim 12 verified redirects: the complete old→new content-equivalence mapping has not been supplied, and only one pairing has been accepted here. Get historical URLs from Search Console Pages export and source revision history, assess each, and approve before redirecting.

## T3 Host normalization
- `proxy.ts` already sets 301 to https://www.lusaill.online in a single *application-level* redirect.
- Vercel project domain listing currently shows `lusaill.online` with **no Vercel-level redirect**. Live verification on 11 November 2026: `http://lusaill.online/` requires **2 redirects**; `https://lusaill.online/` and `http://www.lusaill.online/` require **1** each. The one-hop HTTP-apex goal is NOT yet complete. Inspect Settings > Domains for a direct apex redirect before changing DNS or removing the attached domain.
- Retest https://lusaill.online, http://www.lusaill.online and pages with a query string.

## T4 Sitemap / lastmod
- `lib/sitemaps.ts` intentionally excludes articles that fail `isArticleSearchReady` and are `noindex` (see `lib/editorial-indexing.ts`). Adding these to the sitemap prematurely would contradict their robots directives.
- `south-cairo-electricity` and `north-delta-electricity` were expanded with six original decision tables total, consumer-facing explanations, and official EEHC/EgyptERA source references; their substantive `updatedAt` is 2026-11-11. Both pages passed production-build checks for sitemap entries, HTTP 200, indexability and genuine dates, and were verified live after production deployment. Two additional historic gaps remain unidentified from the supplied report and require a URL diff.
- `getArticleModifiedAt` already derives from editorial update fields and recorded content changes, not build time. Do not update dates merely to force crawl.

## T5/T6 Webmaster tools
- The repository already includes `public/26793b26595b48c5b0815df922e238f1.txt` and `/api/indexnow`; `INDEXNOW_KEY` was absent from Vercel environment and has been configured for production and preview. The new production deployment is **READY** and the public key file returns HTTP 200. The site successfully sent **7 canonical URL submissions** to IndexNow on 11 November 2026, and the endpoint returned HTTP **202** (accepted for processing). This is NOT confirmation of Bing indexing.
- Bing Webmaster Tools: verify or import domain, submit `https://www.lusaill.online/sitemap.xml`, confirm IndexNow activity in the dashboard. No evidence of a completed Bing account verification is available here.
- Google Search Console: select the verified property; submit sitemap; after final production QA, use URL Inspection to inspect each canonical indexable page and click **Request indexing** manually. Do not claim Google accepted requests without the actual status.
- Candidate URLs, highest-priority first (request only if HTTP 200, canonical self, robots indexable and in sitemap):
  1. https://www.lusaill.online/articles/electricity-bill-inquiry
  2. https://www.lusaill.online/articles/north-cairo-electricity
  3. https://www.lusaill.online/articles/south-delta-electricity
  4. https://www.lusaill.online/articles/south-cairo-electricity
  5. https://www.lusaill.online/articles/north-delta-electricity
  6. https://www.lusaill.online/articles/alexandria-electricity
  7. https://www.lusaill.online/articles/electricity-complaint
  8. https://www.lusaill.online/articles/electricity-outage-report
  9. https://www.lusaill.online/articles/code-electricity-meter
  10. https://www.lusaill.online/articles/automated-birth-certificate
  11. https://www.lusaill.online/articles/private-driving-license-first-time
  12. https://www.lusaill.online/articles/ration-data-update

## T7/T8 Content and electricity hub
- Homepage H1, intro and top navigation prioritize Egyptian services; miscellaneous subject taxonomy remains accessible via `/knowledge`, `/topics`, and the footer.
- Refine each distributor guide against the actual company portal: exact account identifiers, separate bill/reading/payment tasks, fallback channels, date checked, errors, and links to central hub. Do not add city-name-only duplicate pages.
- Internal link from the hub `/articles/electricity-bill-inquiry` to all company guides; verify return links and live HTTP 200.

## T9/T10 Performance and structured data
- Removed serialized `getSiteSearchItems()` props from homepage client search (search remains functional via GET /search). Removed the 324-subtopic category grid from homepage (remains available at /topics).
- Measure actual built HTML with `node scripts/check-homepage-html.mjs https://preview-host`; **target less than 153600 bytes** uncompressed. Measured **68,640 bytes** (~67 KiB) in built preview and **69,961 bytes** in live production, both far below the target. Historic production HTML was approximately 806 KB.
- Keep stable Organization, WebSite, Article and BreadcrumbList entities. Removed FAQ and HowTo JSON-LD from general article pages because of unavailable rich results, while keeping visible FAQ and steps intact. Check HTML vs JSON-LD and Rich Results Test.

## T11–T14 Editorial/AI/links/analytics
- Current article template already has a clearly labeled **الإجابة المباشرة** section and source references. Keep concise sourced answers, H2 task questions, explicit provenance/check dates and robust canonical URLs. AI citation inclusion is not guaranteed.
- First genuine backlinks: create original utility (company-by-company error codes, verified links and a decision table), then pitch to legitimate Egyptian consumer-rights, local-service and community resource editors. Offer it as a useful resource, not paid spam links, reciprocal link schemes or fake reviews. Record outreach and actual backlinks with URL, date and referral status.
- OpenSEO project currently reported as United States / English: manually change keyword-tracking project location to **Egypt** and language to **Arabic**, then validate query results against Google Search Console. This setting is in OpenSEO, not this repository.

## Final production validation — 11 November 2026
- PR #97 merged into `main` as `8efc650`, Vercel production deployment `dpl_GxAyfWKR7oqPLJzpRaTDh5ciPnmz` reported **READY**.
- Production GET `/`, `/articles/weather-climate`, `/articles/solar-system`, `/articles/south-cairo-electricity`, `/articles/north-delta-electricity`, and `/sitemap-articles.xml` all returned HTTP **200**.
- Production-build crawl checked **307 sitemap pages**, **910 internal links**, **527 image references**, and passed HTML/metadata/robots/canonical/schema/internal-link QA. Full external third-party image verification was intentionally skipped.
- `npm run build`, `npm run seo:qa`, `npm run lint`, `node scripts/test-topic-discovery.mjs` and `node scripts/verify-electricity-pages.mjs` passed, with 0 lint errors (5 nonblocking warnings).
- **124 existing search titles exceed 60 characters**. This is a content-quality review backlog, not a hard Google character rule. Prioritize titles based on real impressions and snippet usability.
- Remaining uncompleted actions: one-hop HTTP apex Vercel domain redirect, verifying Bing Webmaster property & Google URL indexing submissions, OpenSEO Egypt/Arabic settings, sourcing real editorial backlinks, and unreviewed historic 301 pairs.
