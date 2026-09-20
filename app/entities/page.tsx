import type { Metadata } from "next";
import Link from "next/link";
import { entities } from "@/lib/entities";
import { articles } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "الجهات والخدمات",
  description: "دليل شامل للجهات والخدمات الحكومية في مصر: بوابة مصر الرقمية، مترش، حماية المستهلك، شركات الكهرباء، البريد المصري.",
  alternates: { canonical: "/entities" },
  openGraph: {
    title: "الجهات والخدمات — لوسيل",
    description: "دليل شامل للجهات والخدمات الحكومية في مصر.",
    url: "/entities",
    type: "website",
  },
};

export default function EntitiesPage() {
  const activeEntities = entities.filter((entity) => articles.some((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode)));
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الجهات والخدمات", item: absoluteUrl("/entities") },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "الجهات والخدمات الحكومية — لوسيل",
    description: "دليل شامل للجهات والخدمات الحكومية في مصر.",
    numberOfItems: activeEntities.length,
    itemListElement: activeEntities.map((entity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/entities/${entity.slug}`),
      name: entity.name,
    })),
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">دليل الجهات</span>
        <h1>الجهات والخدمات الحكومية</h1>
        <p className="text-lead">
          نعرض فقط الجهات المرتبطة بأدلة منشورة ومراجعة، مع رابط البوابة الرسمية والخدمات ذات الصلة.
        </p>
        <div className="cluster-grid">
          {activeEntities.map((entity) => (
            <Link key={entity.slug} className="cluster-card" href={`/entities/${entity.slug}`} style={{ "--c": "#145da0" } as React.CSSProperties}>
              <div className="cluster-top">
                <span className="cluster-code">{entity.category}</span>
              </div>
              <h3>{entity.name}</h3>
              <p>{entity.description.slice(0, 120)}...</p>
              <div className="cluster-meta">
                <span><b>{entity.services.length}</b> خدمة</span>
                {entity.phone && <span>هاتف: {entity.phone}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </main>
  );
}
