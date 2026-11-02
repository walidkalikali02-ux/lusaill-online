import {z} from "zod";
import template from "./task-template.json";
export const seoTemplate=template;
export type SeoTask=typeof template.tasks[number];
export type SeoStatus="pending"|"working"|"done"|"blocked"|"na";
export type TaskState={status:SeoStatus;note:string;evidence:string;ownerId:string|null;dueAt:string|null;priority:string;version:number;contentHash:string;reviewedAt:string;reviewedBy:string};
export type SeoTarget={key:string;scope:"site"|"article";id?:string;slug?:string;title:string;status:string;category:string;path:string;hash:string;documentId?:string;live:boolean};
export type SeoCheck={id:string;title:string;status:"pass"|"fail"|"warning"|"manual"|"error";detail:string;tasks:string[]};
export type SeoRun={id:string;target_key:string;content_hash:string;report:{checkedAt:string;mode:string;url:string;checks:SeoCheck[];facts:Record<string,unknown>};created_at:string};
export const statusLabels:Record<string,string>={pending:"لم تبدأ",working:"قيد التنفيذ",done:"مكتملة",blocked:"تحتاج إصلاحًا / متوقفة",na:"غير منطبقة بسبب موثق",stale:"تحتاج إعادة مراجعة"};
export const taskUpdate=z.object({action:z.literal("task"),target:z.string().max(100),task:z.string().regex(/^SEO-\d{3}$/),expectedVersion:z.number().int().nonnegative(),state:z.object({status:z.enum(["pending","working","done","blocked","na"]),note:z.string().max(6000),evidence:z.string().max(3000),ownerId:z.uuid().nullable().optional(),dueAt:z.iso.datetime({offset:true}).nullable().optional(),priority:z.enum(["low","normal","high","critical"]).default("normal")})});
export function effectiveStatus(state:TaskState|undefined,hash:string):string{return !state?"pending":(["done","na"].includes(state.status)&&state.contentHash!==hash?"stale":state.status);}
