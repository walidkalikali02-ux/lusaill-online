import type { Metadata } from "next";
import Link from "next/link";
import { ClusterCard } from "@/components/cluster-card";
import { clusters, overallProgress, clusterProgress } from "@/lib/content";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "التصنيفات",
  description: "تصفح التصنيفات التي تضم أدلة منشورة في لوسيل. ابدأ بخدمات شركات توزيع الكهرباء والاستعلام عن الفواتير، مع روابط رسمية وخطوات عملية.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "التصنيفات — لوسيل",
    description: "التصنيفات التي تضم أدلة منشورة ومراجعة في لوسيل.",
    url: "/categories",
    type: "website",
    images: [siteSocialImage],
  },
};

export default function ClustersPage() {
  const progress = overallProgress();
  const activeClusters = clusters.filter((cluster) => clusterProgress(cluster.slug).published > 0);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "التصنيفات", item: absoluteUrl("/categories") },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "تصنيفات المقالات — لوسيل",
    description: "تصنيفات المقالات في لوسيل: دليل شامل لكل إجراء حكومي في العالم العربي.",
    numberOfItems: activeClusters.length,
    itemListElement: activeClusters.map((cluster, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/categories/${cluster.slug}`),
      name: cluster.name,
    })),
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">خريطة المحتوى</span>
        <h1>تصنيفات المقالات</h1>
        <p className="text-lead">
          تعرض هذه الصفحة التصنيفات التي تحتوي أدلة منشورة ومراجعة فقط. نضيف أي تصنيف جديد بعد اكتمال أول دليل موثق فيه.
        </p>

        <div style={{ margin: "24px 0", padding: "16px 20px", background: "var(--paper-deep)", borderRadius: 8, border: "1px solid var(--line)" }}>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)" }}>
            <strong>{progress.corePublished}</strong> من <strong>{progress.coreTotal}</strong> مقالاً منشوراً —
            كل مقال يمر بمراجعة المصادر الرسمية قبل النشر.
            <Link href="/editorial-policy" style={{ marginRight: 8, color: "var(--brand)" }}>راجع سياسة التحرير ←</Link>
          </p>
        </div>

        <div className="cluster-grid">
          {activeClusters.map((cluster) => <ClusterCard cluster={cluster} key={cluster.slug} />)}
        </div>

        <div style={{ marginTop: 48, padding: "24px 0", borderTop: "1px solid var(--line)" }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>كيف نبني كل تصنيف؟</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            <div style={{ padding: 16, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>صفحة ركيزة شاملة</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>كل تصنيف يبدأ بصفحة واحدة شاملة تغطي جميع الجوانب الأساسية للموضوع.</p>
            </div>
            <div style={{ padding: 16, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>صفحات فرعية دقيقة</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>لكل نية بحث محددة صفحة مستقلة تجيب على السؤال بدقة مع روابط رسمية.</p>
            </div>
            <div style={{ padding: 16, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>مراجعة المصادر باستمرار</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)" }}>نسجل تاريخ التحقق داخل كل دليل، ونراجعه عند تغير الخدمة أو ظهور مصدر رسمي أحدث.</p>
            </div>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </main>
  );
}
