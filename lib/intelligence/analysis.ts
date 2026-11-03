import {z} from 'zod';
import {analysisSchema,checkProvenance,editorialScores,type SourceInput,type CatalogItem} from './model';
import {agents,systemPrompt} from './agents';

export function intelligenceCapabilities(oidcToken?:string|null){return {ai:Boolean(process.env.AI_GATEWAY_MODEL&&(process.env.AI_GATEWAY_API_KEY||oidcToken||process.env.VERCEL_OIDC_TOKEN)),worker:true,model:process.env.AI_GATEWAY_MODEL??null,searchConsole:'import_only' as const,aiMode:'gateway_http',scheduled:Boolean(process.env.CRON_SECRET)};}
export async function analyzeTopic(payload:{topic:string,country:string,sources:SourceInput[],catalog:CatalogItem[],unavailable?:unknown[]},oidcToken?:string|null){
 // Vercel Function tokens rotate on the request header; build-time env tokens are not runtime credentials.
 const token=process.env.AI_GATEWAY_API_KEY||oidcToken||process.env.VERCEL_OIDC_TOKEN,model=process.env.AI_GATEWAY_MODEL;
 if(!token||!model)throw Error('BLOCKED:يلزم ضبط AI_GATEWAY_MODEL ومصادقة AI Gateway في بيئة النشر؛ لم يُنفذ تحليل دلالي.');
 if(!payload.sources.length)throw Error('BLOCKED:لا توجد مصادر مستخرجة يمكن تحليلها.');
 const input=JSON.stringify({...payload,agents:agents.filter(a=>a.mode==='ai')});
 if(input.length>500_000)throw Error('BLOCKED:تجاوز التحليل حد الإدخال؛ قسّم الموضوع إلى نطاق أصغر.');
 const schema=z.toJSONSchema(analysisSchema,{target:'draft-7'});
 // Provider-neutral documented HTTP surface; SDK installation is unavailable in the restricted npm network.
 const response=await fetch('https://ai-gateway.vercel.sh/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({model,max_tokens:12000,messages:[{role:'system',content:systemPrompt},{role:'user',content:input}],response_format:{type:'json_schema',json_schema:{name:'lusaill_topic_report',strict:true,schema}}}),signal:AbortSignal.timeout(150_000)});
 if(!response.ok){const body=await response.json().catch(()=>({}));const code=String(body?.error?.code??response.status);const rawMessage=body?.error?.message??body?.message??(typeof body?.error==='string'?body.error:'');const detail=String(rawMessage).replaceAll(token,'[محجوب]').replace(/Bearer\s+\S+|eyJ[\w.-]+|(?:sk_|sk-)[\w-]+/gi,'[محجوب]').replace(/https?:\/\/\S+/g,'[رابط الخدمة]').replace(/[\r\n]/g,' ').slice(0,400);throw Error(`BLOCKED:تعذر تشغيل AI Gateway (${code.replace(/[^a-zA-Z0-9_-]/g,'').slice(0,100)})؛ ${detail||'لم تُنتج نتائج تحليل.'}`);}
 const body=await response.json();const content=body.choices?.[0]?.message?.content;
 if(body.choices?.[0]?.finish_reason!=='stop'||typeof content!=='string')throw Error('BLOCKED:استجابة التحليل ناقصة؛ لم تحفظ كتقرير مكتمل.');
 const report=checkProvenance(analysisSchema.parse(JSON.parse(content)),payload.sources,payload.catalog);
 // Persist actual bounded input scope, not an imaginary full-web competitor audit.
 const result={...report,scores:editorialScores(report,payload.sources),sourceInventory:payload.sources.map(s=>({id:s.id,url:s.document.url,title:s.document.title,role:s.role,quality:s.document.quality,fetchedAt:s.document.fetchedAt})),unavailable:payload.unavailable??[],generatedAt:new Date().toISOString(),method:'ai_batched_roles',model,searchDemand:'unmeasured',internalCatalogCount:payload.catalog.length};
 return {report:result,opportunities:report.opportunities.map(o=>({kind:o.kind,action:o.action,title:o.title.slice(0,400),priority:o.priority,data:o})),agentRuns:[{agent:'semantic_graph_opportunity_batch',status:'succeeded',model,inputTokens:body.usage?.prompt_tokens??null,outputTokens:body.usage?.completion_tokens??null,costUsd:typeof body.usage?.cost==='number'?body.usage.cost:null,details:{roles:agents.filter(a=>a.mode==='ai').map(a=>a.id),providerRequestId:body.id??null,costBasis:typeof body.usage?.cost==='number'?'provider_reported':'unavailable',validated:true}},{agent:'quality',status:'succeeded',details:{schema:true,references:true,quotes:true,publicationAllowed:false}}]};
}
