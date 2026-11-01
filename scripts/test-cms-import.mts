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
