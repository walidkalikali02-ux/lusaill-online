import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/cms/server";
import { IntelligenceWorkspace } from "@/components/intelligence/workspace";
import "./intelligence.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ذكاء الموضوعات",
  description: "مساحة بحث الموضوعات وتحليل المصادر وفجوات المحتوى واعتماد الفرص التحريرية.",
  alternates: { canonical: "/admin/intelligence" },
  robots: { index: false, follow: false },
};

export default async function IntelligencePage() {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  return <IntelligenceWorkspace />;
}
