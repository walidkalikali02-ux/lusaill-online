import {z} from 'zod';
import {type OpsRecord,text,normalize,stageLabels} from './model';

export const publicationLabels:Record<string,string>={published:'منشور',unpublished:'غير منشور',archived:'مؤرشف'};
export const workflowLabels:Record<string,string>={planned:'مخطط',draft:'مسودة',verification:'بانتظار التحقق',approval:'بانتظار الاعتماد',scheduled:'مجدول',published:'منشور',archived:'مؤرشف',not_started:'مخطط',drafting:'قيد الإعداد',needs_verification:'بانتظار التحقق'};
export const managementKindLabels:Record<string,string>={article:'مقال',guide:'مسار إرشادي',course:'كورس',lesson:'درس',tool:'أداة'};
export const managementPriorityLabels:Record<string,string>={normal:'عادية',high:'مرتفعة',urgent:'عاجلة'};
export type DocumentMetadata={id:string;slug:string;title:string;status:string;author?:string;category?:string;reviewedAt?:string;scheduledAt?:string;updatedAt?:string;operationsItemId?:string};
export type CatalogMetadata={href:string;title:string;kind:string;status:string;category?:string;reviewedAt?:string;updatedAt?:string};
export type ManagementItem={id:string;href:string;title:string;kind:string;category:string;publicationStatus:string;workflowStatus:string;updatedAt:string;reviewedAt:string;scheduledAt:string;cmsId?:string;record?:OpsRecord};
export type ManagementTask=OpsRecord;
export type Readiness={itemId:string;brief:boolean;outline:boolean;criticalReviews:number;pendingClaims:number;reviewPassed:boolean};
export const managementPath=(value:string)=>/^\/(?!\/)[\p{L}\p{N}_/-]+$/u.test(value)&&!value.includes('..');
export const recordPath=(row:OpsRecord)=>text(row.data.managementPath)||text(row.data.publicPath);

export function mergeManagementInventory(catalog:CatalogMetadata[],documents:DocumentMetadata[],publications:DocumentMetadata[],records:OpsRecord[]):ManagementItem[]{
 const tracked=new Map<string,OpsRecord>();
 for(const row of [...records].sort((a,b)=>b.updated_at.localeCompare(a.updated_at))){const path=recordPath(row);if(path&&!tracked.has(path))tracked.set(path,row);}
 const docMap=new Map(documents.map(d=>[`/articles/${d.slug}`,d]));
 const pubMap=new Map(publications.map(d=>[`/articles/${d.slug}`,d]));
 const entries=new Map(catalog.map(c=>[c.href,c]));
 for(const d of [...publications,...documents])if(!entries.has(`/articles/${d.slug}`))entries.set(`/articles/${d.slug}`,{href:`/articles/${d.slug}`,title:d.title,kind:'article',status:'draft',category:d.category});
 const used=new Set<string>();
 const items:ManagementItem[]=[...entries.values()].map(c=>{const d=docMap.get(c.href),p=pubMap.get(c.href),r=tracked.get(c.href);if(r)used.add(r.id);
  // A draft revision does not withdraw the currently published snapshot.
  const publicationStatus=p?(p.status==='archived'?'archived':'published'):c.status==='published'?'published':'unpublished';
  return {id:c.href,href:c.href,title:d?.title||c.title,kind:c.kind,category:c.category||d?.category||'غير مصنّف',publicationStatus,workflowStatus:d?.status||c.status,updatedAt:d?.updatedAt||c.updatedAt||'',reviewedAt:d?.reviewedAt||c.reviewedAt||'',scheduledAt:d?.scheduledAt||'',cmsId:d?.id,record:r};
 });
 for(const r of records)if(!used.has(r.id)&&(!recordPath(r)||!entries.has(recordPath(r))))items.push({id:r.id,href:recordPath(r),title:text(r.data.title)||'متابعة بلا عنوان',kind:text(r.data.kind)||'article',category:'غير مصنّف',publicationStatus:'unpublished',workflowStatus:'planned',updatedAt:r.updated_at,reviewedAt:'',scheduledAt:'',record:r});
 return items;
}

