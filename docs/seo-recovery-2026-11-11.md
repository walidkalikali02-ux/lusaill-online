# SEO recovery — 11 November 2026

## Scope and factual constraints
- Canonical: https://www.lusaill.online
- Vercel production project ID: prj_GvzTCMz7VvyslHpXgfxjBUApCZnS
- Work on branch until build, crawl, measured homepage bytes and canonical redirect checks pass.
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

Two previously visible URLs should be **restored with substantive, sourced material** rather than redirected based on keyword proximity: `/articles/weather-climate` (historical 28 impressions), `/articles/solar-system` (22). Retain their current 404 until restored; do NOT return 410 while restoration is planned. A true permanently retired URL with no equivalent may return 410 and must remain out of XML/RSS.

Do not claim 12 verified redirects: the complete old→new content-equivalence mapping has not been supplied, and only one pairing has been accepted here. Get historical URLs from Search Console Pages export and source revision history, assess each, and approve before redirecting.

## T3 Host normalization
- `proxy.ts` already sets 301 to https://www.lusaill.online in a single *application-level* redirect.
- Vercel project domain listing currently shows `lusaill.online` with **no Vercel-level redirect**. Test externally with `curl -sIL http://lusaill.online/` and count Location hops; if an edge-level HTTP→HTTPS hop occurs before Next.js, configure a direct domain redirect in Vercel project Settings > Domains. CDN/DNS behavior cannot be proven from the source.
- Retest https://lusaill.online, http://www.lusaill.online and pages with a query string.

## T4 Sitemap / lastmod
- `lib/sitemaps.ts` intentionally excludes articles that fail `isArticleSearchReady` and are `noindex` (see `lib/editorial-indexing.ts`). Adding these to the sitemap prematurely would contradict their robots directives.
- Audit missing `south-cairo-electricity` and `north-delta-electricity`, plus the other two URLs found by comparing live 200s and sitemap. Improve content and verify sources first; only then allow the shared readiness gate to include them.
- `getArticleModifiedAt` already derives from editorial update fields and recorded content changes, not build time. Do not update dates merely to force crawl.

## T5/T6 Webmaster tools
- The repository already includes `public/26793b26595b48c5b0815df922e238f1.txt` and `/api/indexnow`; `INDEXNOW_KEY` was absent from Vercel environment and has been configured for production and preview. A **new deployment** is required for it to take effect.
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
- Measure actual built HTML with `node scripts/check-homepage-html.mjs https://preview-host`; **target less than 153600 bytes** uncompressed. This target is not proven until preview measurement.
- Keep stable Organization, WebSite, Article and BreadcrumbList entities. Removed FAQ and HowTo JSON-LD from general article pages because of unavailable rich results, while keeping visible FAQ and steps intact. Check HTML vs JSON-LD and Rich Results Test.

## T11–T14 Editorial/AI/links/analytics
- Current article template already has a clearly labeled **الإجابة المباشرة** section and source references. Keep concise sourced answers, H2 task questions, explicit provenance/check dates and robust canonical URLs. AI citation inclusion is not guaranteed.
- First genuine backlinks: create original utility (company-by-company error codes, verified links and a decision table), then pitch to legitimate Egyptian consumer-rights, local-service and community resource editors. Offer it as a useful resource, not paid spam links, reciprocal link schemes or fake reviews. Record outreach and actual backlinks with URL, date and referral status.
- OpenSEO project currently reported as United States / English: manually change keyword-tracking project location to **Egypt** and language to **Arabic**, then validate query results against Google Search Console. This setting is in OpenSEO, not this repository.
