import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import s from "../services.module.css";

const title = "إنشاء موقع إلكتروني احترافي | 500 ريال شهريًا";
const description = "أنشئ موقعًا إلكترونيًا احترافيًا لنشاطك التجاري مع لوسيل مقابل 500 ريال قطري شهريًا. تصميم متوافق مع الجوال وصفحات واضحة وتجربة تواصل مريحة للعملاء.";
export const metadata: Metadata = {
  title, description, alternates: pageAlternates("/services/website-design"),
  openGraph: { title, description, url: "/services/website-design", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};
const features = [
  { icon: "✦", title: "تصميم يليق بعلامتك", text: "هوية بصرية متناسقة ومساحات واضحة تساعد زائر الموقع على فهم نشاطك من أول لحظة." },
  { icon: "▣", title: "مناسب لكل الشاشات", text: "تجربة مريحة على الهاتف والكمبيوتر والأجهزة اللوحية، دون تعقيد في التصفح." },
  { icon: "⚡", title: "أداء وتجربة استخدام", text: "بنية خفيفة وترتيب واضح للمحتوى لتقليل التشتيت وتسهيل الوصول إلى المعلومات." },
  { icon: "⌕", title: "أساسيات الظهور في البحث", text: "عناوين ووصف صفحات وهيكلة مناسبة لمحركات البحث، دون وعود بترتيب أو زيارات مضمونة." },
  { icon: "✉", title: "طرق تواصل واضحة", text: "أزرار واتساب ووسائل تواصل مناسبة بحيث يصبح الاستفسار عن خدماتك أسهل." },
  { icon: "↗", title: "قابل للنمو", text: "ابدأ بالصفحات الأهم، ثم ناقش إضافة صفحات أو وظائف جديدة عند توسع نشاطك." },
];
const steps = [
  { number: "01", title: "أخبرنا عن مشروعك", text: "أرسل اسم النشاط ونوع الموقع الذي تريده وبعض الأمثلة التي تعجبك." },
  { number: "02", title: "نحدد النطاق والتصميم", text: "نتفق على الصفحات والمحتوى والوظائف وتفاصيل الاشتراك قبل التنفيذ." },
  { number: "03", title: "نجهز الموقع للنشر", text: "نراجع التصميم والمحتوى والتواصل معك ثم ننسق موعد الإطلاق." },
];
export default function WebsiteDesignPage() {
  // Use only the verified Lusaill services number, configured in Vercel.
  const number = (process.env.LUSAIL_SERVICES_WHATSAPP || "").replace(/\D/g, "");
  const hasWhatsapp = number.length >= 8 && number.length <= 15;
  const message = "مرحبًا فريق لوسيل، أرغب في طلب خدمة إنشاء موقع إلكتروني بسعر 500 ريال قطري شهريًا. أود معرفة خطوات البدء وتفاصيل الاشتراك.";
  const contactUrl = hasWhatsapp
    ? "https://wa.me/" + number + "?text=" + encodeURIComponent(message)
    : "mailto:" + siteConfig.editorialEmail + "?subject=" + encodeURIComponent("طلب خدمة إنشاء موقع | لوسيل") + "&body=" + encodeURIComponent(message);
  const contactLabel = hasWhatsapp ? "اطلب موقعك عبر واتساب" : "استفسر عن الخدمة بالبريد";
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
    <section className={s.hero}><div className={s.wrap}><div className={s.heroGrid}>
      <div>
        <span className={s.eyebrow}>خدمات لوسيل • إنشاء المواقع</span>
        <h1>مشروعك يستحق <span className={s.highlight}>موقعًا يُظهر قيمته.</span></h1>
        <p className={s.lead}>خلّ أول انطباع عن نشاطك احترافيًا. نصمّم لك موقعًا واضحًا وجذابًا يعرّف الناس بخدماتك، ويجعل التواصل معك خطوة سهلة — مقابل <strong>500 ريال قطري شهريًا.</strong></p>
        <div className={s.actions}><a href={contactUrl} className={s.primaryCta} target={hasWhatsapp ? "_blank" : undefined} rel={hasWhatsapp ? "noopener noreferrer" : undefined}>{contactLabel} ←</a><a href="#what-you-get" className={s.secondaryCta}>اكتشف ما ستحصل عليه</a></div>
        <p className={s.trustLine}>سعر شهري واضح · تصميم متجاوب · نطاق عمل نتفق عليه قبل البدء</p>
      </div>
      <div className={s.visual} role="img" aria-label="معاينة توضيحية لشكل موقع إلكتروني احترافي">
        <div className={s.browser}><div className={s.browserTop}><div className={s.dots}><i/><i/><i/></div><div className={s.browserBar}/></div>
          <div className={s.mockNav}><strong>علامتك</strong><small>الرئيسية &nbsp; الخدمات &nbsp; من نحن &nbsp; تواصل</small></div>
          <div className={s.mockHero}><div><div className={s.mockHeading}>اترك انطباعًا<br/>يستحق التذكّر.</div><p>تجربة رقمية تعبّر عن جودة ما تقدّمه.</p><div className={s.mockButtons}><span/><span/></div></div><div className={s.mockCircle}/></div>
          <div className={s.mockTiles}><div/><div/><div/></div>
        </div><div className={s.floatingStat}>✦ تصميم عربي متجاوب</div>
      </div>
    </div></div></section>
    <div className={s.wrap}><nav className={s.crumbs} aria-label="مسار التصفح"><Link href="/services">رئيسية المشروع</Link> / <Link href="/services">الخدمات</Link> / إنشاء المواقع</nav></div>
    <section className={s.section} id="what-you-get"><div className={s.wrap}>
      <div className={s.sectionHeading}><span>موقعك يبدأ من هنا</span><h2>كل ما يحتاجه زائرك، بتجربة واحدة واضحة</h2><p>نركز على بناء موقع يخدم هدف نشاطك بدل إضافة تفاصيل تقنية لا يحتاجها العميل.</p></div>
      <div className={s.gridThree}>{features.map((feature) => <article key={feature.title} className={s.featureCard}><span className={s.featureIcon} aria-hidden="true">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
    </div></section>
    <section className={s.section + " " + s.mutedSection}><div className={s.wrap}>
      <div className={s.sectionHeading}><span>كيف نبدأ؟</span><h2>3 خطوات من فكرتك إلى موقعك</h2><p>عملية واضحة، تبدأ بفهم نشاطك وتحديد ما يناسبك.</p></div>
      <div className={s.steps}>{steps.map((step) => <div className={s.step} key={step.number}><strong>{step.number}</strong><h3>{step.title}</h3><p>{step.text}</p></div>)}</div>
    </div></section>
    <section className={s.priceBand} id="pricing"><div className={s.wrap}><div className={s.priceGrid}>
      <div className={s.priceCopy}><h2>موقع احترافي،<br/>بتكلفة شهرية تعرفها مسبقًا.</h2>
        <p>لا تحتاج إلى البدء بمشروع تقني معقد. أرسل احتياجاتك، وسنحدد معًا الصفحات والميزات المناسبة ضمن الاشتراك.</p>
        <ul><li>تصميم مخصص لنشاطك ومتوافق مع الجوال</li><li>الصفحات والمحتوى الأساسي وفق نطاق متفق عليه</li><li>وسائل تواصل واضحة لعملائك</li><li>مراجعة احتياجات التشغيل والتحديث قبل الاتفاق</li></ul>
      </div>
      <aside className={s.priceBox} aria-label="سعر الاشتراك الشهري"><small>خدمة إنشاء المواقع من لوسيل</small>
        <div className={s.price}>500 <span>ر.ق / شهر</span></div><p className={s.priceCaption}>اشتراك شهري لخدمة إنشاء الموقع وإدارته وفق النطاق المتفق عليه.</p>
        <a className={s.darkCta} href={contactUrl} target={hasWhatsapp ? "_blank" : undefined} rel={hasWhatsapp ? "noopener noreferrer" : undefined}>{contactLabel} ←</a>
        <p className={s.priceFoot}>نوضح قبل الاشتراك تكاليف النطاق والاستضافة وأي إضافات خارج نطاق الخدمة، إن وجدت.</p>
      </aside>
    </div></div></section>
    <section className={s.section}><div className={s.wrap}>
      <div className={s.sectionHeading}><span>أسئلة شائعة</span><h2>قبل أن تبدأ</h2></div>
      <div className={s.faqGrid}>
        <details><summary>ما أنواع المواقع التي يمكن طلبها؟</summary><p>مواقع تعريفية للشركات والمشاريع والمتاجر المحلية، وصفحات هبوط للخدمات، ومواقع شخصية أو مهنية. نراجع فكرة الموقع ومتطلباته أولًا لتحديد ما يدخل ضمن الاشتراك.</p></details>
        <details><summary>هل السعر 500 ريال قطري شهريًا؟</summary><p>نعم، السعر المعروض للاشتراك هو 500 ريال قطري شهريًا. يُحدّد نطاق العمل والصفحات والخدمات الدورية قبل الاتفاق، وتُوضَّح أي تكاليف إضافية بشكل منفصل.</p></details>
        <details><summary>هل يشمل السعر الدومين والاستضافة والمتجر الإلكتروني؟</summary><p>تُراجع متطلبات النطاق والاستضافة وأي وظائف خاصة — مثل الدفع الإلكتروني أو أنظمة الحجز والمتاجر — بشكل منفصل، وتُحدد التكاليف إن وجدت قبل البدء.</p></details>
        <details><summary>ماذا أحتاج قبل طلب الموقع؟</summary><p>يكفي أن ترسل نوع النشاط واسم المشروع والصفحات التي تتوقع احتياجها وأمثلة لمواقع تعجبك. نساعدك بعد ذلك على ترتيب الخطوات.</p></details>
      </div>
    </div></section>
    <section className={s.footCta}><div className={s.wrap}><h2>جاهز تخلي نشاطك يظهر بشكل أفضل؟</h2><p>احكِ لنا عن فكرتك، ونبدأ بتحديد الموقع المناسب لمشروعك.</p><a href={contactUrl} className={s.primaryCta} target={hasWhatsapp ? "_blank" : undefined} rel={hasWhatsapp ? "noopener noreferrer" : undefined}>{contactLabel} ←</a></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
  </main>;
}
