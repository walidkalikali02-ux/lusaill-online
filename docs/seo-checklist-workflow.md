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
