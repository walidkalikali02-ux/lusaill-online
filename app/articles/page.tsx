import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/content";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "كل الأدلة",
  description: "تصفح أدلة لوسيل المنشورة حول خدمات شركات توزيع الكهرباء والاستعلام عن الفواتير، بخطوات عربية واضحة ومصادر رسمية وتاريخ مراجعة.",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "كل الأدلة — لوسيل",
    description: "تصفح أدلة لوسيل المنشورة حول خدمات شركات توزيع الكهرباء والاستعلام عن الفواتير، بخطوات عربية واضحة ومصادر رسمية وتاريخ مراجعة.",
    url: "/articles",
    type: "website",
    images: [siteSocialImage],
  },
};

export default function ArticlesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الأدلة", item: absoluteUrl("/articles") },
    ],
  };

  const publishedArticles = articles.filter((a) => a.status === "published");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أدلة لوسيل",
    description: "جميع الأدلة العملية في موسوعة لوسيل.",
    numberOfItems: publishedArticles.length,
    itemListElement: publishedArticles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/articles/${article.slug}`),
      name: article.title,
    })),
  };

  return (
    <main id="main-content" className="category-page">
      <div className="shell">
        <div className="breadcrumbs">
          <Link href="/">الرئيسية</Link><span>/</span>
          <span>الأدلة</span>
        </div>

        <div className="category-hero">
          <span className="article-card-tag">الأدلة</span>
          <h1>كل الأدلة</h1>
          <p>جميع الأدلة والمقالات العملية في موسوعة لوسيل.</p>
          <div className="article-meta" style={{ marginTop: 16 }}>
            <span className="article-meta-item">{publishedArticles.length} دليلًا منشورًا</span>
          </div>
        </div>

        {publishedArticles.length > 0 ? (
          <div className="articles-grid">
            {publishedArticles.map((article) => (
              <Link key={article.slug} className="article-card" href={`/articles/${article.slug}`}>
                <h3>{article.title}</h3>
                <p className="article-card-desc">
                  {article.quickAnswer
                    ? article.quickAnswer.slice(0, 120) + (article.quickAnswer.length > 120 ? "…" : "")
                    : `دليل شامل عن ${article.keyword} مع خطوات عملية.`}
                </p>
                <div className="article-card-footer">
                  <span className="article-card-time">دليل عملي</span>
                  <span className="article-card-link">اقرأ الدليل ←</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>جاري تجهيز الأدلة</h3>
            <p>نعمل على نشر أول الأدلة العملية قريباً.</p>
            <Link className="button button-secondary" href="/categories" style={{ marginTop: 16 }}>تصفح التصنيفات</Link>
          </div>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </main>
  );
}
