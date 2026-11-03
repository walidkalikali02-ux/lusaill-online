import {inflateRawSync} from "node:zlib";
import {createRequire} from "node:module";
import {posix} from "node:path";
import {importUrlText} from "./import";

type XmlElement={tagName:string;textContent:string;getAttribute(name:string):string|undefined;querySelectorAll(selector:string):XmlElement[]};
const {parse}=createRequire(import.meta.url)("next/dist/compiled/node-html-parser") as {parse:(xml:string,options?:unknown)=>XmlElement};
const MAX_FILE=2_000_000,MAX_INFLATED=8_000_000;
function crc32(buffer:Buffer){let crc=0xffffffff;for(const byte of buffer){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
function xml(buffer:Buffer){const text=buffer.toString("utf8");if(/<!DOCTYPE|<!ENTITY/i.test(text))throw Error("تعريفات الكيانات وDTD غير مسموحة في ملف Excel");return parse(text,{comment:false});}
function members(buffer:Buffer){
 if(buffer.length>MAX_FILE||buffer.length<22)throw Error("ملف Excel غير صالح أو يتجاوز 2 ميجابايت");
 let end=-1;for(let i=buffer.length-22;i>=Math.max(0,buffer.length-65557);i--){if(buffer.readUInt32LE(i)===0x06054b50&&i+22+buffer.readUInt16LE(i+20)===buffer.length){end=i;break;}}
 if(end<0)throw Error("بنية ZIP لملف Excel غير صالحة");
 const entries=buffer.readUInt16LE(end+10),size=buffer.readUInt32LE(end+12),offset=buffer.readUInt32LE(end+16);
 if(buffer.readUInt16LE(end+4)||buffer.readUInt16LE(end+6)||buffer.readUInt16LE(end+8)!==entries||entries===0||entries>200||offset+size!==end)throw Error("أرشيف Excel متعدد الأقراص أو كبير أو غير مدعوم");
 const files=new Map<string,Buffer>();const ranges:{start:number;end:number}[]=[];let cursor=offset,total=0;
 for(let i=0;i<entries;i++){
  if(cursor+46>end||buffer.readUInt32LE(cursor)!==0x02014b50)throw Error("فهرس ZIP تالف");
  const flags=buffer.readUInt16LE(cursor+8),method=buffer.readUInt16LE(cursor+10),crc=buffer.readUInt32LE(cursor+16),compressed=buffer.readUInt32LE(cursor+20),inflated=buffer.readUInt32LE(cursor+24),nameLength=buffer.readUInt16LE(cursor+28),extra=buffer.readUInt16LE(cursor+30),comment=buffer.readUInt16LE(cursor+32),disk=buffer.readUInt16LE(cursor+34),local=buffer.readUInt32LE(cursor+42);
  if(cursor+46+nameLength+extra+comment>end||disk||flags&~0x080e||![0,8].includes(method)||compressed===0xffffffff||inflated===0xffffffff||local===0xffffffff)throw Error("خصائص ZIP مشفرة أو غير مدعومة");
  const name=buffer.subarray(cursor+46,cursor+46+nameLength).toString("utf8");cursor+=46+nameLength+extra+comment;
  if(!name||name.includes("\\")||name.includes("\0")||name.startsWith("/")||name.split("/").includes("..")||name.includes("�")||files.has(name))throw Error("اسم ملف داخل Excel غير آمن أو مكرر");
  if(/(?:^|\/)(?:externalLinks|vbaProject)(?:\/|\.)|\.bin$/i.test(name))throw Error("ملفات الماكرو أو الارتباطات الخارجية غير مدعومة");
  total+=inflated;if(total>MAX_INFLATED)throw Error("حجم Excel بعد فك الضغط يتجاوز 8 ميجابايت");
  if(local+30>offset||buffer.readUInt32LE(local)!==0x04034b50||buffer.readUInt16LE(local+6)!==flags||buffer.readUInt16LE(local+8)!==method)throw Error("رأس ZIP المحلي غير متسق");
  const localNameLength=buffer.readUInt16LE(local+26),localExtra=buffer.readUInt16LE(local+28),start=local+30+localNameLength+localExtra,finish=start+compressed;
  if(finish>offset||buffer.subarray(local+30,local+30+localNameLength).toString("utf8")!==name||ranges.some(range=>local<range.end&&finish>range.start))throw Error("حدود ZIP غير متسقة");ranges.push({start:local,end:finish});
  let data:Buffer;try{data=method===0?buffer.subarray(start,finish):inflateRawSync(buffer.subarray(start,finish),{maxOutputLength:Math.min(MAX_INFLATED,inflated+1)});}catch{throw Error("تعذر فك ضغط Excel بأمان");}
  if(data.length!==inflated||crc32(data)!==crc)throw Error("بيانات Excel لا تطابق الحجم أو التحقق المسجل");
  files.set(name,data);
 }
 if(cursor!==end)throw Error("فهرس ZIP يحتوي بيانات غير متوقعة");
 for(const [name,data] of files){if(/\.(?:xml|rels)$/i.test(name)){const root=xml(data);if(/\.rels$/i.test(name)&&root.querySelectorAll("relationship").some(el=>el.getAttribute("TargetMode")?.toLowerCase()==="external"||/^(?:[a-z]+:|\/\/)/i.test(el.getAttribute("Target")??"")))throw Error("العلاقات الخارجية غير مسموحة؛ صدّر الروابط كنصوص إلى CSV");}}
 return files;
}
/** Narrow OOXML importer: first sheet only, bounded archive, no macros, formulas or external relationships. */
export function importXlsx(buffer:Buffer):{urls:string[];errors:string[]} {
 const files=members(buffer),workbook=files.get("xl/workbook.xml"),relations=files.get("xl/_rels/workbook.xml.rels");
 if(!workbook||!relations||!files.has("[Content_Types].xml"))throw Error("يلزم ملف XLSX قياسي يحتوي مصنفًا واحدًا");
 const sheet=xml(workbook).querySelectorAll("sheet")[0];const relationId=sheet?.getAttribute("r:id");
 const relation=xml(relations).querySelectorAll("relationship").find(el=>el.getAttribute("Id")===relationId);
 if(!relation||!(relation.getAttribute("Type")??"").endsWith("/worksheet"))throw Error("تعذر تحديد ورقة العمل الأولى");
 const target=relation.getAttribute("Target")??"";const sheetPath=target.startsWith("/")?posix.normalize(target.slice(1)):posix.normalize(posix.join("xl",target));
 if(!sheetPath.startsWith("xl/")||!files.has(sheetPath))throw Error("مسار ورقة العمل غير صالح");
 const shared=files.has("xl/sharedStrings.xml")?xml(files.get("xl/sharedStrings.xml")!).querySelectorAll("si").map(el=>el.querySelectorAll("t").map(t=>t.textContent).join("")):[];
 const sheetRoot=xml(files.get(sheetPath)!);const cells=sheetRoot.querySelectorAll("c");if(cells.length>20_000)throw Error("ورقة Excel تتجاوز 20000 خلية");
 const values:string[]=[];let formulas=0;
 for(const cell of cells){if(cell.querySelectorAll("f").length){formulas++;continue;}const type=cell.getAttribute("t");let value="";
  if(type==="s"){const index=Number(cell.querySelectorAll("v")[0]?.textContent);if(Number.isInteger(index)&&index>=0)value=shared[index]??"";}
  else if(type==="inlineStr")value=cell.querySelectorAll("t").map(el=>el.textContent).join("");
  else if(type==="str")value=cell.querySelectorAll("v")[0]?.textContent??"";
  if(value.trim().startsWith("https://")||value.trim().startsWith("http://"))values.push(value.trim());
 }
 for(const link of sheetRoot.querySelectorAll("hyperlink")){const location=link.getAttribute("location")??"";if(/^https?:\/\//.test(location))values.push(location);}
 const result=importUrlText(values.join("\n"));if(formulas)result.errors.push(`تم تجاهل ${formulas} خلية تحتوي صيغًا؛ الصيغ لا تُنفذ ولا تُستورد قيمها المؤقتة`);return result;
}
