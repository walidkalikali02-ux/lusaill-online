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
