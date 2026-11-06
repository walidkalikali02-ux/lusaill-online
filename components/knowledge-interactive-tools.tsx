"use client";
import { useState } from "react";
import type { KnowledgeTopic } from "@/lib/knowledge-expansion-data";

const cardStyle={border:"1px solid #cbd5e1",background:"#f8fafc",padding:24,borderRadius:16,marginBlock:28} as const;

const experiments=[
 {label:"يتبخر الماء ببطء من طبق يحتوي على محلول ملح، فتظهر حبيبات منتظمة",kind:"تبلور بالتبخر",why:"يتناقص المذيب وتزداد نسبة الملح حتى يخرج جزء منه على هيئة بلورات. لا يعني هذا تكوّن مركب جديد."},
 {label:"عند مزج محلولين مناسبين، تظهر عكارة وجسيمات صلبة جديدة",kind:"ترسيب من تفاعل",why:"إذا نتج مركب قليل الذوبان، تنفصل جسيمات صلبة عن السائل. لا تكفي العكارة وحدها لتحديد المركب أو إثبات السبب."},
 {label:"يُبرّد محلول كانت ذوبانية مادته أعلى عند الحرارة المرتفعة، فتتكون بلورات",kind:"تبلور بالتبريد (عند تحقق الشروط)",why:"قد يقل مقدار ما يمكن إبقاؤه ذائبًا عند التبريد فتبدأ النوى البلورية في النمو. لا ينطبق ذلك على جميع المواد."},
];
function CrystalGuide(){
const [index,setIndex]=useState(0);
return <section id="interactive-tool" style={cardStyle} aria-labelledby="crystal-tool-title">
<h2 id="crystal-tool-title" style={{fontSize:23,fontWeight:750,marginBottom:10}}>أداة تعليمية: ما العملية الأقرب للوصف؟</h2>
<p>اختر موقفًا لتفهم الآلية المحتملة. هذه أداة لتفسير المفاهيم، وليست تحليلًا كيميائيًا لمادة مجهولة.</p>
<label style={{display:"grid",gap:8,marginTop:14,fontWeight:600}}>الموقف
<select value={index} onChange={e=>setIndex(Number(e.target.value))} style={{padding:14,border:"1px solid #94a3b8",borderRadius:9}}>
{experiments.map((e,i)=><option key={i} value={i}>{e.label}</option>)}
</select></label>
<output aria-live="polite" style={{display:"grid",gap:7,background:"white",padding:15,borderRadius:10,marginTop:14}}>
<strong style={{color:"#0f766e"}}>{experiments[index].kind}</strong><span>{experiments[index].why}</span>
</output></section>;
}
const environmentTracks=[
 {label:"المياه وجودتها",subjects:"علوم البيئة، الهيدرولوجيا، الهندسة البيئية",skills:"تحليل جودة المياه والإحصاء وقراءة الخرائط",project:"استخدم بيانات مياه منشورة رسميًا وقارن الاتجاه عبر سنتين مع توثيق وحدات القياس."},
 {label:"المناخ والطاقة",subjects:"الطاقة والهندسة البيئية والفيزياء والسياسات",skills:"حسابات الطاقة وتحليل السيناريوهات والبيانات",project:"قارن استهلاك الكهرباء في مبنى افتراضي قبل وبعد تحسين إضاءة، مع ذكر الافتراضات."},
 {label:"التنوع الحيوي",subjects:"الأحياء، الإيكولوجيا، البيئة البحرية",skills:"طرق رصد الأنواع وتوثيق المواقع وأخلاقيات العمل الميداني",project:"أنشئ خريطة تعليمية لبيانات أنواع منشورة في قاعدة مفتوحة دون جمع بيانات حساسة."},
 {label:"الخرائط والبيانات",subjects:"GIS والاستشعار عن بعد والجغرافيا والبرمجة",skills:"GIS وتنظيف بيانات وقراءة صور الأقمار الصناعية",project:"ارسم تغير استخدام الأراضي في منطقة من مجموعة بيانات مفتوحة مع ملاحظة دقة المصدر."},
 {label:"النفايات والتصنيع",subjects:"الهندسة البيئية، الكيميائية، والاقتصاد الدائري",skills:"ميزان المواد، تقييم دورة الحياة، كتابة تقارير",project:"قارن نفايات نشاط صغير حسب فئات الوزن باستخدام بيانات افتراضية معلنة."}
];
function EnvironmentalPaths(){
const [index,setIndex]=useState(0);const item=environmentTracks[index];
return <section id="interactive-tool" style={cardStyle} aria-labelledby="environment-tool-title">
<h2 id="environment-tool-title" style={{fontSize:23,fontWeight:750,marginBottom:10}}>اكتشف المسارات البيئية القريبة من اهتمامك</h2>
<p>اختر المشكلة التي تحب العمل عليها لتظهر لك مجالات دراسية ومهارات ومشروع تعليمي تجريبي. ليست توصية مهنية ملزمة أو معلومات عن شواغر فعلية.</p>
<label style={{display:"grid",gap:7,marginTop:15}}>ما المجال الذي يثير اهتمامك؟
<select value={index} onChange={e=>setIndex(Number(e.target.value))} style={{padding:12,border:"1px solid #94a3b8",borderRadius:10}}>
{environmentTracks.map((a,i)=><option key={a.label} value={i}>{a.label}</option>)}</select>
</label>
<div aria-live="polite" style={{background:"white",borderRadius:10,padding:18,marginTop:12,display:"grid",gap:10}}>
<p><strong>برامج للبحث عنها: </strong>{item.subjects}</p><p><strong>مهارات ابدأ بها: </strong>{item.skills}</p><p><strong>مشروع خلال أسبوعين: </strong>{item.project}</p>
</div>
<p style={{fontSize:13,color:"#475569",marginTop:12}}>تحقق من شروط القبول والاعتماد والترخيص في بلدك؛ لا تقرر بناءً على التشابه في اسم التخصص فقط.</p>
</section>;
}
const factors=[
 {name:"الاهتمام بطبيعة الدراسة والعمل",weight:25,help:"هل تتقبل المهام اليومية؟"},
 {name:"المهارات والاستعداد للتعلم",weight:25,help:"هل تتناسب المقررات مع قدراتك؟"},
 {name:"أدلة الطلب من سوقك المحلي",weight:20,help:"هل لديك بيانات حديثة لا مجرد توقع؟"},
 {name:"تكلفة البرنامج وجودته واعتماده",weight:15,help:"هل الرسوم والاعتماد والتدريب مناسبون؟"},
 {name:"مرونة مسارات العمل والتعلم",weight:15,help:"هل توجد مهارات قابلة للنقل؟"}
];
function MajorChoice(){
const [names,setNames]=useState<[string,string]>(["علوم البيئة","علوم البيانات"]);
const [scores,setScores]=useState<[number[],number[]]>([[3,3,3,3,3],[3,3,3,3,3]]);
const totals=scores.map(v=>Math.round(v.reduce((total,rating,i)=>total+rating*factors[i].weight/5,0)));
return <section id="interactive-tool" style={cardStyle} aria-labelledby="major-tool-title">
<h2 id="major-tool-title" style={{fontSize:23,fontWeight:750,marginBottom:8}}>مصفوفة مقارنة تخصصين جامعيين</h2>
<p>قيّم كل معيار من 1 (غير مناسب) إلى 5 (مناسب جدًا). أوزان هذه الأداة تقديرية من إعداد لوسيل لتنظيم التفكير، وليست نموذجًا تنبؤيًا للتوظيف ولا اختبارًا نفسيًا.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16,marginTop:16}}>
{[0,1].map(option=><div key={option} style={{background:"white",borderRadius:12,padding:15,display:"grid",gap:14}}>
<label style={{display:"grid",gap:6,fontWeight:700}}>اسم التخصص {option+1}
<input value={names[option]} maxLength={70} onChange={e=>setNames(old=>old.map((n,i)=>i===option?e.target.value:n) as [string,string])} style={{padding:10,borderRadius:8,border:"1px solid #94a3b8"}}/>
</label>
{factors.map((item,i)=><label key={item.name} style={{display:"grid",gap:6,fontSize:14}}>
<span><strong>{item.name}</strong> ({item.weight}%)</span><span style={{color:"#64748b",fontSize:12}}>{item.help}</span>
<input type="range" min={1} max={5} step={1} value={scores[option][i]} onChange={e=>{const next=scores.map(a=>[...a]) as [number[],number[]];next[option][i]=Number(e.target.value);setScores(next);}}/>
<span style={{fontWeight:700}}>{scores[option][i]} / 5</span>
</label>)}
<output aria-live="polite" style={{fontSize:23,fontWeight:800,color:"#0f766e",textAlign:"center"}}>{totals[option]} / 100</output>
</div>)}
</div>
<p style={{fontSize:13,color:"#475569",marginTop:14}}>النتيجة الأعلى تعكس تقييماتك الشخصية فقط. إذا لم تملك دليلًا موثوقًا لأحد المعايير، اكتب ذلك في ملاحظاتك ولا تحول الدرجة إلى وعد بالوظيفة أو الراتب.</p>
</section>;
}

