import {createHash} from 'node:crypto';
import {requireOps,opsError} from '@/lib/content-ops/server';
import {contentCatalog} from '@/lib/content-ops/catalog';
import {articles} from '@/lib/content';
import {clusters} from '@/lib/clusters';
import {managementRequest,mergeManagementInventory,recordPath,type DocumentMetadata} from '@/lib/content-ops/management';
import {text,type OpsRecord} from '@/lib/content-ops/model';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private,no-store'};
const metadataSelect='id,slug,title:document->>title,status:document->>status,author:document->>author,category:document->>category,reviewedAt:document->>reviewedAt,scheduledAt:document->>scheduledAt,updatedAt:document->>updatedAt,operationsItemId:document->>operationsItemId';
const baseCatalog=()=>contentCatalog.map(c=>{const a=c.kind==='article'?articles.find(a=>`/articles/${a.slug}`===c.href):undefined;return {...c,category:a?clusters.find(g=>g.code===a.clusterCode)?.name??'غير مصنّف':c.kind==='guide'?'مسارات الخدمات':'التعلّم',reviewedAt:a?.updatedAt??'',updatedAt:a?.updatedAt??''};});
export async function GET(){try{const {client,role,user}=await requireOps();
 const tables=['content_items','workflow_tasks','source_claims','content_reviews','content_briefs','content_outlines'] as const;
 const rows:Record<string,OpsRecord[]>={};let truncated=false;
 await Promise.all(tables.map(async entity=>{const r=await client.from(entity).select('*').order('updated_at',{ascending:false}).limit(501);if(r.error)throw r.error;truncated||=(r.data?.length??0)>500;rows[entity]=r.data?.slice(0,500)??[];}));
 const [docs,pubs,members,activity]=await Promise.all([client.from('cms_documents').select(metadataSelect).limit(1001),client.from('cms_publications').select(metadataSelect).limit(1001),client.from('ops_members').select('user_id,display_name,role,active').eq('active',true),client.from('content_activity_log').select('id,entity,action,created_at,record_id,actor').order('created_at',{ascending:false}).limit(100)]);
 for(const r of [docs,pubs,members,activity])if(r.error)throw r.error;
 truncated||=(docs.data?.length??0)>1000||(pubs.data?.length??0)>1000;
 const inventory=mergeManagementInventory(baseCatalog(),(docs.data??[]).slice(0,1000) as unknown as DocumentMetadata[],(pubs.data??[]).slice(0,1000) as unknown as DocumentMetadata[],rows.content_items);
 const readiness=rows.content_items.map(item=>({itemId:item.id,brief:rows.content_briefs.some(r=>r.item_id===item.id&&r.data.status==='approved'),outline:rows.content_outlines.some(r=>r.item_id===item.id&&r.data.status==='approved'),criticalReviews:rows.content_reviews.filter(r=>r.item_id===item.id&&r.data.severity==='critical'&&r.data.result!=='pass').length,pendingClaims:rows.source_claims.filter(r=>r.item_id===item.id&&r.data.status!=='verified').length,reviewPassed:rows.content_reviews.some(r=>r.item_id===item.id&&r.data.result==='pass')}));
 // No article body, brief prose, outline sections or generated drafts are sent to this management view.
 return Response.json({role,userId:user.id,inventory,tasks:rows.workflow_tasks,readiness,claims:rows.source_claims.map(r=>({id:r.id,item_id:r.item_id,title:text(r.data.title),url:text(r.data.url),status:text(r.data.status),checkedAt:text(r.data.checkedAt),expiresAt:text(r.data.expiresAt)})),reviews:rows.content_reviews.map(r=>({id:r.id,item_id:r.item_id,title:text(r.data.title),severity:text(r.data.severity),result:text(r.data.result),note:text(r.data.note),updated_at:r.updated_at})),members:members.data,activity:activity.data,truncated,asOf:new Date().toISOString()},{headers});
 }catch(error){return Response.json({error:opsError(error)},{status:error instanceof Error&&error.message==='UNAUTHORIZED'?401:503,headers});}}
