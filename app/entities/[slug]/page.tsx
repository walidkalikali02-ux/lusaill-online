import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entities, getEntity } from "@/lib/entities";
import { articles } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

export function generateStaticParams() {
  return entities.map((entity) => ({ slug: entity.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entity = getEntity(slug);
  if (!entity) return {};
  const hasPublished = articles.some((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode));
  return {
    title: entity.name,
    description: entity.description,
    alternates: { canonical: `/entities/${entity.slug}` },
    robots: { index: hasPublished, follow: true },
    openGraph: {
      title: entity.name,
      description: entity.description,
      url: `/entities/${entity.slug}`,
      type: "website",
    },
  };
}

export default async function EntityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entity = getEntity(slug);
  if (!entity) notFound();

  const relatedArticles = articles.filter(
    (article) => entity.clusterCodes.includes(article.clusterCode) && article.status === "published",
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الجهات والخدمات", item: absoluteUrl("/entities") },
      { "@type": "ListItem", position: 3, name: entity.name, item: absoluteUrl(`/entities/${entity.slug}`) },
    ],
  };

  const governmentServiceSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: entity.name,
    description: entity.description,
    url: entity.url,
    provider: {
      "@type": "Organization",
      name: entity.name,
    },
    areaServed: {
      "@type": "Country",
      name: "مصر",
    },
    serviceType: entity.category,
    ...(entity.phone ? { telephone: entity.phone } : {}),
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <div className="breadcrumbs">
          <Link href="/">الرئيسية</Link><span>/</span>
          <Link href="/entities">الجهات والخدمات</Link><span>/</span>
          <span>{entity.name}</span>
        </div>

        <span className="eyebrow">{entity.category}</span>
        <h1>{entity.name}</h1>
        <p className="text-lead">{entity.description}</p>

        <div className="text-grid" style={{ marginTop: 32 }}>
          <section>
            <span>الموقع الرسمي</span>
            <h2>البوابة الإلكترونية</h2>
            <p>
              <a href={entity.url} target="_blank" rel="noopener noreferrer">{entity.url}</a>
            </p>
          </section>
          {entity.phone && (
            <section>
              <span>التواصل</span>
              <h2>رقم الخدمة</h2>
              <p style={{ fontSize: 24, fontWeight: 700, color: "var(--brand)" }}>{entity.phone}</p>
            </section>
          )}
        </div>

        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>الخدمات المتاحة</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {entity.services.map((service) => (
              <div key={service} style={{ padding: 16, background: "var(--paper)", borderRadius: 8, border: "1px solid var(--line)" }}>
                <p style={{ margin: 0, fontSize: 15 }}>{service}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-cta" style={{ marginTop: 40 }}>
          <div>
            <strong>مقالات ذات صلة</strong>
            <p>تصفح مقالاتنا التفصيلية حول خدمات {entity.name} مع خطوات مصوّرة وأرقام دعم رسمية.</p>
            {relatedArticles.length > 0 && (
              <ul style={{ margin: "12px 0 0", fontSize: 14 }}>
                {relatedArticles.map((article) => (
                  <li key={article.slug} style={{ marginBottom: 6 }}>
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServiceSchema) }} />
    </main>
  );
}