const safetyChecks=[
 "غسلت اليدين بالماء والصابون قبل التحضير وبعد لمس النيئ.",
 "فصلت أدوات اللحم النيئ عن الخضراوات الجاهزة.",
 "استعملت ميزان حرارة الطعام المناسب للنوع الذي أطهوه.",
 "غسلت الفاكهة والخضراوات تحت الماء الجاري دون صابون.",
 "وضعت الأطعمة سريعة التلف في الثلاجة دون تأخير.",
 "لم أعتمد على لون الطعام أو رائحته وحدهما للحكم على سلامته.",
 "راجعت تعليمات التخزين ودرجة حرارة الثلاجة."
];
function FoodSafetyChecklist(){
 const [checks,setChecks]=useState<boolean[]>(safetyChecks.map(()=>false));
 const count=checks.filter(Boolean).length;
 return <section id="interactive-tool" style={cardStyle} aria-labelledby="safety-tool">
  <h2 id="safety-tool" style={{fontSize:24,fontWeight:750,marginBottom:9}}>قائمة تحقق سلامة الطعام قبل التقديم</h2>
  <p>استخدمها لتذكّر أهم خطوات النظافة والفصل والطهي والتبريد. اكتمال القائمة لا يضمن سلامة أي طعام؛ التزم بدرجات الحرارة والتعليمات المناسبة لكل صنف.</p>
  <div style={{display:"grid",gap:11,marginTop:16}}>
   {safetyChecks.map((label,i)=><label key={label} style={{display:"flex",alignItems:"start",gap:10,padding:10,background:"white",borderRadius:10}}>
    <input type="checkbox" checked={checks[i]} onChange={e=>setChecks(a=>a.map((v,k)=>k===i?e.target.checked:v))} style={{marginTop:7}}/>{label}
   </label>)}
  </div>
  <output aria-live="polite" style={{fontWeight:700,display:"block",marginTop:14}}>{count} من {safetyChecks.length} خطوات تمت مراجعتها</output>
 </section>;
}
const immuneClaims=[
 {claim:"تناول مكملات بجرعات أعلى من الاحتياج يمنع العدوى لدى الجميع.",answer:"غير مثبت. قد تفيد المكملات عند وجود نقص غذائي، ولا يعني تناول المزيد حماية أعلى."},
 {claim:"تساعد اللقاحات الجسم على الاستعداد ضد مسببات عدوى محددة.",answer:"صحيح. تختلف التوصيات حسب البلد والعمر والحالة الصحية."},
 {claim:"يمكن معرفة كفاءة الجهاز المناعي كلها من تحليل روتيني واحد.",answer:"غير دقيق. يعتمد التقييم على الأعراض والتاريخ الصحي وفحوص يختارها المختص."}
];
function ImmuneFacts(){
const [i,setI]=useState(0);
return <section id="interactive-tool" style={cardStyle} aria-labelledby="immune-tool">
<h2 id="immune-tool" style={{fontSize:24,fontWeight:750,marginBottom:9}}>فاحص الادعاءات الشائعة عن المناعة</h2>
<p>اختر ادعاءً واقرأ ما يقوله الدليل التثقيفي. لا يوصي هذا القسم بمكمل أو جرعة أو إجراء طبي فردي.</p>
<label style={{display:"grid",gap:9,marginTop:12}}>الادعاء<select value={i} onChange={e=>setI(Number(e.target.value))} style={{padding:12,borderRadius:9,border:"1px solid #94a3b8"}}>{immuneClaims.map((x,j)=><option value={j} key={j}>{x.claim}</option>)}</select></label>
<output aria-live="polite" style={{display:"block",marginTop:15,background:"white",borderRadius:10,padding:16}}>{immuneClaims[i].answer}</output>
</section>;
}
const focusDays=[
["راقب المقاطعات","ضع علامة كلما قُطعت جلستك دون لوم نفسك."],
["أغلق الإشعارات","قارن المقاطعات مع اليوم السابق."],
["اكتب هدفًا واحدًا","هل انتهيت من المهمة المحددة؟"],
["نظّم موعد النوم","سجل موعد النوم والاستيقاظ بصورة تقريبية."],
["أضف حركة معتدلة","دوّن النشاط الملائم لك وحالتك."],
["جرب جلسات مع استراحات","اختر المدة التي تناسب المهمة."],
["راجع الأسبوع","حدد عادة أو اثنتين يمكن أن تستمر معك."]
];
function FocusWeekPlan(){
const [done,setDone]=useState<boolean[]>(Array(7).fill(false));
return <section id="interactive-tool" style={cardStyle} aria-labelledby="focus-tool">
<h2 id="focus-tool" style={{fontSize:24,fontWeight:750,marginBottom:9}}>خطة التركيز لمدة سبعة أيام</h2>
<p>يمكنك متابعة الإجراءات في المتصفح، ولا تُحفظ بياناتك على الخادم. هذه تجربة شخصية لتنظيم العادات وليست علاجًا طبيًا.</p>
<div style={{display:"grid",gap:9,marginTop:15}}>{focusDays.map(([title,desc],i)=><label key={title} style={{display:"flex",gap:12,background:"white",padding:12,borderRadius:10}}>
<input type="checkbox" checked={done[i]} onChange={e=>setDone(a=>a.map((x,k)=>k===i?e.target.checked:x))} style={{marginTop:7}}/><span><strong>اليوم {i+1}: {title}</strong><span style={{display:"block",fontSize:13,color:"#475569"}}>{desc}</span></span></label>)}</div>
<output aria-live="polite" style={{display:"block",marginTop:12,fontWeight:700}}>تمت متابعة {done.filter(Boolean).length} من 7 أيام</output>
</section>;
}
const schoolWeeks=[
 {title:"الأسبوع الأول — فهم المشكلة",details:"راجع قواعد المدرسة واسأل الطلاب والمعلمين عن ثلاثة مواقف متكررة، دون جمع بيانات شخصية خارج السياسة المعتمدة."},
 {title:"الأسبوع الثاني — تعليم الروتين",details:"اكتب توقعات سلوكية قصيرة ودرّب الطلاب على الدخول والانتقال والمشاركة."},
 {title:"الأسبوع الثالث — تقديم الدعم",details:"استخدم الثناء المحدد وحوارًا محترمًا، وقدّم دعمًا مناسبًا عند تكرار الصعوبات."},
 {title:"الأسبوع الرابع — المراجعة والإنصاف",details:"قارن فهم القواعد ووقت بدء التعلم وشعور الطلاب بالعدالة، وعدّل ما لا يعمل."}
];
function SchoolDisciplinePlan(){
const [week,setWeek]=useState(0);
return <section id="interactive-tool" style={cardStyle} aria-labelledby="school-tool">
<h2 id="school-tool" style={{fontSize:24,fontWeight:750,marginBottom:9}}>خطة الانضباط الإيجابي: اختر الأسبوع</h2>
<label style={{display:"grid",gap:7}}>الأسبوع<select value={week} onChange={e=>setWeek(Number(e.target.value))} style={{padding:12,border:"1px solid #94a3b8",borderRadius:9}}>{schoolWeeks.map((w,i)=><option key={i} value={i}>{w.title}</option>)}</select></label>
<output aria-live="polite" style={{display:"block",padding:17,background:"white",borderRadius:9,marginTop:13}}>{schoolWeeks[week].details}</output>
<p style={{fontSize:13,color:"#475569",marginTop:10}}>تُقدَّم حماية الطلاب واتباع سياسات المدرسة على أي خطة عامة.</p>
</section>;
}
function WritingOutline(){
const [subject,setSubject]=useState("أهمية القراءة");
const [mainIdea,setMainIdea]=useState("القراءة تساعدنا على التعلم والفهم");
const [ideas,setIdeas]=useState(["توسيع المعرفة","فهم النصوص","التلخيص والمناقشة"]);
return <section id="interactive-tool" style={cardStyle} aria-labelledby="writing-tool">
<h2 id="writing-tool" style={{fontSize:24,fontWeight:750,marginBottom:9}}>مولّد مخطط موضوع قابل للتعديل</h2>
<p>أدخل العنوان والفكرة المركزية ثم ثلاث أفكار فرعية. يظهر المخطط فقط، ولا يختلق معلومات أو مصادر.</p>
<div style={{display:"grid",gap:12,marginTop:12}}>
<label style={{display:"grid",gap:6}}>عنوان الموضوع<input value={subject} maxLength={120} onChange={e=>setSubject(e.target.value)} style={{padding:11,borderRadius:9,border:"1px solid #94a3b8"}}/></label>
<label style={{display:"grid",gap:6}}>الفكرة الأساسية<input value={mainIdea} maxLength={170} onChange={e=>setMainIdea(e.target.value)} style={{padding:11,borderRadius:9,border:"1px solid #94a3b8"}}/></label>
{ideas.map((x,i)=><label key={i} style={{display:"grid",gap:6}}>الفكرة الفرعية {i+1}<input value={x} maxLength={150} onChange={e=>setIdeas(a=>a.map((v,k)=>k===i?e.target.value:v))} style={{padding:11,borderRadius:9,border:"1px solid #94a3b8"}}/></label>)}
</div>
<output aria-live="polite" style={{display:"block",background:"white",borderRadius:11,padding:16,marginTop:16}}>
<strong>{subject||"عنوان موضوعك"}</strong><p>مقدمة: {mainIdea||"حدد الفكرة المركزية"}</p>
<ol style={{paddingInlineStart:25}}>{ideas.filter(Boolean).map((x,i)=><li key={i}>{x} — أضف دليلًا أو مثالًا موثقًا.</li>)}</ol>
<p>خاتمة: لخّص الأفكار الرئيسة وارجع إلى هدف الموضوع، دون تقديم معلومة جديدة غير مدعومة.</p>
</output>
</section>;
}

export function KnowledgeInteractiveTool({kind}: {kind:KnowledgeTopic["tool"]}){
if(kind==="crystal-guide")return <CrystalGuide/>;
if(kind==="environmental-paths")return <EnvironmentalPaths/>;
if(kind==="food-safety-checklist")return <FoodSafetyChecklist/>;
if(kind==="immunity-facts")return <ImmuneFacts/>;
if(kind==="focus-week-plan")return <FocusWeekPlan/>;
if(kind==="school-discipline-plan")return <SchoolDisciplinePlan/>;
if(kind==="writing-outline")return <WritingOutline/>;
return <MajorChoice/>;
}
