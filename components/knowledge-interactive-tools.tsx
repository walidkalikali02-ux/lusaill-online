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
export function KnowledgeInteractiveTool({kind}: {kind:KnowledgeTopic["tool"]}){
if(kind==="crystal-guide")return <CrystalGuide/>;
if(kind==="environmental-paths")return <EnvironmentalPaths/>;
return <MajorChoice/>;
}
