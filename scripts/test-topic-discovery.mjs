import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {resolve,dirname} from "node:path";
import ts from "typescript";
const cache=new Map();
function load(file){
 let path=resolve(file);
 if(!existsSync(path)){if(existsSync(path+".ts"))path+=".ts";else path=resolve(path,"index.ts");}
 if(cache.has(path))return cache.get(path);
 if(path.endsWith(".json")){const value={default:JSON.parse(readFileSync(path,"utf8"))};cache.set(path,value);return value;}
 const exports={};cache.set(path,exports);
 const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function("require","exports",code)((id)=>{assert(id.startsWith(".")||id.startsWith("@/"),"Unexpected data dependency "+id);return load(id.startsWith("@/")?resolve(id.slice(2)):resolve(dirname(path),id));},exports);
 return exports;
}
const {articles}=load("lib/content.ts"),{foodSafetyArticles}=load("lib/food-safety.ts"),{sitemapGroups}=load("lib/sitemaps.ts"),{getGuidePath}=load("lib/guide-paths.ts"),{getArticleModifiedAt,latestContentDate}=load("lib/content-modified.ts"),{guideIllustrations}=load("lib/guide-illustrations.ts");
assert.equal(latestContentDate("2026-10-22","2026-09-30"),"2026-10-22","An older image must not overwrite newer content");
assert.equal(getArticleModifiedAt({slug:"legacy-without-image",updatedAt:"2026-09-20"}),"2026-09-20","No global date floor");
assert.equal(getArticleModifiedAt({slug:"unknown"}),undefined,"Do not invent a date");
assert.equal(latestContentDate("invalid","2026-10-01"),"2026-10-01");
const groups=sitemapGroups(),all=Object.values(groups).flat(),urls=all.map(r=>r.url),map=new Map(groups["sitemap-articles.xml"].map(r=>[r.url,r]));
assert.equal(new Set(urls).size,urls.length,"Duplicate sitemap URLs");
for(const url of urls){const u=new URL(url);assert.equal(u.origin,"https://www.lusaill.online");assert(!u.search&&!u.hash,"Only canonical clean URLs in sitemap");}
const published=articles.filter(a=>a.status==="published");
assert.equal(map.size,published.length+foodSafetyArticles.length);
for(const a of articles){const url="https://www.lusaill.online/articles/"+a.slug;if(a.status!=="published"){assert(!map.has(url),"Draft/removed article leaked to sitemap");continue;}assert(getGuidePath(a.slug),"Published guide needs a task hub");const date=getArticleModifiedAt(a);assert(date,"Missing authentic content/publication date");assert(Date.parse(date)<=Date.now(),"Future modification date");assert.equal(new Date(map.get(url).lastModified).getTime(),Date.parse(date));if(guideIllustrations[a.slug]?.updatedAt)assert(Date.parse(date)>=Date.parse(guideIllustrations[a.slug].updatedAt));}
for(const a of foodSafetyArticles){const row=map.get("https://www.lusaill.online/food-safety/"+a.slug);assert(row);assert.equal(new Date(row.lastModified).getTime(),Date.parse(a.updatedAt));}
for(const path of ["/articles/verify-electronic-certificate","/articles/move-in-condition-report","/categories/housing-utilities","/services/electricity-bill-inquiry"])assert(!urls.includes("https://www.lusaill.online"+path),"Retired/alias URL leaked");
const source=readFileSync("components/electricity-inquiry-detail.tsx","utf8");
const targets=["electricity-complaint","electricity-consumer-rights","electricity-outage-report","electricity-meter-apply","electricity-meter-transfer","electricity-meter-test","prepaid-meter-mobile-charge","north-cairo-electricity","north-delta-electricity"];
for(const slug of targets){assert(published.some(a=>a.slug===slug),"Unpublished contextual link");assert(source.includes('href="/articles/'+slug+'"'),"Missing service decision-table link");}
const companySlugs=load("lib/electricity-inquiry-detail.ts").electricityCompanies.map(c=>c.guide).filter(Boolean);
const normalized=text=>text.toLowerCase().replace(/[ً-ْـ]/g,"").replace(/[أإآ]/g,"ا").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
const documents=[...published.map(a=>({url:"/articles/"+a.slug,title:a.title,text:[a.quickAnswer,...(a.steps??[]).flatMap(s=>[s.title,s.detail]),...(a.summaryTable??[]).flatMap(r=>[r.label,r.value]),...(a.practicalSections??[]).flatMap(s=>[s.title,s.intro,...s.rows.flat()]),...(a.faqs??[]).flatMap(f=>[f.question,f.answer])].filter(Boolean).join(" ")})),...foodSafetyArticles.map(a=>({url:"/food-safety/"+a.slug,title:a.title,text:a.bodyHtml.replace(/<[^>]+>/g," ")}))];
const grams=documents.map(d=>{const words=normalized(d.text).split(" ");return new Set(words.slice(0,-3).map((_,i)=>words.slice(i,i+4).join(" ")));});
const exact=new Map(),pairs=[];
for(let i=0;i<documents.length;i++){const text=normalized(documents[i].text);assert(!exact.has(text),"Exact duplicate content: "+documents[i].url+" / "+exact.get(text));exact.set(text,documents[i].url);for(let j=0;j<i;j++){const a=grams[i],b=grams[j],small=a.size<b.size?a:b,large=a.size<b.size?b:a;let intersection=0;for(const token of small)if(large.has(token))intersection++;const score=intersection/(a.size+b.size-intersection||1);if(score>.15)pairs.push({score:Number(score.toFixed(4)),a:{url:documents[i].url,title:documents[i].title,answer:documents[i].text.slice(0,240)},b:{url:documents[j].url,title:documents[j].title,answer:documents[j].text.slice(0,240)}});}}
pairs.sort((a,b)=>b.score-a.score);
console.log("DISCOVERY_SUMMARY "+JSON.stringify({published:published.length,food:foodSafetyArticles.length,articleSitemap:map.size,allSitemapUrls:urls.length,nonPublishedExcluded:articles.length-published.length,exactDuplicates:0,companySlugs,contextTargets:targets,nearCandidates:pairs.slice(0,10),result:"PASS"}));
for(const a of published){console.log("DISCOVERY_ARTICLE "+JSON.stringify({slug:a.slug,title:a.title,reviewedAt:a.updatedAt,publishedAt:a.publishedAt,modifiedAt:getArticleModifiedAt(a),imageModifiedAt:guideIllustrations[a.slug]?.updatedAt??null,category:a.clusterCode,hub:"/guides/"+getGuidePath(a.slug).slug}));await new Promise(resolve=>setTimeout(resolve,30));}
console.log("PASS: sitemap completeness, excluded drafts/retirements, authentic dates, hub membership and relevant contextual targets");
