import {z} from 'zod';

const text=z.string().trim().min(1).max(4000);
const ids=z.array(z.string().max(120)).max(40);
export const provenance=z.enum(['observed','authoritative','inferred','unverified']);
export const actions=['create','expand','update','merge','section','tool','document','research','none'] as const;
const opportunity=z.object({
 title:text,kind:z.enum(['content','tool','document','research']),action:z.enum(actions),priority:z.number().int().min(1).max(5),
 intent:text,audience:text,problem:text,explanation:text,evidenceIds:ids,provenance,confidence:z.number().min(0).max(1),
 outline:z.array(text).max(20),questions:z.array(text).max(20),requiredSources:z.array(text).max(20),
 relatedUrls:z.array(z.string().url()).max(20),originalContribution:text,expertReview:text,
 effort:z.enum(['small','medium','large']),dependencies:z.array(text).max(20),risks:z.array(text).max(20),
 tool:z.object({inputs:z.array(text),outputs:z.array(text),rules:z.array(text),validation:z.array(text),privacy:text,flow:z.array(text),edgeCases:z.array(text),errors:z.array(text),accessibility:text,responsive:text,freshness:text,seo:text,acceptance:z.array(text)}).nullable(),
 document:z.object({format:text,fields:z.array(text),structure:z.array(text),limitations:text,revision:text,instructions:text,validation:z.array(text),official:z.literal(false)}).nullable(),
});
export const analysisSchema=z.object({
 summary:text,topic:text,definition:text,country:text,limitations:z.array(text).max(30),
 nodes:z.array(z.object({id:z.string().max(100),label:text,kind:text,evidenceIds:ids})).max(80),
 edges:z.array(z.object({from:z.string(),to:z.string(),relation:z.enum(['IS_PART_OF','REQUIRES','RELATED_TO','ANSWERS','SOLVES','APPLIES_TO','DEPENDS_ON','CONTRADICTS','SUPERSEDES','VERIFIED_BY','IMPLEMENTED_BY']),evidenceIds:ids})).max(150),
 intents:z.array(z.object({intent:text,audience:text,journey:text,evidenceIds:ids})).max(30),
 journeys:z.array(z.object({persona:text,steps:z.array(text).max(20),missing:z.array(text).max(20),evidenceIds:ids})).max(15),
 claims:z.array(z.object({text,sourceId:z.string(),sectionId:z.string(),quote:z.string().min(1).max(400),verification:z.literal('unverified'),reason:text})).max(35),
 coverage:z.array(z.object({label:text,sourceIds:ids,lusaillUrls:z.array(z.string().url()).max(20),missing:z.boolean(),evidenceIds:ids})).max(60),
 gaps:z.array(z.object({title:text,type:z.enum(['competitive','collective','journey','information','practical','evidence','freshness','experience','geographic','intent']),country:text,intent:text,explanation:text,provenance,evidenceIds:ids,priority:z.number().int().min(1).max(5)})).max(40),
 opportunities:z.array(opportunity).max(25),monitoring:z.array(text).max(20),humanReview:z.array(text).max(20),
});
export type AnalysisReport=z.infer<typeof analysisSchema>;
export type CatalogItem={url:string,title:string,text:string,headings:string[],sources:string[]};
export type SourceInput={id:string,role:string,document:{url:string,title:string,text:string,quality:string,sections:{id:string,heading:string,text:string}[],headings:{level:number,text:string}[],fetchedAt:string}};

export function checkProvenance(report:AnalysisReport,sources:SourceInput[],catalog:CatalogItem[]){
 const evidence=new Set(sources.flatMap(s=>s.document.sections.map(p=>`${s.id}:${p.id}`)));
 const check=(list:string[])=>{for(const id of list)if(!evidence.has(id))throw Error('مرجع دليل غير موجود في المصادر المستخرجة');};
 for(const group of [report.nodes,report.edges,report.intents,report.journeys,report.gaps,report.opportunities,report.coverage])for(const item of group)check(item.evidenceIds);
 const nodes=new Set(report.nodes.map(n=>n.id));if(nodes.size!==report.nodes.length)throw Error('معرّفات عقد مكررة');
 for(const e of report.edges)if(!nodes.has(e.from)||!nodes.has(e.to))throw Error('علاقة بلا عقدة');
 for(const c of report.claims){const s=sources.find(s=>s.id===c.sourceId);const section=s?.document.sections.find(p=>p.id===c.sectionId);if(!section||!section.text.includes(c.quote))throw Error('الاقتباس غير مطابق للمصدر');}
 const urls=new Set(catalog.map(i=>i.url));
 for(const c of report.coverage){if(c.sourceIds.some(id=>!sources.some(s=>s.id===id)))throw Error('مصدر تغطية غير موجود');if(c.lusaillUrls.some(u=>!urls.has(u)))throw Error('صفحة لوسيل غير موجودة');}
 for(const o of report.opportunities){if(o.relatedUrls.some(u=>!urls.has(u)))throw Error('توصية برابط داخلي غير موجود');if(o.kind==='tool'&&!o.tool)throw Error('مواصفات الأداة ناقصة');if(o.kind==='document'&&!o.document)throw Error('مواصفات المستند ناقصة');if(o.provenance==='observed'&&!o.evidenceIds.length)throw Error('استنتاج مباشر بلا دليل');}
 // A crawler or model cannot confer authoritative verification. That requires an attributable review.
 for(const g of [...report.gaps,...report.opportunities])if(g.provenance==='authoritative')throw Error('الاعتماد على جهة رسمية يحتاج تحققًا بشريًا مسجلاً');
 return report;
}

export function editorialScores(report:AnalysisReport,sources:SourceInput[]){
 const total=report.coverage.length,covered=report.coverage.filter(c=>c.lusaillUrls.length>0).length;
 const claims=report.claims.length;const complete=sources.filter(s=>s.document.quality==='complete').length;
 return {
  coverage:{value:total?Math.round(100*covered/total):null,numerator:covered,denominator:total,basis:'AI_ESTIMATED_SCOPE'},
  evidence:{value:claims?0:null,numerator:0,denominator:claims,basis:'HUMAN_VERIFIED_CLAIMS'},
  extraction:{value:sources.length?Math.round(100*complete/sources.length):null,numerator:complete,denominator:sources.length,basis:'OBSERVED_EXTRACTION'},
  publicationReady:false,publicationBlockers:['هذه توصيات للمراجعة وليست مسودات معتمدة للنشر','يلزم تحقق بشري من الادعاءات المهمة والمصادر والولاية الجغرافية'],
  qualityComposite:null,qualityReason:'لا نحسب دقة أو قيمة أصلية أو تجربة مستخدم من غياب دليل؛ الدرجة المركبة غير متاحة حتى اكتمال التقييم البشري.',
  suggestedWeights:{coverage:20,accuracy:25,utility:20,originality:15,ux:10,freshness:10},
 };
}
