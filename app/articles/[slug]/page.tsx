import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getRelatedArticles } from "@/lib/content";
import { clusters } from "@/lib/clusters";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { ArticleBrief } from "@/components/article-brief";

export function generateStaticParams() {
  return articles.filter((article) => article.status === "published").map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.status !== "published") return { robots: { index: false, follow: false } };
  return {
    title: article.title,
    description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث مع خطوات وروابط رسمية.`,
    alternates: { canonical: `/articles/${article.slug}` },
    robots: { index: article.status === "published", follow: true },
    openGraph: {
      title: article.title,
      description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث.`,
      url: `/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt ?? undefined,
      images: article.coverImage ? [{ url: article.coverImage, alt: article.coverImageAlt ?? article.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث.`,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

function readingTime(article: { quickAnswer?: string; steps?: { title: string; detail: string }[] }): number {
  const words = (article.quickAnswer?.length ?? 0) + (article.steps?.length ?? 0) * 40 + 200;
  return Math.max(3, Math.round(words / 200));
}

function wordCount(article: { quickAnswer?: string; steps?: { title: string; detail: string }[]; commonMistakes?: string[]; faqs?: { question: string; answer: string }[] }) {
  const text = [
    article.quickAnswer,
    ...(article.steps ?? []).flatMap((step) => [step.title, step.detail]),
    ...(article.commonMistakes ?? []),
    ...(article.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
  ].filter(Boolean).join(" ");
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.status !== "published") notFound();

  const cluster = clusters.find((item) => item.code === article.clusterCode);
  if (!cluster) notFound();

  const related = getRelatedArticles(article);
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
  const mins = readingTime(article);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(`/articles/${article.slug}`)}#article`,
    headline: article.title,
    description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث مع خطوات وروابط رسمية.`,
    url: absoluteUrl(`/articles/${article.slug}`),
    inLanguage: siteConfig.language,
    articleSection: cluster.name,
    keywords: [article.keyword, cluster.name],
    wordCount: wordCount(article),
    timeRequired: `PT${mins}M`,
    author: {
      "@type": "Organization",
      "@id": `${absoluteUrl("/authors/editorial-team")}#author`,
      name: siteConfig.publisher,
      url: absoluteUrl("/authors/editorial-team"),
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
      "@id": `${absoluteUrl(`/articles/${article.slug}`)}#webpage`,
    },
    datePublished,
    dateModified,
    image: article.coverImage ? {
      "@type": "ImageObject",
      url: absoluteUrl(article.coverImage),
      width: 1200,
      height: 630,
      caption: article.coverImageAlt ?? article.title,
    } : undefined,
  };

  const howToSchema = article.steps?.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "@id": `${absoluteUrl(`/articles/${article.slug}`)}#howto`,
        name: article.title,
        description: article.quickAnswer,
        inLanguage: siteConfig.language,
        totalTime: `PT${mins}M`,
        step: article.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.detail,
          url: `${absoluteUrl(`/articles/${article.slug}`)}#step-${index + 1}`,
        })),
      }
    : null;

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
          <span className="article-card-tag">{cluster.name}</span>
          <h1>{article.title}</h1>
          <div className="article-meta">
            {article.publishedAt && <span className="article-meta-item">نُشر: {article.publishedAt}</span>}
            {article.updatedAt && <span className="article-meta-item">رُوجع: {article.updatedAt}</span>}
            <span className="article-meta-item"><Link href="/authors/editorial-team">فريق لوسيل</Link></span>
            <span className="article-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {mins} دقائق قراءة
            </span>
            {latestCheck && (
              <span className="article-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                آخر تحقق: {latestCheck}
              </span>
            )}
          </div>
        </div>

        {article.coverImage ? (
          <Image
            className="article-cover"
            src={article.coverImage}
            alt={article.coverImageAlt ?? article.title}
            width={1200}
            height={630}
            priority
          />
        ) : null}

        {/* Mobile TOC */}
        <details className="toc-mobile">
          <summary>محتويات الدليل</summary>
          <nav>
            <a href="#quick-answer">الإجابة الفورية</a>
            <a href="#summary">الملخص</a>
            <a href="#steps">خطوات التنفيذ</a>
            {article.commonMistakes?.length ? <a href="#mistakes">الأخطاء الشائعة</a> : null}
            <a href="#sources">المصادر الرسمية</a>
            {article.faqs?.length ? <a href="#faq">الأسئلة الشائعة</a> : null}
          </nav>
        </details>

        <ArticleBrief article={article} cluster={cluster} related={related} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {howToSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </main>
  );
}
