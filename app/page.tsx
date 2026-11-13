import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { siteConfig } from "@/lib/site-config";
export const metadata: Metadata = {
 title: { absolute: "شركة لوسيل | المعرفة والخدمات والمشاريع الرقمية" },
 description: siteConfig.description, alternates: pageAlternates("/"),
 openGraph: { title: "شركة لوسيل | المعرفة بداية الأثر", description: siteConfig.description, url: "/" },
};
const projects = [
 { n: "01", title: "موسوعة لوسيل", tag: "المعرفة", text: "مشروعنا المعرفي باللغة العربية. موضوعات وشروحات في العلوم والتعليم والتقنية والحياة اليومية، مع أدوات تساعد على الفهم.", href: "/knowledge" },
 { n: "02", title: "خدمات لوسيل", tag: "الحلول الرقمية", text: "من الفكرة إلى حضور رقمي واضح. خدمات إنشاء وتصميم المواقع للأفراد والشركات والمشاريع الصغيرة.", href: "/services" },
 { n: "03", title: "لوسيل تعلّم", tag: "التعليم", text: "كورسات ودروس منظّمة، من المفاهيم الأساسية إلى التطبيق. مساحة للتعلّم على مهل ومراجعة ما تحتاجه.", href: "/courses" },
 { n: "04", title: "الأدلة العملية", tag: "الخدمات والحياة اليومية", text: "أدلة مستقلة ومسارات مهام لفهم الإجراءات والخدمات، مع خطوات واضحة ومراجع رسمية.", href: "/articles" },
 { n: "05", title: "كاريكاتير لوسيل", tag: "المحتوى البصري", text: "قراءة بصرية للأحداث والأفكار من خلال أعمال الكاريكاتير المنشورة في لوسيل.", href: "/caricatures" }
];
export default function Home() {
 const websiteSchema = { "@context":"https://schema.org", "@type":"WebSite", "@id":siteConfig.url+"/#website", url:siteConfig.url, name:"شركة لوسيل", description:siteConfig.description, inLanguage:"ar", publisher:{"@id":siteConfig.url+"/#organization"} };
 return <main id="main-content" className="company-home">
  <section className="company-hero">
   <div className="company-orbit" aria-hidden="true"><i/><i/><i/><span/></div>
   <div className="shell company-hero-content">
    <div className="company-kicker"><span>شركة لوسيل</span><span dir="ltr">LUSAILL / KNOWLEDGE & DIGITAL</span></div>
    <h1>المعرفة بداية.<br/>والأثر ما نبنيه.</h1>
    <div className="company-hero-bottom"><p>المعرفة والخدمات والتعلّم.<br/>مشاريع متعددة، تجمعها شركة لوسيل.</p><Link href="#projects" className="company-button">اكتشف مشاريعنا <span aria-hidden="true">↙</span></Link></div>
    <div className="company-caption"><span>رؤية واحدة. مشاريع متعددة.</span><span aria-hidden="true">↓</span><span dir="ltr">01 — LUSAILL</span></div>
   </div>
  </section>
  <section className="shell company-intro" id="company"><span className="company-label">01 / عن الشركة</span><div><h2>لوسيل.<br/>مساحة تتسع للأفكار<br/><span>وما تصنعه من أثر.</span></h2><p>شركة لوسيل تجمع الموسوعة والخدمات الرقمية والتعلّم والمحتوى البصري تحت مظلة واحدة. لكل مشروع مجاله وتجربته، وتجمعها غاية واحدة: تحويل المعرفة والأفكار إلى قيمة عملية.</p><Link className="company-inline-link" href="/contact">تواصل مع شركة لوسيل ←</Link></div></section>
  <section className="company-projects" id="projects"><div className="shell"><div className="company-section-title"><div><span className="company-label">02 / مشاريع الشركة</span><h2>أفكار لها وجهة.</h2></div><p>اكتشف مشاريع لوسيل.<br/>اختر المجال الذي يهمك وابدأ من هنا.</p></div>
   {projects.map(p => <Link className="company-project" href={p.href} key={p.n}><span className="project-num">{p.n}</span><div><span className="project-tag">{p.tag}</span><h3>{p.title}</h3></div><div className="project-details"><p>{p.text}</p><span>استكشف المشروع <b aria-hidden="true">←</b></span></div></Link>)}
  </div></section>
  <section className="shell company-principles"><span className="company-label">03 / من الفكرة إلى التطبيق</span><h2>نفهم الاحتياج.<br/>نوضّح الطريق.</h2><div className="principle-grid"><div><span>01</span><h3>معرفة يمكن فهمها</h3><p>موضوعات وشروحات وأدلة تساعد على فهم الفكرة وسياقها.</p></div><div><span>02</span><h3>تعلّم بخطوات واضحة</h3><p>دروس ومسارات تربط المفاهيم بالتطبيق والمراجعة.</p></div><div><span>03</span><h3>خدمات تدعم مشروعك</h3><p>حلول رقمية لتحويل فكرتك إلى حضور يستطيع الناس الوصول إليه.</p></div></div></section>
  <section className="company-end"><div className="shell"><span className="company-label">لنتحدث عن فكرتك</span><h2>الخطوة التالية تبدأ معك.</h2><Link className="company-button" href="/contact">تواصل معنا <span aria-hidden="true">←</span></Link></div></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema).replace(/</g,"\\u003c")}}/>
 </main>;
}
