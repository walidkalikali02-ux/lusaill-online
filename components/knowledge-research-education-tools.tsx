"use client";
import { useMemo, useState } from "react";

const panel={padding:22,background:"#f6fafb",border:"1px solid #c9dce3",borderRadius:16,marginBlock:28} as const;
const inputStyle={width:"100%",padding:11,borderRadius:9,background:"#fff",border:"1px solid #94a3b8"} as const;

type EvidenceRow={claim:string,source:string,basis:string,limitation:string};
export function ResearchEvidenceMatrix(){
 const [question,setQuestion]=useState("ما العوامل التي تؤثر في فرز الورق داخل فصل دراسي؟");
 const [entries,setEntries]=useState<EvidenceRow[]>([{claim:"",source:"",basis:"",limitation:""}]);
 const update=(i:number,key:keyof EvidenceRow,value:string)=>setEntries(prev=>prev.map((row,j)=>j===i?{...row,[key]:value}:row));
 const active=entries.filter(e=>e.claim.trim()&&e.source.trim());
 return <section id="interactive-tool" aria-labelledby="evidence-matrix-heading" style={panel}>
  <h2 id="evidence-matrix-heading" style={{fontSize:24,fontWeight:750,marginBottom:8}}>أداة مصفوفة الأدلة: من الادعاء إلى المصدر</h2>
  <p>دوّن السؤال، والادعاءات التي تحتاج فحصًا، والدليل وحدوده. الأداة لا تتصفح الروابط ولا تتحقق من صحتها آليًا؛ راجع المصدر بنفسك قبل الاستشهاد به.</p>
  <label style={{display:"grid",gap:7,marginTop:15}}>سؤال البحث
   <input style={inputStyle} maxLength={250} value={question} onChange={e=>setQuestion(e.target.value)}/>
  </label>
  <div style={{display:"grid",gap:14,marginTop:17}}>
   {entries.map((e,i)=><fieldset key={i} style={{padding:16,border:"1px solid #cbd5e1",borderRadius:11,background:"white"}}>
    <legend style={{paddingInline:6,fontWeight:750}}>الدليل {i+1}</legend>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:10}}>
      {[
       {key:"claim" as const,label:"الادعاء المراد فحصه",placeholder:"ما العبارة التي تريد التثبت منها؟"},
       {key:"source" as const,label:"اسم المصدر أو رابطه",placeholder:"اسم الجهة وتاريخ الاطلاع أو URL"},
       {key:"basis" as const,label:"الدليل المباشر",placeholder:"رقم الصفحة أو اسم الجدول أو ملخص النتيجة"},
       {key:"limitation" as const,label:"القيود أو الملاحظات",placeholder:"هل ينطبق على حالتك؟ ما حدود الدراسة؟"}
      ].map(item=><label key={item.key} style={{display:"grid",gap:5,fontSize:14}}>{item.label}
        <textarea rows={2} maxLength={500} placeholder={item.placeholder} style={inputStyle} value={e[item.key]} onChange={v=>update(i,item.key,v.target.value)}/>
       </label>)}
    </div>
    {entries.length>1&&<button type="button" onClick={()=>setEntries(x=>x.filter((_,j)=>j!==i))} style={{padding:"8px 11px",marginTop:10,borderRadius:8,border:"1px solid #e8b0b0",background:"#fff5f5"}}>حذف هذا الصف</button>}
   </fieldset>)}
  </div>
  <button type="button" onClick={()=>setEntries(x=>x.length>=8?x:[...x,{claim:"",source:"",basis:"",limitation:""}])} disabled={entries.length>=8} style={{padding:"9px 15px",marginTop:14,borderRadius:9,background:"#d8eee8",border:"1px solid #98cbbb",opacity:entries.length>=8?.5:1}}>إضافة ادعاء جديد</button>
  <output aria-live="polite" style={{display:"block",background:"#fff",padding:16,marginTop:15,borderRadius:10}}>
   <strong>ملخص مصفوفة البحث</strong>
   <p>السؤال: {question||"لم يُحدد السؤال بعد"}</p>
   <p>الصفوف التي لها ادعاء ومصدر: {active.length} من {entries.length}.</p>
   {active.map((e,i)=><p key={i} style={{padding:"7px 0",borderBottom:"1px solid #e2e8f0"}}><b>{i+1}. {e.claim}</b> — المصدر: {e.source}. الدليل: {e.basis||"غير موثق بعد"}. القيود: {e.limitation||"تحتاج مراجعة"}.</p>)}
   <p style={{fontSize:13,color:"#475569"}}>وجود اسم مصدر لا يعني أن الادعاء أصبح مثبتًا. راجع النص الأصلي والصلة والقيود قبل النشر.</p>
  </output>
 </section>;
}

