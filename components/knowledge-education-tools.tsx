"use client";
import { useState } from "react";

const outcomes=[
 {label:"الرياضيات — مقارنة الكسور متساوية المقام",goal:"يقارن المتعلم بين كسرين لهما المقام نفسه، ويشرح لماذا أحدهما أكبر",challenge:"يطابق الطلاب بطاقة الكسر مع تمثيله البصري، ثم يرتبون 1/4 و2/4 و3/4 ويشرحون الاختيار",check:"سؤالان فرديان جديدان مع شرح السبب خارج اللعبة"},
 {label:"اللغة — التمييز بين الاسم والفعل",goal:"يصنف المتعلم كلمات جديدة إلى اسم وفعل مع تفسير قرينة لغوية واحدة",challenge:"يسحب كل فريق بطاقة ويضعها في خانة مناسبة، ثم يتبادل الأدوار بين المصنّف والمفسّر",check:"خمس كلمات جديدة تُصنَّف فرديًا بعد النشاط"},
 {label:"العلوم — السلسلة الغذائية",goal:"يرتب المتعلم سلسلة غذائية بسيطة ويشرح اتجاه انتقال الطاقة",challenge:"ترتب المجموعة بطاقات المنتج والمستهلك حسب السيناريو المرفق دون الاعتماد على سرعة اللعب",check:"ارسم سلسلة جديدة مع تفسير دور المنتج والمستهلك"}
];
export function GameLessonBuilder(){
 const [selected,setSelected]=useState(0),[minutes,setMinutes]=useState(35);
 const item=outcomes[selected];
 return <section id="interactive-tool" aria-labelledby="game-plan-title" style={{padding:23,border:"1px solid #d5e5eb",borderRadius:16,background:"#f6fafc",marginBlock:28}}>
 <h2 id="game-plan-title" style={{fontSize:24,fontWeight:750,marginBottom:9}}>مولّد خطة نشاط قائم على الألعاب</h2>
 <p>خطة تعليمية محلية في متصفحك؛ الأمثلة من إعداد لوسيل وليست تجربة أثبتت نتيجة تعليمية معينة. يمكن تعديل الزمن حسب مستوى الطلاب.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:15,marginTop:16}}>
 <label style={{display:"grid",gap:8}}>الدرس
 <select value={selected} onChange={e=>setSelected(Number(e.target.value))} style={{padding:12,borderRadius:9,border:"1px solid #94a3b8"}}>{outcomes.map((o,i)=><option value={i} key={o.label}>{o.label}</option>)}</select></label>
 <label style={{display:"grid",gap:8}}>مدة الحصة
 <select value={minutes} onChange={e=>setMinutes(Number(e.target.value))} style={{padding:12,borderRadius:9,border:"1px solid #94a3b8"}}>
 {[30,35,40,45,50].map(n=><option value={n} key={n}>{n} دقيقة</option>)}</select></label></div>
 <output aria-live="polite" style={{display:"grid",gap:10,marginTop:17,padding:18,borderRadius:11,background:"white"}}>
 <p><strong>هدف قابل للملاحظة:</strong> {item.goal}.</p>
 <p><strong>تشخيص قبلي — {Math.round(minutes*.14)} دقائق:</strong> سؤال أولي فردي متصل بالهدف دون ترتيب علني.</p>
 <p><strong>شرح تمهيدي — {Math.round(minutes*.2)} دقائق:</strong> نموذج من المعلم يعالج المفهوم الأساسي.</p>
 <p><strong>تحدّي اللعبة — {Math.round(minutes*.36)} دقائق:</strong> {item.challenge}.</p>
 <p><strong>تقويم بعدي — {Math.round(minutes*.2)} دقائق:</strong> {item.check}.</p>
 <p><strong>خلاصة — {minutes-Math.round(minutes*.14)-Math.round(minutes*.2)-Math.round(minutes*.36)-Math.round(minutes*.2)} دقائق:</strong> أبرز خطأ شائع وقدم تغذية راجعة تشرح السبب.</p>
 </output>
 <p style={{color:"#475569",fontSize:13,marginTop:12}}>تذكير: لا تنقل بيانات الطلاب إلى أداة خارجية دون سياسة المدرسة، ووفّر خيارًا غير رقميًا.</p>
 </section>;
}
const criteria=[
["اسم الجهة والبرنامج", "عرفت الاسم القانوني للمؤسسة والبرنامج، لا اسم المنصة فقط."],
["الجهة المختصة", "تحققت من الجهة الرسمية التي تعتمد أو تعترف بالمؤسسة والبرنامج في بلدها."],
["الاعتراف في بلدي", "سألت الجهة المسؤولة في البلد الذي أريد استخدام المؤهل فيه."],
["نوع الشهادة", "ميّزت بين شهادة إتمام دورة ودرجة أكاديمية أو شهادة مهنية."],
["التكلفة الكاملة", "اطلعت على رسوم التسجيل والتقييم والشهادات وأي حضور إلزامي."],
["طريقة الدراسة", "تحققت من الامتحانات والدعم التقني والحضور والمواعيد."],
["إمكانية الوصول", "جربت المنصة وتأكدت من مناسبة المواد ووسائل الدعم لاحتياجاتي."]
];
export function OpenLearningChecker(){
 const [checked,setChecked]=useState<boolean[]>(criteria.map(()=>false));
 const count=checked.filter(Boolean).length;
 return <section id="interactive-tool" aria-labelledby="open-check-title" style={{padding:23,border:"1px solid #d5e5eb",borderRadius:16,background:"#f6fafc",marginBlock:28}}>
 <h2 id="open-check-title" style={{fontSize:24,fontWeight:750,marginBottom:9}}>قائمة فحص برنامج تعليم مفتوح قبل التسجيل</h2>
 <p>هذا النموذج ينظم الأسئلة التي ينبغي التأكد منها؛ ليس جهة اعتماد أو معادلة للمؤهلات، ولا يحكم على أي جامعة.</p>
 <div style={{display:"grid",gap:11,marginTop:17}}>
 {criteria.map(([title,detail],i)=><label key={title} style={{display:"flex",gap:12,alignItems:"start",background:"white",borderRadius:9,padding:12}}>
 <input checked={checked[i]} onChange={e=>setChecked(c=>c.map((a,k)=>k===i?e.target.checked:a))} type="checkbox" style={{marginTop:7}}/>
 <span><strong>{title}</strong><span style={{display:"block",color:"#475569",fontSize:13}}>{detail}</span></span>
 </label>)}</div>
 <output aria-live="polite" style={{display:"block",fontWeight:750,marginTop:14}}>{count} من {criteria.length} عناصر تم التحقق منها بحسب إفادتك.</output>
 <p style={{marginTop:10,color:"#92400e",fontSize:14}}>حتى لو أكملت جميع البنود، فإن الاعتراف الرسمي لا يثبته هذا الاختبار؛ احتفظ بوثائق الجهات المختصة وتحقق من صلاحيتها.</p>
 </section>;
}
