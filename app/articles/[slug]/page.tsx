import { getArticleModifiedAt } from "@/lib/content-modified";
import { getArticleAdvisories } from "@/lib/article-audit-updates";
import { electricityDetailText } from "@/lib/electricity-inquiry-detail";
import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { EditorialCover } from "@/components/editorial-cover";
import { editorialImagePath } from "@/lib/editorial-image-url";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getRelatedArticles, isArticleIndexable } from "@/lib/content";
import { clusters } from "@/lib/clusters";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { searchTitles } from "@/lib/search-titles";
import { ArticleBrief, ArticleSidebar } from "@/components/article-brief";
import { getTeamPersonaForArticle } from "@/lib/team-domains";
import { teamPersonaAnchor } from "@/lib/team-personas";
import { getEncyclopedicContent } from "@/lib/encyclopedic-content";
import { getArticlePresentation } from "@/lib/article-presentation";
import { isArticleSearchReady } from "@/lib/editorial-indexing";

export function generateStaticParams() {
  return articles.filter((article) => isArticleIndexable(article)).map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !isArticleIndexable(article)) return { robots: { index: false, follow: false } };
  const imagePath = editorialImagePath("articles", article.slug);
  return {
    title: searchTitles[article.slug] ?? article.title,
    description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث مع خطوات وروابط رسمية.`,
    alternates: pageAlternates(`/articles/${article.slug}`),
    robots: { index: isArticleSearchReady(article), follow: true },
    openGraph: {
      title: searchTitles[article.slug] ?? article.title,
      description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث.`,
      url: `/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: getArticleModifiedAt(article),
      images: [{ url: imagePath, alt: "غلاف تحريري: " + article.title, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: searchTitles[article.slug] ?? article.title,
      description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث.`,
      images: [imagePath],
    },
  };
}

function readingTime(article: Parameters<typeof wordCount>[0]): number {
  return Math.max(1, Math.ceil(wordCount(article) / 200));
}

function wordCount(article: { slug?: string; quickAnswer?: string; summaryTable?: { label: string; value: string }[]; steps?: { title: string; detail: string }[]; practicalSections?: { title: string; intro?: string; columns: string[]; rows: string[][] }[]; commonMistakes?: string[]; faqs?: { question: string; answer: string }[] }) {
  const text = [
    article.quickAnswer,
    article.slug === "electricity-bill-inquiry" ? electricityDetailText : undefined,
    ...((getEncyclopedicContent(article.slug ?? "")?.sections ?? []).flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])])),
    ...(article.summaryTable ?? []).flatMap((row) => [row.label, row.value]),
    ...(article.steps ?? []).flatMap((step) => [step.title, step.detail]),
    ...(article.practicalSections ?? []).flatMap((section) => [section.title, section.intro, ...section.columns, ...section.rows.flat()]),
    ...(article.commonMistakes ?? []),
    ...(article.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
  ].filter(Boolean).join(" ");
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || !isArticleIndexable(article)) notFound();

  const cluster = clusters.find((item) => item.code === article.clusterCode);
  if (!cluster) notFound();
  const topicPersona = getTeamPersonaForArticle(article);

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
  const dateModified = getArticleModifiedAt(article);
  const mins = readingTime(article);
  const deepContent = getEncyclopedicContent(article.slug);
  const presentation = getArticlePresentation(article);
  const editorialImage = editorialImagePath("articles", article.slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(`/articles/${article.slug}`)}#article`,
    headline: article.title,
    description: article.metaDescription ?? article.quickAnswer ?? `${article.keyword} — دليل عملي محدث مع خطوات وروابط رسمية.`,
    url: absoluteUrl(`/articles/${article.slug}`),
    inLanguage: siteConfig.language,
    articleSection: cluster.name,
    keywords: [article.keyword, cluster.name, ...(deepContent?.keywords ?? [])],
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
    image: {
      "@type": "ImageObject",
      url: absoluteUrl(editorialImage),
      width: 1200,
      height: 630,
      caption: article.title,
    },
  };

  return (
    <main id="main-content" className="article-page">
      <div className="shell">
        <div className="breadcrumbs">
          <Link href="/articles">رئيسية المشروع</Link><span>/</span>
          <Link href={`/categories/${cluster.slug}`}>{cluster.name}</Link><span>/</span>
          <span>{article.title}</span>
        </div>

        <div className="article-layout">
        <div className="article-reading-main">
        <div className="article-header">
          <span className="article-card-tag">{cluster.name}</span>
          <h1>{article.title}</h1>
          <div className="article-meta">
            {article.publishedAt && <span className="article-meta-item">نُشر: <time dateTime={article.publishedAt}>{article.publishedAt.slice(0, 10)}</time></span>}
            {article.updatedAt && <span className="article-meta-item">آخر مراجعة: <time dateTime={article.updatedAt}>{article.updatedAt.slice(0, 10)}</time></span>}
            <span className="article-meta-item"><Link href="/authors/editorial-team">فريق لوسيل</Link></span>
            {topicPersona && <span className="article-meta-item">المسار التخصصي: <Link href={`/team#${teamPersonaAnchor(topicPersona)}`}>{topicPersona.name}</Link></span>}
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

        {getArticleAdvisories(article).map((notice) => <section className="brief-box callout callout-warning" key={notice.title}>
          <h2>{notice.title}</h2><p>{notice.detail}</p>
          {notice.url.startsWith("/") ? <Link href={notice.url}>{notice.label}</Link> : <a href={notice.url} target="_blank" rel="noopener noreferrer">{notice.label}</a>}
        </section>)}

        <section id="quick-answer" className="brief-box">
          <h2>الإجابة المباشرة</h2>
          <p>{article.quickAnswer}</p>
        </section>

        <EditorialCover
          title={article.title}
          category={cluster.name}
          image={article.coverImage}
          imageAlt={article.coverImageAlt}
          imageUrl={editorialImage}
          priority
          description="دليل عملي بخطوات ومراجع"
        />

        {/* Mobile TOC */}
        <details className="toc-mobile">
          <summary>محتويات الدليل</summary>
          <nav>
            <a href="#quick-answer">الإجابة الفورية</a>
            <a href="#summary">{presentation.summaryHeading}</a>
            <a href="#steps">{presentation.stepsHeading}</a>
            {deepContent && <a href="#in-depth">شرح متعمق</a>}
            {article.slug === "electricity-bill-inquiry" && <><a href="#electricity-companies">الشركات التسع</a><a href="#calculator">حاسبة الفاتورة</a><a href="#inquiry-problems">حل مشكلات الاستعلام</a></>}
            {article.commonMistakes?.length ? <a href="#mistakes">الأخطاء الشائعة</a> : null}
            <a href="#sources">{presentation.sourcesHeading}</a>
            {deepContent && <a href="#encyclopedic-sources">مصادر البحث الإضافية</a>}
            {article.faqs?.length ? <a href="#faq">الأسئلة الشائعة</a> : null}
          </nav>
        </details>

        <ArticleBrief article={article} cluster={cluster} related={related} />
        </div>
        <ArticleSidebar article={article} cluster={cluster} related={related} />
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
    </main>
  );
}
