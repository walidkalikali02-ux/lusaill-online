import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clusters, getCluster, getClusterArticles, clusterProgress } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { StatusBadge } from "@/components/status-badge";
import type { ArticleGroup } from "@/lib/articles-data";

const ARTICLES_PER_PAGE = 30;

export function generateStaticParams() {
  return clusters.map((cluster) => ({ slug: cluster.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cluster = getCluster(slug);
  if (!cluster) return {};
  return {
    title: cluster.name,
    description: cluster.description,
    alternates: { canonical: `/categories/${cluster.slug}` },
    openGraph: {
      title: cluster.name,
      description: cluster.description,
      url: `/categories/${cluster.slug}`,
      type: "website",
    },
  };
}

const groupLabels: Record<ArticleGroup, string> = {
  pillar: "الركيزة",
  distributors: "صفحات شركات التوزيع",
  payments: "صفحات الدفع والسداد",
  core: "المقالات",
  bonus: "محتوى إضافي (الشهر ٦)",
};

export default async function ClusterPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const cluster = getCluster(slug);
  if (!cluster) notFound();

  const items = getClusterArticles(cluster.slug);
  const progress = clusterProgress(cluster.slug);
  const groups = Array.from(new Set(items.map((item) => item.group))) as ArticleGroup[];
  const totalPages = Math.ceil(items.length / ARTICLES_PER_PAGE);
  const currentPage = Math.max(1, Math.min(Number(pageParam) || 1, totalPages));
  const startIdx = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedItems = items.slice(startIdx, startIdx + ARTICLES_PER_PAGE);
  const paginatedGroups = Array.from(new Set(paginatedItems.map((item) => item.group))) as ArticleGroup[];

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
        <div className="category-hero" style={{ borderTopColor: cluster.color }}>
          <div>
            <strong style={{ color: cluster.color }}>العنقود {cluster.code} · الشهر {cluster.months}</strong>
            <h1>{cluster.name}</h1>
            <p>{cluster.description}</p>
          </div>
          <div>
            <div className="category-method"><span>المنهج</span><p>{cluster.approach}</p></div>
            <div className="category-method"><span>الحجم التقريبي</span><p>~{cluster.approxMonthlyVolume.toLocaleString("ar-EG")} بحث شهريًا</p></div>
            <div className="category-method"><span>نطاق الصعوبة</span><p>KD {cluster.kdRange[0]}–{cluster.kdRange[1]}</p></div>
            <div className="category-method"><span>التقدم</span><p>{progress.published} من {progress.total} منشور</p></div>
          </div>
        </div>

        {totalPages > 1 && (
          <div style={{ marginTop: 24, padding: "12px 16px", background: "var(--paper-deep)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>
              عرض {startIdx + 1}–{Math.min(startIdx + ARTICLES_PER_PAGE, items.length)} من {items.length} مقال
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {currentPage > 1 && (
                <Link href={`/categories/${cluster.slug}?page=${currentPage - 1}`} style={{ padding: "6px 12px", borderRadius: 6, background: "var(--line)", fontSize: 13, textDecoration: "none", color: "var(--text)" }}>
                  السابق
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/categories/${cluster.slug}?page=${p}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: p === currentPage ? "var(--brand)" : "var(--line)",
                    color: p === currentPage ? "white" : "var(--text)",
                    fontSize: 13,
                    textDecoration: "none",
                    fontWeight: p === currentPage ? 600 : 400,
                  }}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link href={`/categories/${cluster.slug}?page=${currentPage + 1}`} style={{ padding: "6px 12px", borderRadius: 6, background: "var(--line)", fontSize: 13, textDecoration: "none", color: "var(--text)" }}>
                  التالي
                </Link>
              )}
            </div>
          </div>
        )}

        {paginatedGroups.map((group) => (
          <div key={group} style={{ marginTop: 44 }}>
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>{groupLabels[group]}</h2>
            <table className="article-table">
              <thead>
                <tr><th>#</th><th>المقال</th><th>الكلمة الأساسية</th><th>الحجم</th><th>KD</th><th>الحالة</th></tr>
              </thead>
              <tbody>
                {paginatedItems.filter((item) => item.group === group).map((item) => (
                  <tr key={item.slug}>
                    <td className="num">{item.id}</td>
                    <td><Link href={`/articles/${item.slug}`}>{item.title}</Link></td>
                    <td className="kw">{item.keyword}</td>
                    <td className="num">{item.volume.toLocaleString("ar-EG")}</td>
                    <td className="num">{item.kd ?? "—"}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
    </main>
  );
}
