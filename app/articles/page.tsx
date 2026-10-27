import { ArticleCard } from "@/components/article-card";
import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/content";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "كل الأدلة",
  description: "تصفح أدلة لوسيل لخدمات الكهرباء والحياة الرقمية: تنظيم البريد وحماية الحسابات وإدارة الملفات، مع خطوات واضحة وصور ومصادر رسمية وتاريخ مراجعة.",
  alternates: pageAlternates("/articles"),
  openGraph: {
    title: "كل الأدلة — لوسيل",
    description: "تصفح أدلة لوسيل لخدمات الكهرباء والحياة الرقمية: تنظيم البريد وحماية الحسابات وإدارة الملفات، مع خطوات واضحة وصور ومصادر رسمية وتاريخ مراجعة.",
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

        <h2>اختر دليلًا يناسب مشكلتك</h2>
        {publishedArticles.length > 0 ? (
          <div className="articles-grid">
            {publishedArticles.map(article => <ArticleCard key={article.slug} article={article} />)}
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
    </main>
  );
}
