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
