import { entities,saveSchema,transitionSchema,convertSchema } from "@/lib/content-ops/model";
import { requireOps,opsError } from "@/lib/content-ops/server";
import { contentCatalog } from "@/lib/content-ops/catalog";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"private, no-store"};
export async function GET(){
 try {const {client,role,user}=await requireOps();const rows:Record<string,unknown>={};let truncated=false;
 await Promise.all(entities.map(async entity=>{const {data,error}=await client.from(entity).select("*").order("updated_at",{ascending:false}).limit(501);if(error)throw error;truncated ||= (data?.length??0)>500;rows[entity]=data?.slice(0,500)??[];}));
 const {data:members,error}=await client.from("ops_members").select("user_id,display_name,role,active");if(error)throw error;
 const {data:activity,error:aError}=await client.from("content_activity_log").select("*").order("created_at",{ascending:false}).limit(100);if(aError)throw aError;
 return Response.json({role,userId:user.id,rows,members,activity,truncated,catalog:contentCatalog,asOf:new Date().toISOString()},{headers});
 }catch(error){return Response.json({error:opsError(error)},{status:error instanceof Error&&error.message==="UNAUTHORIZED"?401:403,headers});}
}
export async function POST(request:Request){
 if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:{code:"ORIGIN",message:"طلب غير مسموح"}},{status:403,headers});
 try {const raw=await request.text();if(raw.length>300000)return Response.json({error:{code:"TOO_LARGE",message:"الطلب كبير جدًا"}},{status:413,headers});
 const body=JSON.parse(raw);const {client}=await requireOps();
 let result;
 if(body.action==="transition") {const p=transitionSchema.parse(body);result=await client.rpc("ops_transition",{item:p.item,next_stage:p.stage,reason:p.reason,expected_version:p.expectedVersion});}
 else if(body.action==="convert") {const p=convertSchema.parse(body);result=await client.rpc("ops_convert_idea",{idea:p.idea,expected_version:p.expectedVersion,reason:p.reason,kind:p.kind,owner_id:p.ownerId,existing_item:p.existingItem??null});}
 else {const p=saveSchema.parse(body);result=await client.rpc("ops_save",{entity:p.entity,payload:p.payload,expected_version:p.expectedVersion});}
 if(result.error){const error=opsError(result.error);return Response.json({error},{status:error.code==="VERSION_CONFLICT"?409:422,headers});}
 return Response.json(result.data,{headers});
 }catch(error){return Response.json({error:opsError(error)},{status:error instanceof Error&&error.message==="UNAUTHORIZED"?401:error instanceof Error&&error.message==="FORBIDDEN"?403:400,headers});}
}
