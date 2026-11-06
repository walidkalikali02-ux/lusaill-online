"use client";
import { useState } from "react";

const boxStyle={padding:22,background:"#f6fafc",border:"1px solid #d2e2ea",borderRadius:15,marginBlock:28} as const;
const inputStyle={padding:11,border:"1px solid #9cadba",borderRadius:9,width:"100%",background:"white"} as const;
export function ReportOutlineBuilder(){
 const [type,setType]=useState("دراسي");
 const [subject,setSubject]=useState("متابعة استهلاك الورق في فصل دراسي");
 const [purpose,setPurpose]=useState("توضيح ما حدث وما يمكن تحسينه");
 const types: Record<string,string[]> = {
  "دراسي":["المقدمة والهدف","المصادر أو طريقة جمع المعلومات","النتائج","المناقشة","الخاتمة والمراجع"],
  "إداري":["الملخص التنفيذي","الهدف والفترة","المؤشرات والنتائج","المعوقات والقيود","التوصيات والمسؤوليات"],
  "بحثي":["ملخص","مقدمة وسؤال البحث","المنهج والعينة","النتائج","المناقشة والقيود","الاستنتاج والمراجع"],
  "فني":["نطاق الفحص","الأجهزة والخطوات","القياسات مع الوحدات","النتائج","القيود والتوصيات"]
 };
 return <section id="interactive-tool" aria-labelledby="report-builder-heading" style={boxStyle}>
  <h2 id="report-builder-heading" style={{fontSize:24,fontWeight:750}}>مولّد مخطط تقرير قابل للتعديل</h2>
  <p>هذه أداة تنظيم محلية لا تجمع بياناتك ولا تكتب نتائج أو إحصاءات بالنيابة عنك. راجع الهيكل المطلوب لدى الجهة المستفيدة.</p>
  <div style={{display:"grid",gap:13,marginTop:16}}>
   <label style={{display:"grid",gap:6}}>نوع التقرير<select style={inputStyle} value={type} onChange={e=>setType(e.target.value)}>{Object.keys(types).map(t=><option key={t}>{t}</option>)}</select></label>
   <label style={{display:"grid",gap:6}}>عنوان التقرير<input style={inputStyle} maxLength={125} value={subject} onChange={e=>setSubject(e.target.value)}/></label>
   <label style={{display:"grid",gap:6}}>الغرض من التقرير<input style={inputStyle} maxLength={190} value={purpose} onChange={e=>setPurpose(e.target.value)}/></label>
  </div>
  <output aria-live="polite" style={{display:"block",padding:18,marginTop:16,background:"#fff",borderRadius:10}}>
   <strong>{subject||"عنوان التقرير"}</strong>
   <p><b>النوع:</b> {type} — <b>الغرض:</b> {purpose||"حدد الهدف"}</p>
   <ol style={{paddingInlineStart:25,lineHeight:2}}>{types[type].map(x=><li key={x}>{x}: أضف معلومات موثقة وشرحًا مناسبًا.</li>)}</ol>
   <p style={{color:"#475569",fontSize:13}}>اكتب الملخص التنفيذي بعد إتمام الأقسام. البيانات المثال لا تُنشر على أنها بيانات حقيقية.</p>
  </output>
 </section>;
}
export function MindMapBuilder(){
 const [center,setCenter]=useState("دورة الماء");
 const [nodes,setNodes]=useState(["التبخر","التكاثف","الهطول","التجمع"]);
 const [relation,setRelation]=useState("يرتبط بـ");
 const update=(i:number,value:string)=>setNodes(a=>a.map((v,k)=>i===k?value:v));
 const displayed=nodes.filter(x=>x.trim());
 return <section id="interactive-tool" aria-labelledby="mindmap-heading" style={boxStyle}>
 <h2 id="mindmap-heading" style={{fontSize:24,fontWeight:750}}>محرر خريطة ذهنية عربية مبسطة</h2>
 <p>اكتب فكرة مركزية وأربعة فروع. العلاقات المعروضة عبارات تعليمية عامة؛ أضف أنت العلاقات الدقيقة من كتابك. لا تُرسل الأداة بياناتك للخادم.</p>
 <div style={{display:"grid",gap:12,marginTop:16}}>
  <label style={{display:"grid",gap:6}}>المفهوم الرئيسي<input style={inputStyle} value={center} maxLength={70} onChange={e=>setCenter(e.target.value)}/></label>
  <label style={{display:"grid",gap:6}}>عبارة ربط عامة<input style={inputStyle} value={relation} maxLength={36} onChange={e=>setRelation(e.target.value)}/></label>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
  {nodes.map((v,i)=><label key={i} style={{display:"grid",gap:6}}>الفرع {i+1}<input style={inputStyle} value={v} maxLength={60} onChange={e=>update(i,e.target.value)}/></label>)}
  </div>
 </div>
 <div aria-label="معاينة الخريطة" style={{padding:20,background:"white",borderRadius:11,marginTop:16}}>
  <div style={{maxWidth:400,marginInline:"auto",textAlign:"center",background:"#d0f3e8",padding:16,borderRadius:12,fontWeight:800,wordBreak:"break-word"}}>{center||"الفكرة الرئيسية"}</div>
  <p style={{textAlign:"center",fontWeight:700,color:"#475569"}}>{relation||"يرتبط بـ"}</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10}}>{displayed.map((v,i)=><div key={i} style={{background:["#d9e9fc","#f9e9c9","#e4defa","#d8f0df"][i%4],padding:15,borderRadius:10,textAlign:"center",wordBreak:"break-word"}}>{v}</div>)}</div>
 </div>
 <p style={{color:"#475569",marginTop:12,fontSize:13}}>اختبر فهمك: أخفِ الخريطة، وأعد كتابة الفروع من الذاكرة، واشرح الرابط بين كل فرع والفكرة الأساسية.</p>
 </section>;
}
