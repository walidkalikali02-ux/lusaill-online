import type { Metadata } from "next";
import { ArticleDirectory } from "@/components/article-directory";
import { articles, clusters } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "كل المقالات",
  description: "خطة المئة مقال الأولى لموقع لوسيل، مرتبة حسب العنقود والشهر وحجم البحث والصعوبة.",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "كل المقالات — لوسيل",
    description: "خطة المئة مقال الأولى لموقع لوسيل، مرتبة حسب العنقود والشهر وحجم البحث والصعوبة.",
    url: "/articles",
    type: "website",
  },
};

export default function ArticlesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "المقالات", item: absoluteUrl("/articles") },
    ],
  };

  const publishedArticles = articles.filter((a) => a.status === "published");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "مقالات لوسيل",
    description: "دليل خطة المقالات — كل مقال هو ملف تحرير: الكلمة المستهدفة، الحجم، الصعوبة، والحالة.",
    numberOfItems: publishedArticles.length,
    itemListElement: publishedArticles.slice(0, 50).map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/articles/${article.slug}`),
      name: article.title,
    })),
  };

  return (
    <main id="main-content" className="directory">
      <div className="page-hero" style={{ padding: "50px 0 30px" }}>
        <div className="shell">
          <span className="eyebrow">{articles.length} مقالاً في الخطة</span>
          <h1 style={{ margin: "10px 0 14px", fontSize: "clamp(30px, 4.6vw, 46px)" }}>دليل خطة المقالات</h1>
          <p style={{ color: "var(--muted)", maxWidth: 640 }}>كل صف هنا هو ملف تحرير: الكلمة المستهدفة، الحجم، الصعوبة، والحالة. اضغط على أي مقال لرؤية القالب التحريري الكامل قبل الكتابة.</p>
        </div>
      </div>
      <div className="shell" style={{ paddingTop: 30 }}>
        <ArticleDirectory articles={articles} clusters={clusters} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    </main>
  );
}
