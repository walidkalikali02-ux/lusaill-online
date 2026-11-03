import type {CmsDocument} from "../cms/model";
import type {SeoCheck} from "./model";
export const officialOrigin="https://www.lusaill.online";
export const decode=(text:string)=>text.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&lt;/g,"<").replace(/&gt;/g,">");
export const clean=(html:string)=>decode(html.replace(/<script\b[\s\S]*?<\/script>/gi,"").replace(/<style\b[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim();
export function attr(tag:string,name:string){const match=tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`,"i"));return decode(match?.[1]??match?.[2]??"");}
export function meta(html:string,name:string){return [...html.matchAll(/<meta\b[^>]*>/gi)].map(m=>m[0]).filter(tag=>attr(tag,"name").toLowerCase()===name.toLowerCase()).map(tag=>attr(tag,"content"));}
export function inspectHtml(html:string,url:string,status:number,headers:Record<string,string>={}){
 const checks:SeoCheck[]=[];const check=(id:string,title:string,passed:boolean,detail:string,tasks:string[],warning=false)=>checks.push({id,title,status:passed?"pass":warning?"warning":"fail",detail,tasks});
 const headings=(level:number)=>[...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`,"gi"))].map(m=>clean(m[1]));
 const title=clean(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]??"");const descriptions=meta(html,"description");const canonicals=[...html.matchAll(/<link\b[^>]*>/gi)].map(m=>m[0]).filter(tag=>attr(tag,"rel").split(/\s+/).includes("canonical")).map(tag=>attr(tag,"href"));
 const h1=headings(1),h2=headings(2);const robots=[...meta(html,"robots"),headers["x-robots-tag"]??""].join(",");const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]??"";const text=clean(main);
 const anchors=[...main.matchAll(/<a\b[^>]*>/gi)].map(m=>attr(m[0],"href")).filter(Boolean);const images=[...main.matchAll(/<img\b[^>]*>/gi)].map(m=>({src:attr(m[0],"src"),alt:attr(m[0],"alt"),width:attr(m[0],"width"),height:attr(m[0],"height")}));
 const schemaTypes=new Set<string>();let invalidSchema=0,schemaBlocks=0;
 const visit=(value:unknown)=>{if(Array.isArray(value)){value.forEach(visit);return;}if(value&&typeof value==="object"){const v=value as Record<string,unknown>;for(const type of Array.isArray(v["@type"])?v["@type"]:[v["@type"]])if(typeof type==="string")schemaTypes.add(type);if(v["@graph"])visit(v["@graph"]);}};
 for(const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){schemaBlocks++;try{visit(JSON.parse(match[1]));}catch{invalidSchema++;}}
 const normalized=(value:string)=>{try{const u=new URL(value,url);return decodeURIComponent(u.origin+u.pathname).replace(/\/$/,"");}catch{return "";}};
 check("http","إتاحة الصفحة دون تسجيل دخول",status===200,`HTTP ${status}؛ طلب عام دون ملفات تعريف ارتباط`,["SEO-084"]);
 if(status!==200)return {checks,facts:{status,url}};
 check("title","وجود عنوان SEO واحد",[...html.matchAll(/<title\b/gi)].length===1&&!!title,title,["SEO-058","SEO-214"]);
 check("title-length","طول عنوان البحث الإرشادي",title.length>=30&&title.length<=65,`${title.length} حرفًا؛ الطول إرشادي وليس شرط ترتيب`,["SEO-216"],true);
 check("description","وجود وصف تعريفي واحد",descriptions.length===1&&!!descriptions[0],descriptions[0]??"الوصف مفقود",["SEO-060","SEO-219"]);
 check("description-length","طول الوصف الإرشادي",(descriptions[0]?.length??0)>=140&&(descriptions[0]?.length??0)<=155,`${descriptions[0]?.length??0} حرفًا؛ نطاق الموقع 140–155`,["SEO-220"],true);
 check("canonical","رابط أساسي ذاتي واحد على www",canonicals.length===1&&normalized(canonicals[0])===normalized(url)&&canonicals[0].startsWith(officialOrigin+"/"),canonicals.join(" | ")||"مفقود",["SEO-062","SEO-083"]);
 check("indexable","عدم وجود noindex",!/(?:^|[,\s])(?:noindex|none)(?:$|[,\s])/i.test(robots),robots||"لا توجد تعليمات noindex في HTML أو ترويسة الاستجابة",["SEO-083"]);
 check("h1","عنوان H1 واحد",h1.length===1&&!!h1[0],`${h1.length}: ${h1.join(" | ")}`,["SEO-063","SEO-234"]);
 check("headings","وجود أقسام H2 وصفية",h2.length>0,`${h2.length} عنوان H2`,["SEO-065","SEO-236"]);
 check("initial-html","وجود نص المقال في HTML الأولي",text.length>=400,`${text.length} حرفًا في main قبل تشغيل JavaScript؛ لا يثبت اختبار المتصفح المعروض`,["SEO-027"]);
 check("schema","صياغة JSON-LD وArticle وBreadcrumbList",invalidSchema===0&&schemaTypes.has("Article")&&schemaTypes.has("BreadcrumbList"),`${schemaBlocks} كتلة؛ الأنواع ${[...schemaTypes].join(", ")}؛ ${invalidSchema} أخطاء صياغة. أهلية النتائج الغنية تحتاج تحققًا منفصلًا.`,["SEO-086","SEO-262","SEO-263"]);
 check("image-alt","نصوص بديلة للصور المعلوماتية",images.length>0&&images.every(i=>!!i.alt),`${images.length} صور؛ ${images.filter(i=>!i.alt).length} alt فارغ/مفقود؛ الملاءمة الدلالية مراجعة بشرية`,["SEO-073","SEO-256"],true);
 check("image-dimensions","أبعاد صريحة للصور",images.length>0&&images.every(i=>!!i.width&&!!i.height),`${images.filter(i=>!i.width||!i.height).length} صور بلا أبعاد صريحة`,["SEO-074","SEO-257"],true);
 const internal=anchors.filter(h=>h.startsWith("/")&&!h.startsWith("//")||h.startsWith(officialOrigin+"/"));
 check("internal-links","وجود روابط HTML داخلية",internal.length>0,`${new Set(internal).size} وجهة داخل main؛ صلة الروابط ونصوصها تحتاج مراجعة`,["SEO-077","SEO-079","SEO-251"]);
 check("mixed-content","عدم وجود موارد HTTP مختلطة",!/<(?:img|script|iframe|link)\b[^>]*(?:src|href)=["']http:\/\//i.test(html),"فحص src/href للموارد في HTML",["SEO-117"],true);
 checks.push({id:"human",title:"التحقق التحريري والبحث ومؤشرات الويب",status:"manual",detail:"لا يثبت هذا الفحص صحة الحقائق أو نية البحث أو الأصالة أو قياسات LCP/INP/CLS أو الفهرسة الفعلية. تبقى مهامها مفتوحة.",tasks:[]});
 return {checks,facts:{status,url,title,description:descriptions[0]??"",canonical:canonicals,h1,h2,robots,visibleCharacters:text.length,schemaTypes:[...schemaTypes],images,internalLinks:[...new Set(internal)].slice(0,80)}};
}
export function inspectDraft(doc:CmsDocument){const checks:SeoCheck[]=[];const add=(id:string,title:string,pass:boolean,detail:string,tasks:string[])=>checks.push({id,title,status:pass?"pass":"warning",detail,tasks});
 add("draft-title","عنوان المسودة",!!doc.title.trim(),doc.title,["SEO-020","SEO-058"]);add("draft-description","وصف المسودة",doc.description.length>=140&&doc.description.length<=155,`${doc.description.length} حرفًا`,["SEO-060"]);add("draft-answer","إجابة مباشرة",!!doc.answer.trim(),doc.answer.slice(0,240),["SEO-024","SEO-068"]);add("draft-sources","مصادر وتواريخ تحقق مسجلة",doc.sources.length>0&&doc.sources.every(s=>!!s.url&&!!s.checkedAt),`${doc.sources.length} مصادر؛ تسجيل التاريخ لا يثبت مراجعة المصدر`,["SEO-036"]);
 add("draft-body","وجود نص في المسودة",JSON.stringify(doc.body).length>200,"فحص البنية المحفوظة؛ لا يمثل عرض الصفحة العامة",["SEO-027"]);
 return {checks,facts:{title:doc.title,status:doc.status,publiclyTested:false}};
}
