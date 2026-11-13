import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { services } from "@/lib/service-orders";
import s from "./studio.module.css";

export const metadata: Metadata = {
  title: "خدمات لوسيل الرقمية",
  description: "اطلب إنشاء موقع، مونتاج فيديو، إنشاء أو تعديل ملف إكسل، أو تصميم منشورات التواصل. حدّد متطلباتك في محادثة قصيرة.",
  alternates: pageAlternates("/services"),
  openGraph: { title: "خدمات لوسيل الرقمية", description: "اطلب خدمة رقمية وحدّد تفاصيل مشروعك خطوة بخطوة.", url: "/services", type: "website" },
};

const categories = {
  "website-design": { label: "ويب", symbol: "↗", tone: "web" },
  "video-editing": { label: "فيديو", symbol: "▶", tone: "video" },
  excel: { label: "بيانات", symbol: "▦", tone: "data" },
  "social-design": { label: "تصميم", symbol: "✳", tone: "social" },
} as const;

export default function ServicesPage() {
  return <main id="main-content" className={s.root}>
    <header className={s.catalogHero}>
      <div className={s.heroCopy}>
        <p className={s.kicker}>خدمات لوسيل الرقمية</p>
        <h1>ما الذي تريد<br />إنجازه اليوم؟</h1>
        <p className={s.lead}>من إطلاق موقعك إلى تجهيز فيديو أو ملف عمل. اختر الخدمة وأخبرنا بما تحتاجه في محادثة قصيرة.</p>
        <a className={s.button} href="#available-services">استكشف الخدمات <span aria-hidden="true">↓</span></a>
      </div>
      <div className={s.heroPhoto} aria-hidden="true" />
    </header>

    <section className={s.section} id="available-services" aria-labelledby="services-title">
      <div className={s.wrap}>
        <div className={s.sectionHeading}><h2 id="services-title">اختر الخدمة المناسبة</h2><p>حدّد التفاصيل في الطلب ليُراجع الفريق نطاق العمل والتكلفة.</p></div>
        <div className={s.catalogGrid}>
          {services.map(service => {
            const category = categories[service.slug as keyof typeof categories];
            return <article className={s.serviceCard} data-tone={category?.tone} key={service.slug}>
              <div className={s.cardTop}><span className={s.icon} aria-hidden="true">{category?.symbol}</span><span>{category?.label}</span></div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className={s.cardBottom}>
                <strong>{service.price ?? "عرض سعر حسب الطلب"}</strong>
                <div className={s.actions}>
                  <Link className={s.button} href={`/services/request?service=${service.slug}`} aria-label={`ابدأ طلب ${service.name}`}>ابدأ الطلب <span aria-hidden="true">←</span></Link>
                  <Link className={s.textLink} href={`/services/${service.slug}`} aria-label={`تفاصيل ${service.name}`}>تفاصيل الخدمة</Link>
                </div>
              </div>
            </article>;
          })}
        </div>
      </div>
    </section>
    <section className={s.process} aria-labelledby="process-title">
      <div className={s.wrap}>
        <h2 id="process-title">كيف يبدأ العمل؟</h2>
        <ol className={s.steps}>
          <li><strong>اختر الخدمة</strong><p>ابدأ من الخدمة الأقرب لما تريد إنجازه.</p></li>
          <li><strong>صف مشروعك</strong><p>أجب عن الأسئلة وأضف التفاصيل والمراجع المتاحة.</p></li>
          <li><strong>أرسل طلبك</strong><p>احتفظ برقم الطلب ليتواصل معك الفريق بعد المراجعة.</p></li>
        </ol>
      </div>
    </section>
  </main>;
}
