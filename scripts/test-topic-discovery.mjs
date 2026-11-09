import assert from "node:assert/strict";
import {readFileSync,existsSync,statSync} from "node:fs";
import {resolve,dirname} from "node:path";
import ts from "typescript";
const cache=new Map();
function load(file){
 let path=resolve(file);
 if(!existsSync(path)||!statSync(path).isFile()){if(existsSync(path+".ts"))path+=".ts";else path=resolve(path,"index.ts");}
 if(cache.has(path))return cache.get(path);
 if(path.endsWith(".json")){const value={default:JSON.parse(readFileSync(path,"utf8"))};cache.set(path,value);return value;}
 const exports={};cache.set(path,exports);
 const code=ts.transpileModule(readFileSync(path,"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function("require","exports",code)((id)=>{assert(id.startsWith(".")||id.startsWith("@/"),"Unexpected data dependency "+id);return load(id.startsWith("@/")?resolve(id.slice(2)):resolve(dirname(path),id));},exports);
 return exports;
}
const {articles,clusters,isArticleIndexable}=load("lib/content.ts"),{foodSafetyArticles}=load("lib/food-safety.ts"),{sitemapGroups}=load("lib/sitemaps.ts"),{getGuidePath}=load("lib/guide-paths.ts"),{getArticleModifiedAt,latestContentDate}=load("lib/content-modified.ts"),{guideIllustrations}=load("lib/guide-illustrations.ts");
const {isArticleSearchReady,isKnowledgeSearchReady,isFoodSafetySearchReady}=load("lib/editorial-indexing.ts");
// Keep publication and crawl eligibility tied to real content, not a manual approval flag.
const emptyArticle = {
  id: 999999, slug: "empty-placeholder", title: "عنوان فقط",
  keyword: "عبارة بحث", status: "published",
  metaDescription: "وصف SEO", quickAnswer: "  ",
  summaryTable: [{label:"قيمة",value:"  "}],
  steps: [{title:"الخطوة", detail:" \n "}],
  faqs: [{question:"سؤال",answer:" "}],
  sources: [{label:"المصدر",url:"https://example.org",checkedAt:"2026-11-06"}],
};
assert.equal(isArticleIndexable(emptyArticle), false, "Empty articles must never publish, even if status is published");
assert.equal(isArticleIndexable({...emptyArticle,status:"drafting"}), false, "Draft metadata alone is not content");
assert.equal(isArticleIndexable({...emptyArticle,quickAnswer:"إجابة واقعية مفيدة للقارئ."}), true, "Contentful articles must not need editorial approval");
assert.equal(isArticleIndexable({...emptyArticle,status:"needs_verification",steps:[{title:"خطوة",detail:"شرح قابل للاستخدام"}]}), true, "Substantive steps automatically qualify");
assert.equal(articles.filter(a => !isArticleIndexable(a)).some(a => a.quickAnswer?.trim() || a.steps?.some(x => x.detail.trim())), false, "No real content should be excluded as empty");
assert.equal(latestContentDate("2026-10-22","2026-09-30"),"2026-10-22","An older image must not overwrite newer content");
assert.equal(getArticleModifiedAt({slug:"legacy-without-image",updatedAt:"2026-09-20"}),"2026-09-20","No global date floor");
assert.equal(getArticleModifiedAt({slug:"unknown"}),undefined,"Do not invent a date");
assert.equal(latestContentDate("invalid","2026-10-01"),"2026-10-01");
const groups=sitemapGroups(),all=Object.values(groups).flat(),urls=all.map(r=>r.url),map=new Map(groups["sitemap-articles.xml"].map(r=>[r.url,r]));
assert.equal(new Set(urls).size,urls.length,"Duplicate sitemap URLs");
// Content completeness regression: empty articles are never published or inserted in XML.
const {knowledgeTopics}=load("lib/knowledge-expansion-data.ts");
assert.equal(knowledgeTopics.length,138,"Expected 138 authored knowledge topics including batch 20");
const expertBatch = [...load("lib/knowledge-expert-batch-09a.ts").expertBatchA,...load("lib/knowledge-expert-batch-09b.ts").expertBatchB];
assert.equal(expertBatch.length,10,"Ten expert guides required");
assert.equal(new Set(expertBatch.map(t=>t.slug)).size,10,"Expert article slugs must be unique");
for (const t of expertBatch) {
  const body=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[]),...(s.table?.rows||[]).flat()]),...t.faq.flatMap(a=>[a.question,a.answer])].join(" ");
  const words=body.trim().split(/\s+/).length;
  assert(words>=1000,"Expert article must contain at least 1000 meaningful words: "+t.slug+" "+words);
  assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"Missing article structure, FAQ or sources: "+t.slug);
  assert(t.tool==="expert-knowledge-check","Missing matching interactive quiz: "+t.slug);
  assert(existsSync("public"+t.image),"Missing educational illustration: "+t.slug);
  assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}
