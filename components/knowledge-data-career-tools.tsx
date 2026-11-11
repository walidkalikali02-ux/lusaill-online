"use client";
import { useState } from "react";

const sectionStyle={padding:22,background:"#f6fafb",border:"1px solid #cadae4",borderRadius:16,marginBlock:28} as const;
const textBox={width:"100%",padding:"10px 12px",border:"1px solid #93a7b7",borderRadius:9,background:"#fff"} as const;
const shades=["#0e907d","#4285c5","#efac37","#9971c1","#da728c","#6b8c54"];
type Slice={label:string,value:number};
function sectorPath(start:number,sweep:number):string{
 const rad=(degrees:number)=>degrees*Math.PI/180;
 const x=(degrees:number)=>120+106*Math.cos(rad(degrees-90));
 const y=(degrees:number)=>120+106*Math.sin(rad(degrees-90));
 const end=start+sweep;
 const large=sweep>180?1:0;
 return "M120 120 L"+x(start).toFixed(4)+" "+y(start).toFixed(4)+" A106 106 0 "+large+" 1 "+x(end).toFixed(4)+" "+y(end).toFixed(4)+" Z";
}
export function PieAngleCalculator(){
 const [items,setItems]=useState<Slice[]>([
 {label:"العلوم",value:20},{label:"الأدب",value:15},{label:"التاريخ",value:10},{label:"الفنون",value:5}
 ]);
 const values=items.map(s=>({label:s.label.trim(),value:Number.isFinite(s.value)?Math.max(0,s.value):0}));
 const sum=values.reduce((a,s)=>a+s.value,0);
 const segments=values.map((v,i)=>{
  const start=sum>0?values.slice(0,i).reduce((acc,prior)=>acc+prior.value,0)/sum*360:0;
  const sweep=sum>0?v.value/sum*360:0;
  return {...v,start,sweep,color:shades[i%shades.length]};
 });
 const nonzero=segments.filter(s=>s.value>0);
 const setValue=(i:number,k:keyof Slice,v:string)=>setItems(a=>a.map((s,j)=>j===i?{...s,[k]:k==="label"?v:Math.max(0,Math.min(1000000,Number(v)||0))}:s));
 return <section id="interactive-tool" aria-labelledby="pie-calc-heading" style={sectionStyle}>
  <h2 id="pie-calc-heading" style={{fontSize:25,fontWeight:750,marginBottom:8}}>حاسبة الدائرة النسبية وزوايا القطاعات</h2>
  <p>أدخل فئات من إجمالي واحد. تحسب الأداة النسب والزوايا تلقائيًا وترسم القطاعات. المثال الابتدائي افتراضي لتعلم الحساب ولا يمثل بيانات مكتبة حقيقية.</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:18,marginTop:18}}>
   <div style={{display:"grid",gap:10}}>
   {items.map((item,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"1fr 110px auto",alignItems:"end",gap:8}}>
    <label style={{display:"grid",gap:5,fontSize:14}}>الفئة {i+1}
     <input style={textBox} value={item.label} maxLength={45} onChange={e=>setValue(i,"label",e.target.value)}/>
    </label>
    <label style={{display:"grid",gap:5,fontSize:14}}>القيمة
     <input style={textBox} type="number" min={0} max={1000000} step="any" value={item.value} onChange={e=>setValue(i,"value",e.target.value)}/>
    </label>
    <button type="button" disabled={items.length<=1} onClick={()=>setItems(a=>a.filter((_,j)=>j!==i))} style={{padding:10,borderRadius:9,border:"1px solid #dfb2ad",background:"#fff",opacity:items.length<=1?.45:1}} aria-label={"حذف الفئة "+(i+1)}>حذف</button>
   </div>)}
   <button type="button" disabled={items.length>=6} onClick={()=>setItems(a=>a.length>=6?a:[...a,{label:"فئة "+(a.length+1),value:0}])} style={{padding:10,borderRadius:9,border:"1px solid #8dbfba",background:"#dcf3ec",opacity:items.length>=6?.5:1}}>إضافة فئة (حتى 6)</button>
   <button type="button" onClick={()=>setItems([{label:"العلوم",value:20},{label:"الأدب",value:15},{label:"التاريخ",value:10},{label:"الفنون",value:5}])} style={{padding:9,borderRadius:9,border:"1px solid #a9b7c4",background:"#fff"}}>استعادة المثال</button>
   <p style={{color:"#475569",fontWeight:700}}>مجموع القيم: {Number(sum.toFixed(4)).toLocaleString("ar")}</p>
   </div>
   <div style={{display:"grid",justifyItems:"center",gap:8}}>
   {sum<=0?<p role="status" style={{padding:22,borderRadius:10,background:"#fff3ea",color:"#8a3c16"}}>لا يمكن رسم القطاعات: مجموع الفئات صفر. أدخل قيمة موجبة واحدة على الأقل.</p>:
   <svg viewBox="0 0 240 240" width="100%" style={{maxWidth:330,height:"auto"}} role="img" aria-label={"الدائرة النسبية لقيمك، المجموع "+sum}>
   {nonzero.length===1?<circle cx="120" cy="120" r="106" fill={nonzero[0].color}/>:
   nonzero.map((seg,i)=><path key={i} d={sectorPath(seg.start,seg.sweep)} fill={seg.color} stroke="#fff" strokeWidth="1.5"><title>{seg.label||"فئة بلا اسم"} — {(seg.sweep/3.6).toFixed(1)}%</title></path>)}
   <circle cx="120" cy="120" r="106" fill="none" stroke="#294053" strokeWidth="1.5"/>
   </svg>}
   <p style={{color:"#475569",fontSize:14,textAlign:"center"}}>تُظهر الدائرة حصصًا من إجمالي واحد؛ الألوان للتمييز وليست لقياس شدة الظاهرة.</p>
   </div>
  </div>
  {sum>0?<div style={{overflowX:"auto",border:"1px solid #d5e2eb",borderRadius:10,background:"white",marginTop:15}}>
   <table style={{width:"100%",borderCollapse:"collapse",textAlign:"start",minWidth:430}}>
    <caption style={{padding:10,fontWeight:700}}>نتائج الحساب من القيم غير المقربة</caption>
    <thead><tr style={{background:"#e8f1f5"}}>{["الفئة","القيمة","النسبة المئوية","الزاوية بالدرجات"].map(a=><th scope="col" key={a} style={{padding:10}}>{a}</th>)}</tr></thead>
    <tbody>{segments.map((s,i)=><tr key={i} style={{borderTop:"1px solid #e2e8f0"}}><th scope="row" style={{padding:10}}><span style={{display:"inline-block",width:12,height:12,background:s.color,marginInlineEnd:8,borderRadius:3}}/>{s.label||"بدون اسم"}</th><td style={{padding:10}}>{s.value}</td><td style={{padding:10}}>{(s.sweep/3.6).toFixed(2)}%</td><td style={{padding:10}}>{s.sweep.toFixed(2)}°</td></tr>)}</tbody>
    <tfoot><tr style={{borderTop:"2px solid #cbd5e1",fontWeight:800}}><td style={{padding:10}}>المجموع</td><td style={{padding:10}}>{sum}</td><td style={{padding:10}}>100% قبل التقريب</td><td style={{padding:10}}>360° قبل التقريب</td></tr></tfoot>
   </table></div>:null}
  <p style={{color:"#526575",fontSize:13,marginTop:12}}>قد تختلف مجاميع النسب والزوايا المعروضة إلى منزلتين عشريتين قليلًا عن 100% و360° بسبب التقريب، مع بقاء حساب القطاعات دقيقًا داخليًا.</p>
 </section>;
}

