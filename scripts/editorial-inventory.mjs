#!/usr/bin/env node
/**
 * Reproducible editorial inventory, not a search ranking prediction.
 * The gate is a temporary prioritization rule, not a Google word-count requirement.
 * Run: node scripts/editorial-inventory.mjs
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import ts from "typescript";

const cache = new Map();
function load(file) {
  let path = resolve(file);
  if (!existsSync(path) || !statSync(path).isFile()) {
    if (existsSync(path + ".ts")) path += ".ts";
    else path = resolve(path, "index.ts");
  }
  if (cache.has(path)) return cache.get(path);
  if (path.endsWith(".json")) {
    const value = { default: JSON.parse(readFileSync(path, "utf8")) };
    cache.set(path, value);
    return value;
  }
  const exports = {};
  cache.set(path, exports);
  const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "exports", code)((id) => {
    assert(id.startsWith(".") || id.startsWith("@/"), "Unexpected data dependency: " + id);
    return load(id.startsWith("@/") ? resolve(id.slice(2)) : resolve(dirname(path), id));
  }, exports);
  return exports;
}
const { articles, isArticleIndexable } = load("lib/content.ts");
const { knowledgeTopics } = load("lib/knowledge-expansion-data.ts");
const { foodSafetyArticles } = load("lib/food-safety.ts");
const { guidePaths } = load("lib/guide-paths.ts");
const { getEncyclopedicContent } = load("lib/encyclopedic-content.ts");
const { verifiedServiceHubs } = load("lib/verified-service-hubs.ts");
const gate = load("lib/editorial-indexing.ts");
const words = text => String(text || "").trim().split(/\s+/u).filter(Boolean).length;
function body(a) {
 const deep = getEncyclopedicContent(a.slug);
 return [
  a.quickAnswer, ...(a.steps??[]).flatMap(s=>[s.title,s.detail]),
  ...(a.summaryTable??[]).flatMap(row=>[row.label,row.value]),
  ...(a.practicalSections??[]).flatMap(s=>[s.title,s.intro,...s.rows.flat()]),
  ...(a.commonMistakes??[]), ...(a.faqs??[]).flatMap(x=>[x.question,x.answer]),
  ...(deep?.sections??[]).flatMap(s=>[s.title,...s.paragraphs,...(s.bullets??[])])
 ].filter(Boolean).join(" ");
}
const referenceUrls = a => {
 const d = getEncyclopedicContent(a.slug);
 return [...new Set([
  ...(a.sources??[]).map(s=>s.url), ...(d?.sources??[]).map(s=>s.url),
  ...(d?.sections??[]).flatMap(s=>s.sourceUrls??[])
 ].filter(x => /^https:\/\/[^\s]+/i.test(x??"")))];
};
const rows = articles.filter(isArticleIndexable).map(a => {
 const d=getEncyclopedicContent(a.slug), wc=words(body(a)), refs=referenceUrls(a);
 const missing=[];
 if(wc<350)missing.push("brief_content");
 if(refs.length<2)missing.push("few_source_links");
 if(!a.metaDescription?.trim())missing.push("no_specific_meta_description");
 if(a.metaDescription?.length>200)missing.push("long_meta_description");
 if(!a.updatedAt)missing.push("missing_content_review_date");
 if(!d && (a.practicalSections?.length??0)<2 && !gate.isArticleSearchReady(a))missing.push("limited_added_depth");
 return {slug:a.slug,title:a.title,cluster:a.clusterCode,words:wc,sourceLinks:refs.length,searchReady:gate.isArticleSearchReady(a),issues:missing};
});
const key=s=>String(s||"").trim().toLocaleLowerCase("ar").replace(/[\s\p{P}]+/gu," ");
const desc = new Map();
for(const a of articles.filter(isArticleIndexable)){
 if(!a.metaDescription?.trim())continue;
 const k=key(a.metaDescription);
 desc.set(k,[...(desc.get(k)||[]),a.slug]);
}
const duplicateMetas=[...desc.values()].filter(g=>g.length>1);
const split={};
for(const a of rows){
 const name=a.searchReady?"ready":"held";
 (split[a.cluster]??={ready:0,held:0})[name]++;
}
const health=knowledgeTopics.filter(gate.isMedicalKnowledgeTopic);
const summary={
 publishedArticles:rows.length,
 articleSearchReady:rows.filter(a=>a.searchReady).length,
 heldForReview:rows.filter(a=>!a.searchReady).length,
 knowledgeTopics:knowledgeTopics.length,
 knowledgeReady:knowledgeTopics.filter(gate.isKnowledgeSearchReady).length,
 medicalKnowledgeHeld:health.length,
 foodSafetyHeld:foodSafetyArticles.filter(a=>!gate.isFoodSafetySearchReady(a)).length,
 topicPaths:guidePaths.length,
 searchableGuidePaths:guidePaths.filter(gate.isGuidePathSearchReady).length,
 enrichedDecisionHubs:Object.keys(verifiedServiceHubs),
 withoutSpecificMeta:rows.filter(r=>r.issues.includes("no_specific_meta_description")).length,
 duplicateMetaGroups:duplicateMetas.length,
 fewerThanTwoSources:rows.filter(r=>r.sourceLinks<2).length,
 noindexByCluster:split
};
console.log("EDITORIAL_INVENTORY_SUMMARY "+JSON.stringify(summary));
if(duplicateMetas.length)console.log("EDITORIAL_DUPLICATE_META "+JSON.stringify(duplicateMetas.slice(0,20)));
const opportunities = rows.filter(r=>!r.searchReady && r.sourceLinks>=2)
 .sort((a,b)=>b.words-a.words).slice(0,18);
console.log("EDITORIAL_REVIEW_CANDIDATES "+JSON.stringify(opportunities));
for(const group of ["driving-licences","work-permits","passports"]){
 const h=verifiedServiceHubs[group];
 console.log("SERVICE_HUB "+JSON.stringify({slug:group,title:h.title,covered:h.choices.length,
    cases:guidePaths.find(p=>p.slug===group)?.articleSlugs.length??0,
    sourceLinks:h.references.length,
    unresolvedFees:h.factRows.some(r=>/لم نوثق|لم تتحقق|غير مؤكدة|لا يوجد/i.test(r.value))}));
}
assert(rows.length > 0 && knowledgeTopics.length > 0 && foodSafetyArticles.length > 0,"Missing editorial datasets");
