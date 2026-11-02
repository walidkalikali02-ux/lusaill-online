import { z } from "zod";
export const entities = ["content_items","content_ideas","idea_evidence","topic_clusters","cluster_members","content_briefs","content_outlines","workflow_tasks","content_reviews","source_claims","editorial_guidelines","content_assets"] as const;
export type OpsEntity = typeof entities[number];
export type OpsRecord = {id:string;item_id?:string|null;data:Record<string,unknown>;version:number;created_at:string;updated_at:string;created_by:string};
export const stages = ["research","brief","outline","drafting","editorial","fact_check","visual_seo","final_approval","ready"] as const;
export const stageLabels:Record<string,string> = {research:"جمع المعلومات",brief:"الموجز",outline:"الهيكل",drafting:"كتابة المسودة",editorial:"المراجعة التحريرية",fact_check:"التحقق",visual_seo:"الصور والسيو",final_approval:"الاعتماد النهائي",ready:"جاهز للنشر"};
export const valueLabels:Record<string,string>={...stageLabels,article:"مقال",guide:"دليل",course:"كورس",lesson:"درس",tool:"أداة",admin:"مدير",strategist:"مسؤول استراتيجية",writer:"كاتب",editor:"محرر",fact_checker:"مدقق معلومات",publisher:"مسؤول النشر",draft:"مسودة",published:"منشور",planned:"مخطط",approved:"معتمد",rejected:"مرفوض",merged:"مدمج",normal:"عادي",high:"مرتفع",urgent:"عاجل",open:"مفتوح",working:"قيد التنفيذ",blocked:"متوقف",done:"مكتمل",pending:"بانتظار التحقق",verified:"متحقق",critical:"حرج",fail:"إخفاق",pass:"ناجح"};
export const saveSchema = z.object({entity:z.enum(entities),payload:z.object({id:z.uuid().optional(),item_id:z.uuid().nullable().optional(),idea_id:z.uuid().optional(),cluster_id:z.uuid().optional(),data:z.record(z.string(),z.unknown())}),expectedVersion:z.number().int().nonnegative()});
export const transitionSchema = z.object({item:z.uuid(),stage:z.enum(stages),reason:z.string().max(3000),expectedVersion:z.number().int().positive()});
export const convertSchema = z.object({idea:z.uuid(),expectedVersion:z.number().int().positive(),reason:z.string().trim().min(1).max(3000),kind:z.enum(["article","guide","course","lesson","tool"]),ownerId:z.uuid(),existingItem:z.uuid().nullable().optional()});
export const text = (value:unknown) => typeof value === "string" ? value : "";
export function normalize(value:string){return value.normalize("NFKC").replace(/[\u064b-\u065f]/g,"").replace(/[أإآ]/g,"ا").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();}
export function similarTopics(query:string,items:{title:string;href:string}[]) {
 const words=new Set(normalize(query).split(" ").filter(w=>w.length>2));
 if(!words.size)return [];
 return items.map(item=>{const other=new Set(normalize(item.title).split(" ").filter(w=>w.length>2));const intersection=[...words].filter(w=>other.has(w)).length;return {...item,score:intersection/(new Set([...words,...other]).size||1)};}).filter(r=>r.score>=0.2).sort((a,b)=>b.score-a.score).slice(0,6);
}
