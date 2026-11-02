# Content Operations — coverage ledger

This is the first incremental planning/workflow implementation, not completion of the FRS. The existing production editor remains a single-admin system until the separate editor/publication integration is tested. A `ready` operations stage is an editorial state; it does not publish a page or mean Google indexed it.

| Requirements | Current implementation | Remaining acceptance work |
| --- | --- | --- |
| FR-001–006 | Persisted stage counts, overdue/blocked items, direct record opening, real creation-to-ready duration, owner/type/date/search filters | Editor/category filters, per-stage time aggregation, actionable failed-publication alerts |
| FR-007–012 | Manual ideas/evidence, original problem/audience/country, recorded decisions; lexical comparison with current catalog; atomic conversion to item/brief/task | Radar ingestion, merge similar ideas, demand/evidence ranking and semantic intent review |
| FR-013–018 | Clusters, pillar paths, linked members across content types | Completion/freshness metrics and gap/link review screens |
| FR-019–024 | Draft brief from an idea, required fields, keywords, intent, competitor notes, information gain, official sources; server validation of approval | Optional audited AI assistance; source/competitor completeness assessment |
| FR-025–032 | Ordered workflow, owner, deadline, acceptance criteria, blockers, backward reasons, persisted transition timestamps; board, table and weekly/monthly calendar | Per-type configurable workflow, bulk assignment, notification delivery and work/wait timer separation |
| FR-033–036 | H2/H3 outline, section questions/sources, ordered move controls, notes and server approval gate | Drag/drop, section comments and suggested missing sections |
| FR-037–042 | Existing CMS has RTL editor, autosave, revisions and desktop/mobile preview | Operations context sidebar, staff-scoped editor access, type-specific authoring and optional AI |
| FR-043–049 | Recorded review axes, severity, claims, human check/expiry dates; unverified/expired claims and critical failures block operations readiness; changing prerequisites reopens review | Configurable checklists, automated SEO report binding, integration of readiness with actual publication transaction |
| FR-050–055 | Database roles and per-action RPC checks; writer assignment/ownership; self-approval restrictions with explicit logged admin exception | Team provisioning UI, SOP acknowledgement/version approvals, onboarding and productivity reports |
| FR-056–060 | Weekly/monthly planning calendar and real deadlines; original CMS scheduling remains unchanged | Approved publication jobs, timezone-safe worker, retry/idempotency flow and live validation |
| FR-061–064 | Linked manual asset drafts | Source-linked repurposing templates, deduplication, distribution approvals and channel state |
| FR-065–070 | Original CMS CSV reporting remains available; no new fabricated analytics | Authorized GSC/GA4 connection, comparisons, decline detection, improvement tasks and team reports |
| LX-001–003 | Claim records with URL/check date/expiry and responsible actor in audit | Normalized source/authority registry, automated freshness queue and source availability checks |
| LX-004–005 | Catalog connects existing paths without changing public content; existing CMS accepts indexing CSV | Explicit keep/update/merge/retire decisions and integrated coverage queue |
| LX-006 | Atomic idea → item + draft brief + task with evidence gate and safe replay | Authenticated radar adapter |
| LX-007 | Critical review flag | Risk classification and specialist assignment/approval |
| LX-008 | Persisted cluster member relationships among article/guide/course/lesson/tool | Interactive relation map and approved internal-link suggestions |

## Verification

`npm run content-ops:test`: PGlite executes the migration and exercises all six roles, nonmember and anon isolation, direct-write denial, optimistic version conflicts, required evidence/brief/outline fields, assignment ownership, ordered transitions, critical failures, readiness invalidation, explicit self-approval exceptions, repeatable atomic conversion and append-only history. These are planning/workflow tests; they do not establish the still-pending CMS publication gates.

`npm run cms:test`, `npx tsc --noEmit`, `npm run lint`, and `npm run seo:qa` verify compatibility with the released editor and public-site source. Deployment and browser evidence are recorded separately after they actually complete.

## Deployment / rollback

Apply the additive migration only to Lusaill project `sikeoqsmneywwsqehcum`. It creates new operations tables/functions and does not modify CMS documents, Auth credentials, public publications, slugs or article dates. Never apply it to the store project. Use the permitted Vercel project only. Test a branch preview with branch-scoped Supabase public configuration before production rollout.

To roll back the frontend, redeploy production commit `738bd92891779a88e75abb8df6f995e70662863d`. Retain the additive tables and their audit data; do not drop user records as a rollback mechanism. A later publication-gate migration must have its own compatibility and rollback tests.
