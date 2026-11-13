import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/lib/service-orders";
import { ServiceChat } from "./service-chat";
import studio from "../studio.module.css";
import s from "./request.module.css";

export const metadata: Metadata = {
  title: "محادثة طلب خدمة | لوسيل",
  description: "أخبر فريق لوسيل عن مشروعك وراجع تفاصيله قبل إرسال طلب الخدمة.",
  alternates: { canonical: "/services" },
  robots: { index: false, follow: true },
};

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: slug } = await searchParams;
  const service = getService(slug ?? "");
  if (!service) notFound();

  return <main id="main-content" className={studio.root}>
    <header className={studio.detailHero}>
      <div className={studio.wrap}>
        <nav className={studio.crumb} aria-label="مسار التصفح">
          <Link href="/services">الخدمات</Link><span aria-hidden="true">/</span>
          <Link href={`/services/${service.slug}`}>تفاصيل الخدمة</Link><span aria-hidden="true">/</span>
          <span aria-current="page">طلب الخدمة</span>
        </nav>
        <h1 className={s.title}>طلب {service.name}</h1>
        <p className={studio.lead}>أخبرنا بما تريد إنجازه، ثم راجع التفاصيل وأرسلها إلى فريق لوسيل.</p>
      </div>
    </header>
    <div className={`${studio.wrap} ${s.layout}`}>
      <ServiceChat key={service.slug} slug={service.slug} />
      <aside className={s.sidebar} aria-label="عن الخدمة والطلب">
        <p className={s.eyebrow}>عن الخدمة</p>
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <Link className={studio.textLink} href={`/services/${service.slug}`}>عرض تفاصيل الخدمة</Link>
        <div className={s.sidebarNote}>
          <strong>ماذا يحدث بعد الإرسال؟</strong>
          <p>يراجع الفريق المحادثة وملخص متطلباتك، ثم يتواصل معك على البريد الذي أدخلته.</p>
        </div>
      </aside>
    </div>
  </main>;
}
