import "server-only";
import {publicCmsClient} from "../cms/server";
export const heatmapVersion=()=>process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,12)??"local";
export const heatmapConfigured=()=>Boolean(process.env.HEATMAP_INGEST_KEY&&process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export async function heatmapConfig(){const client=publicCmsClient();if(!client||!heatmapConfigured())return {enabled:false,configured:false};const {data,error}=await client.rpc("heatmap_config");if(error)throw error;return {...data,configured:true};}
export function sameOrigin(request:Request){return request.headers.get("origin")===new URL(request.url).origin;}
export function trackingHost(request:Request,test=false){const host=new URL(request.url).hostname;return test||host==="www.lusaill.online"||host==="localhost"||host==="127.0.0.1";}
