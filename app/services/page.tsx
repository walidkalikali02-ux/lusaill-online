import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { services } from "@/lib/service-orders";
import s from "./orders.module.css";

export const metadata: Metadata = {
  title: "خدمات لوسيل الرقمية",
  description: "اطلب إنشاء موقع، مونتاج فيديو، إنشاء أو تعديل ملف إكسل، أو تصميم منشورات التواصل. حدّد متطلباتك في محادثة قصيرة.",
  alternates: pageAlternates("/services"),
};

export default function ServicesPage() {
  return <main id="main-content" className={s.page}>
    <header className={s.hero}>
      <div className={s.wrap}>
        <h1>خدمات لوسيل الرقمية</h1>
        <p>اختر الخدمة التي تحتاجها. سنسألك خطوة بخطوة عن التفاصيل التي يحتاجها فريقنا لتقدير العمل والبدء معك.</p>
      </div>
    </header>
    <section className={s.wrap} id="available-services" aria-label="الخدمات المتاحة">
      <div className={s.grid}>{services.map(service => <article className={s.card} key={service.slug}>
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <p className={s.price}>{service.price ?? "عرض سعر بحسب تفاصيل الطلب"}</p>
        <div className={s.actions}>
          <Link className={s.primary} href={`/services/request?service=${service.slug}`}>ابدأ الطلب <span aria-hidden="true">←</span></Link>
          {service.slug === "website-design" && <Link className={s.back} href="/services/website-design">تفاصيل الاشتراك</Link>}
        </div>
      </article>)}</div>
    </section>
  </main>;
}
