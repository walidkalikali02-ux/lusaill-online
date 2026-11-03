export const GRID_X=64;
export const GRID_Y=100;
export const BANDS=20;
export const RETENTION_DAYS=14;
export function publicHeatmapPath(path:string){
 if(path.length>250||path.includes("?")||path.includes("#")||path.includes("%")||path.includes("\\")||path.includes("//")||path.includes(".."))return false;
 return path==="/"||/^\/(articles|categories|guides|entities|courses)(\/[\p{L}\p{N}_-]+){0,4}$/u.test(path);
}
export function deviceFor(width:number){return width<768?"mobile":width<1024?"tablet":"desktop";}
