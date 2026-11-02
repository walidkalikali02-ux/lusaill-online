import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cmsConfigured, requireAdmin } from "@/lib/cms/server";
import { articles } from "@/lib/content";
import { importArticle } from "@/lib/cms/import";
import { CmsWorkspace } from "@/components/cms/workspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  description: "لوحة تحرير المقالات والمصادر والمراجعات الخاصة بمدير لوسيل.",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false },
};
export default async function Admin() {
  if (!cmsConfigured()) redirect("/admin/login");
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
  return <CmsWorkspace initial={articles.map(importArticle)} />;
}
