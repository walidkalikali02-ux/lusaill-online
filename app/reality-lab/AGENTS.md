# Codex instructions — Lusaill Reality Lab

The repository is a Next.js encyclopedia. The Reality Lab is the private operational research module under app/reality-lab and lib/reality-lab. Work in Arabic RTL.

## Engineering constraints
- Preserve the existing encyclopedia pages, SEO metadata, indexing rules, and shared site layout. Reality Lab is noindex and isolated from SiteFrame.
- Never present synthetic data, scenario output or seeded reproducibility as measured company performance.
- Never collect customer names, phones, payment details, credentials, or raw POS data on the public-facing demo route.
- Simulation API must have bounded inputs, deterministic seed, no network calls, and no unsafe evaluation.
- Unit tests: npm run lab:test. Run TypeScript checks and Next.js build before merging.
- Do not place Supabase service-role keys in client bundles. Add auth and RLS before making private data persistent.
- Keep physical units explicit: kilograms, minutes, days, QAR. Explain uncertainty and missing calibration.
- This v0.3 server-side TypeScript model is an explanatory demo. The detailed audited Python v0.2 engine belongs in a future worker deployment, not browser code.

## Tasks for next Codex agent
1. Implement a secure authenticated data layer and SQL migrations for project/run history.
2. Build connector adapters for actual POS/ERP/roaster logs, with an ingestion quarantine.
3. Add worker jobs for long-lived Python simulation and model-version tracking.
4. Add validation plots vs measured hold-out data, sensitivity analysis, and calibration provenance.
5. Add automated preview and branch protection; test responsive RTL dashboard.
