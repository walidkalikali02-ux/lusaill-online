import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
export const metadata:Metadata={title:"معارف وأدوات تعليمية أصلية",description:"أدلة عربية وأدوات تعليمية أصلية من لوسيل مع جداول دقيقة وتمارين ومراجع واضحة.",alternates:pageAlternates("/knowledge"),robots:{index:true,follow:true}};
const guides=[
{href:"/knowledge/crystals-vs-precipitates",title:"البلورات والرواسب في المحاليل",description:"شرح علمي موثق مع جدول مقارنة وتجربة ملح آمنة واختبار تفاعلي.",kind:"كيمياء · تجربة وأداة"},
{href:"/knowledge/environmental-majors",title:"التخصصات البيئية ومجالات العمل",description:"مقارنة البرامج والمهارات مع مستكشف تفاعلي للمسارات.",kind:"تعليم ومهن · مستكشف مسارات"},
{href:"/knowledge/choosing-university-major",title:"كيف تختار تخصصك الجامعي؟",description:"إطار عمل موثق وأداة للمقارنة بين تخصصين، دون وعود برواتب أو وظائف.",kind:"توجيه جامعي · مصفوفة قرار"},
{href:"/knowledge/roman-numerals",title:"الأرقام الرومانية من 1 إلى 100",description:"جدول كامل وقواعد القراءة مع محول مجاني يعمل داخل المتصفح.",kind:"رياضيات · أداة تفاعلية"},
{href:"/knowledge/learning-objectives",title:"كيف تكتب أهدافًا تعليمية قابلة للقياس؟",description:"دليل بلوم مع أمثلة قابلة للتعديل ومساعد لصياغة الأهداف.",kind:"تعليم · نموذج أصلي"}
];
export default function KnowledgeIndex(){
return <main id="main-content" className="shell" style={{paddingBlock:52}}>
<nav aria-label="مسار التنقل" style={{color:"#64748b",marginBottom:16}}><Link href="/">الرئيسية</Link> / معارف وأدوات</nav>
<h1 style={{fontSize:"clamp(30px,4vw,44px)",fontWeight:800,marginBottom:16}}>معارف وأدوات تعليمية من لوسيل</h1>
<p style={{fontSize:18,color:"#475569",maxWidth:820,marginBottom:30}}>لا نكتفي بذكر المعلومة، بل نقدم جدولًا أو تمرينًا أو أداة تساعدك على التطبيق. اختر الموضوع الذي تريد تعلمه.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:18}}>
{guides.map(guide=><Link href={guide.href} key={guide.href} style={{border:"1px solid #e2e8f0",borderRadius:16,background:"white",padding:24,display:"grid",gap:13}}>
<span style={{fontSize:13,color:"#475569"}}>{guide.kind}</span><strong style={{fontSize:24}}>{guide.title}</strong><span style={{color:"#64748b"}}>{guide.description}</span><span style={{color:"#0f766e",fontWeight:700}}>افتح الدليل ←</span>
</Link>)}
</div>
<p style={{marginTop:28,color:"#64748b"}}>نوضح مصادرنا ونراجع المقالات عالية المخاطر قبل النشر. <Link href="/editorial-policy" style={{textDecoration:"underline"}}>منهج التحرير والتصحيح</Link>.</p>
</main>;
}
