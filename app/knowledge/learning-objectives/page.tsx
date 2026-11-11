import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import { ObjectiveBuilder } from "./objective-builder";
const path="/knowledge/learning-objectives";
const title="صياغة الأهداف التعليمية القابلة للقياس مع أمثلة وتصنيف بلوم";
const description="دليل عملي لكتابة هدف تعليمي واضح وقابل للقياس: أمثلة قبل وبعد، مستويات بلوم الستة، قائمة تدقيق، وأداة مجانية لصياغة هدف الدرس.";
export const metadata:Metadata={title,description,alternates:pageAlternates(path),robots:{index:true,follow:true},openGraph:{title,description,url:path,type:"article",images:[{url:"/images/bloom-learning-levels-original.svg",alt:"المستويات الستة في تصنيف بلوم المنقح"}]}};
export const revalidate=86400;
const sections=[
{level:"التذكر",verb:"يسمي، يعدد، يحدد",example:"يسمي المتعلم ثلاث خصائص للمادة بعد قراءة النص."},
{level:"الفهم",verb:"يشرح، يلخص، يصنف",example:"يلخص المتعلم أسباب التبخر في فقرتين واضحتين."},
{level:"التطبيق",verb:"يستخدم، يحل، ينفذ",example:"يحل المتعلم أربع مسائل جمع باستخدام الاستراتيجية المشروحة."},
{level:"التحليل",verb:"يقارن، يميز، يحلل",example:"يقارن المتعلم بين مصدرين للمعلومات وفق ثلاثة معايير."},
{level:"التقييم",verb:"يحكم، يبرر، يقوّم",example:"يقيم المتعلم مصداقية خبر ويدعم حكمه بدليلين."},
{level:"الإبداع",verb:"يصمم، ينتج، يبتكر",example:"يصمم المتعلم مخططًا يوضح دورة الماء مع تسميات صحيحة."},
];
const h2={fontSize:26,fontWeight:700,margin:"28px 0 12px"} as const;
export default function LearningObjectivesPage(){
const url=absoluteUrl(path);
const breadcrumbSchema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"الرئيسية",item:absoluteUrl("/")},{"@type":"ListItem",position:2,name:"معارف وأدوات",item:absoluteUrl("/knowledge")},{"@type":"ListItem",position:3,name:title,item:url}]};
const schema={"@context":"https://schema.org","@type":"Article",headline:title,description,url,inLanguage:"ar",datePublished:"2026-11-06",author:{"@type":"Organization",name:"فريق لوسيل"},publisher:{"@type":"Organization",name:"لوسيل",url:absoluteUrl("/")},image:absoluteUrl("/images/bloom-learning-levels-original.svg")};
return <main id="main-content" className="shell" style={{paddingBlock:44}}><nav aria-label="مسار التنقل" style={{color:"#64748b",marginBottom:18}}><Link href="/">الرئيسية</Link> / <Link href="/knowledge">معارف وأدوات</Link> / الأهداف التعليمية</nav>
<article style={{maxWidth:950,margin:"auto"}}>
<header><p style={{fontSize:14,color:"#475569"}}>التعليم · مهارات التدريس · دليل بأمثلة أصلية</p><h1 style={{fontSize:"clamp(28px,4vw,43px)",fontWeight:800,lineHeight:1.5,margin:"12px 0"}}>{title}</h1>
<p style={{fontSize:18}}>الهدف التعليمي الجيد يوضح ما يستطيع المتعلم فعله بعد الدرس، وكيف نتحقق من إنجازه. مثلًا: «بنهاية الدرس، يقارن الطالب بين كسرين لهما المقام نفسه في أربع مسائل من أصل خمس» أكثر قابلية للتقييم من «أن يفهم الطالب الكسور».</p>
<p style={{color:"#64748b",fontSize:13,marginTop:10}}>نشر: 6 نوفمبر 2026 · إعداد: فريق لوسيل · مصدر مرجعي: جامعة كورنيل</p>
</header>
<figure style={{margin:"25px 0"}}><Image src="/images/bloom-learning-levels-original.svg" alt="رسم توضيحي أصلي للمستويات الستة من التذكر والفهم والتطبيق والتحليل والتقييم إلى الإبداع" width={1200} height={630} unoptimized style={{width:"100%",height:"auto",borderRadius:15}}/><figcaption style={{fontSize:13,color:"#64748b"}}>صورة أصلية تلخص تصنيف بلوم المعرفي المنقح؛ المستوى ليس قيمة لجودة المتعلم بل نوع العملية المعرفية المطلوبة.</figcaption></figure>
<section style={{background:"#eff6ff",border:"1px solid #c9dbea",padding:22,borderRadius:14}}><h2 style={{fontSize:23,fontWeight:700}}>الإجابة المباشرة</h2><p>لصياغة هدف تعليمي واضح، اجمع بين أربعة عناصر: المتعلم، والفعل القابل للملاحظة، والمحتوى المستهدف، ومعيار النجاح إن كان مناسبًا. ثم تأكد أن أداة التقييم تقيس المهارة الموصوفة في الهدف فعلًا.</p></section>
<h2 style={h2}>كيف تحول هدفًا عامًا إلى هدف قابل للقياس؟</h2>
<div style={{display:"grid",gap:12}}><section style={{padding:18,borderRadius:12,background:"#fff1f2"}}><b>قبل التحسين:</b> «أن يفهم الطالب الإحصاء». <p>لا تحدد هذه العبارة ما السلوك الذي يثبت الفهم، ولا طريقة التقييم.</p></section><section style={{padding:18,borderRadius:12,background:"#ecfdf5"}}><b>بعد التحسين:</b> «بنهاية الدرس، يحسب الطالب المتوسط الحسابي لخمس مجموعات بيانات، ويقدم أربع إجابات صحيحة على الأقل».</section></div>
<h2 style={h2}>مكونات الهدف التعليمي</h2>
<ol style={{paddingInlineStart:24,lineHeight:2}}>
<li><b>المتعلم:</b> من الذي سيؤدي المهمة؟ الطالب أو المتدرب.</li>
<li><b>الفعل:</b> استخدم فعلًا يمكن ملاحظة ناتجه؛ مثل يحسب أو يقارن أو يشرح.</li>
<li><b>المحتوى:</b> ما الموضوع أو المهارة المراد إتقانها؟</li>
<li><b>الشرط والمعيار:</b> أضف الأدوات أو الوقت أو درجة الدقة عندما تكون مؤثرة حقًا في تحقيق الهدف.</li>
</ol>
<ObjectiveBuilder/>
<h2 style={h2}>تصنيف بلوم المنقح مع أمثلة لكل مستوى</h2>
<p>تصنيف بلوم يساعد المعلم على تنويع العمليات المعرفية المطلوبة، ولا يعني أن كل درس يجب أن يبدأ بالمستوى الأدنى أو يستخدم المستويات الستة كلها.</p>
<div style={{overflowX:"auto",border:"1px solid #e5e7eb",borderRadius:12,marginTop:12}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead style={{background:"#eaf2f6"}}><tr><th style={{padding:13}}>المستوى</th><th>أفعال مناسبة</th><th>مثال قابل للتعديل</th></tr></thead><tbody>{sections.map((s,i)=><tr key={s.level} style={{background:i%2?"#f8fafc":"#fff"}}><td style={{padding:13,borderTop:"1px solid #e5e7eb",fontWeight:700}}>{s.level}</td><td style={{padding:13,borderTop:"1px solid #e5e7eb"}}>{s.verb}</td><td style={{padding:13,borderTop:"1px solid #e5e7eb"}}>{s.example}</td></tr>)}</tbody></table></div>
<h2 style={h2}>قائمة مراجعة الهدف قبل اعتماده</h2>
<ul style={{paddingInlineStart:25,lineHeight:2}}><li>هل يستطيع المتعلم فهم المطلوب دون شرح إضافي طويل؟</li><li>هل الفعل يصف أداءً يمكن ملاحظته؟</li><li>هل هناك انسجام بين الهدف والنشاط والتقييم؟</li><li>هل معيار النجاح واقعي ومناسب لعمر المتعلمين ووقت الدرس؟</li><li>هل يتجنب الهدف جمع عدة نتائج تعليمية مختلفة في جملة واحدة؟</li></ul>
<h2 style={h2}>أخطاء شائعة في صياغة الأهداف</h2>
<p>من الأخطاء الاعتماد على فعل غامض بلا دليل، أو وضع معيار رقمي اعتباطي، أو صياغة هدف عن نشاط المعلم بدل أداء المتعلم، أو المطالبة بمهارة تحليلية ثم قياسها باختبار حفظ فقط.</p>
<h2 style={h2}>مصادر موثوقة</h2>
<p>المرجع الرئيسي: <a href="https://teaching.cornell.edu/resource/blooms-taxonomy" style={{color:"#2563eb",textDecoration:"underline"}} target="_blank" rel="noopener noreferrer">Cornell University — Bloom’s Taxonomy</a> (فئات مستويات التفكير والأفعال الشائعة). الأمثلة والصياغات هنا من إعداد لوسيل لغرض التدريب، ولا تعكس نصًا حرفيًا للجامعة.</p>
<p style={{marginTop:25}}>دليل مرتبط: <Link href="/knowledge/roman-numerals" style={{color:"#2563eb",textDecoration:"underline"}}>الأرقام الرومانية من 1 إلى 100 مع محول مجاني</Link>.</p>
</article><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,"\\u003c")}}/></main>;
}
