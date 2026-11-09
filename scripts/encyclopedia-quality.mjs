#!/usr/bin/env node
/**
 * A strict quality gate for research-enriched article bodies only.
 * It intentionally does NOT pad existing guides or automatically noindex them.
 */
import fs from "node:fs";
import path from "node:path";
function readRegistry(pathname, startMarker, endMarker) {
  const source=fs.readFileSync(pathname,"utf8");
  const from=source.indexOf(startMarker);
  const until=source.lastIndexOf(endMarker);
  if(from<0||until<=from)throw new Error("Encyclopedic content registry could not be parsed: "+pathname);
  return JSON.parse(source.slice(from+startMarker.length,until));
}
const registry=readRegistry(
  "lib/encyclopedic-content.ts",
  "export const encyclopedicContent: Record<string, EncyclopedicContent> = ",
  ";\\nconst electricityReferenceExpansions".replace("\\\\n","\\n"),
);
const supplemental=[
  ["upper-egypt-electricity","lib/electricity-upper-reference.ts","upperEgyptElectricityExpansion"],
  ["beheira-electricity","lib/electricity-beheira-reference.ts","beheiraElectricityExpansion"],
  ["south-delta-electricity","lib/electricity-south-delta-reference.ts","southDeltaElectricityExpansion"],
];
for(const [slug,pathname,name] of supplemental){
  if(registry[slug])throw new Error("Duplicate encyclopedia slug: "+slug);
  registry[slug]=readRegistry(pathname,`export const ${name}: EncyclopedicContent = `,";\\n".replace("\\\\n","\\n"));
}
let bad=0;
for (const [slug, article] of Object.entries(registry)) {
  const body=article.sections.flatMap(section=>[section.title,...section.paragraphs,...(section.bullets??[])]).join(" ");
  const words=body.trim().split(/\s+/u).filter(Boolean).length;
  const chapters=article.sections?.length??0;
  const officialSources=new Set(article.sources?.map(source=>source.url)??[]);
  const cited=new Set(article.sections.flatMap(section=>section.sourceUrls??[]));
  const duplicateIds=new Set(article.sections.map(section=>section.id)).size!==chapters;
  const missingCitations=[...cited].filter(url=>!officialSources.has(url));
  const invalidSources=article.sources.some(source=>!/^https:\/\//.test(source.url)||!/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt));
  const brokenIllustrations=article.sections.flatMap(section=>section.illustration?[section.illustration.src]:[]).filter(src=>!src.startsWith("/")||!fs.existsSync(path.join("public",src.slice(1))));
  const emptyParagraphs=article.sections.some(section=>section.paragraphs.length<2||section.paragraphs.some(paragraph=>paragraph.trim().length<80));
  const valid=words>=1000&&chapters>=5&&officialSources.size>=3&&!duplicateIds&&!missingCitations.length&&!invalidSources&&!brokenIllustrations.length&&!emptyParagraphs;
  console.log(`${valid?"PASS":"FAIL"} ${slug}: ${words} words, ${chapters} chapters, ${officialSources.size} sources, ${brokenIllustrations.length} missing assets`);
  if(!valid){bad++;console.error(JSON.stringify({slug,duplicateIds,missingCitations,invalidSources,brokenIllustrations,emptyParagraphs}));}
}
console.log(`Quality-reviewed longform articles: ${Object.keys(registry).length}`);
if(bad)process.exitCode=1;
