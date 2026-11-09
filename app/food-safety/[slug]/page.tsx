import { searchTitles } from "@/lib/search-titles";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { foodSafetyArticles, getFoodSafetyArticle } from "@/lib/food-safety";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { pageAlternates } from "@/lib/page-alternates";
import "../food-safety.css";
import { getFoodSafetyPersona } from "@/lib/team-domains";
import { teamPersonaAnchor } from "@/lib/team-personas";
import { isFoodSafetySearchReady } from "@/lib/editorial-indexing";

export const dynamicParams = false;
export function generateStaticParams() {
  return foodSafetyArticles.map((article) => ({ slug: article.slug }));
}
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getFoodSafetyArticle(slug);
  if (!article) return { robots: { index: false, follow: false } };
  const path = `/food-safety/${article.slug}`;
  return {
    title: searchTitles[article.slug] ?? article.title,
    description: article.description,
    alternates: pageAlternates(path),
    robots: { index: isFoodSafetySearchReady(article), follow: true },
    openGraph: {
      type: "article",
      title: searchTitles[article.slug] ?? article.title,
      description: article.description,
      url: path,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [{ url: article.coverImage, alt: article.coverImageAlt }],
    },
    twitter: { card: "summary_large_image", title: searchTitles[article.slug] ?? article.title, description: article.description, images: [article.coverImage] },
  };
}

export default async function FoodSafetyArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getFoodSafetyArticle(slug);
  if (!article) notFound();
  const topicPersona = getFoodSafetyPersona();
  const path = `/food-safety/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline: article.title,
    description: article.description,
    inLanguage: "ar",
    url: absoluteUrl(path),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: article.coverImage,
    author: { "@type": "Organization", name: siteConfig.publisher, url: absoluteUrl("/authors/editorial-team") },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: absoluteUrl(path),
    isAccessibleForFree: true,
  };
  const breadcrumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "سلامة الغذاء", item: absoluteUrl("/food-safety") },
      { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(path) },
    ],
  };
  return (
    <main id="main-content" className="food-section-page">
      <div className="shell">
        <nav className="food-breadcrumbs" aria-label="مسار التنقل"><Link href="/">الرئيسية</Link><span>/</span><Link href="/food-safety">سلامة الغذاء</Link><span>/</span><span>{article.title}</span></nav>
        <div className="food-layout">
          <article className="food-article">
            <div className="food-article-rich" dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
            <div className="food-editorial-note">
              <p>المعلومات الواردة للتوعية العامة فقط، وليست تشخيصًا أو استشارة طبية. تُذكر مصادر الحقائق داخل المقال، ولا يُدّعى حصول مراجعة سريرية مستقلة. إذا ظهرت أعراض شديدة فاطلب رعاية طبية مناسبة.</p>
              <p>نُشر في <time dateTime={article.publishedAt}>{article.publishedAt}</time> — <Link href="/contact">الإبلاغ عن تصحيح</Link></p>
              {topicPersona && <p>المسار التخصصي: <Link href={`/team#${teamPersonaAnchor(topicPersona)}`}>{topicPersona.name}</Link> (شخصية توضيحية لتنظيم المحتوى؛ ليست طبيبًا أو مراجعًا بشريًا).</p>}
            </div>
          </article>
          <aside className="food-aside" aria-label="أدلة ذات صلة">
            <h2>أكمل الموضوع</h2>
            <ul>
              {foodSafetyArticles.filter((item) => item.slug !== article.slug).map((item) => (
                <li key={item.slug}><Link href={`/food-safety/${item.slug}`}>{item.title}</Link></li>
              ))}
              <li><Link href="/food-safety">جميع أدلة سلامة الغذاء</Link></li>
            </ul>
          </aside>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </main>
  );
}
