import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/lib/service-orders";
import { ServiceChat } from "./service-chat";
import s from "../orders.module.css";

export const metadata: Metadata = { title: "طلب خدمة | لوسيل", alternates: { canonical: "/services" }, robots: { index: false, follow: true } };

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: slug } = await searchParams;
  const service = getService(slug ?? "");
  if (!service) notFound();
  return <main id="main-content" className={s.page}>
    <div className={s.narrow}>
      <Link className={s.back} href="/services">→ جميع الخدمات</Link>
      <h1>طلب {service.name}</h1>
      <ServiceChat slug={service.slug} />
    </div>
  </main>;
}
