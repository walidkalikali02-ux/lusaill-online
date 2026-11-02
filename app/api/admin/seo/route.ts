import {createHash,randomUUID} from "node:crypto";
import {requireOps} from "@/lib/content-ops/server";
import {seoInventory} from "@/lib/seo/inventory";
import {seoTemplate,taskUpdate} from "@/lib/seo/model";
import {auditArticle,auditSite} from "@/lib/seo/run";
export const dynamic="force-dynamic";
export const maxDuration=300;
const headers={"Cache-Control":"private, no-store"};
function failure(error:unknown){const text=error instanceof Error?error.message:String((error as {message?:string})?.message??"");const messages:Record<string,string>={VERSION_CONFLICT:"تعارض تعديل؛ أعد تحميل المهمة",CONTENT_CHANGED:"تغير المحتوى؛ حمّل القائمة الحالية قبل اعتمادها",EVIDENCE_REQUIRED:"أضف وصفًا واضحًا للدليل أو سبب التعطيل/عدم الانطباق (10 أحرف على الأقل)",FORBIDDEN:"لا تملك صلاحية هذا الإجراء",APPROVAL_FORBIDDEN:"المهمة تحتاج محررًا أو مدقق معلومات أو مديرًا",UNAUTHORIZED:"سجّل الدخول أولًا",TASK_SCOPE_MISMATCH:"هذه المهمة تتبع نطاقًا مختلفًا",NOT_FOUND:"المقال أو المهمة غير موجود",INVENTORY_FAILED:"تعذر تحميل مكتبة المقالات"};const key=Object.keys(messages).sort((a,b)=>b.length-a.length).find(k=>text.includes(k));return Response.json({error:key?messages[key]:"تعذر تنفيذ العملية؛ تحقق من الاتصال والحقول"},{status:key==="UNAUTHORIZED"?401:key==="FORBIDDEN"?403:key==="VERSION_CONFLICT"||key==="CONTENT_CHANGED"?409:400,headers});}
export async function GET(request:Request){try{const {client,role,user}=await requireOps();const inventory=await seoInventory(client);const url=new URL(request.url);const key=url.searchParams.get("target");
 if(key){const target=inventory.targets.find(t=>t.key===key||t.documentId===key.replace(/^article:/,"")||t.documentId===url.searchParams.get("documentId"));if(!target)throw Error("NOT_FOUND");
 const [{data:record,error},{data:runs,error:runError},{data:activity,error:activityError}]=await Promise.all([client.from("seo_targets").select("*").eq("target_key",target.key).maybeSingle(),client.from("seo_review_runs").select("*").eq("target_key",target.key).order("created_at",{ascending:false}).limit(5),client.from("seo_task_activity").select("*").eq("target_key",target.key).order("created_at",{ascending:false}).limit(100)]);if(error||runError||activityError)throw Error("LOAD_FAILED");
 return Response.json({target,record,runs,activity,role,userId:user.id,template:seoTemplate},{headers});}
 const {data:summary,error}=await client.from("seo_target_summary").select("*").limit(1000);if(error)throw error;return Response.json({targets:inventory.targets,summary,role,userId:user.id,template:seoTemplate,asOf:new Date().toISOString()},{headers});
 }catch(error){return failure(error);}}
export async function POST(request:Request){
 if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"طلب غير مسموح"},{status:403,headers});
 try{const {client,role}=await requireOps();const raw=await request.text();if(raw.length>100000)return Response.json({error:"طلب كبير جدًا"},{status:413,headers});const body=JSON.parse(raw);const inventory=await seoInventory(client);
 if(body.action==="sync"){if(!["admin","editor","strategist"].includes(role))throw Error("FORBIDDEN");const {data,error}=await client.rpc("seo_sync",{payload:inventory.targets});if(error)throw error;return Response.json({registered:data},{headers});}
 if(body.action==="task"){const input=taskUpdate.parse(body);const target=inventory.targets.find(t=>t.key===input.target);if(!target)throw Error("NOT_FOUND");
 if(["admin","editor","strategist"].includes(role)){const {error}=await client.rpc("seo_sync",{payload:[target]});if(error)throw error;}
 const {data,error}=await client.rpc("seo_set_task",{target:target.key,task:input.task,state:input.state,expected_version:input.expectedVersion,expected_hash:target.hash});if(error)throw error;return Response.json(data,{headers});}
 if(body.action==="audit"){if(!["admin","editor","strategist"].includes(role))throw Error("FORBIDDEN");if(!Array.isArray(body.targets)||body.targets.length<1||body.targets.length>4||body.targets.some((k:unknown)=>typeof k!=="string"))throw Error("INVALID_DATA");
 const targets=body.targets.map((key:string)=>{const target=inventory.targets.find(t=>t.key===key);if(!target)throw Error("NOT_FOUND");return target;});
 const {error:syncError}=await client.rpc("seo_sync",{payload:targets});if(syncError)throw syncError;const batch=typeof body.requestId==="string"?body.requestId:randomUUID();
 const results=[];for(const target of targets){const h=createHash("sha256").update(batch+target.key).digest("hex");const id=`${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-8${h.slice(17,20)}-${h.slice(20,32)}`;
 const {data:existing,error:existingError}=await client.from("seo_review_runs").select("id,target_key,content_hash,report").eq("id",id).maybeSingle();if(existingError)throw existingError;
 if(existing){if(existing.target_key!==target.key||existing.content_hash!==target.hash)throw Error("CONTENT_CHANGED");results.push({target:target.key,id,failures:existing.report.checks.filter((c:{status:string})=>["fail","error"].includes(c.status)).length});continue;}
 const doc=inventory.documents.get(target.key);const report=target.scope==="site"?await auditSite():await auditArticle(target,doc!);
 const {data,error}=await client.rpc("seo_record_run",{run_id:id,target:target.key,hash:target.hash,report});if(error)throw error;results.push({target:target.key,id:data.id,failures:report.checks.filter(c=>["fail","error"].includes(c.status)).length});}
 return Response.json({results},{headers});}
 throw Error("INVALID_DATA");
 }catch(error){return failure(error);}
}
