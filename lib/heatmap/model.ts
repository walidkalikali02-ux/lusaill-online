import {z} from "zod";

import {GRID_X,GRID_Y,BANDS,publicHeatmapPath} from "./public";
export {GRID_X,GRID_Y,BANDS,publicHeatmapPath,deviceFor,RETENTION_DAYS} from "./public";
export const startSchema=z.object({path:z.string().refine(publicHeatmapPath),width:z.number().int().min(280).max(3000),layout:z.string().regex(/^[a-f0-9]{12}$/),test:z.boolean().default(false)}).strict();
export const snapshotSchema=z.object({
 sequence:z.number().int().min(1).max(256),height:z.number().int().min(200).max(150000),viewportHeight:z.number().int().min(200).max(3000),
 scroll:z.number().int().min(0).max(100),seconds:z.number().int().min(0).max(1800),
 clicks:z.array(z.object({x:z.number().int().min(0).max(GRID_X-1),y:z.number().int().min(0).max(GRID_Y-1),n:z.number().int().min(1).max(200)}).strict()).max(100),
 attention:z.array(z.number().min(0).max(1800)).length(BANDS),
}).strict().refine(v=>v.clicks.reduce((n,c)=>n+c.n,0)<=200&&new Set(v.clicks.map(c=>`${c.x}:${c.y}`)).size===v.clicks.length&&v.attention.reduce((a,b)=>a+b,0)<=v.seconds+1,"Invalid cumulative snapshot");
export type HeatmapSnapshot=z.infer<typeof snapshotSchema>;
export type HeatmapView={width:number;height:number;viewportHeight:number;scroll:number;seconds:number;clicks:{x:number;y:number;n:number}[];attention:number[]};
export function aggregateViews(views:HeatmapView[]){
 const cells=new Map<string,{x:number;y:number;n:number}>();const reaches=Array(BANDS).fill(0) as number[],attention=Array(BANDS).fill(0) as number[];
 for(const view of views){for(const cell of view.clicks){const key=`${cell.x}:${cell.y}`;const saved=cells.get(key);if(saved)saved.n+=cell.n;else cells.set(key,{...cell});}for(let i=0;i<BANDS;i++){if(view.scroll>=i*5)reaches[i]++;attention[i]+=view.attention[i]??0;}}
 return {views:views.length,clicks:[...cells.values()],reaches,attention,clickCount:[...cells.values()].reduce((n,c)=>n+c.n,0),averageScroll:views.length?views.reduce((n,v)=>n+v.scroll,0)/views.length:0,seconds:views.reduce((n,v)=>n+v.seconds,0),averageViewportHeight:views.length?Math.round(views.reduce((n,v)=>n+v.viewportHeight,0)/views.length):0};
}
