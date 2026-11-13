import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import s from "../studio.module.css";

const title = "إنشاء موقع إلكتروني احترافي | 500 ريال شهريًا";
const description = "أنشئ موقعًا إلكترونيًا احترافيًا لنشاطك التجاري مع لوسيل مقابل 500 ريال قطري شهريًا. تصميم متوافق مع الجوال وصفحات واضحة وتجربة تواصل مريحة للعملاء.";
export const metadata: Metadata = {
  title, description, alternates: pageAlternates("/services/website-design"),
  openGraph: { title, description, url: "/services/website-design", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};
const features = [
  { title: "تصميم يعكس هويتك", text: "ألوان وخطوط وتنظيم يناسب نشاطك." },
  { title: "تجربة مريحة على الجوال", text: "صفحات تتكيّف مع الهاتف والأجهزة اللوحية والكمبيوتر." },
  { title: "محتوى يسهل تصفّحه", text: "هيكلة واضحة وعناوين ووصف أساسي لمحركات البحث." },
  { title: "طرق تواصل مباشرة", text: "وسائل تواصل مثل واتساب ونماذج الاستفسار حسب نطاق العمل." },
];
const steps = [
  { number: "01", title: "أخبرنا عن مشروعك", text: "أرسل اسم النشاط ونوع الموقع الذي تريده وبعض الأمثلة التي تعجبك." },
  { number: "02", title: "نحدد النطاق والتصميم", text: "نتفق على الصفحات والمحتوى والوظائف وتفاصيل الاشتراك قبل التنفيذ." },
  { number: "03", title: "نجهز الموقع للنشر", text: "نراجع التصميم والمحتوى والتواصل معك ثم ننسق موعد الإطلاق." },
];
export default function WebsiteDesignPage() {
  const contactUrl = '/services/request?service=website-design';
  const contactLabel = 'ابدأ طلب إنشاء موقع';
  const serviceSchema = {
    "@context": "https://schema.org", "@type": "Service", name: "خدمة إنشاء المواقع الإلكترونية", description,
    serviceType: "تصميم وتطوير المواقع الإلكترونية",
    provider: { "@type": "Organization", "@id": siteConfig.url + "/#organization", name: "لوسيل", url: siteConfig.url },
    areaServed: { "@type": "Place", name: "قطر" }, url: absoluteUrl("/services/website-design"),
    offers: { "@type": "Offer", price: "500", priceCurrency: "QAR", priceSpecification: { "@type": "UnitPriceSpecification", price: "500", priceCurrency: "QAR", unitText: "شهر" } },
  };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "الخدمات", item: absoluteUrl("/services") },
    { "@type": "ListItem", position: 3, name: "إنشاء المواقع", item: absoluteUrl("/services/website-design") },
  ] };
  return <main id="main-content" className={s.root}>
    <header className={s.detailHero}>
      <div className={`${s.wrap} ${s.detailGrid}`}>
        <div>
          <nav className={s.crumb} aria-label="مسار التصفح"><Link href="/services">الخدمات</Link><span aria-hidden="true"> / </span><span aria-current="page">إنشاء المواقع</span></nav>
          <h1>موقع إلكتروني<br />يعبّر عن نشاطك</h1>
          <p className={s.lead}>صمّم موقعًا يعرّف العملاء بما تقدّمه ويسهّل عليهم التواصل معك، بتجربة واضحة على الجوال والكمبيوتر.</p>
          <div className={s.actions}>
            <Link href={contactUrl} className={s.button}>{contactLabel} <span aria-hidden="true">←</span></Link>
            <a href="#pricing" className={s.textLink}>عرض الاشتراك</a>
          </div>
        </div>
        <figure className={s.preview}>
          <div className={s.browserBar} aria-hidden="true"><span>● ● ●</span><span>معاينة التصميم</span></div>
          <div className={s.previewPage} aria-hidden="true">
            <div className={s.previewCopy}><strong>دار</strong><span>للعمارة والتصميم</span><p>مساحات تُصمّم للعيش.</p></div>
            <div className={s.previewPhoto} />
          </div>
          <figcaption>مثال توضيحي لتصميم موقع تعريفي</figcaption>
        </figure>
      </div>
    </header>
    <section className={s.section} id="what-you-get"><div className={s.wrap}>
      <div className={s.sectionHeading}><h2>ماذا يشمل العمل؟</h2><p>نحدّد الصفحات والمحتوى والوظائف معك قبل بدء التنفيذ.</p></div>
      <div className={s.features}>{features.map(feature => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
    </div></section>
    <section className={s.process}><div className={s.wrap}>
      <h2>من الطلب إلى الإطلاق</h2>
      <ol className={s.steps}>{steps.map(step => <li key={step.title}><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol>
    </div></section>
    <section className={s.section} id="pricing"><div className={s.wrap}>
      <div className={s.pricePanel}>
        <div><h2>اشتراك إنشاء المواقع</h2><p>يُتفق على عدد الصفحات والمحتوى والخدمات الدورية قبل بدء التنفيذ.</p><p>نوضّح تكاليف النطاق والاستضافة والوظائف الإضافية، مثل الدفع أو الحجز، قبل الاتفاق.</p></div>
        <div className={s.priceAction}><p><strong>500</strong> ريال قطري شهريًا</p><Link className={s.button} href={contactUrl}>{contactLabel} <span aria-hidden="true">←</span></Link></div>
      </div>
    </div></section>
    <section className={s.faq}><div className={s.wrap}>
      <h2>أسئلة شائعة</h2>
      <details><summary>ما أنواع المواقع التي يمكن طلبها؟</summary><p>مواقع تعريفية وصفحات هبوط ومواقع شخصية ومهنية، ويمكنك طلب متجر أو إعادة تصميم موقع قائم لتقييم النطاق.</p></details>
      <details><summary>هل يشمل الاشتراك النطاق والاستضافة؟</summary><p>نراجع احتياجات النطاق والاستضافة والوظائف الخاصة قبل بدء العمل، ونوضح أي تكاليف إضافية.</p></details>
      <details><summary>ماذا أجهّز قبل إرسال الطلب؟</summary><p>اذكر اسم النشاط وهدف الموقع والصفحات التي تحتاجها. يمكنك إضافة أمثلة أو مواد جاهزة أثناء المحادثة.</p></details>
    </div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
  </main>;
}