export const taskDone=(task:OpsRecord)=>task.data.status==='done';
export const validDate=(value:unknown)=>!!text(value)&&Number.isFinite(Date.parse(text(value)));
export function isOverdue(value:unknown,asOf:string){return validDate(value)&&Date.parse(text(value))<Date.parse(asOf);}
export function itemNeedsAttention(item:ManagementItem,asOf:string){return Boolean(item.record&&!item.record.data.managementArchived&&(text(item.record.data.blockedReason)||(item.record.data.stage!=='ready'&&isOverdue(item.record.data.dueAt,asOf))));}
export function matchesManagementItem(item:ManagementItem,filter:{query:string;kind:string;category:string;publication:string;owner:string;priority:string;tracked:string;from:string;to:string}){
 const query=normalize(filter.query);const haystack=normalize(`${item.title} ${item.href}`);
 const date=text(item.record?.data.dueAt)||item.scheduledAt;
 const day=validDate(date)?new Date(Date.parse(date)+3*3600000).toISOString().slice(0,10):'';
 return (!query||haystack.includes(query))&&(!filter.kind||item.kind===filter.kind)&&(!filter.category||item.category===filter.category)&&(!filter.publication||item.publicationStatus===filter.publication)&&(!filter.owner||item.record?.data.ownerId===filter.owner)&&(!filter.priority||item.record?.data.priority===filter.priority)&&(!filter.tracked||(filter.tracked==='yes'?Boolean(item.record&&!item.record.data.managementArchived):!item.record||Boolean(item.record.data.managementArchived)))&&(!filter.from||day>=filter.from)&&(!filter.to||Boolean(day&&day<=filter.to));
}
export function managementSummary(items:ManagementItem[],tasks:OpsRecord[],asOf:string){
 const active=items.filter(i=>i.record&&!i.record.data.managementArchived);
 return {articles:items.filter(i=>i.kind==='article').length,published:items.filter(i=>i.kind==='article'&&i.publicationStatus==='published').length,tracked:active.length,attention:active.filter(i=>itemNeedsAttention(i,asOf)).length,pendingApproval:active.filter(i=>i.record?.data.stage==='final_approval').length,openTasks:tasks.filter(t=>!taskDone(t)).length,overdueTasks:tasks.filter(t=>!taskDone(t)&&isOverdue(t.data.dueAt,asOf)).length};
}
const date=z.string().max(50).refine(v=>!v||Number.isFinite(Date.parse(v)),'تاريخ غير صالح');
export const managementRequest=z.discriminatedUnion('action',[
 z.object({action:z.literal('track'),href:z.string().max(1500).refine(managementPath)}).strict(),
 z.object({action:z.literal('metadata'),id:z.uuid(),expectedVersion:z.number().int().positive(),ownerId:z.union([z.uuid(),z.literal('')]),dueAt:date,priority:z.enum(['normal','high','urgent']),blockedReason:z.string().max(1500),notes:z.string().max(3000),archived:z.boolean()}).strict(),
 z.object({action:z.literal('task'),id:z.uuid().optional(),itemId:z.uuid(),expectedVersion:z.number().int().nonnegative(),title:z.string().trim().min(2).max(300),ownerId:z.uuid(),dueAt:date,status:z.enum(['open','working','blocked','done']),blockedReason:z.string().max(1500),acceptance:z.string().trim().min(3).max(3000)}).strict(),
 z.object({action:z.literal('decision'),id:z.uuid(),expectedVersion:z.number().int().positive(),decision:z.enum(['approve','return']),reason:z.string().trim().min(3).max(3000)}).strict(),
]);
export const managementStageLabel=(stage:unknown)=>stageLabels[text(stage)]||'لم تبدأ متابعة تفصيلية';
