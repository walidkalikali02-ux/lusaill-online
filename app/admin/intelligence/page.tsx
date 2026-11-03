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

export default async function IntelligencePage({searchParams}:{searchParams:Promise<{project?:string}>}) {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  const {project}=await searchParams;
  return <IntelligenceWorkspace initialProjectId={project&&/^[a-f0-9-]{36}$/.test(project)?project:""} />;
}
