# Content Operations verification — 2 November 2026

## Scope and release state

Incremental delivery against `content-operations-frs.md`; remaining work is listed in `content-operations-coverage.md`. Production stays on `738bd92891779a88e75abb8df6f995e70662863d`. No article was published or changed by this implementation test.

Foundation commit `e26db1b6dca658f8c4be832dde853eeae53370d5`: preview `dpl_5hTbWE6uZvTMepqUCUZXiizzSRFY` READY. Editor integration commit `509e3c7d30e3b7e1d7ebd574ed6ac254ae2cbd67`: preview `dpl_9Ux92WfXUogrjCwXVUZ1dm6asrfN` READY. Both use the permitted Vercel project. The existing preview alias is used for authenticated testing; production domains were not reassigned.

## Database

Only Lusaill project `sikeoqsmneywwsqehcum` was changed. Applied additive foundation, private RPC implementation schema, staged editor linkage/read permissions, unsafe DDL-grant removal, and assigned-writer brief fix. All 22 public tables have RLS. Supabase security advisor reports no new schema warnings; its existing leaked-password-protection warning remains an Auth setting (see [Supabase documentation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)).

Privileged implementations are outside the exposed API schema. Public wrappers use invoker security; mutation functions check membership, role, ownership, prerequisites and optimistic versions. Operations history has no browser write grants. The separate `release_gates` cutover migration is tested locally and **not applied**. Until cutover, production's old admin-only `cms_save` retains its existing behavior; the preview's new `ops_cms_save` enforces operations gates. Do not claim production publication enforcement is activated.

## Automated checks

- `npm run content-ops:test`: PASS. Executes all migrations, including release cutover, under PGlite. Covers six roles, outsider/anon access, assigned writer editing a strategist-created brief, approval denial, evidence/required fields, transitions, optimistic conflicts, immutable audit, atomic/repeated conversion, writer-scoped CMS and revisions, publisher release, stale-snapshot rejection through both RPC names, direct mutation/TRUNCATE denial, explicit admin draft exceptions and public snapshot preservation.
- `npm run cms:test`: PASS, including actual CSV parsing, 330 existing content imports and discovery behavior.
- `npx tsc --noEmit`: PASS.
- Full lint: no errors; two existing warnings in course-data/test files.
- `npm run seo:qa`: PASS, including 43 task paths and 22 semantic regressions.
- Remote Next.js build for editor integration: READY.

## Live/preview checks

Focused fetches on editor preview: homepage, birth-registration article, backup-codes article, electricity category, article directory, sitemap and robots all HTTP 200. Public HTML contains an H1 and canonical www URLs; both article pages include four parseable JSON-LD blocks. Sitemap excludes admin URLs; robots blocks admin. Unauthenticated operations page reaches noindex login. Operations overview and ideas APIs return 401 without a session.

Authenticated browser: command center loaded real empty counts; idea form saved Arabic text as version 1, then a reasoned rejection as version 2. Database confirms two audit events. Private test idea `5b8f374b-50d9-4f66-9a78-c8773da50531` is clearly marked as a technical test, rejected, and was never converted to content or published. Existing public content is file-backed; the CMS database still has zero published snapshots. Screenshot is stored outside the source tree at `outputs/content-ops-preview-2026-11-02.png`.

Full browser evidence→brief→outline→writer draft→publisher job UAT and responsive viewport checks remain open. The database integration flow passed; that does not substitute for claiming complete browser UAT or full FRS acceptance.