const newExpertBatch10=[...load("lib/knowledge-expert-batch-10a.ts").expertBatch10A,...load("lib/knowledge-expert-batch-10b.ts").expertBatch10B,...load("lib/knowledge-expert-batch-10c.ts").expertBatch10C,...load("lib/knowledge-expert-batch-10d.ts").expertBatch10D];
const quiz10=load("lib/knowledge-expert-batch10-quiz-data.ts").expert10Questions;
assert.equal(newExpertBatch10.length,10,"Ten new long-form expert guides required");
assert.equal(new Set(newExpertBatch10.map(t=>t.slug)).size,10,"Duplicate new expert slug");
for(const t of newExpertBatch10){
 const body=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[]),...(s.table?.rows||[]).flat()]),...t.faq.flatMap(a=>[a.question,a.answer])].join(" ");
 const words=body.trim().split(/\s+/).length;
 assert(words>=1000,"New expert article must contain 1000 meaningful words: "+t.slug+" "+words);
 assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"New expert structure incomplete: "+t.slug);
 assert(t.tool==="expert-knowledge-check","No learning check: "+t.slug);
 assert(quiz10[t.slug]?.qa.length===2,"Missing quiz content: "+t.slug);
 assert(existsSync("public"+t.image),"Missing original infographic: "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}
const batch11=[...load("lib/knowledge-batch-11a.ts").batch11A,...load("lib/knowledge-batch-11b.ts").batch11B,...load("lib/knowledge-batch-11c.ts").batch11C,...load("lib/knowledge-batch-11d.ts").batch11D];
const quiz11=load("lib/knowledge-batch-11-quiz.ts").batch11Questions;
assert.equal(batch11.length,10,"Exactly ten expert guides required in batch 11");
assert.equal(new Set(batch11.map(t=>t.slug)).size,10,"Duplicate slug in batch 11");
for(const article of batch11){
 const body=[article.intro,article.directAnswer,...article.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[]),...(s.table?.rows||[]).flat()]),...article.faq.flatMap(a=>[a.question,a.answer])].join(" ");
 const words=body.trim().split(/\s+/).length;
 assert(words>=1000,"Batch 11 article shorter than 1000 words: "+article.slug+" "+words);
 assert(article.sections.length>=8&&article.faq.length>=5&&article.sources.length>=3,"Incomplete expert structure: "+article.slug);
 assert(article.tool==="expert-knowledge-check","No guided knowledge check: "+article.slug);
 assert(quiz11[article.slug]?.qa.length===2,"Missing two-question quiz: "+article.slug);
 assert(existsSync("public"+article.image),"Missing original infographic: "+article.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+article.slug),isKnowledgeSearchReady(article),"Knowledge sitemap must match temporary quality gate: "+article.slug);
}

