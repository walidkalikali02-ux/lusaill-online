import {createHash} from "node:crypto";
import {createRequire} from "node:module";

// Pin follows the project's existing Next version. DOM parsing, not regexp HTML stripping.
type HtmlElement={tagName:string;textContent:string;innerHTML:string;getAttribute(name:string):string|undefined;querySelector(selector:string):HtmlElement|null;querySelectorAll(selector:string):HtmlElement[];remove():void};
const {parse}=createRequire(import.meta.url)("next/dist/compiled/node-html-parser") as {parse:(html:string,options?:unknown)=>HtmlElement};
export type ExtractedDocument={url:string;canonical:string;title:string;description:string;text:string;headings:{level:number;text:string}[];sections:{id:string;heading:string;text:string}[];links:{url:string;text:string}[];tables:string[][][];lists:string[][];images:{url:string;alt:string}[];structuredData:unknown[];dates:{published?:string;modified?:string};authors:string[];fingerprint:string;quality:"complete"|"partial";warnings:string[];fetchedAt:string};
const clean=(s:string)=>s.replace(/\s+/g," ").trim();
function absolute(value:string|undefined,base:string){if(!value?.trim())return "";try{const u=new URL(value,base);return ["http:","https:"].includes(u.protocol)?u.href:"";}catch{return "";}}
function validDate(value:string|undefined){if(!value||!/^(?:19|20)\d\d-\d\d-\d\d(?:T.*)?$/.test(value)||!Number.isFinite(Date.parse(value)))return undefined;const [year,month,day]=value.slice(0,10).split("-").map(Number);return new Date(Date.UTC(year,month-1,day)).toISOString().slice(0,10)===value.slice(0,10)?value:undefined;}

