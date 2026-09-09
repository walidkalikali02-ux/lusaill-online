import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getRelatedArticles } from "@/lib/content";
import { clusters } from "@/lib/clusters";
import { entities } from "@/lib/entities";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { ArticleBrief } from "@/components/article-brief";
import { StatusBadge } from "@/components/status-badge";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.quickAnswer ?? `${article.keyword} — دليل عملي محدث مع رسوم ومواعيد وخطوات وروابط رسمية.`,
    alternates: { canonical: `/articles/${article.slug}` },
    robots: { index: article.status === "published", follow: true },
    openGraph: {
      title: article.title,
      description: article.quickAnswer ?? `${article.keyword} — دليل عملي محدث.`,
      url: `/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.quickAnswer ?? `${article.keyword} — دليل عملي محدث.`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const cluster = clusters.find((item) => item.code === article.clusterCode);
  if (!cluster) notFound();

  const related = getRelatedArticles(article);
  const relatedEntities = entities.filter((entity) => entity.clusterCodes.includes(article.clusterCode));
  const latestCheck = article.sources?.length
    ? article.sources.reduce((latest, source) => (source.checkedAt > latest ? source.checkedAt : latest), article.sources[0].checkedAt)
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: cluster.name, item: absoluteUrl(`/categories/${cluster.slug}`) },
      { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(`/articles/${article.slug}`) },
    ],
  };

  const datePublished = article.publishedAt || undefined;
  const dateModified = article.updatedAt || latestCheck || undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.url}/articles/${article.slug}/#article`,
    headline: article.title,
    description: article.quickAnswer ?? `${article.keyword} — دليل عملي محدث مع رسوم ومواعيد وخطوات وروابط رسمية.`,
    url: absoluteUrl(`/articles/${article.slug}`),
    inLanguage: siteConfig.language,
    author: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.publisher,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: {
      "@type": "Thing",
      name: article.keyword,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/articles/${article.slug}/#webpage`,
    },
    datePublished,
    dateModified,
  };

  const faqSchema = article.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <main id="main-content" className="article-page">
      <div className="shell">
        <div className="breadcrumbs">
          <Link href="/">الرئيسية</Link><span>/</span>
          <Link href={`/categories/${cluster.slug}`}>{cluster.name}</Link><span>/</span>
          <span>{article.title}</span>
        </div>
        <div className="article-header">
          <h1>{article.title}</h1>
          {article.status === "published" && latestCheck && (
            <p>آخر تحقق من المصدر الرسمي: {latestCheck} — راجع «الإجابة الفورية» أدناه لخلاصة سريعة.</p>
          )}
          <div className="article-meta-row">
            <span className="pill">{article.volume.toLocaleString("ar-EG")} بحث/شهر</span>
            <span className="pill">KD {article.kd ?? "—"}</span>
            <span className="pill">الشهر {article.month}</span>
            <StatusBadge status={article.status} />
          </div>
        </div>
        <ArticleBrief article={article} cluster={cluster} related={related} />
        {relatedEntities.length > 0 && (
          <section style={{ marginTop: 32, padding: 20, background: "var(--paper-deep)", borderRadius: 8, border: "1px solid var(--line)" }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>الجهات الرسمية ذات الصلة</h2>
            <ul style={{ margin: 0, fontSize: 14 }}>
              {relatedEntities.map((entity) => (
                <li key={entity.slug} style={{ marginBottom: 6 }}>
                  <Link href={`/entities/${entity.slug}`}>{entity.name}</Link>
                  {entity.phone && <span style={{ color: "var(--muted)" }}> — هاتف: {entity.phone}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </main>
  );
}
