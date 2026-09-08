import type { Metadata } from "next";
import { ClusterCard } from "@/components/cluster-card";
import { clusters } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "التصنيفات",
  description: "تصنيفات المقالات في لوسيل: فواتير الكهرباء، بوابة مصر الرقمية، رخص القيادة، حماية المستهلك، المحافظ الإلكترونية، عقود الإيجار، والسجل المدني.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "التصنيفات — لوسيل",
    description: "تصنيفات المقالات في لوسيل.",
    url: "/categories",
    type: "website",
  },
};

export default function ClustersPage() {
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
    description: "تصنيفات المقالات في لوسيل.",
    numberOfItems: clusters.length,
    itemListElement: clusters.map((cluster, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/categories/${cluster.slug}`),
      name: cluster.name,
    })),
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">خريطة الخطة</span>
        <h1>تصنيفات المقالات</h1>
        <p className="text-lead">أكثر من مليون بحث شهري بصعوبة منخفضة. كل تصنيف يبدأ بصفحة ركيزة ثم يتفرع إلى صفحات دقيقة لكل نية بحث.</p>
        <div className="cluster-grid">
          {clusters.map((cluster) => <ClusterCard cluster={cluster} key={cluster.slug} />)}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </main>
  );
}