/** Extract observed source content only; it never verifies that a source's claims are true. */
export function extractDocument(html:string,url:string,fetchedAt=new Date().toISOString()):ExtractedDocument {
 const root=parse(html,{comment:false,blockTextElements:{script:true,style:false,noscript:false,pre:true}});
 const warnings:string[]=[];
 const meta=(name:string)=>root.querySelector(`meta[property="${name}"]`)?.getAttribute("content")??root.querySelector(`meta[name="${name}"]`)?.getAttribute("content");
 const title=clean(root.querySelector("title")?.textContent??meta("og:title")??"").slice(0,500);
 const description=clean(meta("description")??meta("og:description")??"").slice(0,2000);
 const canonical=absolute(root.querySelector('link[rel="canonical"]')?.getAttribute("href"),url)||url;
 const structuredData:unknown[]=[];
 for(const el of root.querySelectorAll('script[type="application/ld+json"]').slice(0,20)){try{if(el.textContent.length<200_000)structuredData.push(JSON.parse(el.textContent));else warnings.push("بيانات منظمة تتجاوز حد المعالجة");}catch{warnings.push("بيانات منظمة غير صالحة في المصدر");}}
 const graphNodes:Record<string,unknown>[]=[];
 const visit=(value:unknown,depth=0)=>{if(depth>6||graphNodes.length>200)return;if(Array.isArray(value)){for(const node of value)visit(node,depth+1);}else if(value&&typeof value==="object"){const node=value as Record<string,unknown>;graphNodes.push(node);if(node["@graph"])visit(node["@graph"],depth+1);if(node.mainEntity)visit(node.mainEntity,depth+1);}};
 for(const node of structuredData)visit(node);
 const articleNode=graphNodes.find(node=>[node["@type"]].flat().some(type=>typeof type==="string"&&/^(?:Article|NewsArticle|BlogPosting|TechArticle)$/.test(type)));
 const jsonAuthors=articleNode?.author?[articleNode.author].flat().flatMap(value=>typeof value==="string"?[value]:value&&typeof value==="object"&&typeof (value as Record<string,unknown>).name==="string"?[(value as {name:string}).name]:[]):[];
 const authors=[...new Set([meta("author"),...root.querySelectorAll('[rel="author"]').map(el=>clean(el.textContent)),...jsonAuthors].filter((x):x is string=>!!x))].map(name=>clean(name).slice(0,300)).slice(0,20);
 const dates={published:validDate(meta("article:published_time")??meta("datePublished")??(typeof articleNode?.datePublished==="string"?articleNode.datePublished:undefined)),modified:validDate(meta("article:modified_time")??meta("dateModified")??(typeof articleNode?.dateModified==="string"?articleNode.dateModified:undefined))};
 if(articleNode?.isAccessibleForFree===false||articleNode?.isAccessibleForFree==="false")warnings.push("المصدر يعلن محتوى مقيدًا بالاشتراك؛ التحليل يقتصر على الجزء المتاح");
 let main=root.querySelector("article")??root.querySelector("main");
 if(!main){main=root.querySelector("body")??root;warnings.push("لم يُعثر على عنصر مقال أو محتوى رئيسي؛ الاستخراج جزئي");}
 const obviousGate=/\b(?:captcha|cloudflare|access denied|verify you are human|enable javascript and cookies|subscribe to continue|sign in to continue)\b/i.test(title+" "+clean(main.textContent).slice(0,600));
 if(obviousGate)throw Error("المصدر يعرض حاجز وصول أو تحقق؛ لم يُحلل كمقال");
 for(const el of main.querySelectorAll("script,style,noscript,nav,footer,form,aside,[hidden],[aria-hidden=true]"))el.remove();
 const links=main.querySelectorAll("a[href]").slice(0,500).flatMap(el=>{const href=absolute(el.getAttribute("href"),url);return href?[{url:href,text:clean(el.textContent).slice(0,300)}]:[];});
 const images=main.querySelectorAll("img").slice(0,100).flatMap(el=>{const href=absolute(el.getAttribute("src")??el.getAttribute("data-src"),url);return href?[{url:href,alt:clean(el.getAttribute("alt")??"").slice(0,500)}]:[];});
 const tables=main.querySelectorAll("table").slice(0,30).map(table=>table.querySelectorAll("tr").slice(0,100).map(row=>row.querySelectorAll("th,td").slice(0,30).map(cell=>clean(cell.textContent).slice(0,1000))));
 const lists=main.querySelectorAll("ul,ol").slice(0,50).map(list=>list.querySelectorAll("li").slice(0,100).map(el=>clean(el.textContent).slice(0,1000)));
 const headings=main.querySelectorAll("h1,h2,h3,h4,h5,h6").slice(0,100).map(el=>({level:Number(el.tagName.slice(1)),text:clean(el.textContent).slice(0,500)}));
 const blocks=main.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th");
 const sections:ExtractedDocument["sections"]=[];let current={id:"s1",heading:headings[0]?.text??title,text:""};
 let fullText="";
 for(const block of blocks){const text=clean(block.textContent);if(!text)continue;
  if(/^H[1-6]$/.test(block.tagName)){if(current.text)sections.push(current);current={id:`s${sections.length+1}`,heading:text.slice(0,500),text:""};}
  else current.text+=(current.text?"\n":"")+text;
  fullText+=(fullText?"\n":"")+text;
 }
 if(current.text)sections.push(current);
 if(!fullText){fullText=clean(main.textContent);warnings.push("لا توجد فقرات منظمة في المصدر؛ يلزم فحص الاستخراج");}
 if(fullText.length<200)throw Error("المحتوى المستخرج غير كافٍ للتحليل؛ قد يكون المصدر محمّلًا بجافاسكريبت أو محجوبًا");
 if(fullText.length>60_000||sections.length>100||sections.some(s=>s.text.length>12_000))warnings.push("تجاوز المحتوى حد المعالجة؛ النتائج جزئية");
 const text=fullText.slice(0,60_000);
 return {url,canonical,title,description,text,headings,sections:sections.slice(0,100).map(s=>({...s,text:s.text.slice(0,12_000)})),links,tables,lists,images,structuredData,dates,authors,fingerprint:createHash("sha256").update(fullText).digest("hex"),quality:warnings.length?"partial":"complete",warnings,fetchedAt};
}
