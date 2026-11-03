import {lookup} from "node:dns/promises";
import {isIP} from "node:net";
import {request} from "node:https";
import {normalizeUrl} from "./import";
import {extractDocument,type ExtractedDocument} from "./extract";

export const BOT="LusaillTopicBot/1.0 (+https://www.lusaill.online/about)";
type Address={address:string;family:number};
export type HttpResult={status:number;headers:Record<string,string>;body:string};
export type CrawlDependencies={resolve?:(host:string)=>Promise<Address[]>;transport?:(url:URL,pin:Address,limit:number)=>Promise<HttpResult>;wait?:(ms:number)=>Promise<void>};
const lastDomain=new Map<string,number>();
const robotCache=new Map<string,{at:number;body:string}>();
const sleep=(ms:number)=>new Promise<void>(r=>setTimeout(r,ms));

export function isPublicAddress(ip:string):boolean {
 if(isIP(ip)===4){const n=ip.split(".").map(Number),[a,b,c]=n;
  return !(a===0||a===10||a===127||a>=224||a===100&&b>=64&&b<=127||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&(b===0||b===168||b===88&&c===99)||a===198&&(b===18||b===19||b===51&&c===100)||a===203&&b===0&&c===113);
 }
 if(isIP(ip)!==6)return false;
 // Only native global unicast; reject mapped/compatible IPv4, local, multicast and transition/tunnel ranges.
 const parts=ip.toLowerCase().split(":");const first=parseInt(parts[0],16);
 if(!Number.isFinite(first)||first<0x2000||first>0x3fff||first===0x2002)return false;
 if(first===0x2001){const second=parseInt(parts[1]||"0",16);if(second===0||second===2||second===0xdb8||second>=0x10&&second<=0x1f)return false;}
 return true;
}

async function nativeTransport(url:URL,pin:Address,limit:number):Promise<HttpResult> {
 return new Promise((resolve,reject)=>{
  const options:import("node:https").RequestOptions&{autoSelectFamily:boolean}={method:"GET",family:pin.family,autoSelectFamily:false,headers:{"User-Agent":BOT,Accept:"text/html,application/xhtml+xml,application/xml,text/plain;q=0.8","Accept-Encoding":"identity"},lookup:(_host,_options,callback)=>callback(null,pin.address,pin.family),timeout:12_000};
  const req=request(url,options,res=>{
   const headers:Record<string,string>={};for(const [key,value] of Object.entries(res.headers))if(value!==undefined)headers[key]=Array.isArray(value)?value.join(","):value;
   if(Number(headers["content-length"]??0)>limit){res.destroy();reject(Error("تجاوز المصدر حد حجم الاستجابة"));return;}
   if(headers["content-encoding"]&&!/^identity$/i.test(headers["content-encoding"])){res.destroy();reject(Error("ضغط استجابة غير مدعوم؛ لم تُحلل الاستجابة"));return;}
   const chunks:Buffer[]=[];let size=0;
   res.on("data",(chunk:Buffer)=>{size+=chunk.length;if(size>limit){res.destroy(Error("تجاوز المصدر حد حجم الاستجابة"));}else chunks.push(chunk);});
   res.on("end",()=>resolve({status:res.statusCode??0,headers,body:Buffer.concat(chunks).toString("utf8")}));res.on("error",reject);
  });
  const timer=setTimeout(()=>req.destroy(Error("انتهت مهلة المصدر")),15_000);timer.unref();
  req.on("timeout",()=>req.destroy(Error("انتهت مهلة المصدر")));req.on("error",reject);req.on("close",()=>clearTimeout(timer));req.end();
 });
}

async function one(url:URL,limit:number,deps:CrawlDependencies):Promise<HttpResult> {
 normalizeUrl(url.href);
 let dnsTimer:ReturnType<typeof setTimeout>|undefined;
 const records=await Promise.race([(deps.resolve??(host=>lookup(host,{all:true,verbatim:true})))(url.hostname),new Promise<never>((_resolve,reject)=>{dnsTimer=setTimeout(()=>reject(Error("انتهت مهلة DNS")),8000);})]).finally(()=>clearTimeout(dnsTimer));
 if(!records.length||records.some(record=>!isPublicAddress(record.address)))throw Error("تم منع المصدر: عنوان شبكة خاص أو محجوز");
 const last=lastDomain.get(url.hostname)??0;const delay=Math.max(0,last+1000-Date.now());lastDomain.set(url.hostname,Date.now()+delay);
 if(delay)await (deps.wait??sleep)(delay);
 return (deps.transport??nativeTransport)(url,records[0],limit);
}
function redirect(result:HttpResult,url:URL){if([301,302,303,307,308].includes(result.status)){if(!result.headers.location)throw Error("إعادة توجيه دون عنوان");return new URL(normalizeUrl(new URL(result.headers.location,url).href));}return null;}