export async function POST(request:Request){if(request.headers.get('origin')!==new URL(request.url).origin)return new Response(null,{status:403});
 try{const {client,user}=await requireOps();const raw=await request.text();if(raw.length>16000)return new Response(null,{status:413});const parsed=managementRequest.safeParse(JSON.parse(raw));if(!parsed.success)return Response.json({error:{message:parsed.error.issues[0]?.message??'بيانات المتابعة غير صالحة'}},{status:400,headers});const v=parsed.data;let result;
 if(v.action==='track'){
  const [all,docs]=await Promise.all([client.from('content_items').select('*').limit(501),client.from('cms_documents').select(metadataSelect).limit(1001)]);if(all.error||docs.error)throw Error('OPERATIONS_FAILED');if((all.data?.length??0)>500)throw Error('وصل سجل المتابعة إلى حد العرض؛ يلزم توسيع حد الإدارة قبل إضافة عنصر.');
  const existing=(all.data??[]).find(r=>recordPath(r)===v.href);if(existing)return Response.json({id:existing.id,reused:true},{headers});
  const doc=(docs.data as unknown as DocumentMetadata[]??[]).find(d=>`/articles/${d.slug}`===v.href);const entry=baseCatalog().find(c=>c.href===v.href)??(doc?{title:doc.title,kind:'article',status:doc.status}:null);if(!entry)return Response.json({error:{message:'العنصر غير موجود في فهرس المحتوى'}},{status:404,headers});
  const hash=createHash('sha256').update('lusaill-management:'+v.href).digest('hex');const id=`${hash.slice(0,8)}-${hash.slice(8,12)}-5${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20,32)}`;
  result=await client.rpc('ops_save',{entity:'content_items',payload:{id,data:{title:entry.title,kind:entry.kind,managementPath:v.href,publicPath:/^\/[a-zA-Z0-9/_-]+$/.test(v.href)?v.href:'',stage:'research',ownerId:user.id,priority:'normal',baselineStatus:entry.status,managementNotes:'',managementArchived:false}},expected_version:0});
  if(result.error?.message.includes('VERSION_CONFLICT'))return Response.json({id,reused:true},{headers});
 }else if(v.action==='metadata'){
  const row=await client.from('content_items').select('*').eq('id',v.id).single();if(row.error)throw Error('NOT_FOUND');
  result=await client.rpc('ops_save',{entity:'content_items',payload:{id:v.id,data:{...row.data.data,ownerId:v.ownerId,dueAt:v.dueAt,priority:v.priority,blockedReason:v.blockedReason,managementNotes:v.notes,managementArchived:v.archived}},expected_version:v.expectedVersion});
 }else if(v.action==='task'){
  let current:OpsRecord|undefined;if(v.id){const r=await client.from('workflow_tasks').select('*').eq('id',v.id).eq('item_id',v.itemId).single();if(r.error)throw Error('NOT_FOUND');current=r.data;}
  result=await client.rpc('ops_save',{entity:'workflow_tasks',payload:{id:v.id,item_id:v.itemId,data:{...current?.data,title:v.title,ownerId:v.ownerId,dueAt:v.dueAt,status:v.status,blockedReason:v.blockedReason,acceptance:v.acceptance,stage:current?.data.stage??'editorial'}},expected_version:v.expectedVersion});
 }else{
  const row=await client.from('content_items').select('*').eq('id',v.id).single();if(row.error)throw Error('NOT_FOUND');if(row.data.data.stage!=='final_approval')return Response.json({error:{code:'INVALID_TRANSITION',message:'لا يمكن تسجيل اعتماد نهائي قبل وصول العنصر إلى انتظار الاعتماد.'}},{status:422,headers});
  result=await client.rpc('ops_transition',{item:v.id,next_stage:v.decision==='approve'?'ready':'editorial',reason:v.reason,expected_version:v.expectedVersion});
 }
 if(result.error){const error=opsError(result.error);return Response.json({error},{status:error.code==='VERSION_CONFLICT'?409:422,headers});}
 return Response.json({id:result.data?.id,record:result.data},{headers});
 }catch(error){return Response.json({error:opsError(error)},{status:error instanceof Error&&error.message==='UNAUTHORIZED'?401:400,headers});}}
