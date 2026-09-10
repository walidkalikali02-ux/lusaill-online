import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clusters, getCluster, getClusterArticles, clusterProgress } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const ARTICLES_PER_PAGE = 30;

export function generateStaticParams() {
  return clusters.map((cluster) => ({ slug: cluster.slug }));
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const cluster = getCluster(slug);
  if (!cluster) return {};
  const currentPage = Number(pageParam) || 1;
  const canonicalPath = currentPage > 1 ? `/categories/${cluster.slug}?page=${currentPage}` : `/categories/${cluster.slug}`;
  return {
    title: cluster.name,
    description: cluster.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: cluster.name,
      description: cluster.description,
      url: canonicalPath,
      type: "website",
    },
  };
}

export default async function ClusterPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const cluster = getCluster(slug);
  if (!cluster) notFound();

  const items = getClusterArticles(cluster.slug);
  const progress = clusterProgress(cluster.slug);
  const totalPages = Math.ceil(items.length / ARTICLES_PER_PAGE);
  const currentPage = Math.max(1, Math.min(Number(pageParam) || 1, totalPages));
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedItems = items.slice(startIdx, startIdx + ARTICLES_PER_PAGE);
  const publishedItems = paginatedItems.filter((item) => item.status === "published");
  const otherItems = paginatedItems.filter((item) => item.status !== "published");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "التصنيفات", item: absoluteUrl("/categories") },
      { "@type": "ListItem", position: 3, name: cluster.name, item: absoluteUrl(`/categories/${cluster.slug}`) },
    ],
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/categories/${cluster.slug}/#webpage`,
    url: absoluteUrl(`/categories/${cluster.slug}`),
    name: cluster.name,
    description: cluster.description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <main id="main-content" className="category-page">
      <div className="shell">
        <div className="breadcrumbs">
          <Link href="/">الرئيسية</Link><span>/</span>
          <Link href="/categories">التصنيفات</Link><span>/</span>
          <span>{cluster.name}</span>
        </div>

        <div className="category-hero">
          <span className="article-card-tag">{cluster.name}</span>
          <h1>{cluster.name}</h1>
          <p>{cluster.description}</p>
          <div className="article-meta" style={{ marginTop: 16 }}>
            <span className="article-meta-item">{progress.total} دليلًا</span>
            <span className="article-meta-item">{progress.published} منشور</span>
          </div>
        </div>

        {/* Published guides as clean cards */}
        {publishedItems.length > 0 && (
          <div className="articles-grid" style={{ marginBottom: 40 }}>
            {publishedItems.map((item) => (
              <Link key={item.slug} className="article-card" href={`/articles/${item.slug}`}>
                <span className="article-card-tag">{cluster.name}</span>
                <h3>{item.title}</h3>
                <p className="article-card-desc">
                  {item.quickAnswer
                    ? item.quickAnswer.slice(0, 120) + (item.quickAnswer.length > 120 ? "…" : "")
                    : `دليل شامل عن ${item.keyword} مع خطوات عملية.`}
                </p>
                <div className="article-card-footer">
                  <span className="article-card-time">دليل عملي</span>
                  <span className="article-card-link">اقرأ الدليل ←</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Other articles (not yet published) */}
        {otherItems.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--ink-muted)" }}>قريباً</h2>
            <div className="articles-grid">
              {otherItems.map((item) => (
                <div key={item.slug} className="article-card" style={{ opacity: 0.6 }}>
                  <span className="article-card-tag" style={{ background: "var(--bg-alt)", color: "var(--ink-muted)" }}>قريباً</span>
                  <h3>{item.title}</h3>
                  <p className="article-card-desc">{item.keyword}</p>
                  <div className="article-card-footer">
                    <span className="article-card-time">قيد الإعداد</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {publishedItems.length === 0 && otherItems.length === 0 && (
          <div className="empty-state">
            <h3>لا توجد أدلة بعد</h3>
            <p>نعمل على تجهيز الأدلة في هذا التصنيف.</p>
            <Link className="button button-secondary" href="/categories" style={{ marginTop: 16 }}>تصفح التصنيفات الأخرى</Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {currentPage > 1 && (
              <Link href={`/categories/${cluster.slug}?page=${currentPage - 1}`} className="pagination-btn">السابق</Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/categories/${cluster.slug}?page=${p}`}
                className={`pagination-btn ${p === currentPage ? "active" : ""}`}
              >
                {p}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link href={`/categories/${cluster.slug}?page=${currentPage + 1}`} className="pagination-btn">التالي</Link>
            )}
          </div>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
    </main>
  );
}
