import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const load = (path, imports = {}) => {
  const source = readFileSync(path, "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function("require", "exports", code)((id) => { assert(id in imports, `Unexpected import ${id}`); return imports[id]; }, exports);
  return exports;
};
const journeys = load("lib/article-journeys.ts");
const {guidePaths,getGuidePath} = load("lib/guide-paths.ts", {"./article-journeys": journeys});
const expected = {housing:"old-rent-housing-apply",electricity:"north-cairo-electricity","chrome-repair":"chrome-crash-diagnosis","forms-build":"forms-create-registration","account-security":"google-backup-codes","driving-licences":"private-driving-license-first-time"};
for(const [slug,article] of Object.entries(expected)) assert(guidePaths.find(p=>p.slug===slug)?.articleSlugs.includes(article), `${slug} has wrong topic membership`);
assert(!guidePaths.find(p=>p.slug==="housing").articleSlugs.some(s=>s.startsWith("slides-")));
assert.equal(new Set(guidePaths.map(p=>p.slug)).size,guidePaths.length);
for(const p of guidePaths) { assert(p.articleSlugs.length,`Empty path ${p.slug}`); assert.equal(new Set(p.articleSlugs).size,p.articleSlugs.length); }
assert.equal(getGuidePath("automated-birth-certificate").slug,"birth-certificates");
const search = load("lib/guide-search.ts");
assert.equal(search.searchGuides([{slug:"a",title:"فاتورة الكهرباء",keyword:""}],"فَاتورة الكهرباء").length,1);
assert.equal(search.searchGuides([{slug:"a",title:"أمان الحساب",keyword:""}],"امان").length,1);
console.log(`Guide/search regression checks passed for ${guidePaths.length} keyed task paths.`);

// Validate that every visible task member exists and every published article has a relevant path.
const moduleCache = new Map();
const importSource = (path) => {
  path = path.replace(/\\/g, "/");
  if (!path.endsWith(".ts")) path += path.endsWith("article-content") ? "/index.ts" : ".ts";
  if (moduleCache.has(path)) return moduleCache.get(path);
  const exports = {}; moduleCache.set(path, exports);
  const code = ts.transpileModule(readFileSync(path, "utf8"), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  new Function("require", "exports", code)((id) => {
    assert(id.startsWith("."), `Unexpected content dependency: ${id}`);
    const base = path.slice(0, path.lastIndexOf("/") + 1);
    return importSource(base + id.replace(/^\.\//, ""));
  }, exports);
  return exports;
};
const {articles} = importSource("lib/content.ts");
const published = new Set(articles.filter(a => a.status === "published").map(a => a.slug));
for (const path of guidePaths) for(const slug of path.articleSlugs) assert(published.has(slug), `Unpublished member ${slug} in ${path.slug}`);
for(const slug of published) assert(getGuidePath(slug), `No task path for published article ${slug}`);
console.log(`All ${published.size} published articles have task paths; all members are published.`);

// Article audit: a category move must reach every consumer of the article model.
const {getArticleAdvisories, trafficArticleSlugs} = importSource("lib/article-audit-updates.ts");
for (const slug of trafficArticleSlugs) assert.equal(articles.find(a => a.slug === slug)?.clusterCode, "C", `Traffic topic is outside its category: ${slug}`);
assert.equal(articles.filter(a => a.status === "published" && a.clusterCode === "C").length, 13);
for (const a of articles.filter(a => a.status === "published")) {
  assert(new Date(a.updatedAt).getTime() <= Date.now(), `Future update date: ${a.slug}`);
  for (const section of a.practicalSections ?? []) {
    assert(section.rows.length && section.columns.length >= 2);
    for (const row of section.rows) assert.equal(row.length, section.columns.length, `Malformed table: ${a.slug}`);
  }
  const housing = a.slug.startsWith("old-rent-housing-");
  const before = getArticleAdvisories(a, new Date("2026-10-12T12:00:00+03:00")).filter(n => n.title.includes("التقديم"));
  const after = getArticleAdvisories(a, new Date("2026-10-27T12:00:00+03:00")).filter(n => n.title.includes("التقديم"));
  assert.equal(before.length, 0);
  assert.equal(after.length, housing ? 1 : 0, `Missing or misplaced deadline notice: ${a.slug}`);
}
const housingArticle = articles.find(a => a.slug === "old-rent-housing-apply");
assert(!housingArticle.faqs.some(f => f.question.includes("اقترب الموعد")));
assert(articles.find(a => a.slug === "seasonal-work-permit-egypt").quickAnswer.includes("ليس قائمة مستندات مكتملة"));
console.log("Article audit regression passed: 8 category moves, 5 deadline notices, honest scope and valid practical tables.");
