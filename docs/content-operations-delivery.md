# Content Operations delivery

Source: content-operations-frs.md. Baseline production: 738bd928. Dedicated Supabase: sikeoqsmneywwsqehcum. Branch: feat/content-operations.

The existing CMS is released at /admin. This extension is a separate incremental release. Existing public routes, article dates and source verification are preserved.

## Release sequence and evidence

1. Persisted P0 planning/workflow: roles, unified catalog, evidence-backed ideas, clusters, approved briefs/outlines, stage assignments, deadlines, blockers, reviews and immutable activity. Command center and board/table/calendar use recorded data. No duration is invented for historical imported content.
2. Integrate draft creation, writer-scoped editing and publishing with database-enforced gates. Existing published files remain accessible; any exceptional legacy maintenance approval must be explicit and audited.
3. Publication jobs, idempotent scheduling/retries and post-publication verification. Do not activate an automatic scheduler without testing it. Daily ceiling remains 20 in Asia/Qatar.
4. P1 reporting/SOPs/repurposing: real performance snapshots and authorized integrations, versioned guidelines, reusable assets and channel approvals. No external message is sent by default.
5. Optional AI/radar integrations: explicit provenance, review and disabled/unavailable states until provider/account connections are usable. Suggestions never assert verified facts or measured demand.

## Required verification

- Migration tests cover anon/nonmember/writer/editor/publisher/admin, ownership, optimistic concurrency, backward transitions, critical review failures, invalidation after edits and append-only audit logs.
- Browser test: evidence → idea decision → brief/outline approval → draft → revision → review → authorized publication job. Published user content is not used as a disposable fixture.
- Real database and route checks, TypeScript, lint, SEO QA, remote build and focused public crawl must pass before release.
- Track each FR/LX as implemented, partial, external dependency or pending, with exact test/deployment evidence. No overall completion claim until the Definition of Done is met.

## Baseline dependencies

Current account is the only CMS admin. Additional users are not provisioned automatically. GSC is currently real CSV snapshots; GA4 ingestion/OAuth, AI and automatic scheduled publishing are not activated. The earlier CMS's browser revision-restoration check was blocked by a native confirmation; database restoration tests passed separately.
