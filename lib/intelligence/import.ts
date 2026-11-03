import {isIP} from "node:net";
import {parseCsv} from "../cms/reports";

/** Normalize identity without removing query parameters that may change the content. */
export function normalizeUrl(value:string):string {
 const u=new URL(value.trim());
 if(u.protocol!=="https:"||u.username||u.password||u.port&&u.port!=="443")throw Error("الرابط يجب أن يستخدم HTTPS دون بيانات دخول أو منفذ مخصص");
 const host=u.hostname.toLowerCase().replace(/\.$/,"");
 if(!host.includes(".")||isIP(host.replace(/^\[|\]$/g,""))||host.endsWith(".local")||host.endsWith(".localhost")||host.endsWith(".internal")||host.endsWith(".test")||host.endsWith(".invalid")||host.endsWith(".example"))throw Error("اسم مضيف عام مطلوب");
 u.hostname=host;u.hash="";u.searchParams.sort();
 if(u.href.length>2000)throw Error("الرابط أطول من الحد المسموح");
 return u.href;
}

export function importUrlText(text:string):{urls:string[];errors:string[]} {
 if(text.length>1_000_000)throw Error("الملف يتجاوز الحد المسموح: مليون حرف");
 const urls:string[]=[],errors:string[]=[];const seen=new Set<string>();
 const rows=text.includes(",")||text.includes('"')?parseCsv(text):text.replace(/^\uFEFF/,"").split(/\r?\n/).map(line=>line.split("\t"));
 for(const row of rows){for(const value of row){const trimmed=value.trim();if(!trimmed)continue;
  if(!/^https?:\/\//i.test(trimmed)){if(trimmed.includes("://"))errors.push("رابط غير مدعوم: "+trimmed.slice(0,150));continue;}
  try{const url=normalizeUrl(trimmed);if(!seen.has(url)){seen.add(url);urls.push(url);}}catch(e){errors.push(`${trimmed.slice(0,150)}: ${e instanceof Error?e.message:"رابط غير صالح"}`);}
 }}
 if(urls.length>100)throw Error("الحد الأقصى 100 رابط في الدفعة الواحدة");
 if(!urls.length&&!errors.length)errors.push("لم يتم العثور على روابط HTTPS في الملف");
 return {urls,errors};
}
