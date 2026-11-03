# Article tasks and SEO reviews

The user's complete 281-line list is retained verbatim in `seo-user-task-list.txt`, translated in `lib/seo/task-titles-ar.txt`, and versioned with stable SEO-001…SEO-281 identifiers in `lib/seo/task-template.json`. Tests compare every original line, order and identifier. No overlapping request is silently discarded.

Each existing or newly saved article uses 157 article tasks. The 124 shared site tasks (tools/accounts, crawl infrastructure, indexing, backlinks, measurement and technical monitoring) appear in a linked site checklist rather than incorrectly treating account setup as a separate operation per article. The full original instruction remains expandable beside each Arabic title.

## Editor and dashboard

- `/admin/seo`: article inventory, category/search filters, current-content review summaries, article/site checklist, evidence, priorities, ownership, deadlines, audit history and JSON export.
- Every article in the CMS library links directly to its checklist. The rich editor has a dedicated tasks/SEO tab; task updates do not change article text, publication status or visible review dates.
- Default state is pending. Completion, non-applicability and blockers need a recorded explanation. Sensitive editorial/factual completion requires admin/editor/fact-checker privileges; writers may update only assigned content and cannot close protected approval tasks.
- Completion records bind to a content fingerprint. Source text/draft changes or publication-mode changes flag previous completion as needing review. Deployment timestamps do not manufacture freshness.
- Reports and task changes retain actor/time evidence and are append-only to browser roles. Optimistic task versions prevent lost edits. Replaying a report request does not create a second report.

## Actual reviews

The authenticated audit runs in bounded batches (up to four targets/request), saving each report immediately. The UI reports actual saved progress, supports stopping after the current batch and resuming targets without a current report. Closing the tab stops scheduling further batches; already saved reports remain available.

Published articles receive real unauthenticated HTTP checks against fixed `https://www.lusaill.online` public URLs: response, title/description, H1/H2, canonical/noindex, initial HTML text, JSON-LD syntax/types, local image response/alt/dimensions, article-sitemap membership and public internal-link responses. Site reviews check entry pages, robots, sitemap format and proven two-click article paths. Public response caching is limited to 60 seconds during a crawl. Source/draft plans receive a saved-content check and are never falsely called public 404s. The audit cannot fetch arbitrary origins, admin or API pages.

Machine observations never auto-complete human tasks. Factual accuracy, original experience, current search results, keyword demand, media rights, editorial approval, external reference verification and actual account/traffic evidence remain explicit work. A server HTML check is not a rendered mobile-browser test, a field Core Web Vitals measurement, a Google indexing result, or a ranking guarantee. Numbers such as title length are guidelines, not hard ranking scores. FAQ/HowTo eligibility is not asserted.

## Persistence and verification

Four RLS tables and an invoker-security summary view are additive to Lusaill Supabase. Privileged implementations stay in `content_ops_private`; public functions are guarded wrappers. Nonmembers and anon cannot read private records; table mutation and history deletion are unavailable to browser roles. Templates are maintenance-managed.

`npm run seo:tasks:test` covers all original tasks/scopes, existing inventory, changed-content fingerprints, HTML defects, ownership, evidence/approval gates, per-task concurrency, replay-safe audit storage and immutable history. TypeScript, lint, SEO QA and a remote build are required before release.

Supabase CLI was unavailable in the sandbox (npm DNS ENOTFOUND). The tested migration was applied through the connected Supabase migration tool; its actual recorded version is `20261102192935_article_seo_checklists.sql`. The store database is not used. Rolling back this additive interface does not require dropping task history or deleting user records.

## Executed review and Search Console snapshot (3 November 2026)

The completed run persisted 331 distinct current reports: 230 live article audits, 100 unpublished source-plan checks and one site report. Four verified technical tasks per live article (canonical, single H1, HTTP availability and sitemap eligibility) were recorded with report evidence: 920 task completions. Another 212 articles have a pending description-length advisory, not an automatic text rewrite or a ranking diagnosis. Editorial/source verification tasks remain open.

The two user-provided Search Console workbooks exported on 29 October were read without modification. Coverage's latest chart point is 23 October 2026: 263 Discovered – currently not indexed URLs. An indexing snapshot was imported into existing cms_reports, then matched to the current inventory: 218 published articles and 45 other pages (30 guide routes, five category pages, five entity pages and five driving lessons). All 45 other pages returned HTTP 200 in the follow-up check, with canonical, a single H1 and no robots noindex. This is current technical evidence; it does not establish Google's current indexing decision.

Crawl statistics cover 24 August–27 October 2026: 1,348 requests; historical response shares 94.88% 200, 2.74% 404, 2.23% 301 and 0.15% other 4xx. The summary does not identify failing URLs. JavaScript accounts for 46.59% of crawler requests; this is not an audience-device or page-speed measurement. The Last crawled placeholder in Coverage is not treated as a real crawl date. There is no supplied Crawled – currently not indexed export.

The SEO interface labels imported data as a dated snapshot, shows the coverage dates/import time and per-article inclusion, and never infers indexing from either inclusion or absence. A newer data date takes priority over a newer import timestamp. No live Google integration, traffic or URL Inspection result is invented. Site tasks SEO-106/107/108 retain review evidence and remaining work.

Audit requests retry transient network/429/5xx failures with the same request ID. The API reuses an already saved run before fetching again; resume loads fresh saved inventory before choosing outstanding targets. Transport tests exercise disconnect recovery, request preservation, 503 retry, abort and authorization failure behavior.
