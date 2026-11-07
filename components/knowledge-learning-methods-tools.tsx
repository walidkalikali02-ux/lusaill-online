"use client";
import { useState } from "react";

const shell={padding:22,border:"1px solid #c9dce4",borderRadius:16,background:"#f5fafb",marginBlock:28} as const;
const problemExamples=[
 {title:"شراء دفاتر وقلم",question:"اشترى خالد 3 دفاتر بسعر 7 ريالات للواحد وقلمًا بـ4 ريالات، ودفع 30 ريالًا. كم بقي له؟",
 steps:[
 {heading:"افهم السؤال",text:"المعطيات: 3 دفاتر، ثمن الواحد 7، قلم بـ4، المبلغ المدفوع 30. المطلوب: الباقي."},
 {heading:"ضع خطة",text:"احسب ثمن الدفاتر، ثم أضف ثمن القلم، واطرح مجموع المشتريات من المبلغ المدفوع."},
 {heading:"نفذ الخطة",text:"3 × 7 = 21 ريالًا، 21 + 4 = 25 ريالًا، 30 − 25 = 5 ريالات."},
 {heading:"تحقق",text:"المصروف 25 والباقي 5، ومجموعهما 30. إذن الباقي 5 ريالات."}]},
 {title:"محيط مستطيل",question:"مستطيل طوله 8 سم وعرضه 5 سم. ما محيطه؟",
 steps:[
 {heading:"افهم السؤال",text:"المعطيات: الطول 8 سم والعرض 5 سم. المطلوب: مجموع حدود المستطيل (المحيط) لا المساحة."},
 {heading:"ضع خطة",text:"يمكن جمع الأطوال الأربعة أو تطبيق 2 × (الطول + العرض)."},
 {heading:"نفذ الخطة",text:"2 × (8 + 5) = 26 سم."},
 {heading:"تحقق",text:"8 + 5 + 8 + 5 = 26 سم. استخدمنا وحدة طول «سم»، وليس «سم²»."}]},
 {title:"الكتب في المكتبة",question:"في مكتبة 24 كتابًا؛ بيع ثلثها ثم أضيفت 6 كتب. كم كتابًا بقي؟",
 steps:[
 {heading:"افهم السؤال",text:"العدد الأولي 24 كتابًا. بيع ثلثه ثم أضيفت 6 كتب. المطلوب العدد النهائي."},
 {heading:"ضع خطة",text:"أوجد ثلث 24، ثم اطرحه من 24 وأضف 6."},
 {heading:"نفذ الخطة",text:"24 ÷ 3 = 8 كتب مباعة؛ 24 − 8 = 16؛ 16 + 6 = 22 كتابًا."},
 {heading:"تحقق",text:"بداية 24 − مبيعات 8 + إضافات 6 = 22، وتطابق النتيجة ترتيب الأحداث."}]}
];
export function PolyaTrainer(){
 const [problem,setProblem]=useState(0),[step,setStep]=useState(0),[attempt,setAttempt]=useState("");
 const current=problemExamples[problem],stage=current.steps[step];
 return <section id="interactive-tool" aria-labelledby="polya-trainer-heading" style={shell}>
 <h2 id="polya-trainer-heading" style={{fontSize:24,fontWeight:750,marginBottom:10}}>تدريب تفاعلي: حل المسألة بخطوات بوليا</h2>
 <p>اقرأ المسألة وحاول كتابة خطتك أولًا، ثم انتقل بين المراحل الأربع. جميع الأمثلة تعليمية من إعداد لوسيل.</p>
 <label style={{display:"grid",gap:7,marginTop:14}}>اختر مسألة
 <select value={problem} onChange={e=>{setProblem(Number(e.target.value));setStep(0);setAttempt("");}} style={{padding:12,border:"1px solid #94a3b8",borderRadius:10,background:"white"}}>
 {problemExamples.map((item,i)=><option value={i} key={item.title}>{item.title}</option>)}</select></label>
 <p style={{fontWeight:700,background:"white",padding:14,borderRadius:10,marginTop:14}}>{current.question}</p>
 <label style={{display:"grid",gap:7,marginTop:12}}>ما خطتك أو محاولتك؟
 <textarea rows={3} maxLength={700} value={attempt} onChange={e=>setAttempt(e.target.value)} placeholder="اكتب المعطيات والخطة أو خطواتك قبل فتح الحل" style={{padding:12,border:"1px solid #94a3b8",borderRadius:10,background:"white",width:"100%"}}/>
 </label>
 <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginTop:14}}>
 <button type="button" disabled={step===0} onClick={()=>setStep(v=>Math.max(0,v-1))} style={{padding:"9px 16px",borderRadius:9,border:"1px solid #9aaabd",background:"white",opacity:step===0?0.5:1}}>المرحلة السابقة</button>
 <strong>الخطوة {step+1} من 4</strong>
 <button type="button" disabled={step===3} onClick={()=>setStep(v=>Math.min(3,v+1))} style={{padding:"9px 16px",borderRadius:9,border:"1px solid #9aaabd",background:"white",opacity:step===3?0.5:1}}>المرحلة التالية</button>
 </div>
 <output aria-live="polite" style={{display:"block",marginTop:14,padding:17,background:"#fff",borderRadius:10}}>
 <strong style={{color:"#0c7469"}}>{stage.heading}</strong><p style={{marginTop:8}}>{stage.text}</p></output>
 <p style={{fontSize:13,color:"#475569",marginTop:13}}>هذا النموذج يوضح التفكير، ولا يصحّح كتابتك تلقائيًا. لا تُرسل محاولتك إلى خادم.</p>
 </section>;
}
const stages=[
 {title:"استطلاع",hint:"ما عنوان الدرس وما أهم أقسامه؟",field:"لاحظ العناوين والرسوم والمفردات",placeholder:"عناوين الفصل والأفكار التي تظهر في الفهرس"},
 {title:"سؤال",hint:"ما الأسئلة التي تريد أن تجيب عنها من النص؟",field:"حوّل عنوانًا إلى سؤال",placeholder:"كيف يحدث...؟ ولماذا...؟"},
 {title:"قراءة",hint:"ما الفكرة التي شرحها النص؟",field:"دوّن الفكرة بعد القراءة",placeholder:"ملخص قصير للنص وأي سؤال لم يُحسم"},
 {title:"استرجاع",hint:"أغلق النص الآن: ماذا تستطيع تفسيره دون النظر إليه؟",field:"اكتب من ذاكرتك",placeholder:"اشرح الفكرة بلغتك دون نسخ الجمل"},
 {title:"مراجعة",hint:"قارن إجابتك بالنص: ما الذي أغفلته؟",field:"سجل التصحيح أو سؤال المراجعة",placeholder:"الفكرة التي تحتاج إعادة قراءة أو اختبار"}
];
export function SQ3RWorkbook(){
 const [name,setName]=useState("دورة الماء");
 const [stage,setStage]=useState(0);
 const [answers,setAnswers]=useState<string[]>(["","","","",""]);
 const filled=answers.filter(s=>s.trim().length>=5).length;
 return <section id="interactive-tool" aria-labelledby="sq3r-workbook-heading" style={shell}>
 <h2 id="sq3r-workbook-heading" style={{fontSize:24,fontWeight:750,marginBottom:10}}>دفتر SQ3R التفاعلي للقراءة المتعمقة</h2>
 <p>اختر درسًا أو فصلًا، واكتب ملاحظات في كل مرحلة. لا تحفظ الأداة بياناتك على خادم؛ انسخ ملاحظاتك إلى ملفك الشخصي إذا أردت الاحتفاظ بها.</p>
 <label style={{display:"grid",gap:7,marginTop:14}}>عنوان ما تقرؤه
 <input value={name} onChange={e=>setName(e.target.value)} maxLength={100} style={{padding:12,border:"1px solid #94a3b8",borderRadius:9,background:"white"}}/></label>
 <div role="group" aria-label="مراحل القراءة المتعمقة" style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>
 {stages.map((s,i)=><button key={s.title} type="button" aria-pressed={stage===i} onClick={()=>setStage(i)} style={{padding:"8px 12px",borderRadius:9,border:"1px solid #cbd5e1",background:stage===i?"#d8f4ed":"white",fontWeight:stage===i?700:400}}>{i+1}. {s.title}</button>)}</div>
 <div style={{marginTop:16,padding:15,borderRadius:10,background:"white"}}>
 <h3 style={{fontSize:20,fontWeight:700}}>{stages[stage].title}</h3>
 <p style={{marginBlock:8}}>{stages[stage].hint}</p>
 <label style={{display:"grid",gap:7}}>{stages[stage].field}
 <textarea rows={4} maxLength={1200} placeholder={stages[stage].placeholder} value={answers[stage]} onChange={e=>setAnswers(a=>a.map((x,i)=>i===stage?e.target.value:x))} style={{width:"100%",padding:12,border:"1px solid #94a3b8",borderRadius:8}}/></label>
 </div>
 <output aria-live="polite" style={{display:"block",marginTop:14,fontWeight:700}}>كتبت ملاحظات في {filled} من 5 مراحل</output>
 <p style={{marginTop:10,fontSize:13,color:"#475569"}}>اكتمال الخانات ليس دليلًا كافيًا على الفهم. اختبر نفسك بأسئلة جديدة ثم صحح الإجابات من مصدر الدرس.</p>
 </section>;
}
