import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cmsConfigured } from "@/lib/cms/server";
import { requireOps } from "@/lib/content-ops/server";
import { emptyDocument,type CmsDocument } from "@/lib/cms/model";
import Link from "next/link";
import { articles } from "@/lib/content";
import { importArticle } from "@/lib/cms/import";
import { CmsWorkspace } from "@/components/cms/workspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  description: "لوحة تحرير المقالات والمصادر والمراجعات الخاصة بمدير لوسيل.",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false },
};
export default async function Admin({searchParams}:{searchParams:Promise<{ops?:string}>}) {
  if (!cmsConfigured()) redirect("/admin/login");
  let auth;
  try {
    auth=await requireOps();
  } catch {
    redirect("/admin/login");
  }
  const {ops}=await searchParams;
  let initialDocument:CmsDocument|undefined;
  if(ops){
    if(!/^[a-f0-9-]{36}$/i.test(ops))redirect("/admin/content-ops");
    const {data:item,error}=await auth.client.from("content_items").select("*").eq("id",ops).maybeSingle();
    if(error||!item||item.data.kind!=="article")redirect("/admin/content-ops");
    if(auth.role==="writer"&&item.data.ownerId!==auth.user.id)redirect("/admin/content-ops");
    if(!["drafting","editorial","fact_check","visual_seo","final_approval","ready"].includes(item.data.stage))return <main id="main-content" className="cms-login"><h1>الموجز والهيكل أولًا</h1><p>اعتمد الموجز والهيكل وانقل العنصر إلى مرحلة الكتابة لفتح المحرر.</p><Link href="/admin/content-ops">العودة لعمليات المحتوى</Link></main>;
    const source=articles.find(article=>`/articles/${article.slug}`===item.data.publicPath);
    const {data:saved}=item.cms_document_id?await auth.client.from("cms_documents").select("document").eq("id",item.cms_document_id).maybeSingle():{data:null};
    initialDocument={...(saved?.document??(source?importArticle(source):{...emptyDocument(),title:item.data.title})),operationsItemId:item.id};
  }
  return <CmsWorkspace initial={auth.role==="admin"?articles.map(importArticle):[]} initialDocument={initialDocument}/>;
}
