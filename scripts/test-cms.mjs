import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import {
  documentSchema,
  emptyDocument,
  publishErrors,
  normalizeTopic,
} from "../lib/cms/model.ts";

const d = emptyDocument();
d.slug = "cms-test";
d.title = "اختبار حفظ المقال";
d.answer = "إجابة موثقة";
d.reviewedAt = "2026-11-01";
d.sources = [
  {
    label: "مصدر رسمي",
    url: "https://www.moss.gov.eg/",
    checkedAt: "2026-11-01",
    expiresAt: "",
  },
];
assert(documentSchema.safeParse(d).success);
assert(
  !documentSchema.safeParse({
    ...d,
    sources: [{ ...d.sources[0], url: "javascript:alert(1)" }],
  }).success,
);
assert(!documentSchema.safeParse({ ...d, reviewedAt: "nonsense" }).success);
assert(publishErrors({ ...d, answer: "" }).length);
assert.equal(normalizeTopic("إجراءاتُ  التجديد"), "اجراءات التجديد");
const db = new PGlite();
await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
create schema auth;create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to authenticated,anon,service_role;grant execute on function auth.uid() to authenticated,anon,service_role;`);
await db.exec(await readFile("database/cms-schema.sql", "utf8"));
const admin = "11111111-1111-4111-8111-111111111111",
  stranger = "22222222-2222-4222-8222-222222222222";
await db.exec(
  `insert into auth.users values('${admin}'),('${stranger}');insert into public.cms_admins(user_id) values('${admin}');`,
);
async function as(user, sql, params = []) {
  await db.exec(
    `set role authenticated;select set_config('request.jwt.claim.sub','${user}',false);`,
  );
  try {
    return await db.query(sql, params);
  } finally {
    await db.exec("reset role");
  }
}
const saved = await as(admin, "select public.cms_save($1::jsonb,0) as doc", [
  JSON.stringify(d),
]);
assert.equal(saved.rows[0].doc.version, 1);
await assert.rejects(
  as(admin, "select public.cms_save($1::jsonb,0)", [JSON.stringify(d)]),
  /VERSION_CONFLICT/,
);
assert.equal(
  (await db.query("select count(*)::int n from cms_revisions")).rows[0].n,
  1,
);
await assert.rejects(
  as(stranger, "select public.cms_save($1::jsonb,0)", [
    JSON.stringify({ ...d, id: crypto.randomUUID(), slug: "unauthorized" }),
  ]),
  /FORBIDDEN/,
);
const publish = { ...saved.rows[0].doc, status: "published" };
await as(admin, "select public.cms_save($1::jsonb,1)", [
  JSON.stringify(publish),
]);
await db.exec("set role anon");
assert.equal(
  (await db.query("select count(*)::int n from cms_publications")).rows[0].n,
  1,
);
await assert.rejects(
  db.query("select * from cms_documents"),
  /permission denied/,
);
await assert.rejects(
  db.query("select * from cms_revisions"),
  /permission denied/,
);
await db.exec("reset role");
await as(admin, "select public.cms_save($1::jsonb,2)", [
  JSON.stringify({ ...publish, status: "draft", title: "SECRET_DRAFT" }),
]);
assert.notEqual(
  (await db.query("select document from cms_publications")).rows[0].document
    .title,
  "SECRET_DRAFT",
);
await as(admin, "select public.cms_save($1::jsonb,3)", [
  JSON.stringify({ ...publish, status: "archived", answer: "PRIVATE_CHANGES" }),
]);
const archived = (await db.query("select document from cms_publications"))
  .rows[0].document;
assert.equal(archived.status, "archived");
assert.equal(archived.answer, "");
assert(documentSchema.safeParse(archived).success);
assert.equal(
  (await db.query("select count(*)::int n from cms_revisions")).rows[0].n,
  4,
);
const scheduled = {
  ...d,
  id: crypto.randomUUID(),
  slug: "scheduled-test",
  status: "scheduled",
  scheduledAt: "2000-01-01T00:00:00Z",
};
await as(admin, "select public.cms_save($1::jsonb,0)", [
  JSON.stringify(scheduled),
]);
await db.exec("set role service_role");
const due = await db.query("select public.cms_publish_due() as n");
assert.equal(due.rows[0].n, 1);
await db.exec("reset role");
assert.equal(
  (
    await db.query("select document from cms_publications where slug=$1", [
      "scheduled-test",
    ])
  ).rows[0].document.status,
  "published",
);
await as(admin, "select public.cms_save($1::jsonb,4)", [
  JSON.stringify({ ...publish, status: "draft" }),
]);
assert.equal(
  (
    await db.query(
      "select max(version)::int n from cms_revisions where document_id=$1",
      [d.id],
    )
  ).rows[0].n,
  5,
);
await db.exec("set role anon");
await assert.rejects(
  db.query("select public.cms_publish_due()"),
  /permission denied/,
);
await db.exec("reset role");
for (let i = 0; i < 19; i++) {
  const item = {
    ...d,
    id: crypto.randomUUID(),
    slug: `quota-${i}`,
    status: "published",
  };
  await as(admin, "select public.cms_save($1::jsonb,0)", [
    JSON.stringify(item),
  ]);
}
await assert.rejects(
  as(admin, "select public.cms_save($1::jsonb,0)", [
    JSON.stringify({
      ...d,
      id: crypto.randomUUID(),
      slug: "over-quota",
      status: "published",
    }),
  ]),
  /DAILY_LIMIT/,
);
assert.equal(
  (
    await db.query(
      "select count(*)::int n from cms_documents where slug='over-quota'",
    )
  ).rows[0].n,
  0,
);
await db.close();
console.log(
  "PASS: CMS validation, single-admin RLS, private drafts/revisions, atomic version conflict, publishing snapshots and safe archival",
);
