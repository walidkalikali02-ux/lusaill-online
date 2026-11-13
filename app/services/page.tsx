import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import s from "./services.module.css";

export const metadata: Metadata = {
  title: "خدمات لوسيل | حلول رقمية لأعمالك",
  description: "اكتشف خدمات لوسيل الرقمية للأفراد والشركات. أنشئ موقعًا احترافيًا يعرض أعمالك ويُسهّل تواصل العملاء معك، مقابل 500 ريال قطري شهريًا.",
  alternates: pageAlternates("/services"),
  openGraph: { title: "خدمات لوسيل | حلول رقمية لأعمالك", description: "خدمات رقمية لأعمالك، تبدأ بخدمة إنشاء المواقع مقابل 500 ريال قطري شهريًا.", url: "/services", type: "website" },
};
export default function ServicesPage() {
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "خدمات لوسيل", item: absoluteUrl("/services") },
  ] };
  return <main id="main-content" className={s.root}>
    <section className={s.serviceHero}><div className={s.wrap}>
      <span className={s.eyebrow}>خدمات لوسيل الرقمية</span>
      <h1>من المعرفة إلى التنفيذ.</h1>
      <p>من خلال خدمات لوسيل الرقمية نساعدك على تحويل أفكارك إلى حضور رقمي واضح وعملي. اختر الخدمة المناسبة لنشاطك وابدأ بخطوة بسيطة.</p>
    </div></section>
        <section className={s.section} id="available-services"><div className={s.wrap}>
      <div className={s.sectionHeading}><span>أول خدماتنا</span><h2>خدمات تساعد مشروعك على النمو</h2><p>حلول رقمية سهلة البدء، بتفاصيل وتكلفة واضحتين قبل الاتفاق.</p></div>
      <article className={s.serviceCard}><div>
        <span className={s.eyebrow} style={{ background: "#e8f1f4", color: "#275773", borderColor: "#d5e6ed" }}>إنشاء وتصميم المواقع</span>
        <h2>موقع احترافي يمثّل نشاطك</h2>
        <p>موقع أنيق وسريع ومتوافق مع الجوال، يوضح خدماتك أو منتجاتك ويجعل الوصول إليك أسهل. مناسب للشركات والمشاريع الصغيرة والخدمات المهنية.</p>
        <div className={s.servicePrice}>500 ريال قطري / شهريًا</div>
        <Link href="/services/website-design" className={s.darkCta}>استكشف الخدمة واطلب موقعك ←</Link>
      </div><div className={s.serviceArt} aria-hidden="true" /></article>
      <p className={s.notice}>خدمات لوسيل الرقمية أحد مشاريع شركة لوسيل.</p>
    </div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
  </main>;
}
