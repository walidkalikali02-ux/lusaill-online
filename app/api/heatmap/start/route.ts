import {requireAdmin} from "@/lib/cms/server";
import {startSchema} from "@/lib/heatmap/model";
import {heatmapConfig,heatmapConfigured,heatmapVersion,sameOrigin,trackingHost} from "@/lib/heatmap/server";
import {signGrant} from "@/lib/heatmap/token";
export async function POST(request:Request){
 if(!sameOrigin(request))return new Response(null,{status:403});
 try{const raw=await request.text();if(raw.length>1000)return new Response(null,{status:413});const input=startSchema.parse(JSON.parse(raw));if(!trackingHost(request,input.test))return new Response(null,{status:403});if(!heatmapConfigured())return new Response(null,{status:503});
 if(input.test)await requireAdmin();else if(!(await heatmapConfig()).enabled)return new Response(null,{status:409});
 return Response.json({token:signGrant({path:input.path,width:input.width,version:`${heatmapVersion()}-${input.layout}`,test:input.test},process.env.HEATMAP_INGEST_KEY!)},{headers:{"Cache-Control":"private,no-store"}});
 }catch{return new Response(null,{status:400});}
}
