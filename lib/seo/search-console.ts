import type {CmsReport} from "../cms/reports";
export type IndexingSnapshot={from:string;to:string;importedAt:string;reason:string;urls:string[]};
// A dated user export, never a live URL Inspection result.
export function indexingSnapshot(reports:CmsReport[]):IndexingSnapshot|null {
 const report=reports.filter(r=>r.kind==="indexing").sort((a,b)=>b.to.localeCompare(a.to)||b.importedAt.localeCompare(a.importedAt))[0];
 if(!report)return null;
 return {from:report.from,to:report.to,importedAt:report.importedAt,reason:report.reason,urls:[...new Set(report.rows.map(r=>r.url))]};
}
export function snapshotContains(snapshot:IndexingSnapshot|null,path:string){return snapshot?.urls.includes(`https://www.lusaill.online${path}`)??false;}
