import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidePaths } from "@/lib/guide-paths";
import { articles } from "@/lib/content";
import { verifiedServiceHubs } from "@/lib/verified-service-hubs";
import { VerifiedServiceHubContent } from "@/components/verified-service-hub";
import { isGuidePathSearchReady } from "@/lib/editorial-indexing";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const dynamicParams = false;
export function generateStaticParams() { return guidePaths.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = guidePaths.find((item) => item.slug === slug);
  if (!path) return { robots: { index: false } };
  const hub = verifiedServiceHubs[slug];
  const title = hub?.seoTitle ?? path.title;
  const description = hub?.description ?? path.description;
  return { title, description, alternates: pageAlternates(`/guides/${slug}`),
    robots: { index: isGuidePathSearchReady(path), follow: true },
    openGraph: { title, description, url: `/guides/${slug}`, images: [siteSocialImage] } };
}
export default async function GuidePathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = guidePaths.find((item) => item.slug === slug);
  if (!path) notFound();
  const items = path.articleSlugs.flatMap((articleSlug) => articles.filter((article) => article.slug === articleSlug && article.status === "published"));
  const hub = verifiedServiceHubs[slug];
  const extra = hub ? items.filter((article) => !hub.choices.some((choice) => choice.slug === article.slug)) : [];
  const schemas = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "مسارات المهام", item: absoluteUrl("/guides") },
      { "@type": "ListItem", position: 3, name: path.title, item: absoluteUrl(`/guides/${slug}`) },
    ] },
    { "@context": "https://schema.org", "@type": "CollectionPage", name: path.title, description: path.description, url: absoluteUrl(`/guides/${slug}`), inLanguage: "ar",
      mainEntity: { "@type": "ItemList", itemListElement: items.map((article, index) => ({ "@type": "ListItem", position: index + 1, name: article.title, url: absoluteUrl(`/articles/${article.slug}`) })) } },
    ...(hub ? [{ "@context": "https://schema.org", "@type": "Article", headline: hub.title, description: hub.description,
      url: absoluteUrl(`/guides/${slug}`), inLanguage: "ar", dateModified: "2026-11-09",
      author: { "@type": "Organization", name: "فريق تحرير لوسيل", url: absoluteUrl("/authors/editorial-team") },
      publisher: { "@type": "Organization", name: "موسوعة لوسيل", url: absoluteUrl("/") }
    }] : []),
  ];
  return <main id="main-content" className="category-page"><div className="shell">
    <div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>/</span><Link href="/guides">مسارات المهام</Link><span>/</span><span>{hub?.title ?? path.title}</span></div>
    <div className="category-hero"><h1>{hub?.title ?? path.title}</h1><p>{hub?.description ?? path.description}</p><p><strong>نطاق الخدمة: </strong>{path.scope}</p></div>
    {hub && <VerifiedServiceHubContent hub={hub} slugs={new Set(items.map((article) => article.slug))} />}
    {hub && extra.length > 0 && <section aria-labelledby="additional-services" className="brief-box">
      <h2 id="additional-services">حالات متخصصة إضافية</h2>
      <ul>{extra.map((article) => <li key={article.slug}><Link href={`/articles/${article.slug}`}>{article.title}</Link></li>)}</ul>
    </section>}
    {!hub && <>
    <h2>اختر حالتك قبل بدء الإجراء</h2><p>هذه أدلة مرتبطة بالمهمة؛ قد تحتاج إلى أحدها فقط. اقرأ شروط الدليل وحدوده، ثم اتبع خطواته ومصادره الرسمية.</p>
    <div className="trust-grid">{items.map((article) => <section className="trust-card" key={article.slug}>
      <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3><p>{article.quickAnswer}</p>
      <Link href={`/articles/${article.slug}#summary`}>راجع الملخص والمتطلبات</Link> · <Link href={`/articles/${article.slug}#checklist`}>قائمة المتابعة</Link>
    </section>)}</div>
    </>}
    <p className="path-note">راجع تاريخ التحقق داخل كل مقال. لوسيل يشرح الإجراء؛ تقديم الطلب أو تغيير الإعدادات يتم لدى الخدمة الرسمية.</p>
    <Link href="/contact">أبلغ عن خطوة تغيرت أو رابط لا يعمل</Link>
  </div>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</main>;
}
