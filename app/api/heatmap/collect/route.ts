import {publicCmsClient} from "@/lib/cms/server";
import {snapshotSchema} from "@/lib/heatmap/model";
import {heatmapConfigured,sameOrigin,trackingHost} from "@/lib/heatmap/server";
import {verifyGrant} from "@/lib/heatmap/token";
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response(null,{status:403});
 if(!heatmapConfigured())return new Response(null,{status:503});
 try{const raw=await request.text();if(raw.length>16000)return new Response(null,{status:413});const body=JSON.parse(raw);if(typeof body.token!=="string")return new Response(null,{status:400});const grant=verifyGrant(body.token,process.env.HEATMAP_INGEST_KEY!);if(!grant||!trackingHost(request,grant.test))return new Response(null,{status:403});const parsed=snapshotSchema.safeParse(body.snapshot);if(!parsed.success)return new Response(null,{status:400});
 const client=publicCmsClient()!;const {data,error}=await client.rpc("heatmap_accept",{app_key:process.env.HEATMAP_INGEST_KEY!,payload:{...parsed.data,id:grant.id,path:grant.path,width:grant.width,version:grant.version,test:grant.test}});if(error)return new Response(null,{status:400});return Response.json(data,{status:data.accepted?200:429,headers:{"Cache-Control":"no-store"}});
 }catch{return new Response(null,{status:400});}
}
