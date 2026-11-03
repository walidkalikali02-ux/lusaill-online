import {geometryUnit} from "./public";
// Only layout geometry is hashed locally. No text, field values, selectors or DOM is uploaded.
export async function layoutSignature(doc:Document){
 await doc.fonts?.ready;
 const main=doc.querySelector("main");if(!main)throw Error("No public main");const view=doc.defaultView!;
 const shapes=[...main.querySelectorAll("h1,h2,h3,p,li,table,img,section")].slice(0,2000).map(el=>{const r=el.getBoundingClientRect();return `${el.tagName}:${geometryUnit(r.top+view.scrollY)}:${geometryUnit(r.height)}:${geometryUnit(r.width)}`;}).join("|");
 const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(shapes));return [...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,"0")).join("").slice(0,12);
}
