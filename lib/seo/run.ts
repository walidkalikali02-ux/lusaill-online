import "server-only";
import {createHash} from "node:crypto";
import {inspectHtml,inspectDraft,officialOrigin,attr,decode} from "./inspect";
import type {CmsDocument} from "../cms/model";
import type {SeoTarget,SeoCheck} from "./model";
const cache=new Map<string,{expires:number;promise:Promise<{status:number;text:string;headers:Record<string,string>}>}>();
async function publicGet(path:string){
 const url=new URL(path,officialOrigin);if(url.origin!==officialOrigin||!url.pathname.startsWith("/")||url.pathname.startsWith("/admin")||url.pathname.startsWith("/api/"))throw Error("PUBLIC_URL_REQUIRED");
 const key=url.toString();const existing=cache.get(key);if(existing&&existing.expires>Date.now())return existing.promise;
 const promise=(async()=>{const response=await fetch(key,{cache:"no-store",redirect:"manual",signal:AbortSignal.timeout(20000),headers:{"User-Agent":"LusaillEditorialSEO/1.0"}});const text=(await response.text()).slice(0,2000000);return {status:response.status,text,headers:{"content-type":response.headers.get("content-type")??"","x-robots-tag":response.headers.get("x-robots-tag")??""}};})();
 if(cache.size>80)cache.delete(cache.keys().next().value!);cache.set(key,{expires:Date.now()+60000,promise});return promise;
}
async function imageStatus(src:string){const url=new URL(src,officialOrigin);if(url.origin!==officialOrigin||!/^\/(?:_next\/image|images\/)/.test(url.pathname))return {url:url.toString(),status:0,external:true};const response=await fetch(url,{method:"HEAD",redirect:"manual",cache:"no-store",signal:AbortSignal.timeout(12000)});return {url:url.toString(),status:response.status,external:false};}
const locs=(xml:string)=>[...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map(m=>decode(m[1]));
const normalized=(value:string)=>decodeURIComponent(new URL(value,officialOrigin).pathname).replace(/\/$/,"")||"/";
export async function auditArticle(target:SeoTarget,doc:CmsDocument){
 const checkedAt=new Date().toISOString(),url=new URL(target.path,officialOrigin).toString();
 if(!target.live)return {checkedAt,mode:"draft",url,...inspectDraft(doc)};
 try{
 const [page,sitemap]=await Promise.all([publicGet(target.path),publicGet("/sitemap-articles.xml")]);
 const result=inspectHtml(page.text,url,page.status,page.headers);const checks:SeoCheck[]=[...result.checks];if(doc.status!=="published")checks.push({id:"draft-snapshot",title:"يوجد محتوى تحرير خاص بجانب النسخة العامة",status:"manual",detail:"هذا التقرير يفحص الصفحة المنشورة؛ لا يعتمد محتوى المسودة الخاصة أو المراجعات قيد العمل.",tasks:[]});
 checks.push({id:"sitemap-member",title:"وجود المقال في خريطة المقالات",status:sitemap.status===200&&locs(sitemap.text).some(loc=>normalized(loc)===normalized(url))?"pass":"fail",detail:`sitemap-articles.xml: HTTP ${sitemap.status}`,tasks:["SEO-088"]});
 const facts=result.facts as Record<string,unknown>;const links=(facts.internalLinks??[]) as string[];
 // Only public same-site article-body links; external references remain an explicit human task.
 const urls=[...new Set(links.map(h=>{const u=new URL(h,url);u.hash="";return u.pathname+u.search;}))].filter(p=>!p.startsWith("/admin")&&!p.startsWith("/api/"));
 const checkedLinks: {path:string;status:number;error?:string}[]=[];
 for(let i=0;i<urls.length;i+=5)checkedLinks.push(...await Promise.all(urls.slice(i,i+5).map(async path=>{try{const r=await publicGet(path);return {path,status:r.status};}catch(error){return {path,status:0,error:error instanceof Error?error.message:"Request failed"};}})));
 if(checkedLinks.length)checks.push({id:"link-status",title:"استجابة الروابط الداخلية في المحتوى",status:checkedLinks.every(l=>l.status===200)?"pass":"fail",detail:`${checkedLinks.length} رابط؛ ${checkedLinks.filter(l=>l.status!==200).length} يحتاج فحصًا. لم تُفحص المراجع الخارجية أو الوجهات داخل الصفحة.`,tasks:["SEO-082","SEO-085"]});
 const images=(facts.images??[]) as {src:string;alt:string;width:string;height:string}[];
 const checkedImages=await Promise.all(images.slice(0,30).map(async image=>{try{return await imageStatus(image.src);}catch{return {url:image.src,status:0,external:false};}}));
 if(images.length)checks.push({id:"image-status",title:"استجابة صور المحتوى المحلية",status:checkedImages.every(i=>i.external||i.status===200)?"pass":"fail",detail:`فُحصت ${checkedImages.filter(i=>!i.external).length} صور محلية؛ الخارجية والملاءمة وحقوق الاستخدام مراجعة منفصلة.`,tasks:["SEO-071"]});
 return {checkedAt,mode:"live",url,checks,facts:{...facts,htmlHash:createHash("sha256").update(page.text).digest("hex"),checkedLinks,checkedImages,externalLinksChecked:false,browserRenderingChecked:false,coreWebVitalsMeasured:false}};
 }catch(error){return {checkedAt,mode:"live",url,checks:[{id:"request",title:"تعذر إكمال طلب الفحص",status:"error" as const,detail:error instanceof Error?error.message:"Request failed",tasks:["SEO-084"]}],facts:{requestFailed:true}};}
}
export async function auditSite(){
 const checkedAt=new Date().toISOString();const paths=["/","/articles","/categories","/robots.txt","/sitemap.xml","/sitemap-articles.xml"];const pages=await Promise.all(paths.map(async path=>{try{return {path,...await publicGet(path)};}catch(error){return {path,status:0,text:"",headers:{},error:error instanceof Error?error.message:"Request failed"};}}));
 const checks:SeoCheck[]=pages.map(p=>({id:`request-${p.path}`,title:`إتاحة ${p.path}`,status:p.status===200?"pass":"fail",detail:`HTTP ${p.status}`,...("error"in p?{detail:p.error}:{}),tasks:[]}));
 const map=new Map(pages.map(p=>[p.path,p]));const xml=map.get("/sitemap-articles.xml")!.text;const urls=locs(xml);
 const valid=urls.every(url=>{try{const u=new URL(url);return u.origin===officialOrigin&&u.pathname.startsWith("/articles/")&&!u.search&&!u.hash;}catch{return false;}});
 checks.push({id:"sitemap-urls",title:"روابط خريطة المقالات الأساسية",status:urls.length>0&&valid&&new Set(urls).size===urls.length?"pass":"fail",detail:`${urls.length} رابط؛ هذا فحص صياغة وتكرار وليس اختبار HTTP لكل وجهة. نتائج زحف كل مقال محفوظة منفصلة.`,tasks:["SEO-097","SEO-103","SEO-171","SEO-172"]});
 const robots=map.get("/robots.txt")!.text;checks.push({id:"robots",title:"إتاحة robots وإعلانه للخريطة",status:robots.includes(`Sitemap: ${officialOrigin}/sitemap.xml`)?"pass":"fail",detail:"تُراجع صلاحية كل قاعدة زحف وتفاعلها مع قواعد Allow بصورة منفصلة.",tasks:["SEO-101"]});
 const links=(path:string)=>[...map.get(path)!.text.matchAll(/<a\b[^>]*>/gi)].map(m=>attr(m[0],"href")).filter(h=>h.startsWith("/")&&!h.startsWith("//"));
 const homeLinks=links("/"),directoryLinks=links("/articles");const shallow=homeLinks.includes("/articles")?urls.filter(url=>directoryLinks.some(h=>normalized(h)===normalized(url))):[];
 checks.push({id:"depth",title:"وصول المقالات من الرئيسية خلال نقرتين",status:urls.length>0&&shallow.length===urls.length?"pass":"warning",detail:`${shallow.length} من ${urls.length} روابط الخريطة مثبتة عبر الرئيسية ← فهرس المقالات ← المقال؛ الباقي يحتاج تتبع مسارات أخرى.`,tasks:["SEO-159","SEO-160","SEO-161"]});
 checks.push({id:"manual",title:"القياسات والتكاملات الخارجية",status:"manual",detail:"لم يتحقق هذا الفحص من ملكية Search Console أو Bing أو استقبال GA4 للأحداث أو فهرسة Google الفعلية أو الروابط الخلفية أو CWV الميدانية. لا تُغلق مهامها دون أدلة من حساباتها.",tasks:[]});
 return {checkedAt,mode:"site",url:officialOrigin,checks,facts:{articleSitemapUrls:urls,verifiedTwoClickPaths:shallow,entryLinks:{"/":homeLinks,"/articles":directoryLinks},requests:pages.map(p=>({path:p.path,status:p.status})),searchConsoleChecked:false,ga4Checked:false,coreWebVitalsMeasured:false}};
}
