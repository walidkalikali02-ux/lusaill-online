import type { Metadata } from "next";
import Link from "next/link";
import { pageAlternates } from "@/lib/page-alternates";
import { services } from "@/lib/service-orders";
import { siteSocialImage } from "@/lib/site-config";
import s from "./studio.module.css";

export const metadata: Metadata = {
  title: "خدمات رقمية: تصميم مواقع ومونتاج وإكسل",
  description: "اطلب إنشاء موقع، مونتاج فيديو، إنشاء أو تعديل ملف إكسل، أو تصميم منشورات التواصل. حدّد متطلباتك في محادثة قصيرة.",
  alternates: pageAlternates("/services"),
  openGraph: { title: "خدمات لوسيل الرقمية", description: "اطلب خدمة رقمية وحدّد تفاصيل مشروعك خطوة بخطوة.", url: "/services", type: "website", images: [siteSocialImage] },
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
    <section className={s.section} aria-labelledby="choose-service">
      <div className={s.wrap}>
        <h2 id="choose-service">أي خدمة تناسب احتياجك؟</h2>
        <p>قبل إرسال الطلب، حدّد النتيجة التي تريدها بدل اختيار اسم الخدمة فقط. يساعدك ذلك على وصف المطلوب ومراجعة نطاق العمل والتكلفة.</p>
        <ul>
          <li><strong>موقع إلكتروني:</strong> إذا كنت تحتاج صفحات تعرّف بالنشاط وتوضح الخدمات وتُسهّل تواصل العملاء، ابدأ بتحديد الصفحات والمحتوى والوظائف المهمة.</li>
          <li><strong>مونتاج فيديو:</strong> إذا كانت لديك لقطات خام تريد اختصارها أو ترتيبها ونشرها، وضّح مدة الفيديو والمنصة واللغة وما إذا كنت تحتاج ترجمة.</li>
          <li><strong>ملفات Excel:</strong> إذا كان لديك ملف يكثر فيه العمل اليدوي أو معادلات تحتاج إصلاحًا، صف البيانات والنتائج المطلوبة دون إرسال بيانات حساسة.</li>
          <li><strong>تصميم شبكات التواصل:</strong> إذا أردت منشورات أو قصصًا لهوية واحدة، جهّز الرسالة والشعار والمقاسات وعدد التصاميم المطلوبة.</li>
        </ul>
        <h2>ما الذي يحدث بعد تقديم الطلب؟</h2>
        <p>تُراجع تفاصيل المشروع أولًا حتى يتضح ما يدخل ضمن الخدمة وما يحتاج إلى تسعير إضافي. إذا كانت المواد أو المتطلبات ناقصة، تُستكمل قبل الاتفاق على التسليم. لا ننشر أعمال عملاء أو صورًا من مشاريعهم باعتبارها نماذج منجزة دون إذن موثّق.</p>
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
