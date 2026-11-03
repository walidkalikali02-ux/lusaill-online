import assert from 'node:assert/strict';
import {analysisSchema,checkProvenance,editorialScores,type SourceInput} from '../lib/intelligence/model';
import {analyzeTopic} from '../lib/intelligence/analysis';
// Synthetic Arabic fixtures; never presented as a real analyzed source.
const source:SourceInput={id:'test-source',role:'reference',document:{url:'https://example.com/demo',title:'مثال اصطناعي',text:'راجع المستندات قبل الإرسال.',quality:'partial',sections:[{id:'s1',heading:'التحقق',text:'راجع المستندات قبل الإرسال.'}],headings:[],fetchedAt:'2026-11-03T00:00:00Z'}};
const report=analysisSchema.parse({summary:'اختبار اصطناعي',topic:'اختبار',definition:'مسار التحقق',country:'غير محدد',limitations:['اختبار فقط'],nodes:[{id:'a',label:'التحقق',kind:'مفهوم',evidenceIds:['test-source:s1']}],edges:[],intents:[],journeys:[],claims:[{text:'المصدر يدعو للمراجعة',sourceId:'test-source',sectionId:'s1',quote:'راجع المستندات',verification:'unverified',reason:'مطابقة نصية فقط'}],coverage:[{label:'التحقق',sourceIds:['test-source'],lusaillUrls:[],missing:true,evidenceIds:['test-source:s1']}],gaps:[],opportunities:[],monitoring:[],humanReview:['يلزم مدقق']});
assert.equal(checkProvenance(report,[source],[]),report);
assert.throws(()=>checkProvenance({...report,nodes:[{...report.nodes[0],evidenceIds:['invented:s1']}]},[source],[]));
assert.throws(()=>checkProvenance({...report,claims:[{...report.claims[0],quote:'تم التأكد من القبول'}]},[source],[]));
assert.throws(()=>checkProvenance({...report,coverage:[{...report.coverage[0],lusaillUrls:['https://www.lusaill.online/articles/not-real']}]},[source],[]));
const score=editorialScores(report,[source]);assert.equal(score.publicationReady,false);assert.equal(score.evidence.value,0);assert.equal(score.extraction.value,0);assert.equal(score.qualityComposite,null);
const oldModel=process.env.AI_GATEWAY_MODEL,oldKey=process.env.AI_GATEWAY_API_KEY,oldOidc=process.env.VERCEL_OIDC_TOKEN;delete process.env.AI_GATEWAY_MODEL;delete process.env.AI_GATEWAY_API_KEY;delete process.env.VERCEL_OIDC_TOKEN;
await assert.rejects(()=>analyzeTopic({topic:'اختبار',country:'مصر',sources:[source],catalog:[]}),/BLOCKED:/);
if(oldModel)process.env.AI_GATEWAY_MODEL=oldModel;if(oldKey)process.env.AI_GATEWAY_API_KEY=oldKey;if(oldOidc)process.env.VERCEL_OIDC_TOKEN=oldOidc;
console.log('PASS: Arabic structured report, real-section provenance, hallucinated references/quotes/URLs rejected, unknown quality not fabricated, missing AI blocked honestly');
