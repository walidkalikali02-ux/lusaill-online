import assert from "node:assert/strict";
import { articles } from "../lib/content.ts";
import { importArticle } from "../lib/cms/import.ts";
import { documentSchema } from "../lib/cms/model.ts";
for (const article of articles) {
  const d = importArticle(article);
  const parsed = documentSchema.safeParse(d);
  assert(
    parsed.success,
    `${article.slug}: ${JSON.stringify(parsed.error?.issues)}`,
  );
  assert.equal(
    d.blocks.filter((b) => b.kind === "step").length,
    article.steps?.length ?? 0,
  );
  assert.equal(
    d.blocks.filter((b) => b.kind === "faq").length,
    article.faqs?.length ?? 0,
  );
}
console.log(
  `PASS: ${articles.length} existing articles import with sources, summary, practical sections, steps and FAQs`,
);

for (const article of articles.filter(a=>a.slug.startsWith("old-rent-housing-"))) {
  const doc = importArticle(article);
  assert.equal(doc.status, "published");
  assert(doc.blocks.some(b=>b.id === "housing-press-followup" && b.text.includes("لم نتمكن")));
  assert.equal(doc.blocks.filter(b=>b.id.startsWith("housing-press-source-")).length, 4);
  assert.deepEqual(doc.sources.map(s=>s.checkedAt), article.sources?.map(s=>s.checkedAt));
}
console.log("PASS: CMS import preserves housing uncertainty and separately labelled press sources");

const { mergePublicArticles } = await import("../lib/cms/discovery.ts");
const source = articles.find(a=>a.status === "published")!;
const managed = importArticle(source);
const draft = {...managed, title: "PRIVATE DRAFT", status: "draft" as const};
assert.equal(mergePublicArticles([source], [draft])[0].title, source.title);
const moved = {...managed, title: "Updated title", category: "C"};
const changed = mergePublicArticles([source], [moved]);
assert.equal(changed.length, 1);
assert.equal(changed[0].title, "Updated title");
assert.equal(changed[0].clusterCode, "C");
assert.equal(changed[0].publishedAt, source.publishedAt);
assert.equal(mergePublicArticles([source], [{...managed, status:"archived"}]).length, 0);
const added = {...managed, id:"00000000-0000-4000-8000-000000008888", slug:"new-cms-guide"};
assert.equal(mergePublicArticles([source], [added]).length, 2);
assert.equal(mergePublicArticles([source], [{...added, category:"UNKNOWN"}]).length, 1);
assert.equal(mergePublicArticles([source], [{...added, status:"scheduled"}]).length, 1);
console.log("PASS: public discovery preserves live drafts, removes archives, moves categories and excludes unpublished content");