const batch12=[...load("lib/knowledge-batch-12a.ts").batch12A,...load("lib/knowledge-batch-12b.ts").batch12B];
const quiz12=load("lib/knowledge-batch-12-quiz.ts").batch12Questions;
assert.equal(batch12.length,10,"Exactly ten guides required for batch 12");
assert.equal(new Set(batch12.map(t=>t.slug)).size,10,"Batch 12 slugs unique");
for(const article of batch12){
 const words=[article.intro,article.directAnswer,...article.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...article.faq.flatMap(x=>[x.question,x.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Expert guide shorter than 1000 words: "+article.slug+" "+words);
 assert(article.sections.length>=8&&article.faq.length>=5&&article.sources.length>=3,"Incomplete batch 12 article: "+article.slug);
 assert(article.tool==="expert-knowledge-check"&&quiz12[article.slug]?.qa.length===2,"Missing knowledge test: "+article.slug);
 assert(article.related.length>=2,"Missing contextual internal links: "+article.slug);
 assert(existsSync("public"+article.image),"Missing original graphic: "+article.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+article.slug),isKnowledgeSearchReady(article),"Knowledge sitemap must match temporary quality gate: "+article.slug);
}


const batch13=[...load("lib/knowledge-batch-13a.ts").batch13A,...load("lib/knowledge-batch-13b.ts").batch13B];
const quiz13=load("lib/knowledge-batch-13-quiz.ts").batch13Questions;
assert.equal(batch13.length,10,"Exactly 10 expert guides required for batch 13");
assert.equal(new Set(batch13.map(t=>t.slug)).size,10,"All batch 13 slugs must be unique");
for(const t of batch13){
 const words=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(q=>[q.question,q.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Batch 13 article under 1000 words: "+t.slug+" ("+words+")");
 assert(t.sections.length>=8 && t.faq.length>=5 && t.sources.length>=3,"Batch 13 article incomplete: "+t.slug);
 assert(t.description.length>=90 && t.description.length<=195,"Invalid SEO description: "+t.slug);
 assert(t.tool==="expert-knowledge-check"&&quiz13[t.slug]?.qa.length===2,"Missing interactive learning questions: "+t.slug);
 assert(t.related.length>=3 && t.related.every(l=>l.href.startsWith("/knowledge/")),"Missing internal contextual navigation: "+t.slug);
 assert(existsSync("public"+t.image),"Missing original batch 13 infographic: "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}


const batch14=[...load("lib/knowledge-batch-14a.ts").batch14A,...load("lib/knowledge-batch-14b.ts").batch14B,...load("lib/knowledge-batch-14c.ts").batch14C,...load("lib/knowledge-batch-14d.ts").batch14D,...load("lib/knowledge-batch-14e.ts").batch14E];
const quiz14=load("lib/knowledge-batch-14-quiz.ts").batch14Questions;
assert.equal(batch14.length,10,"Exactly ten knowledge guides required in batch 14");
assert.equal(new Set(batch14.map(t=>t.slug)).size,10,"Batch 14 must have unique URLs");
for(const t of batch14){
 const body=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(f=>[f.question,f.answer])].join(" ");
 const count=body.trim().split(/\s+/).length;
 assert(count>=1000,"Batch 14 expert article too short: "+t.slug+" "+count);
 assert(t.sections.length>=8 && t.faq.length>=5 && t.sources.length>=3,"Batch 14 incomplete FAQ/sections/sources "+t.slug);
 assert(t.description.length>=85 && t.description.length<=195,"Batch 14 SEO description missing "+t.slug);
 assert(t.related.length>=3,"Batch 14 missing internal navigation "+t.slug);
 assert(t.tool==="expert-knowledge-check" && quiz14[t.slug]?.qa.length===2,"Batch 14 missing interactive checks "+t.slug);
 assert(existsSync("public"+t.image),"Batch 14 graphic missing "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}


const batch15=[...load("lib/knowledge-batch-15a.ts").batch15A,...load("lib/knowledge-batch-15b.ts").batch15B,...load("lib/knowledge-batch-15c.ts").batch15C,...load("lib/knowledge-batch-15d.ts").batch15D];
const quiz15=load("lib/knowledge-batch-15-quiz.ts").batch15Questions;
assert.equal(batch15.length,10,"Batch 15 must publish exactly 10 expert guides");
assert.equal(new Set(batch15.map(t=>t.slug)).size,10,"Batch 15 slugs must be unique");
for(const t of batch15){
 const words=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(q=>[q.question,q.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Batch 15 article shorter than 1000 words: "+t.slug+" "+words);
 assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"Batch 15 article missing research content: "+t.slug);
 assert(t.description.length>=85&&t.description.length<=195,"Batch 15 SEO description length invalid: "+t.slug);
 assert(t.related.length>=3&&t.related.every(x=>x.href.startsWith("/knowledge/")),"Batch 15 internal links missing: "+t.slug);
 assert(t.tool==="expert-knowledge-check"&&quiz15[t.slug]?.qa.length===2,"Batch 15 interactive checks missing: "+t.slug);
 assert(existsSync("public"+t.image),"Batch 15 original infographic missing: "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}


const batch16=[...load("lib/knowledge-batch-16a.ts").batch16A,...load("lib/knowledge-batch-16b.ts").batch16B,...load("lib/knowledge-batch-16c.ts").batch16C];
const quiz16=load("lib/knowledge-batch-16-quiz.ts").batch16Questions;
assert.equal(batch16.length,10,"Batch 16 exactly 10 expert guides");
assert.equal(new Set(batch16.map(t=>t.slug)).size,10,"Batch 16 unique slugs");
for(const t of batch16){
 const words=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(f=>[f.question,f.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Batch 16 under 1000 words: "+t.slug+" "+words);
 assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"Batch 16 missing substantial content: "+t.slug);
 assert(t.description.length>=90&&t.description.length<=195,"Batch 16 invalid SEO description: "+t.slug);
 assert(t.related.length>=3&&t.related.every(l=>l.href.startsWith("/knowledge/")),"Batch 16 missing internal navigation: "+t.slug);
 assert(t.tool==="expert-knowledge-check"&&quiz16[t.slug]?.qa.length===2,"Batch 16 missing interactive quiz: "+t.slug);
 assert(existsSync("public"+t.image),"Batch 16 educational diagram missing: "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}


const batch17=[...load("lib/knowledge-batch-17a.ts").batch17A,...load("lib/knowledge-batch-17b.ts").batch17B,...load("lib/knowledge-batch-17c.ts").batch17C];
const quiz17=load("lib/knowledge-batch-17-quiz.ts").batch17Questions;
assert.equal(batch17.length,10,"Batch 17 must include exactly ten financial literacy articles");
assert.equal(new Set(batch17.map(t=>t.slug)).size,10,"Batch 17 slugs must be unique");
for(const t of batch17){
 const words=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(f=>[f.question,f.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Batch 17 article too short: "+t.slug+" "+words);
 assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"Batch 17 incomplete evidence structure: "+t.slug);
 assert(t.description.length>=85&&t.description.length<=195,"Batch 17 SEO description length invalid: "+t.slug);
 assert(t.related.length>=3&&t.related.every(l=>l.href.startsWith("/knowledge/")),"Batch 17 internal links missing: "+t.slug);
 assert(t.tool==="expert-knowledge-check"&&quiz17[t.slug]?.qa.length===2,"Batch 17 interactive checks missing: "+t.slug);
 assert(existsSync("public"+t.image),"Batch 17 original educational graphic missing: "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}


const batch18=[...load("lib/knowledge-batch-18a.ts").batch18A,...load("lib/knowledge-batch-18b.ts").batch18B,...load("lib/knowledge-batch-18c.ts").batch18C];
const quiz18=load("lib/knowledge-batch-18-quiz.ts").batch18Questions;
assert.equal(batch18.length,10,"Batch 18 must contain exactly ten expert Arabic guides");
assert.equal(new Set(batch18.map(t=>t.slug)).size,10,"Batch 18 article slugs must be unique");
for(const t of batch18){
 const words=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(q=>[q.question,q.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Batch 18 guide too short "+t.slug+" "+words);
 assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"Batch 18 guide missing expert sections or evidence "+t.slug);
 assert(t.description.length>=90&&t.description.length<=195,"Batch 18 SEO description length invalid "+t.slug);
 assert(t.related.length>=3&&t.related.every(x=>x.href.startsWith("/knowledge/")),"Batch 18 missing internal links "+t.slug);
 assert(t.tool==="expert-knowledge-check"&&quiz18[t.slug]?.qa.length===2,"Batch 18 must have two quiz items "+t.slug);
 assert(existsSync("public"+t.image),"Batch 18 original concept graphic missing "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}


const batch19=[...load("lib/knowledge-batch-19a.ts").batch19A,...load("lib/knowledge-batch-19b.ts").batch19B,...load("lib/knowledge-batch-19c.ts").batch19C];
const quiz19=load("lib/knowledge-batch-19-quiz.ts").batch19Questions;
assert.equal(batch19.length,10,"Batch 19 exactly ten Arabic expert project management guides");
assert.equal(new Set(batch19.map(t=>t.slug)).size,10,"Batch 19 slugs must be unique");
for(const t of batch19){
 const words=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(q=>[q.question,q.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Batch 19 guide under 1000 Arabic words: "+t.slug+" "+words);
 assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"Batch 19 missing expert structure: "+t.slug);
 assert(t.description.length>=85&&t.description.length<=195,"Batch 19 SEO description invalid: "+t.slug);
 assert(t.related.length>=3&&t.related.every(x=>x.href.startsWith("/knowledge/")),"Batch 19 missing internal article links: "+t.slug);
 assert(t.tool==="expert-knowledge-check"&&quiz19[t.slug]?.qa.length===2,"Batch 19 interactive questions missing: "+t.slug);
 assert(existsSync("public"+t.image),"Batch 19 original learning diagram missing: "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}


const batch20=[...load("lib/knowledge-batch-20a.ts").batch20A,...load("lib/knowledge-batch-20b.ts").batch20B];
const quiz20=load("lib/knowledge-batch-20-quiz.ts").batch20Questions;
assert.equal(batch20.length,10,"Batch 20 must publish ten guides");
assert.equal(new Set(batch20.map(t=>t.slug)).size,10,"Batch 20 unique slugs");
for(const t of batch20){
 const words=[t.intro,t.directAnswer,...t.sections.flatMap(s=>[...(s.paragraphs||[]),...(s.points||[])]),...t.faq.flatMap(x=>[x.question,x.answer])].join(" ").trim().split(/\s+/).length;
 assert(words>=1000,"Batch 20 less than 1000 words: "+t.slug+" "+words);
 assert(t.sections.length>=8&&t.faq.length>=5&&t.sources.length>=3,"Batch 20 missing sections or sources: "+t.slug);
 assert(t.description.length>=90&&t.description.length<=195,"Batch 20 SEO description length: "+t.slug);
 assert(t.related.length>=3&&t.related.every(x=>x.href.startsWith("/knowledge/")),"Batch 20 internal links missing: "+t.slug);
 assert(t.tool==="expert-knowledge-check"&&quiz20[t.slug]?.qa.length===2,"Batch 20 interactive quiz missing: "+t.slug);
 assert(existsSync("public"+t.image),"Batch 20 original infographic missing: "+t.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+t.slug),isKnowledgeSearchReady(t),"Knowledge sitemap must match temporary quality gate: "+t.slug);
}

for(const topic of knowledgeTopics){
 assert(topic.directAnswer.trim().length>=100,"Missing substantial direct answer: "+topic.slug);
 assert(topic.sections.length>=4,"Insufficient section architecture: "+topic.slug);
 assert(topic.sources.length>=3&&topic.sources.every(s=>s.url.startsWith("https://")),"Missing original sources: "+topic.slug);
 assert(existsSync("public"+topic.image),"Missing original educational SVG: "+topic.slug);
 assert.equal(urls.includes("https://www.lusaill.online/knowledge/"+topic.slug),isKnowledgeSearchReady(topic),"Knowledge sitemap must match temporary quality gate: "+topic.slug);
}

for(const url of urls){
 const u=new URL(url);
 assert.equal(u.origin,"https://www.lusaill.online");
 assert(!u.hash,"Sitemap URLs must not have fragments");
 if(!u.search)continue;
 // Only real category pages beyond page one may use a query string in the sitemap.
 assert.equal(u.searchParams.size,1,"Only canonical pagination parameters allowed");
 const page=Number(u.searchParams.get("page"));
 assert(Number.isSafeInteger(page)&&page>=2,"Invalid category pagination page");
 const match=u.pathname.match(new RegExp("^/categories/([a-z0-9-]+)$"));
 assert(match,"Non-category query URL in sitemap");
 const cluster=clusters.find(c=>c.slug===match[1]);
 assert(cluster,"Unknown category in sitemap");
 const publishedCount=articles.filter(a=>isArticleSearchReady(a)&&a.clusterCode===cluster.code).length;
 assert(page<=Math.ceil(publishedCount/30),"Nonexistent category page in sitemap");
 assert.equal(u.search,`?page=${page}`,"Noncanonical query string in sitemap");
}
for(const cluster of clusters){
 const publishedCount=articles.filter(a=>isArticleSearchReady(a)&&a.clusterCode===cluster.code).length;
 for(let page=2;page<=Math.ceil(publishedCount/30);page++)
  assert(urls.includes(`https://www.lusaill.online/categories/${cluster.slug}?page=${page}`),"Missing canonical category pagination from sitemap");
}
const published=articles.filter(a=>isArticleIndexable(a));
const searchReady=articles.filter(isArticleSearchReady);
assert.equal(map.size,searchReady.length+foodSafetyArticles.filter(isFoodSafetySearchReady).length);
for(const a of articles){const url="https://www.lusaill.online/articles/"+a.slug;const ready=isArticleSearchReady(a);assert.equal(map.has(url),ready,"Article sitemap must match quality gate: "+a.slug);if(!isArticleIndexable(a))continue;if(a.status==="published")assert(getGuidePath(a.slug),"Published guide needs a task hub");if(!ready)continue;const date=getArticleModifiedAt(a);if(date){assert(Date.parse(date)<=Date.now(),"Future modification date");assert.equal(new Date(map.get(url).lastModified).getTime(),Date.parse(date));if(guideIllustrations[a.slug]?.updatedAt)assert(Date.parse(date)>=Date.parse(guideIllustrations[a.slug].updatedAt));}else{assert(!map.get(url).lastModified,"Do not invent a modification date");}}
for(const a of foodSafetyArticles){const row=map.get("https://www.lusaill.online/food-safety/"+a.slug);assert.equal(Boolean(row),isFoodSafetySearchReady(a),"Unreviewed medical articles must stay outside sitemap");if(row)assert.equal(new Date(row.lastModified).getTime(),Date.parse(a.updatedAt));}
for(const path of ["/articles/verify-electronic-certificate","/articles/move-in-condition-report","/categories/housing-utilities","/services/electricity-bill-inquiry"])assert(!urls.includes("https://www.lusaill.online"+path),"Retired/alias URL leaked");
const source=readFileSync("components/electricity-inquiry-detail.tsx","utf8");
const targets=["electricity-complaint","electricity-consumer-rights","electricity-outage-report","electricity-meter-apply","electricity-meter-transfer","electricity-meter-test","prepaid-meter-mobile-charge","north-cairo-electricity","north-delta-electricity"];
for(const slug of targets){assert(published.some(a=>a.slug===slug),"Unpublished contextual link");assert(source.includes('href="/articles/'+slug+'"'),"Missing service decision-table link");}
const {searchTitles}=load("lib/search-titles.ts");
for(const a of [...published,...foodSafetyArticles])assert((searchTitles[a.slug]??a.title).length+8<=60,"Search title exceeds project limit: "+a.slug);
const companySlugs=load("lib/electricity-inquiry-detail.ts").electricityCompanies.map(c=>c.guide).filter(Boolean);
assert.equal(companySlugs.length,7,"All seven published company guides must be linked from the bill hub");
const normalized=text=>text.toLowerCase().replace(/[ً-ْـ]/g,"").replace(/[أإآ]/g,"ا").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
const documents=[...published.map(a=>({url:"/articles/"+a.slug,title:a.title,text:[a.quickAnswer,...(a.steps??[]).flatMap(s=>[s.title,s.detail]),...(a.summaryTable??[]).flatMap(r=>[r.label,r.value]),...(a.practicalSections??[]).flatMap(s=>[s.title,s.intro,...s.rows.flat()]),...(a.faqs??[]).flatMap(f=>[f.question,f.answer])].filter(Boolean).join(" ")})),...foodSafetyArticles.map(a=>({url:"/food-safety/"+a.slug,title:a.title,text:a.bodyHtml.replace(/<[^>]+>/g," ")}))];
const grams=documents.map(d=>{const words=normalized(d.text).split(" ");return new Set(words.slice(0,-3).map((_,i)=>words.slice(i,i+4).join(" ")));});
const exact=new Map(),pairs=[];
for(let i=0;i<documents.length;i++){const text=normalized(documents[i].text);assert(!exact.has(text),"Exact duplicate content: "+documents[i].url+" / "+exact.get(text));exact.set(text,documents[i].url);for(let j=0;j<i;j++){const a=grams[i],b=grams[j],small=a.size<b.size?a:b,large=a.size<b.size?b:a;let intersection=0;for(const token of small)if(large.has(token))intersection++;const score=intersection/(a.size+b.size-intersection||1);if(score>.15)pairs.push({score:Number(score.toFixed(4)),a:{url:documents[i].url,title:documents[i].title,answer:documents[i].text.slice(0,240)},b:{url:documents[j].url,title:documents[j].title,answer:documents[j].text.slice(0,240)}});}}
pairs.sort((a,b)=>b.score-a.score);
console.log("DISCOVERY_SUMMARY "+JSON.stringify({published:published.length,food:foodSafetyArticles.length,articleSitemap:map.size,allSitemapUrls:urls.length,unwrittenExcluded:articles.length-published.length,exactDuplicates:0,companySlugs,contextTargets:targets,nearCandidates:pairs.slice(0,10),result:"PASS"}));
for(const a of published){console.log("DISCOVERY_ARTICLE "+JSON.stringify({slug:a.slug,title:a.title,reviewedAt:a.updatedAt,publishedAt:a.publishedAt,modifiedAt:getArticleModifiedAt(a),imageModifiedAt:guideIllustrations[a.slug]?.updatedAt??null,category:a.clusterCode,hub:getGuidePath(a.slug)?"/guides/"+getGuidePath(a.slug).slug:null}));await new Promise(resolve=>setTimeout(resolve,30));}
console.log("PASS: sitemap completeness, excluded unwritten placeholders/retirements, authentic dates, hub membership and relevant contextual targets");
