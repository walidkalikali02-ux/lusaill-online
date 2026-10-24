import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { createRequire } from "node:module";
const load = createRequire(import.meta.url);

// Load the actual TypeScript content graph without changing production imports.
load.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } });
  module._compile(result.outputText, filename);
};
const { articleJourneyByPath } = load("../lib/article-journeys.ts");
const { guidePaths, getGuidePath } = load("../lib/guide-paths.ts");
const { articles, getRelatedArticles } = load("../lib/content.ts");
const { housingDeadlinePassed } = load("../lib/deadlines.ts");

assert.equal(new Set(guidePaths.map(path => path.slug)).size, guidePaths.length);
assert.deepEqual(guidePaths.map(path => path.slug).sort(), Object.keys(articleJourneyByPath).sort(), "Every named journey needs exactly one task page");

// Editorial expectations: these must stay true even when groups are reordered.
const cases = {
  "tax-card-first-time-egypt": "tax-registration",
  "consumer-protection-complaint-egypt": "consumer-protection",
  "passport-first-time-egypt": "passports",
  "work-permit-first-time-egypt": "work-permits",
  "conscript-travel-permit-egypt": "military-documents",
  "google-backup-codes": "account-security",
  "newborn-birth-registration-egypt": "birth-documents",
  "national-id-first-time-egypt": "national-id",
  "paper-marriage-record-egypt": "marriage-records",
  "death-registration-burial-permit": "death-records",
  "private-driving-license-first-time": "driving-license",
  "verify-used-vehicle-license": "vehicle-check",
  "slides-create-outline": "slides-build",
  "forms-create-registration": "forms-build",
  "south-delta-electricity": "electricity",
  "registered-mobile-lines": "telecom-lines",
  "wifi-calling-egypt": "telecom-connectivity",
  "esim-egypt": "telecom-devices",
  "insurance-number-inquiry": "social-insurance",
  "pension-payment-inquiry": "pensions",
  "old-rent-housing-apply": "housing",
  "birth-certificate-abroad": "consular-documents",
};
for (const [slug, task] of Object.entries(cases)) assert.equal(getGuidePath(slug)?.slug, task, `${slug} assigned to unrelated task`);
for (const path of guidePaths) {
  assert(path.articleSlugs.length > 0, `Empty task: ${path.slug}`);
  for (const slug of path.articleSlugs) assert(articles.some(article => article.slug === slug && article.status === "published"), `Unpublished task member: ${path.slug}/${slug}`);
}
for (const article of articles.filter(article => article.status === "published")) {
  const path = getGuidePath(article.slug);
  const explicit = new Set((article.steps ?? []).flatMap(step => step.relatedLink?.href.startsWith("/articles/") ? [step.relatedLink.href.slice(10)] : []));
  for (const related of getRelatedArticles(article)) {
    assert(related.id !== article.id && related.status === "published");
    assert(explicit.has(related.slug) || path?.articleSlugs.includes(related.slug), `Unrelated recommendation: ${article.slug}/${related.slug}`);
  }
  const latestContentDate = new Date(article.publishedAt ?? 0).getTime();
  assert(new Date(article.updatedAt ?? 0).getTime() >= latestContentDate, `Review date predates publication: ${article.slug}`);
}
assert.equal(housingDeadlinePassed(new Date("2026-10-12T23:59:59+03:00")), false);
assert.equal(housingDeadlinePassed(new Date("2026-10-13T00:00:00+03:00")), true);
console.log(`PASS: ${guidePaths.length} named task paths, ${Object.keys(cases).length} semantic regressions, all published recommendations and review dates`);
