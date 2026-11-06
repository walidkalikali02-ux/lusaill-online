"use client";
import { useState } from "react";

const reportTypes=[
 {label:"تقرير متابعة إداري",sections:["الغرض والنطاق","ملخص الأداء","المنجزات بالأدلة","عوائق وحدود","خطوات تالية ومسؤوليات"],example:"متابعة إنجازات مشروع خلال شهر"},
 {label:"تقرير بحثي أكاديمي",sections:["المقدمة والسؤال","مراجعة الأدبيات عند الحاجة","المنهج والبيانات","النتائج","المناقشة والقيود","الاستنتاج والمراجع"],example:"دراسة تجريبية أو مسح ميداني"},
 {label:"تقرير فني",sections:["وصف المشكلة والنطاق","معايير الفحص والمعدات","القياسات الخام","التحليل والقيود","استنتاجات وتوصيات","مراجع وملاحق"],example:"اختبار أداء جهاز أو نظام"}
];
export function ReportOutlineBuilder(){
const [which,setWhich]=useState(0);
const [purpose,setPurpose]=useState("تقييم أسباب تأخر التسليم في شهر أكتوبر");
const [audience,setAudience]=useState("مدير العمليات");
return <section id="interactive-tool" aria-labelledby="report-tool-title" style={{marginBlock:28,padding:23,border:"1px solid #cbd5e1",background:"#f8fafc",borderRadius:16}}>
<h2 id="report-tool-title" style={{fontSize:24,fontWeight:750,marginBottom:9}}>مولّد هيكل تقرير قابل للتعديل</h2>
<p>يجهّز مخططًا للأقسام بحسب نوع التقرير. لا ينشئ بيانات أو توصيات افتراضية تدّعي أنها حقيقية.</p>
<div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",marginTop:16}}>
<label style={{display:"grid",gap:6}}>نوع التقرير<select value={which} onChange={e=>setWhich(Number(e.target.value))} style={{padding:11,borderRadius:9,border:"1px solid #94a3b8"}}>{reportTypes.map((r,i)=><option key={r.label} value={i}>{r.label}</option>)}</select></label>
<label style={{display:"grid",gap:6}}>لمن تكتب التقرير؟<input value={audience} onChange={e=>setAudience(e.target.value)} maxLength={90} style={{padding:11,borderRadius:9,border:"1px solid #94a3b8"}}/></label>
<label style={{display:"grid",gap:6}}>الغرض المحدد<input value={purpose} onChange={e=>setPurpose(e.target.value)} maxLength={180} style={{padding:11,borderRadius:9,border:"1px solid #94a3b8"}}/></label>
</div>
<output aria-live="polite" style={{display:"block",background:"white",padding:17,borderRadius:11,marginTop:16}}>
<strong style={{fontSize:17}}>{reportTypes[which].label}</strong>
<p><strong>المتلقي:</strong> {audience||"حدّد الجمهور"}</p><p><strong>الهدف:</strong> {purpose||"حدد الغرض"}</p>
<ol style={{paddingInlineStart:23}}>{reportTypes[which].sections.map(section=><li key={section}>{section}: أضف البيانات والدليل أو القرار المرتبطين بهذا القسم.</li>)}</ol>
<p><strong>تذكير:</strong> اكتب الملخص بعد اكتمال النتائج، وافصل الملاحظة عن تفسيرها.</p>
</output>
</section>;
}
export function MindMapBuilder(){
const [center,setCenter]=useState("دورة الماء");
const [branches,setBranches]=useState(["التبخر","التكاثف","الهطول","الجريان"]);
return <section id="interactive-tool" aria-labelledby="mind-tool-title" style={{marginBlock:28,padding:23,border:"1px solid #cbd5e1",background:"#f8fafc",borderRadius:16}}>
<h2 id="mind-tool-title" style={{fontSize:24,fontWeight:750,marginBottom:9}}>أنشئ خريطة مذاكرة بسيطة</h2>
<p>اكتب فكرة مركزية وأربعة فروع؛ ثم استخدم الناتج لتوليد أسئلة من الذاكرة. هذا نموذج للتنظيم وليس اختبارًا علميًا للحفظ.</p>
<label style={{display:"grid",gap:6,marginTop:13}}>الموضوع الرئيسي<input value={center} onChange={e=>setCenter(e.target.value)} maxLength={90} style={{padding:11,border:"1px solid #94a3b8",borderRadius:9}}/></label>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginTop:14}}>
{branches.map((s,i)=><label key={i} style={{display:"grid",gap:6}}>الفرع {i+1}<input value={s} onChange={e=>setBranches(a=>a.map((x,k)=>k===i?e.target.value:x))} maxLength={80} style={{padding:10,border:"1px solid #94a3b8",borderRadius:9}}/></label>)}
</div>
<div aria-label="خريطة مذاكرة نصية" style={{background:"white",borderRadius:14,padding:18,marginTop:17}}>
<div style={{margin:"auto",maxWidth:310,textAlign:"center",padding:17,border:"2px solid #0d9488",borderRadius:14,background:"#ecfdf5",fontWeight:800,wordBreak:"break-word"}}>{center||"الفكرة المركزية"}</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:9,marginTop:21}}>
{branches.filter(Boolean).map((s,i)=><div key={i} style={{border:"1px solid #b6c9d7",background:i%2?"#eef2ff":"#eaf5f5",borderRadius:10,padding:12,textAlign:"center",wordBreak:"break-word"}}>{s}</div>)}
</div>
<output aria-live="polite" style={{display:"block",marginTop:17,fontSize:14}}>
<strong>أسئلة للاسترجاع:</strong> {branches.filter(Boolean).map(s=>"اشرح "+s+" وعلاقته بـ"+(center||"الموضوع")+"؟").join(" | ")}
</output></div>
<p style={{fontSize:13,color:"#475569",marginTop:12}}>جرّب إعادة كتابة الخريطة دون النظر إليها، ثم قارنها بالمصدر وصحّح ما نسيته.</p>
</section>;
}
