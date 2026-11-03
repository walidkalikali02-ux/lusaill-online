import {heatmapConfig} from "@/lib/heatmap/server";
export async function GET(){try{return Response.json(await heatmapConfig(),{headers:{"Cache-Control":"public,max-age=30"}});}catch{return Response.json({enabled:false,configured:false},{headers:{"Cache-Control":"no-store"}});}}
