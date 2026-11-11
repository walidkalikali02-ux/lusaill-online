import type { Metadata } from "next";
import Link from "next/link";
import type { RestoredScienceGuide } from "@/lib/restored-science-guides";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { pageAlternates } from "@/lib/page-alternates";

export function metadataForRestoredScienceGuide(guide: RestoredScienceGuide): Metadata {
  const path = "/articles/" + guide.slug;
  return {
    title: guide.title,
    description: guide.description,
    alternates: pageAlternates(path),
    robots: { index: true, follow: true },
    openGraph: {
      type: "article", title: guide.title, description: guide.description,
      url: path, publishedTime: guide.publishedAt, modifiedTime: guide.publishedAt,
    },
  };
}

export function RestoredScienceArticle({ guide }: { guide: RestoredScienceGuide }) {
  const path = "/articles/" + guide.slug;
  const url = absoluteUrl(path);
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    "@id": url + "#article", url, headline: guide.title,
    description: guide.description, inLanguage: siteConfig.language,
    datePublished: guide.publishedAt, dateModified: guide.publishedAt,
    author: { "@type": "Organization", name: siteConfig.publisher, url: absoluteUrl("/authors/editorial-team") },
    publisher: { "@id": siteConfig.url + "/#organization" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": siteConfig.url + "/#website" },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "المعارف العلمية", item: absoluteUrl("/knowledge") },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };
  const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
  return <main id="main-content" className="article-page">
    <article className="shell" style={{ maxWidth: 940, paddingBlock: 42 }}>
      <nav className="breadcrumbs" aria-label="مسار التنقل">
        <Link href="/">الرئيسية</Link><span>/</span>
        <Link href="/knowledge">المعارف</Link><span>/</span>
        <span>{guide.title}</span>
      </nav>
      <header className="article-header">
        <p className="article-card-tag">{guide.category}</p>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        <div className="article-meta">
          <span>إعداد: <Link href="/authors/editorial-team">فريق لوسيل</Link></span>
          <span>إعادة تحرير ونشر: <time dateTime={guide.publishedAt}>{guide.publishedAt}</time></span>
        </div>
      </header>
      <section id="quick-answer" className="brief-box" aria-labelledby="quick-answer-heading">
        <h2 id="quick-answer-heading">الإجابة المباشرة</h2>
        <p>{guide.directAnswer}</p>
      </section>
      <nav aria-label="فهرس المقال" className="brief-box">
        <h2>في هذا الدليل</h2>
        <ol>{guide.sections.map((section, index) => <li key={section.title}>
          <a href={`#section-${index + 1}`}>{section.title}</a>
        </li>)}</ol>
      </nav>
      <div className="article-body">
        {guide.sections.map((section,index) => <section id={`section-${index+1}`} key={section.title} className="brief-box">
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph,pi) => <p key={pi}>{paragraph}</p>)}
        </section>)}
        <section id="faq" className="brief-box">
          <h2>أسئلة شائعة</h2>
          {guide.faqs.map(item => <div key={item.q}>
            <h3>{item.q}</h3><p>{item.a}</p>
          </div>)}
        </section>
        <section id="sources" className="brief-box">
          <h2>المصادر العلمية</h2>
          <p>المراجع التالية تدعم المفاهيم الأساسية. هذه صفحة تفسيرية لا تعرض توقعات طقس حية أو نتائج رصد ميداني أجريناه بأنفسنا.</p>
          <ul>{guide.sources.map(item => <li key={item.url}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>
          </li>)}</ul>
          <p><Link href="/contact">وجدت معلومة تحتاج تصحيحًا؟ أرسل ملاحظتك.</Link></p>
        </section>
        <p><Link href="/knowledge">تصفّح بقية المعارف العلمية والتطبيقية</Link></p>
      </div>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(breadcrumbSchema) }} />
  </main>;
}
