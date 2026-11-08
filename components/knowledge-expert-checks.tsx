"use client";
import {batch17Questions} from "@/lib/knowledge-batch-17-quiz";
import {batch16Questions} from "@/lib/knowledge-batch-16-quiz";
import {batch15Questions} from "@/lib/knowledge-batch-15-quiz";
import {batch14Questions} from "@/lib/knowledge-batch-14-quiz";
import {batch13Questions} from "@/lib/knowledge-batch-13-quiz";
import {batch12Questions} from "@/lib/knowledge-batch-12-quiz";
import {batch11Questions} from "@/lib/knowledge-batch-11-quiz";
import {DivisionCheck,WaterSavingCalculator,InductionSumCheck} from "./knowledge-batch11-calculators";
import {expert10Questions} from "@/lib/knowledge-expert-batch10-quiz-data";
import {ConditionalProbabilityCalculator,PopulationChangeCalculator,TrainingGapCalculator} from "./knowledge-expert-batch10-calculators";
import { useState } from "react";

type QA={question:string,options:[string,string,string],correct:0|1|2,why:string};
const items:Record<string,{heading:string,qa:QA[]}>={
...batch11Questions,
...batch12Questions,
...batch13Questions,
...batch14Questions,
...batch15Questions,
...batch16Questions,
...batch17Questions,
...expert10Questions,
"lightning-charge-separation-clouds":{heading:"اختبر فهمك لكهرباء السحب",qa:[
{question:"ما العملية الرئيسية المرتبطة بفصل الشحنات في السحب الرعدية؟",options:["اصطدام جسيمات الجليد والغراوبل مع تيارات الهواء","احتكاك السحابة بالأرض مباشرة","ألوان السحابة الداكنة"],correct:0,why:"تنقل التصادمات في ظروف محددة شحنات بين الجسيمات؛ وتساعد التيارات على انفصال المناطق المشحونة."},
{question:"أين يجب الاحتماء عند سماع الرعد؟",options:["تحت شجرة منفردة","داخل مبنى مغلق مناسب أو سيارة سقفها صلب","في مكان مكشوف لأن المطر لم يصل بعد"],correct:1,why:"الصواعق قد تصل إلى أماكن لا تمطر فيها مباشرة، والأماكن المكشوفة أو الأشجار لا توفر حماية."}
]},
"strong-argument-evidence-criteria":{heading:"افحص قوة الحجة",qa:[
{question:"حجة لها مقدمات كاذبة لكن النتيجة تتبعها منطقيا. ماذا نعرف؟",options:["قد يكون البناء صالحًا دون أن تكون الحجة سليمة","الحجة سليمة بالضرورة","النتيجة كاذبة في جميع الأحوال"],correct:0,why:"الصلاحية المنطقية تتعلق بارتباط المقدمات بالنتيجة، أما السلامة فتحتاج أيضًا صدق المقدمات."},
{question:"هل شهادة طالب واحد بأن أسلوبًا أفاده تثبت فائدة الأسلوب لكل الطلاب؟",options:["نعم لأنها تجربة مباشرة","لا؛ لا تسمح بالتعميم على الجميع دون أدلة أوسع","تثبت أن الأسلوب لا يعمل مطلقًا"],correct:1,why:"الشهادة تعبر عن تجربة فردية؛ الحكم العام يحتاج منهجًا وأدلة مناسبة ونظرًا للتفسيرات البديلة."}
]},
"molecular-formula-empirical-formula-calculation":{heading:"تدرب على حساب الصيغة الكيميائية",qa:[
{question:"الصيغة الأولية CH₂O وكتلتها 30.03 غ/مول، والكتلة الجزيئية نحو 180.16 غ/مول. ما المضاعف؟",options:["2","6","12"],correct:1,why:"180.16 ÷ 30.03 ≈ 6؛ لذا تضرب أدلة CH₂O كلها في 6 لتصبح C₆H₁₂O₆."},
{question:"هل يمكن معرفة الصيغة الجزيئية من الصيغة الأولية وحدها؟",options:["لا، تحتاج إلى معلومات إضافية عن الكتلة أو البنية","نعم، دائمًا","نعم، إذا كانت الصيغة تحتوي هيدروجينًا"],correct:0,why:"يمكن أن تتشارك عدة مركبات في الصيغة الأولية نفسها بمضاعفات مختلفة."}
]},
"separate-oil-water":{heading:"اختبر طرق فصل الماء والزيت",qa:[
{question:"ما الطريقة الملائمة لفصل طبقتين من سائلين غير ممتزجين في المختبر؟",options:["ورق ترشيح عادي","قمع فصل مناسب","مغناطيس"],correct:1,why:"قمع الفصل يتيح تصريف الطبقة السفلى عندما تنفصل الطبقتان، مع مراعاة السلامة وتحديد طبيعة السائلين."},
{question:"لماذا يكون زيت الطعام عادة أعلى الماء؟",options:["بسبب كثافته الأقل عادة","لأن الزيت مادة صلبة","لأن الماء يشكل رابطة كيميائية جديدة مع الزيت"],correct:0,why:"اختلاف الكثافة يحدد موقع الطبقات، بينما عدم الامتزاج يرتبط بالتآثر الجزيئي."}
]},
"separate-iron-sand":{heading:"تدرب على الفصل المغناطيسي",qa:[
{question:"لماذا يجذب المغناطيس برادة الحديد من الرمل؟",options:["لأن الحديد يستجيب بقوة للمجال المغناطيسي","لأن الرمل يذوب في المغناطيس","لأن جميع المواد الصلبة مغناطيسية"],correct:0,why:"تختلف استجابة المكونات الفيزيائية للمغناطيس، وهذا يتيح فصلها دون تفاعل كيميائي جديد."},
{question:"هل يضمن المغناطيس أن المادة المجموعة حديد نقي؟",options:["نعم دائمًا","لا، قد يحتوي الرمل على معادن مغناطيسية أخرى","نعم إذا كان لون الرمل فاتحًا"],correct:1,why:"قد تنجذب معادن مثل المغنيتيت، ولذلك لا تساوي عملية الجمع اختبارًا لنقاوة الحديد."}
]},
"meiosis-crossing-over-prophase-i":{heading:"اختبر فهمك للعبور الوراثي",qa:[
{question:"متى يحدث العبور المسؤول عن إعادة ترتيب الأليلات في الانقسام المنصف؟",options:["الطور التمهيدي الأول","الطور النهائي الثاني","بعد انفصال الأمشاج"],correct:0,why:"يحدث الاقتران وإعادة التركيب بين المتماثلات خلال الطور التمهيدي الأول."},
{question:"بين أي كروماتيدين يحدث العبور في المثال المدرسي؟",options:["شقيقين من الكروموسوم نفسه","غير شقيقين من كروموسومين متماثلين","بين كروموسومين غير متماثلين دائمًا"],correct:1,why:"تبادل المقاطع بين كروماتيدات غير شقيقة يفسر إعادة ترتيب الأليلات الوالدية."}
]},
"ants-acacia-mutualism":{heading:"تحقق من علاقة السنط والنمل",qa:[
{question:"ماذا تقدم بعض أشجار Vachellia للنمل المتخصص؟",options:["أشواكًا مجوفة ورحيقًا وأجسامًا غذائية","فريسة حيوانية حية يوميًا","أكسجينًا فقط"],correct:0,why:"توفر الأنواع المتخصصة مأوى في الأشواك المنتفخة وموارد غذائية بما فيها الرحيق وأجسام بلت."},
{question:"هل ينطبق النظام نفسه على كل أنواع السنط؟",options:["نعم بدون استثناء","لا، يختلف باختلاف نوع النبات والنمل والبيئة","نعم على جميع الأشجار الاستوائية"],correct:1,why:"العلاقات المتخصصة ترتبط بأنواع محددة، ويختلف مقدار الدفاع والموارد باختلاف النظام."}
]},
"digit-versus-number":{heading:"اختبر القيمة المكانية",qa:[
{question:"في العدد 507، ما قيمة الرقم 5؟",options:["5","50","500"],correct:2,why:"الرقم 5 في منزلة المئات، لذا قيمته 5×100 = 500."},
{question:"هل الرمز 0 رقم أم عدد؟",options:["رقم فقط","عدد فقط","رقم وعدد في سياقين مناسبين"],correct:2,why:"هو رمز في النظام العشري ويمثل أيضًا القيمة العددية الصفرية."}
]},
"probability-sample-space-outcomes":{heading:"تدرب على فضاء العينة",qa:[
{question:"ما عدد تسلسلات النواتج الممكنة لرمي عملة مرتين مع اعتبار الترتيب؟",options:["2","3","4"],correct:2,why:"الفضاء يحوي ص ص، ص ك، ك ص، ك ك؛ أي 4 تسلسلات."},
{question:"عند رمي نردين عادلين مميزين، كم زوجًا مرتبًا ممكنًا؟",options:["6","12","36"],correct:2,why:"كل نرد له ستة أوجه؛ إذن 6×6 = 36 زوجًا مرتبًا."}
]},
"energy-flow-ecosystem":{heading:"اختبر فهمك للهرم الطاقي",qa:[
{question:"ما الوصف الدقيق لقاعدة انتقال نحو 10% من الطاقة؟",options:["قانون ثابت في كل نظام طبيعي","تقريب مدرسي وقد تختلف الكفاءة","تعني أن كل طاقة الغذاء تذهب للمستوى التالي"],correct:1,why:"الكفاءة تختلف بين الأنظمة والكائنات وطرق القياس، والقيمة التعليمية ليست قانونًا عامًا."},
{question:"ما الفرق بين الطاقة والعناصر الغذائية في النظام البيئي؟",options:["كلاهما يدور بالشكل نفسه","الطاقة تتدفق وتتبدد أجزاء كحرارة، بينما تدور عناصر المادة","الطاقة لا تمر عبر المستهلكات"],correct:1,why:"العناصر مثل الكربون قد تعود للمنتجات عبر دورات المادة، لكن الحرارة المتبددة لا تعود بالطريقة نفسها."}
]}
};
const wrap={border:"1px solid #c8dee2",background:"#f6fafb",padding:22,borderRadius:15,marginBlock:28} as const;
const field={width:"100%",padding:"10px 13px",borderRadius:9,border:"1px solid #9ab1bf",background:"white"} as const;
function MolecularCalculator(){
const [base,setBase]=useState("30.03"),[molar,setMolar]=useState("180.16");
const a=Number(base),b=Number(molar),n=a>0&&b>0?b/a:NaN;
const valid=Number.isFinite(n)&&Number.isInteger(Math.round(n))&&Math.round(n)>=1&&Math.abs(n-Math.round(n))<0.03;
return <div style={{borderTop:"1px solid #cbd5e1",paddingTop:16,marginTop:18}}>
<h3 style={{fontSize:20,fontWeight:750}}>حاسبة المضاعف للصيغة الأولية</h3>
<p>أدخل كتلًا مولية بنفس الوحدة (غ/مول). المثال الافتراضي CH₂O / C₆H₁₂O₆؛ الأداة لا تستنتج التركيب من تجربة مخبرية.</p>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
<label style={{display:"grid",gap:5}}>كتلة الصيغة الأولية<input type="number" step="any" min="0.01" value={base} onChange={e=>setBase(e.target.value)} style={field}/></label>
<label style={{display:"grid",gap:5}}>الكتلة الجزيئية<input type="number" step="any" min="0.01" value={molar} onChange={e=>setMolar(e.target.value)} style={field}/></label>
</div><output aria-live="polite" style={{display:"block",marginTop:12,fontWeight:700}}>{valid?"المضاعف التقريبي n = "+Math.round(n)+"؛ تحقق من الأرقام المعنوية.":"لا يوجد مضاعف صحيح واضح بهذه القيم؛ راجع الوحدات والمعطيات."}</output>
</div>;
}
function ProbabilityCalculator(){
const [count,setCount]=useState(2);
return <div style={{borderTop:"1px solid #cbd5e1",paddingTop:16,marginTop:18}}>
<h3 style={{fontSize:20,fontWeight:750}}>حاسبة فضاء العينة للعملة</h3>
<label style={{display:"grid",gap:8,marginTop:11}}>عدد الرميات في نموذج قطعة متوازنة ومستقلة: {count}
<input type="range" min={1} max={6} step={1} value={count} onChange={e=>setCount(Number(e.target.value))}/></label>
<output aria-live="polite"><strong>عدد تسلسلات النواتج: {2**count} = 2^{count}</strong></output>
<p style={{fontSize:13,color:"#526575"}}>النتائج المتسلسلة متساوية الاحتمال فقط في النموذج المثالي لعملة عادلة ورميات مستقلة.</p></div>;
}
function EnergyCalculator(){
const [percent,setPercent]=useState(10),[base,setBase]=useState(10000);
const values=[base,base*percent/100,base*(percent/100)**2,base*(percent/100)**3];
return <div style={{borderTop:"1px solid #cbd5e1",paddingTop:16,marginTop:18}}>
<h3 style={{fontSize:20,fontWeight:750}}>محاكاة حسابية للهرم الطاقي</h3>
<p>غيّر الكفاءة الافتراضية وشاهد الفرق بين المستويات الأربعة. هذه الأرقام ليست قياسات ولا تعني أن الكفاءة الطبيعية ثابتة.</p>
<label style={{display:"grid",gap:7}}>الطاقة الابتدائية (وحدة افتراضية)
<input type="number" min={100} max={1000000} value={base} onChange={e=>setBase(Math.min(1000000,Math.max(100,Number(e.target.value)||100)))} style={field}/></label>
<label style={{display:"grid",gap:7,marginTop:12}}>الكفاءة المفترضة: {percent}%
<input type="range" min={5} max={30} step={1} value={percent} onChange={e=>setPercent(Number(e.target.value))}/></label>
<output aria-live="polite" style={{display:"grid",gap:5,marginTop:12}}>{values.map((v,i)=><div key={i} style={{padding:9,background:"white",borderRadius:7}}>المستوى {i+1}: {v.toLocaleString("ar",{maximumFractionDigits:2})} وحدة</div>)}</output></div>;
}
export function ExpertKnowledgeCheck({slug}:{slug:string}){
const data=items[slug];const [index,setIndex]=useState(0),[picked,setPicked]=useState<number|null>(null),[shown,setShown]=useState(false);
if(!data)return null;const q=data.qa[index];
return <section id="interactive-tool" style={wrap} aria-labelledby="expert-learning-heading">
<h2 id="expert-learning-heading" style={{fontSize:24,fontWeight:800,marginBottom:8}}>{data.heading}</h2>
<p>سؤال تفاعلي تعليمي من إعداد لوسيل لقياس فهم المفهوم، وليس تقييمًا معتمدًا أو بديلاً عن الشرح والمصادر.</p>
<p style={{marginTop:14,fontWeight:700}}>{q.question}</p>
<div role="group" aria-label="اختر الإجابة" style={{display:"grid",gap:8,marginTop:12}}>{q.options.map((o,i)=><button key={i} type="button" aria-pressed={picked===i} onClick={()=>{setPicked(i);setShown(false)}} style={{textAlign:"start",padding:12,border:"1px solid #9eb3c1",borderRadius:9,background:picked===i?"#d7eee6":"white",fontWeight:picked===i?750:400}}>{o}</button>)}</div>
<div style={{display:"flex",gap:12,alignItems:"center",marginTop:15,flexWrap:"wrap"}}>
<button type="button" disabled={picked===null} onClick={()=>setShown(true)} style={{padding:"9px 15px",border:"1px solid #8dbaaa",borderRadius:9,background:"#d8f1e7",opacity:picked===null?.5:1}}>تحقق من الإجابة</button>
<button type="button" onClick={()=>{setIndex(i=>(i+1)%data.qa.length);setPicked(null);setShown(false)}} style={{padding:"9px 15px",border:"1px solid #aab6c3",borderRadius:9,background:"white"}}>السؤال التالي</button>
<strong>السؤال {index+1} من {data.qa.length}</strong>
</div>
{shown?<output aria-live="polite" style={{display:"block",padding:15,marginTop:12,borderRadius:10,background:"white"}}>
<strong>{picked===q.correct?"إجابة صحيحة":"راجع الإجابة"}</strong><p>{q.why}</p></output>:null}
{slug==="molecular-formula-empirical-formula-calculation"?<MolecularCalculator/>:null}
{slug==="probability-sample-space-outcomes"?<ProbabilityCalculator/>:null}
{slug==="energy-flow-ecosystem"?<EnergyCalculator/>:null}
{slug==="conditional-probability-explained"?<ConditionalProbabilityCalculator/>:null}
{slug==="population-growth-demographic-transition"?<PopulationChangeCalculator/>:null}
{slug==="training-needs-analysis"?<TrainingGapCalculator/>:null}
{slug==="long-division-step-by-step"?<DivisionCheck/>:null}
{slug==="water-conservation-home-school"?<WaterSavingCalculator/>:null}
{slug==="mathematical-induction-examples-proof"?<InductionSumCheck/>:null}
</section>;
}
