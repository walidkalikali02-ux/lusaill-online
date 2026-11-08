import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
export const metadata:Metadata={title:"مقالات موسوعة لوسيل والمعارف والأدوات",description:"مقالات عربية في العلوم والصحة والتعليم والتقنية والحياة اليومية، مع أدوات تفاعلية ومراجع ومصادر واضحة.",alternates:pageAlternates("/knowledge"),robots:{index:true,follow:true}};
const guides=[
{href:"/knowledge/scientific-hypothesis-variables",title:"الفرضية العلمية والمتغيرات",description:"تصميم تجربة وفحص المتغيرات وتفسير النتائج.",kind:"العلوم · منهج بحث"},
{href:"/knowledge/long-division-step-by-step",title:"القسمة المطولة خطوة بخطوة",description:"خارج القسمة والباقي والأصفار وحاسبة تحقق.",kind:"الرياضيات · حاسبة"},
{href:"/knowledge/times-higher-education-ranking-methodology-2027",title:"تصنيف THE العالمي للجامعات 2027",description:"المنهجية الرسمية وأوزان الركائز وكيف تقرأ الترتيب.",kind:"الجامعات · تصنيف"},
{href:"/knowledge/water-conservation-home-school",title:"ترشيد المياه في المنزل والمدرسة",description:"العداد والتسربات وتقدير الهدر وحاسبة مياه.",kind:"البيئة · حاسبة"},
{href:"/knowledge/my-future-self-essay-arabic-english",title:"تعبير كيف أرى نفسي في المستقبل",description:"نماذج عربية وإنجليزية أصلية وتدرج في كتابة الطموح.",kind:"التعبير · نماذج"},
{href:"/knowledge/how-internet-changed-the-world-essay-arabic-english",title:"تعبير كيف غيّر الإنترنت العالم",description:"فوائد وتحديات ونماذج بالإنجليزية والعربية.",kind:"التقنية · تعبير"},
{href:"/knowledge/how-to-choose-a-true-friend",title:"كيف تختار الصديق الحقيقي؟",description:"الاحترام والثقة والحدود وحل الخلافات ونموذج تعبير.",kind:"العلاقات · إرشاد"},
{href:"/knowledge/chemical-reactivity-properties-factors",title:"العوامل المؤثرة في التفاعل الكيميائي",description:"طاقة التنشيط والتركيز والحرارة والسطح والمحفز.",kind:"الكيمياء · شرح"},
{href:"/knowledge/living-organisms-dependence-ecology",title:"اعتماد المخلوقات الحية بعضها على بعض",description:"التغذية والتكافل والتنافس والتطفل والشبكات.",kind:"الأحياء · بيئة"},
{href:"/knowledge/mathematical-induction-examples-proof",title:"الاستقراء الرياضي مع 3 أمثلة",description:"حالة الأساس وفرض الاستقراء والبرهان خطوة بخطوة.",kind:"الرياضيات · برهان"},
{href:"/knowledge/meeting-request-email-english",title:"إيميل تحديد موعد اجتماع بالإنجليزي",description:"نماذج مهنية جاهزة للتعديل ورسائل متابعة وأخطاء يجب تجنبها.",kind:"الإنجليزية · نماذج"},
{href:"/knowledge/conditional-probability-explained",title:"الاحتمال المشروط: قانون وأمثلة",description:"فهم المقام المشروط والاستقلال وجداول التكرار مع حاسبة.",kind:"الإحصاء · حاسبة"},
{href:"/knowledge/population-growth-demographic-transition",title:"النمو السكاني والتحول الديموغرافي",description:"معادلة السكان والزيادة الطبيعية والهجرة وأداة حساب.",kind:"السكان · أداة"},
{href:"/knowledge/first-year-university-adjustment",title:"التكيف مع الحياة الجامعية",description:"خطة الشهر الأول للدراسة والوقت والميزانية والدعم.",kind:"التعليم · خطة"},
{href:"/knowledge/water-pollution-causes-treatment",title:"تلوث المياه وأسبابه ومعالجته",description:"مصادر التلوث والمسارات والمراقبة وإرشادات السلامة.",kind:"البيئة · مصادر"},
{href:"/knowledge/work-stress-prevention-management",title:"ضغوط العمل وإدارتها",description:"المخاطر المهنية والحلول المؤسسية ودعم العاملين.",kind:"العمل · سلامة"},
{href:"/knowledge/teach-children-reading-writing-foundations",title:"تأسيس الطفل في القراءة والكتابة",description:"الأصوات والحروف وفك الرموز والإملاء والفهم.",kind:"التعليم المبكر · نشاط"},
{href:"/knowledge/safe-simple-chemistry-experiments",title:"تجارب كيميائية بسيطة وآمنة",description:"خمسة أنشطة توضيحية مع قواعد السلامة وتوثيق الملاحظات.",kind:"الكيمياء · تجارب"},
{href:"/knowledge/training-needs-analysis",title:"تحديد الاحتياجات التدريبية للموظفين",description:"فجوة المهارة ومصفوفة الأولويات وحاسبة تدريبية.",kind:"الموارد البشرية · أداة"},
{href:"/knowledge/soil-formation-five-factors",title:"كيف تتكوّن التربة؟",description:"العوامل الخمسة والمادة الأم والطبقات والملمس.",kind:"علوم الأرض · خريطة"},
{href:"/knowledge/lightning-charge-separation-clouds",title:"كيف تتكون الشحنات في السحب؟",description:"دليل كهرباء العواصف والبرق والسلامة، بمخطط واختبار.",kind:"الفيزياء · البرق"},
{href:"/knowledge/strong-argument-evidence-criteria",title:"كيف تميّز البرهان القوي؟",description:"8 معايير للمنطق والحجج والأدلة والمغالطات.",kind:"التفكير النقدي · الأدلة"},
{href:"/knowledge/molecular-formula-empirical-formula-calculation",title:"الصيغة الجزيئية والصيغة الأولية",description:"شرح محلول للكتلة المولية والمضاعفات وحاسبة.",kind:"الكيمياء · صيغة جزيئية"},
{href:"/knowledge/separate-oil-water",title:"كيف نفصل الزيت عن الماء؟",description:"فصل السوائل غير الممتزجة والسكب وقمع الفصل.",kind:"الكيمياء · فصل السوائل"},
{href:"/knowledge/separate-iron-sand",title:"فصل برادة الحديد عن الرمل",description:"تجربة مغناطيسية آمنة وحدود الفصل.",kind:"الكيمياء · فصل المخاليط"},
{href:"/knowledge/meiosis-crossing-over-prophase-i",title:"العبور الوراثي في الطور التمهيدي الأول",description:"إعادة تركيب DNA والكيازما وأمثلة الأليلات.",kind:"الأحياء · الوراثة"},
{href:"/knowledge/ants-acacia-mutualism",title:"النمل وأشجار السنط: كيف يحدث التكافل؟",description:"الأشواك المجوفة والرحيق والدفاع البيئي.",kind:"البيئة · المنفعة المتبادلة"},
{href:"/knowledge/digit-versus-number",title:"الفرق بين الرقم والعدد",description:"القيمة المكانية والأرقام العشرية وتمارين.",kind:"رياضيات · مفاهيم"},
{href:"/knowledge/probability-sample-space-outcomes",title:"النواتج الممكنة وفضاء العينة",description:"العملة والنرد ومخططات الشجرة وحاسبة.",kind:"الاحتمالات · فضاء العينة"},
{href:"/knowledge/energy-flow-ecosystem",title:"انتقال الطاقة في النظام البيئي",description:"هرم الطاقة والشبكات الغذائية وكفاءة الانتقال.",kind:"علم البيئة · هرم الطاقة"},
{href:"/knowledge/pie-chart-proportional-circle-guide",title:"تمثيل البيانات بالدائرة النسبية",description:"خطوات حساب النسب وزوايا القطاعات مع حاسبة رسم تفاعلية.",kind:"الإحصاء · حاسبة زوايا"},
{href:"/knowledge/how-to-find-a-job",title:"كيف تحصل على وظيفة؟",description:"دليل البحث والتقديم الآمن والمقابلات ومتعقب طلبات قابل للتصدير.",kind:"التوظيف · متعقب CSV"},
{href:"/knowledge/eight-steps-research-process",title:"الخطوات الثماني للعملية البحثية",description:"دليل بحث موثق مع مصفوفة ادعاءات وأدلة تفاعلية وخطة عملية.",kind:"البحث العلمي · مصفوفة أدلة"},
{href:"/knowledge/creative-lesson-design",title:"تصميم درس إبداعي في 9 خطوات",description:"ربط الأهداف والتقييم والأنشطة مع مولد خطة 30 أو 45 أو 60 دقيقة.",kind:"التدريس · أداة خطة درس"},
{href:"/knowledge/four-steps-math-problem-solving",title:"الخطوات الأربع لحل المسألة الرياضية",description:"طريقة بوليا مع أمثلة محلولة وأداة تدريب للمسائل خطوة بخطوة.",kind:"رياضيات · تدريب تفاعلي"},
{href:"/knowledge/sq3r-deep-reading",title:"الخطوات الخمس للقراءة المتعمقة",description:"طريقة SQ3R مع أمثلة وأسئلة ونموذج استرجاع ومراجعة تفاعلي.",kind:"دراسة وفهم · دفتر SQ3R"},
{href:"/knowledge/how-to-write-a-report",title:"كيفية كتابة تقرير احترافي",description:"دليل التقرير الإداري والأكاديمي مع أمثلة ومولّد مخطط عملي.",kind:"كتابة التقارير · أداة أصلية"},
{href:"/knowledge/mind-maps-for-studying",title:"الخرائط الذهنية للمذاكرة",description:"طريقة وأمثلة ومحرر خريطة ذهنية مع اختبار الاسترجاع.",kind:"مهارات الدراسة · أداة أصلية"},
{href:"/knowledge/game-based-learning-classroom",title:"التعلم بالألعاب في الفصل الدراسي",description:"دليل بالأدلة وأمثلة قياس التعلم ومولّد خطة لعبة تعليمية.",kind:"التربية · خطة درس تفاعلية"},
{href:"/knowledge/open-education-higher-learning",title:"التعليم المفتوح والتعليم عن بعد",description:"الفرق بين البرامج والمقررات المفتوحة والاعتراف بالمؤهلات وقائمة التحقق.",kind:"التعليم العالي · فاحص اعتماد"},
{href:"/knowledge/food-poisoning-risky-foods",title:"10 أطعمة قد تسبب التسمم الغذائي",description:"الوقاية والطهي الآمن وقائمة تحقق منزلية مع مصادر CDC وWHO.",kind:"سلامة الغذاء · قائمة تفاعلية"},
{href:"/knowledge/immune-system-support",title:"عادات تدعم صحة جهاز المناعة",description:"التمييز بين الأدلة والادعاءات عن المكملات والعادات الصحية.",kind:"الصحة · تحليل الأدلة"},
{href:"/knowledge/improve-focus",title:"11 طريقة لتحسين التركيز",description:"خطوات قابلة للتجربة وخطة أسبوعية تفاعلية لمتابعة العادات.",kind:"التعلّم · خطة 7 أيام"},
{href:"/knowledge/positive-school-discipline",title:"الانضباط المدرسي الإيجابي",description:"ممارسات عملية وخطة 4 أسابيع مع أمثلة لمواقف صفية.",kind:"التعليم · خطة أسبوعية"},
{href:"/knowledge/writing-topic-steps",title:"خطوات بناء الموضوع بالترتيب",description:"مقدمة وعرض وخاتمة وتنظيم الأفكار مع أداة كتابة المخطط.",kind:"الكتابة · أداة تفاعلية"},
{href:"/knowledge/crystals-vs-precipitates",title:"البلورات والرواسب في المحاليل",description:"شرح علمي موثق مع جدول مقارنة وتجربة ملح آمنة واختبار تفاعلي.",kind:"كيمياء · تجربة وأداة"},
{href:"/knowledge/environmental-majors",title:"التخصصات البيئية ومجالات العمل",description:"مقارنة البرامج والمهارات مع مستكشف تفاعلي للمسارات.",kind:"تعليم ومهن · مستكشف مسارات"},
{href:"/knowledge/choosing-university-major",title:"كيف تختار تخصصك الجامعي؟",description:"إطار عمل موثق وأداة للمقارنة بين تخصصين، دون وعود برواتب أو وظائف.",kind:"توجيه جامعي · مصفوفة قرار"},
{href:"/knowledge/roman-numerals",title:"الأرقام الرومانية من 1 إلى 100",description:"جدول كامل وقواعد القراءة مع محول مجاني يعمل داخل المتصفح.",kind:"رياضيات · أداة تفاعلية"},
{href:"/knowledge/learning-objectives",title:"كيف تكتب أهدافًا تعليمية قابلة للقياس؟",description:"دليل بلوم مع أمثلة قابلة للتعديل ومساعد لصياغة الأهداف.",kind:"تعليم · نموذج أصلي"}
];
export default function KnowledgeIndex(){
return <main id="main-content" className="shell" style={{paddingBlock:52}}>
<nav aria-label="مسار التنقل" style={{color:"#64748b",marginBottom:16}}><Link href="/">الرئيسية</Link> / معارف وأدوات</nav>
<h1 style={{fontSize:"clamp(30px,4vw,44px)",fontWeight:800,marginBottom:16}}>استكشف مقالات موسوعة لوسيل</h1>
<p style={{fontSize:18,color:"#475569",maxWidth:820,marginBottom:30}}>اكتشف مقالات الموسوعة في موضوعات العلوم والصحة والتعليم والتقنية والحياة اليومية. بعض الموضوعات تتضمن جداول وتمارين وأدوات عملية تساعدك على الفهم، ونعمل على توسيع التغطية باستمرار.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:18}}>
{guides.map(guide=><Link href={guide.href} key={guide.href} style={{border:"1px solid #e2e8f0",borderRadius:16,background:"white",padding:24,display:"grid",gap:13}}>
<span style={{fontSize:13,color:"#475569"}}>{guide.kind}</span><strong style={{fontSize:24}}>{guide.title}</strong><span style={{color:"#64748b"}}>{guide.description}</span><span style={{color:"#0f766e",fontWeight:700}}>افتح الدليل ←</span>
</Link>)}
</div>
<p style={{marginTop:22,color:"#205a52"}}><Link href="/topics" style={{textDecoration:"underline",fontWeight:700}}>استكشف جميع فئات الموسوعة ←</Link></p>
<p style={{marginTop:28,color:"#64748b"}}>نوضح مصادرنا ونراجع المقالات عالية المخاطر قبل النشر. <Link href="/editorial-policy" style={{textDecoration:"underline"}}>منهج التحرير والتصحيح</Link>.</p>
</main>;
}