type JobStatus="لم أقدّم بعد"|"تم التقديم"|"تم التواصل"|"مقابلة"|"عرض"|"اعتذار";
type JobRow={company:string,role:string,appliedOn:string,status:JobStatus,notes:string};
const statuses:JobStatus[]=["لم أقدّم بعد","تم التقديم","تم التواصل","مقابلة","عرض","اعتذار"];
export function JobApplicationTracker(){
 const [rows,setRows]=useState<JobRow[]>([{company:"",role:"",appliedOn:"",status:"لم أقدّم بعد",notes:""}]);
 const update=(index:number,key:keyof JobRow,value:string)=>{
  setRows(data=>data.map((r,i)=>i===index?{...r,[key]:value}:r));
 };
 const filled=rows.filter(r=>r.company.trim()&&r.role.trim());
 const exportCSV=()=>{
  const cols=["الشركة","المسمى الوظيفي","تاريخ التقديم","الحالة","ملاحظات"];
  const records=[cols,...filled.map(r=>[r.company,r.role,r.appliedOn,r.status,r.notes])];
  const csv="\uFEFF"+records.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\r\n");
  const uri=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
  const link=document.createElement("a");link.href=uri;link.download="lusaill-job-applications.csv";document.body.appendChild(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(uri),1000);
 };
 return <section id="interactive-tool" aria-labelledby="job-tracker-title" style={sectionStyle}>
  <h2 id="job-tracker-title" style={{fontSize:25,fontWeight:750,marginBottom:8}}>متعقب طلبات التوظيف — مع تصدير CSV</h2>
  <p>سجّل الشركات التي تريد التقديم إليها أو تقدمت لها فعلًا. هذا جدول على جهازك فقط؛ لا يُرسل البيانات إلى خوادم لوسيل ولا يحفظها بعد تحديث الصفحة. استخدم التصدير للاحتفاظ بنسختك.</p>
  <div style={{display:"grid",gap:15,marginTop:16}}>
  {rows.map((r,i)=><fieldset key={i} style={{border:"1px solid #cbd5e1",borderRadius:12,padding:14,background:"#fff"}}>
   <legend style={{paddingInline:5,fontWeight:750}}>الطلب {i+1}</legend>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:11}}>
    <label style={{display:"grid",gap:6,fontSize:14}}>اسم الشركة<input style={textBox} maxLength={120} placeholder="الشركة أو الجهة" value={r.company} onChange={e=>update(i,"company",e.target.value)}/></label>
    <label style={{display:"grid",gap:6,fontSize:14}}>المسمى الوظيفي<input style={textBox} maxLength={130} placeholder="المسمى في الإعلان" value={r.role} onChange={e=>update(i,"role",e.target.value)}/></label>
    <label style={{display:"grid",gap:6,fontSize:14}}>تاريخ التقديم<input style={textBox} type="date" value={r.appliedOn} onChange={e=>update(i,"appliedOn",e.target.value)}/></label>
    <label style={{display:"grid",gap:6,fontSize:14}}>الحالة<select style={textBox} value={r.status} onChange={e=>update(i,"status",e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
   </div>
   <label style={{display:"grid",gap:6,marginTop:11,fontSize:14}}>ملاحظات غير حساسة<textarea style={textBox} rows={2} maxLength={400} placeholder="رابط الإعلان، موعد المتابعة أو أبرز المتطلبات" value={r.notes} onChange={e=>update(i,"notes",e.target.value)}/></label>
   {rows.length>1&&<button type="button" onClick={()=>setRows(v=>v.filter((_,j)=>j!==i))} style={{padding:8,marginTop:10,border:"1px solid #d8b3b3",borderRadius:8,background:"#fff6f6"}}>حذف الطلب</button>}
  </fieldset>)}
  </div>
  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
   <button type="button" disabled={rows.length>=15} onClick={()=>setRows(v=>[...v,{company:"",role:"",appliedOn:"",status:"لم أقدّم بعد",notes:""}])} style={{padding:"10px 14px",border:"1px solid #8fbaac",background:"#d8f1e8",borderRadius:10,opacity:rows.length>=15?.45:1}}>إضافة طلب جديد</button>
   <button type="button" disabled={!filled.length} onClick={exportCSV} style={{padding:"10px 14px",border:"1px solid #819cb5",background:"#e1edf9",borderRadius:10,opacity:filled.length?1:.5}}>تصدير {filled.length} طلب إلى CSV</button>
  </div>
  <output aria-live="polite" style={{display:"block",marginTop:12,fontWeight:700}}>عدد الطلبات المكتملة البيانات: {filled.length}</output>
  <p style={{color:"#526575",fontSize:13,marginTop:8}}>لا تُدخل أرقام هوية أو حسابات مصرفية أو معلومات سرية هنا. تصدير CSV ينشئ ملفًا على جهازك فقط، وليس طلب توظيف مقدمًا إلى أي جهة.</p>
 </section>;
}