/** RFC9309 longest matching path, Allow wins ties; exact named bot group wins over '*'. */
export function robotsAllowed(body:string,target:string):boolean {
 const octets=(value:string)=>value.replace(/[^\x00-\x7F]/gu,char=>encodeURIComponent(char)).replace(/%([0-9a-f]{2})/gi,(_whole,hex:string)=>{const char=String.fromCharCode(parseInt(hex,16));return /^[A-Za-z0-9._~-]$/.test(char)?char:"%"+hex.toUpperCase();});
 target=octets(target);
 type Group={agents:string[];rules:{allow:boolean;pattern:string}[]};const groups:Group[]=[];let group:Group={agents:[],rules:[]};
 const finish=()=>{if(group.agents.length)groups.push(group);group={agents:[],rules:[]};};
 for(const raw of body.replace(/^\uFEFF/,"").split(/\r?\n/)){const line=raw.replace(/#.*/,"").trim();const split=line.indexOf(":");if(split<0)continue;const key=line.slice(0,split).trim().toLowerCase(),value=line.slice(split+1).trim();
  if(key==="user-agent"){if(group.rules.length)finish();group.agents.push(value.toLowerCase());}else if((key==="allow"||key==="disallow")&&group.agents.length&&value)group.rules.push({allow:key==="allow",pattern:value});
 }finish();
 const named=groups.filter(g=>g.agents.some(a=>a!=="*"&&"lusailltopicbot".startsWith(a)));const chosen=named.length?named:groups.filter(g=>g.agents.includes("*"));
 const matches=chosen.flatMap(g=>g.rules).flatMap(rule=>{const pattern=octets(rule.pattern);const end=pattern.endsWith("$");const source=(end?pattern.slice(0,-1):pattern).split("*").map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join(".*");try{return new RegExp("^"+source+(end?"$":"")).test(target)?[{...rule,length:new TextEncoder().encode(pattern.replace(/\*/g,"").replace(/\$$/,"")).length}]:[];}catch{return [];}});
 matches.sort((a,b)=>b.length-a.length||Number(b.allow)-Number(a.allow));return matches[0]?.allow??true;
}
async function robots(url:URL,deps:CrawlDependencies){
 const cached=robotCache.get(url.origin);if(cached&&Date.now()-cached.at<300_000)return cached.body;
 let current=new URL("/robots.txt",url);let result:HttpResult|undefined;
 for(let hop=0;hop<4;hop++){result=await one(current,512_000,deps);const next=redirect(result,current);if(!next)break;if(hop===3)throw Error("إعادات توجيه robots.txt تتجاوز الحد");current=next;}
 if(!result)throw Error("تعذر تحميل robots.txt");
 if(result.status===404||result.status===410){robotCache.set(url.origin,{at:Date.now(),body:""});return "";}
 if(result.status!==200)throw Error(`تعذر التأكد من سياسة الزحف: robots.txt HTTP ${result.status}`);
 if(/<\s*(?:html|!doctype)/i.test(result.body))throw Error("استجابة robots.txt ليست سياسة نصية صالحة");
 robotCache.set(url.origin,{at:Date.now(),body:result.body});return result.body;
}

export async function fetchPermitted(url:string,limit=2_000_000,deps:CrawlDependencies={}):Promise<{url:string;result:HttpResult}> {
 let current=new URL(normalizeUrl(url));
 for(let hop=0;hop<4;hop++){
  const policy=await robots(current,deps);if(!robotsAllowed(policy,current.pathname+current.search))throw Error("المصدر يمنع هذا المسار في robots.txt");
  const result=await one(current,limit,deps);const next=redirect(result,current);
  if(next){if(hop===3)throw Error("إعادات التوجيه تتجاوز الحد المسموح");current=next;continue;}
  if(result.status!==200)throw Error(`المصدر غير متاح: HTTP ${result.status}`);
  return {url:current.href,result};
 }throw Error("تعذر الوصول إلى المصدر");
}
export async function crawlUrl(url:string,deps:CrawlDependencies={}):Promise<ExtractedDocument> {
 const {url:finalUrl,result}=await fetchPermitted(url,2_000_000,deps);
 if(!/^(?:text\/html|application\/xhtml\+xml)(?:;|$)/i.test(result.headers["content-type"]??""))throw Error("نوع المصدر غير مدعوم؛ يلزم مقال HTML متاح للعامة");
 const doc=extractDocument(result.body,finalUrl);if(finalUrl!==normalizeUrl(url))doc.warnings.push("تم اتباع إعادة توجيه المصدر وتسجيل العنوان النهائي");return doc;
}
export async function discoverSitemap(url:string,max=50,deps:CrawlDependencies={}):Promise<string[]> {
 const normalized=normalizeUrl(url),host=new URL(normalized).hostname;const found=new Set<string>(),queue=[normalized],seen=new Set<string>();
 max=Math.min(100,Math.max(1,Math.floor(max)));
 while(queue.length&&seen.size<4&&found.size<max){const source=queue.shift()!;if(seen.has(source))continue;seen.add(source);const {result}=await fetchPermitted(source,1_000_000,deps);
  if(!/xml|text\/plain/i.test(result.headers["content-type"]??"")||!/\b(?:urlset|sitemapindex)\b/.test(result.body)||/<!DOCTYPE|<!ENTITY/i.test(result.body))throw Error("خريطة موقع XML غير صالحة أو تحتوي تعريفات كيانات غير مسموحة");
  for(const match of result.body.matchAll(/<loc\b[^>]*>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/loc>/gi)){let target:string;try{target=normalizeUrl(match[1].trim().replace(/&amp;/g,"&"));}catch{continue;}if(new URL(target).hostname!==host)continue;
   if(/<sitemapindex\b/.test(result.body)){if(queue.length<4)queue.push(target);}else found.add(target);if(found.size>=max)break;
  }
 }return [...found];
}
