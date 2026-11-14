import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { siteConfig, siteSocialImage } from "@/lib/site-config";
export const metadata: Metadata = {
 title: { absolute: "أدلة الخدمات الحكومية والمعرفة العربية | لوسيل" },
 description: siteConfig.description, alternates: pageAlternates("/"),
 openGraph: { type: "website", images: [siteSocialImage], title: "أدلة الخدمات الحكومية والمعرفة العربية | لوسيل", description: siteConfig.description, url: "/" },
};
const projects = [
 { n: "01", title: "موسوعة لوسيل", tag: "المعرفة", text: "مشروعنا المعرفي باللغة العربية. موضوعات وشروحات في العلوم والتعليم والتقنية والحياة اليومية، مع أدوات تساعد على الفهم.", href: "/knowledge" },
 { n: "02", title: "خدمات لوسيل", tag: "الحلول الرقمية", text: "من الفكرة إلى حضور رقمي واضح. خدمات إنشاء وتصميم المواقع للأفراد والشركات والمشاريع الصغيرة.", href: "/services" },
 { n: "03", title: "لوسيل تعلّم", tag: "التعليم", text: "كورسات ودروس منظّمة، من المفاهيم الأساسية إلى التطبيق. مساحة للتعلّم على مهل ومراجعة ما تحتاجه.", href: "/courses" },
 { n: "04", title: "الأدلة العملية", tag: "الخدمات والحياة اليومية", text: "أدلة مستقلة ومسارات مهام لفهم الإجراءات والخدمات، مع خطوات واضحة ومراجع رسمية.", href: "/articles" },
 { n: "05", title: "كاريكاتير لوسيل", tag: "المحتوى البصري", text: "قراءة بصرية للأحداث والأفكار من خلال أعمال الكاريكاتير المنشورة في لوسيل.", href: "/caricatures" }
];
const startingPoints = [
  {
    title: "الخدمات الحكومية في مصر",
    description: "حدّد الإجراء الذي تحتاجه، وراجع الخطوات والمستندات وروابط الجهات الرسمية قبل تقديم الطلب.",
    links: [
      ["/categories", "تصنيفات أدلة الخدمات"],
      ["/guides", "مسارات المهام خطوة بخطوة"],
      ["/categories/fawatir-alkahraba", "فواتير الكهرباء حسب شركة التوزيع"],
      ["/articles/electricity-bill-inquiry", "الاستعلام عن فاتورة الكهرباء"],
      ["/articles/code-electricity-meter", "العداد الكودي والمحاسبة والتحويل"],
      ["/articles/automated-birth-certificate", "استخراج شهادة ميلاد مميكنة"],
    ],
  },
  {
    title: "الموسوعة العربية والتعليم",
    description: "ابدأ بموضوع من الموسوعة أو اختر مسارًا دراسيًا يجمع الدروس والتمارين في مكان واحد.",
    links: [
      ["/topics", "فهرس موضوعات الموسوعة"],
      ["/topics/science", "العلوم والتجارب"],
      ["/topics/education", "التعليم ومهارات الدراسة"],
      ["/topics/technology", "التقنية والإنترنت"],
      ["/knowledge/manahej", "المناهج والأنشطة التفاعلية"],
      ["/courses/3d-figures-volumes", "دروس المجسمات والحجوم"],
    ],
  },
  {
    title: "الخدمات الرقمية",
    description: "تعرّف على خيارات العمل مع لوسيل حسب نوع مشروعك، من الموقع الإلكتروني إلى التصميم وإعداد الملفات.",
    links: [
      ["/services/website-design", "تصميم المواقع الإلكترونية"],
      ["/services/social-design", "تصاميم شبكات التواصل"],
      ["/services/video-editing", "مونتاج الفيديو"],
      ["/services/excel", "خدمات وإعداد ملفات Excel"],
    ],
  },
];

export default function Home() {
 const websiteSchema = { "@context":"https://schema.org", "@type":"WebSite", "@id":siteConfig.url+"/#website", url:siteConfig.url, name:"شركة لوسيل", description:siteConfig.description, inLanguage:"ar", publisher:{"@id":siteConfig.url+"/#organization"} };
 return <main id="main-content" className="company-home">
  <section className="company-hero">
   <div className="company-orbit" aria-hidden="true"><i/><i/><i/><span/></div>
   <div className="shell company-hero-content">
    <div className="company-kicker"><span>شركة لوسيل</span><span dir="ltr">LUSAILL / KNOWLEDGE & DIGITAL</span></div>
    <h1>أدلة الخدمات الحكومية <br/>والمعرفة العربية</h1>
    <div className="company-hero-bottom"><p>المعرفة بداية، والأثر ما نبنيه. <br/>مشاريع متعددة، تجمعها شركة لوسيل.</p><Link href="#projects" className="company-button">اكتشف مشاريعنا <span aria-hidden="true">↙</span></Link></div>
    <div className="company-caption"><span>رؤية واحدة. مشاريع متعددة.</span><span aria-hidden="true">↓</span><span dir="ltr">01 — LUSAILL</span></div>
   </div>
  </section>
  <section className="shell company-intro" id="company"><span className="company-label">01 / عن الشركة</span><div><h2>لوسيل.<br/>مساحة تتسع للأفكار<br/><span>وما تصنعه من أثر.</span></h2><p>شركة لوسيل تجمع الموسوعة والخدمات الرقمية والتعلّم والمحتوى البصري تحت مظلة واحدة. لكل مشروع مجاله وتجربته، وتجمعها غاية واحدة: تحويل المعرفة والأفكار إلى قيمة عملية.</p><Link className="company-inline-link" href="/contact">تواصل مع شركة لوسيل ←</Link></div></section>
  <section className="company-projects" id="projects"><div className="shell"><div className="company-section-title"><div><span className="company-label">02 / مشاريع الشركة</span><h2>أفكار لها وجهة.</h2></div><p>اكتشف مشاريع لوسيل.<br/>اختر المجال الذي يهمك وابدأ من هنا.</p></div>
   {projects.map(p => <Link className="company-project" href={p.href} key={p.n}><span className="project-num">{p.n}</span><div><span className="project-tag">{p.tag}</span><h3>{p.title}</h3></div><div className="project-details"><p>{p.text}</p><span>استكشف المشروع <b aria-hidden="true">←</b></span></div></Link>)}
  </div></section>
  <section className="shell company-principles" aria-labelledby="starting-points">
   <h2 id="starting-points">تصفّح حسب احتياجك</h2>
   <div className="principle-grid">
    {startingPoints.map(({ title, description, links }) => (
     <div key={title}>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
       {links.map(([href, label]) => <li key={href}><Link className="company-inline-link" href={href}>{label}</Link></li>)}
      </ul>
     </div>
    ))}
   </div>
  </section>
  <section className="company-end"><div className="shell"><span className="company-label">لنتحدث عن فكرتك</span><h2>الخطوة التالية تبدأ معك.</h2><Link className="company-button" href="/contact">تواصل معنا <span aria-hidden="true">←</span></Link></div></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteSchema).replace(/</g,"\\u003c")}}/>
 </main>;
}
