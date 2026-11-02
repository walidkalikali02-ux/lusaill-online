import {createHash} from "node:crypto";
import type {Article} from "../content";
import {importArticle} from "../cms/import";
import type {CmsDocument} from "../cms/model";
import type {SeoTarget} from "./model";
function stable(value:unknown):unknown {if(Array.isArray(value))return value.map(stable);if(value&&typeof value==="object")return Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b)).map(([key,value])=>[key,stable(value)]));return value;}
export function documentHash(doc:CmsDocument){const values={...doc} as Record<string,unknown>;for(const key of ["version","updatedAt","status","scheduledAt","operationsItemId","editorialOverrideReason"])delete values[key];return createHash("sha256").update(JSON.stringify(stable(values))).digest("hex");}
export function makeInventory(base:Article[],saved:CmsDocument[]=[],published:CmsDocument[]=[]) {
 const originals=new Map<string,Article>();const docs=new Map(base.map(a=>{const d=importArticle(a);originals.set(d.id,a);return [d.id,d];}));const slugIds=new Map([...docs.values()].map(d=>[d.slug,d.id]));
 const live=new Set(base.filter(a=>a.status==="published").map(a=>a.slug));const liveDocs=new Map<string,CmsDocument>();
 for(const doc of published){if(doc.status==="published"){live.add(doc.slug);liveDocs.set(doc.slug,doc);}else if(doc.status==="archived")live.delete(doc.slug);}
 for(const doc of saved){const id=slugIds.get(doc.slug)??doc.id;if(doc.status==="archived"&&!docs.has(id))continue;docs.set(id,doc);}
 const targets:SeoTarget[]=[{key:"site",scope:"site",title:"SEO الموقع بالكامل",status:"site",category:"",path:"/",hash:"site-template-1",live:true}];const documents=new Map<string,CmsDocument>();
 for(const [id,doc] of docs){const key=`article:${id}`;targets.push({key,scope:"article",id,slug:doc.slug,documentId:doc.id,title:doc.title,status:doc.status,category:doc.category,path:`/articles/${doc.slug}`,hash:createHash("sha256").update(documentHash(doc)+JSON.stringify(stable(originals.get(id)??null))+String(live.has(doc.slug))).digest("hex"),live:live.has(doc.slug)});documents.set(key,doc);}
 return {targets,documents,liveDocs};
}
