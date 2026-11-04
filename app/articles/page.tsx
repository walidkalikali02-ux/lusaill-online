import { publishedCmsDocuments } from "@/lib/cms/public";
import { ArticleCard } from "@/components/article-card";
import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { articles, clusters } from "@/lib/content";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "كل الأدلة",
  description: "أدلة الخدمات الحكومية المصرية: الكهرباء والأحوال المدنية والمرور والتموين والمعاشات والضرائب وتكافل وكرامة، بخطوات عملية وروابط رسمية وتواريخ مراجعة.",
  alternates: pageAlternates("/articles"),
  openGraph: {
    title: "كل الأدلة — لوسيل",
    description: "أدلة الخدمات الحكومية المصرية: الكهرباء والأحوال المدنية والمرور والتموين والمعاشات والضرائب وتكافل وكرامة، بخطوات عملية وروابط رسمية وتواريخ مراجعة.",
    url: "/articles",
    type: "website",
    images: [siteSocialImage],
  },
};

export default async function ArticlesPage() {
  const managed = await publishedCmsDocuments();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "الأدلة", item: absoluteUrl("/articles") },
    ],
  };

  const publishedArticles = articles.filter((a) => a.status === "published" && !managed.some(m=>m.slug===a.slug)).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") || b.id - a.id);



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
          <p>ابدأ بالخدمة التي تحتاجها: فواتير الكهرباء، وثائق الأحوال المدنية، المرور، التموين، المعاشات، الضرائب أو تكافل وكرامة. يضم الفهرس أيضًا الأدلة الرقمية المنشورة سابقًا؛ افتح الدليل للاطلاع على خطواته ومصادره وتاريخ مراجعته.</p>
          <div className="article-meta" style={{ marginTop: 16 }}>
            <span className="article-meta-item">{publishedArticles.length + managed.filter(d=>d.status === "published").length} دليلًا منشورًا</span>
          </div>
        </div>

        <h2>أحدث الأدلة</h2>
        {managed.filter(d=>d.status==='published').map(d=><article className="brief-box" key={d.id}><h3><Link href={`/articles/${d.slug}`}>{d.title}</Link></h3><p>{d.description}</p></article>)}
        {publishedArticles.length > 0 ? (
          <div className="articles-grid">
            {publishedArticles.slice(0, 12).map(article => <ArticleCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <div className="empty-state">
            <h3>جاري تجهيز الأدلة</h3>
            <p>نعمل على نشر أول الأدلة العملية قريباً.</p>
            <Link className="button button-secondary" href="/categories" style={{ marginTop: 16 }}>تصفح التصنيفات</Link>
          </div>
        )}
        <section className="article-directory-index" aria-labelledby="article-index-title">
          <h2 id="article-index-title">الفهرس الكامل حسب الموضوع</h2>
          <p>كل الأدلة المنشورة في مكان واحد. اختر الموضوع ثم المقال الذي يطابق مهمتك.</p>
          {clusters.filter(cluster => publishedArticles.some(article => article.clusterCode === cluster.code)).map(cluster => <section key={cluster.code}>
            <h3><Link href={`/categories/${cluster.slug}`}>{cluster.name}</Link><span>{publishedArticles.filter(article => article.clusterCode === cluster.code).length} دليلًا</span></h3>
            <ul>{publishedArticles.filter(article => article.clusterCode === cluster.code).map(article => <li key={article.slug}><Link href={`/articles/${article.slug}`}>{article.title}</Link></li>)}</ul>
          </section>)}
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
