import {z} from 'zod';
import {requireAdmin} from '@/lib/cms/server';
import {discoverableArticles} from '@/lib/cms/discovery-server';
import {documentSchema} from '@/lib/cms/model';
import {intelligenceCapabilities} from '@/lib/intelligence/analysis';
import {importUrlText} from '@/lib/intelligence/import';
import {discoverSitemap} from '@/lib/intelligence/crawl';
import {runIntelligenceJob} from '@/lib/intelligence/worker';
import type {CatalogItem,SourceInput} from '@/lib/intelligence/model';
export const dynamic='force-dynamic';
export const maxDuration=300;
const headers={'Cache-Control':'private,no-store'};
const uuid=z.uuid();
const inputSchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('create_project'),title:z.string().trim().min(2).max(200),topic:z.string().trim().min(2).max(1000),country:z.string().trim().min(1).max(100)}),
 z.object({action:z.literal('import_urls'),projectId:uuid,text:z.string().max(100000),role:z.enum(['competitor','official','reference']),mode:z.enum(['urls','sitemap']).default('urls')}),
 z.object({action:z.literal('queue'),projectId:uuid}),z.object({action:z.literal('run'),projectId:uuid}),z.object({action:z.literal('analyze'),projectId:uuid}),
 z.object({action:z.literal('cancel'),projectId:uuid,jobId:uuid}),
 z.object({action:z.literal('decide'),projectId:uuid,id:uuid,expectedVersion:z.number().int().positive(),status:z.enum(['REVIEW','APPROVED','IN_PROGRESS','REJECTED','NEEDS_REVISION','BLOCKED','ARCHIVED']),reason:z.string().trim().min(1).max(3000)}),
]);
export async function GET(request:Request){
 let session;try{session=await requireAdmin();}catch{return Response.json({error:'يلزم الدخول بحساب المدير'},{status:401,headers});}
 try{const {client}=session;const q=new URL(request.url).searchParams;const project=q.get('project');if(project&&!uuid.safeParse(project).success)return Response.json({error:'معرّف المشروع غير صالح'},{status:400,headers});
 const projects=await client.from('ti_projects').select('*').order('created_at',{ascending:false}).limit(100);if(projects.error)throw projects.error;
 const names=['sources','jobs','snapshots','analyses','opportunities','agent_runs'] as const;
 const data:Record<string,unknown>={projects:projects.data,capabilities:intelligenceCapabilities()};
 const page=Math.max(0,Math.min(1000,Number(q.get('page'))||0));
 await Promise.all(names.map(async name=>{if(!project){data[name==='agent_runs'?'agentRuns':name]=[];return;}const r=await client.from('ti_'+name).select('*').eq('project_id',project).order('created_at',{ascending:false}).range(page*100,page*100+99);if(r.error)throw r.error;data[name==='agent_runs'?'agentRuns':name]=name==='analyses'?r.data.map(a=>({...a,data:a.report})):r.data;}));
 const opp=data.opportunities as {id:string}[];const decisions=opp.length?await client.from('ti_decisions').select('*').in('opportunity_id',opp.map(o=>o.id)).order('created_at',{ascending:false}).limit(200):{data:[],error:null};if(decisions.error)throw decisions.error;data.decisions=decisions.data;
 // Search data remains the original attributed import, never fabricated live API metrics.
 const perf=await client.from('cms_reports').select('report,created_at').order('created_at',{ascending:false}).limit(20);if(perf.error)throw perf.error;data.performanceReports=perf.data;data.pagination={page,size:100,projectLimit:100};
 return Response.json(data,{headers});
 }catch{return Response.json({error:'تعذر تحميل محرك الموضوعات؛ تحقق من تثبيت قاعدة البيانات واتصالها.'},{status:503,headers});}
}
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'مصدر الطلب غير مسموح'},{status:403,headers});
 let session;try{session=await requireAdmin();}catch{return Response.json({error:'يلزم الدخول بحساب المدير'},{status:401,headers});}
 try{const raw=await request.text();if(raw.length>150000)return new Response(null,{status:413});const parsed=inputSchema.safeParse(JSON.parse(raw));if(!parsed.success)return Response.json({error:'تحقق من الحقول وحدود النص والتواريخ'},{status:400,headers});const v=parsed.data;const {client,user}=session;
 const check=(r:{error:unknown})=>{if(r.error)throw Error('تعذر حفظ البيانات؛ قد توجد مهمة نشطة أو تعارض تحديث.');};
 if(v.action==='create_project'){const r=await client.from('ti_projects').insert({title:v.title,topic:v.topic,country:v.country,created_by:user.id}).select().single();check(r);return Response.json({ok:true,project:r.data},{headers});}
 const project=await client.from('ti_projects').select('*').eq('id',v.projectId).single();if(project.error||!project.data)return Response.json({error:'المشروع غير موجود'},{status:404,headers});
 if(v.action==='import_urls'){const imported=v.mode==='sitemap'?{urls:await discoverSitemap(v.text.trim(),50),errors:[]}:importUrlText(v.text);if(!imported.urls.length)return Response.json({error:imported.errors.join('؛ ')||'لم تُعثر على روابط صالحة'},{status:422,headers});const r=await client.from('ti_sources').upsert(imported.urls.slice(0,50).map(url=>({project_id:v.projectId,url,role:v.role,created_by:user.id,next_check_at:new Date(Date.now()+7*86400000).toISOString()})),{onConflict:'project_id,url',ignoreDuplicates:true}).select('id');check(r);return Response.json({ok:true,imported:r.data?.length??0,errors:imported.errors,limit:50},{headers});}
 if(v.action==='queue'){const sources=await client.from('ti_sources').select('id').eq('project_id',v.projectId).limit(50);check(sources);let queued=0;for(const s of sources.data??[]){const r=await client.from('ti_jobs').insert({project_id:v.projectId,source_id:s.id,phase:'crawl',created_by:user.id});if(!r.error)queued++;else if(r.error.code!=='23505')check(r);}return Response.json({ok:true,queued},{headers});}
 if(v.action==='run')return Response.json({ok:true,...await runIntelligenceJob(client,'',v.projectId)},{headers});
 if(v.action==='cancel'){const owns=await client.from('ti_jobs').select('id').eq('id',v.jobId).eq('project_id',v.projectId).single();check(owns);const r=await client.rpc('ti_cancel_job',{job_id:v.jobId,reason:'إيقاف يدوي من لوحة المشروع'});check(r);return Response.json({ok:true},{headers});}
 if(v.action==='decide'){const owns=await client.from('ti_opportunities').select('id').eq('id',v.id).eq('project_id',v.projectId).single();check(owns);const r=await client.rpc('ti_decide',{opportunity_id:v.id,expected_version:v.expectedVersion,decision:v.status,reason:v.reason});check(r);return Response.json({ok:true,result:r.data},{headers});}
 // Analyze only persisted source snapshots; failed URLs remain visible in scope limitations.
 const [snapshots,sources,pubs]=await Promise.all([client.from('ti_snapshots').select('source_id,document,created_at').eq('project_id',v.projectId).order('created_at',{ascending:false}).limit(300),client.from('ti_sources').select('id,url,role,status').eq('project_id',v.projectId).limit(100),client.from('cms_publications').select('document')]);check(snapshots);check(sources);check(pubs);
 const seen=new Set<string>();const inputs:SourceInput[]=[];let scope=0;
 for(const snap of snapshots.data??[]){if(seen.has(snap.source_id))continue;seen.add(snap.source_id);if(inputs.length>=12)continue;const doc=snap.document;const sections=[];let chars=0;for(const section of doc.sections??[]){if(chars+section.text.length>15000||scope+section.text.length>100000)break;sections.push(section);chars+=section.text.length;scope+=section.text.length;}if(!sections.length)continue;const truncated=sections.length!==(doc.sections??[]).length;inputs.push({id:snap.source_id,role:sources.data?.find(s=>s.id===snap.source_id)?.role??'competitor',document:{url:doc.url,title:doc.title,text:sections.map(s=>s.text).join('\n'),quality:truncated?'partial':doc.quality,headings:doc.headings,sections,fetchedAt:doc.fetchedAt}});}
 if(!inputs.length)return Response.json({error:'اجلب مصدرًا واحدًا على الأقل قبل طلب التحليل'},{status:422,headers});
 const articleList=await discoverableArticles();const catalog:CatalogItem[]=articleList.map(a=>({url:`https://www.lusaill.online/articles/${a.slug}`,title:a.title,text:[a.quickAnswer,...(a.steps??[]).map(s=>s.title+' '+s.detail),...(a.faqs??[]).map(f=>f.question+' '+f.answer)].join('\n').slice(0,600),headings:(a.steps??[]).map(s=>s.title),sources:(a.sources??[]).map(s=>s.url)}));
 for(const p of pubs.data??[]){const d=documentSchema.safeParse(p.document);if(!d.success)continue;const item=catalog.find(c=>c.url.endsWith('/'+d.data.slug));if(item)item.text=JSON.stringify(d.data.body).slice(0,600);}
 const r=await client.from('ti_jobs').insert({project_id:v.projectId,phase:'analyze',created_by:user.id,payload:{topic:project.data.topic,country:project.data.country,sources:inputs,catalog,unavailable:(sources.data??[]).filter(s=>!seen.has(s.id)).map(s=>({url:s.url,status:s.status})),scopeNote:'تقتصر المقارنة على النصوص المختارة المحفوظة؛ ملخصات لوسيل مقتطفات وليست تدقيقًا كاملًا للنصوص.'}});check(r);return Response.json({ok:true,queued:1,sources:inputs.length,catalog:catalog.length},{headers});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'تعذر تنفيذ الطلب'},{status:422,headers});}
}
