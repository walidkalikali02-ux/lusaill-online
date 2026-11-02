import {GET as overview,POST as mutate} from "../route";
import type {OpsEntity} from "@/lib/content-ops/model";
const modules:Record<string,OpsEntity>={ideas:"content_ideas",evidence:"idea_evidence",clusters:"topic_clusters",briefs:"content_briefs",outlines:"content_outlines",tasks:"workflow_tasks",reviews:"content_reviews",claims:"source_claims",assets:"content_assets"};
export const dynamic="force-dynamic";
export async function GET(_:Request,{params}:{params:Promise<{module:string}>}){
 const {module}=await params;
 const response=await overview();if(!response.ok||module==="overview")return response;
 if(!modules[module])return Response.json({error:{code:"NOT_AVAILABLE",message:module==="analytics"?"تكامل التحليلات غير مفعل؛ لا توجد مقاييس معتمدة لعرضها":"الوحدة غير مفعلة بعد"}},{status:module==="analytics"?503:404,headers:{"Cache-Control":"private, no-store"}});
 const data=await response.json();return Response.json({rows:data.rows[modules[module]],truncated:data.truncated,asOf:data.asOf},{headers:{"Cache-Control":"private, no-store"}});
}
export async function POST(request:Request,{params}:{params:Promise<{module:string}>}){
 const {module}=await params;const entity=modules[module];if(!entity)return Response.json({error:{code:"NOT_FOUND",message:"مسار غير موجود"}},{status:404});
 if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:{code:"ORIGIN",message:"طلب غير مسموح"}},{status:403});
 const raw=await request.text();if(raw.length>300000)return Response.json({error:{code:"TOO_LARGE",message:"الطلب كبير جدًا"}},{status:413});
 try{return mutate(new Request(request.url,{method:"POST",headers:request.headers,body:JSON.stringify({...JSON.parse(raw),action:"save",entity})}));}catch{return Response.json({error:{code:"INVALID_DATA",message:"بيانات غير صالحة"}},{status:400});}
}