export function CreativeLessonPlanner(){
 const [topic,setTopic]=useState("ترشيد استهلاك الماء");
 const [learners,setLearners]=useState("طلاب المرحلة الابتدائية وفق منهج المدرسة");
 const [objective,setObjective]=useState("يصنف الطالب أربعة من خمسة مواقف مع تبرير سبب واحد");
 const [evidence,setEvidence]=useState("بطاقة فردية تتضمن خمسة مواقف وسببًا واحدًا");
 const [activity,setActivity]=useState("مجموعات تصنّف بطاقات سلوكيات يومية، ثم تشرح معيار الاختيار");
 const [support,setSupport]=useState("شرح نصي أو شفهي للمواقف وإتاحة العمل الفردي عند الحاجة");
 const [mins,setMins]=useState(45);
 const times=useMemo(()=>{const w=[5,8,15,10,7];const first=w.slice(0,4).map(x=>Math.max(1,Math.round(x*mins/45)));return [...first,mins-first.reduce((a,b)=>a+b,0)];},[mins]);
 const parts=[["مدخل بسؤال","استدعِ فكرة سابقة عن "+topic+"."],["شرح ونمذجة","اعرض المفهوم ومثالًا مضادًا وراجع المصطلحات."],["نشاط تطبيقي",activity],["مناقشة وتغذية راجعة","افحص مبررات الطلاب وصحح تفسيرًا خاطئًا."],["تقويم وخلاصة",evidence]];
 return <section id="interactive-tool" aria-labelledby="lesson-planner-heading" style={panel}>
 <h2 id="lesson-planner-heading" style={{fontSize:24,fontWeight:750,marginBottom:8}}>مولّد خطة درس مبنية على الهدف والتقويم</h2>
 <p>أداة تعليمية مرنة من إعداد لوسيل. اضبط العناصر بحسب منهجك والطلاب، ثم راجع سلامة النشاط وسياسة المدرسة قبل تنفيذه. لا تحفظ الأداة بياناتك على خادم.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:13,marginTop:15}}>
 {[
  {label:"عنوان الحصة",val:topic,set:setTopic},
  {label:"الفئة أو المستوى",val:learners,set:setLearners},
  {label:"هدف قابل للملاحظة",val:objective,set:setObjective},
  {label:"دليل تحقق الهدف",val:evidence,set:setEvidence},
  {label:"النشاط المحوري",val:activity,set:setActivity},
  {label:"بديل المشاركة والدعم",val:support,set:setSupport}
 ].map(x=><label key={x.label} style={{display:"grid",gap:6,fontSize:14,fontWeight:600}}>{x.label}
 <textarea rows={2} style={inputStyle} maxLength={220} value={x.val} onChange={e=>x.set(e.target.value)}/></label>)}
 </div>
 <label style={{display:"grid",gap:8,marginTop:15}}>زمن الحصة: <strong>{mins} دقيقة</strong>
 <select style={inputStyle} value={mins} onChange={e=>setMins(Number(e.target.value))}>
 <option value={30}>30 دقيقة</option><option value={45}>45 دقيقة</option><option value={60}>60 دقيقة</option>
 </select></label>
 <div style={{background:"white",borderRadius:11,padding:16,marginTop:16}}>
 <h3 style={{fontSize:21,fontWeight:750}}>{topic||"عنوان الدرس"} — خطة {mins} دقيقة</h3>
 <p><b>الفئة:</b> {learners||"حدّد الصف"}</p><p><b>الهدف:</b> {objective||"أضف هدفًا"}</p><p><b>التقويم:</b> {evidence||"حدد كيف ستعرف تحقق الهدف"}</p>
 <ol style={{paddingInlineStart:24,lineHeight:2}}>
 {parts.map(([label,description],i)=><li key={label}><b>{times[i]} دقائق — {label}:</b> {description}</li>)}
 </ol>
 <p><b>دعم المشاركة:</b> {support||"أضف بديلًا مناسبًا"}.</p>
 <p><b>بعد الحصة:</b> راجع الإجابات الفعلية، وحدد فكرة تحتاج توضيحًا وتحسينًا واحدًا في التصميم.</p>
 <p style={{fontSize:13,color:"#475569"}}>هذا التقسيم الزمني اقتراح وليس قاعدة معتمدة؛ جودة الدرس لا تُقاس بالتزامه بالدقائق دون النظر إلى تعلم الطلاب.</p>
 </div>
 </section>;
}
