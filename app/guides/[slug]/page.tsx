import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidePaths } from "@/lib/guide-paths";
import { articles } from "@/lib/content";
import { getTopicCluster, guideStages, readerQuestions } from "@/lib/topic-clusters";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

export const dynamicParams = false;
export function generateStaticParams() { return guidePaths.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = guidePaths.find((item) => item.slug === slug);
  if (!path) return { robots: { index: false } };
  return { title: path.title, description: path.description, alternates: pageAlternates(`/guides/${slug}`),
    openGraph: { title: path.title, description: path.description, url: `/guides/${slug}`, images: [siteSocialImage] } };
}
export default async function GuidePathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = guidePaths.find((item) => item.slug === slug);
  if (!path) notFound();
  const items = path.articleSlugs.flatMap((articleSlug) => articles.filter((article) => article.slug === articleSlug && article.status === "published"));
  const cluster = getTopicCluster(slug);
  const stages = guideStages[slug] ?? [{ question: "اختر الدليل المطابق لمهمتك", articleSlugs: path.articleSlugs }];
  const orderedItems = stages.flatMap(stage => stage.articleSlugs.flatMap(articleSlug => items.filter(article => article.slug === articleSlug)));
  const schemas = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "مسارات المهام", item: absoluteUrl("/guides") },
      { "@type": "ListItem", position: 3, name: path.title, item: absoluteUrl(`/guides/${slug}`) },
    ] },
    { "@context": "https://schema.org", "@type": "CollectionPage", name: path.title, description: path.description, url: absoluteUrl(`/guides/${slug}`), inLanguage: "ar",
      mainEntity: { "@type": "ItemList", itemListElement: orderedItems.map((article, index) => ({ "@type": "ListItem", position: index + 1, name: article.title, url: absoluteUrl(`/articles/${article.slug}`) })) } },
  ];
  return <main id="main-content" className="category-page"><div className="shell">
    <div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>/</span><Link href="/guides">مسارات المهام</Link><span>/</span><span>{path.title}</span></div>
    <div className="category-hero"><h1>{path.title}</h1><p>{path.description}</p><p><strong>نطاق الخدمة: </strong>{path.scope}</p></div>
    <p><strong>{readerQuestions[slug]}</strong></p><p>اختر الحالة التي تطابق احتياجك؛ لا يلزم تنفيذ كل الأدلة أو قراءتها بالترتيب. راجع شروط الخدمة في المقال قبل بدء الطلب.</p>
    {stages.length > 1 && <nav className="topic-nav" aria-label="اختر حالتك"><ul>{stages.map((stage, index) => <li key={stage.question}><Link href={`#case-${index + 1}`}>{stage.question}</Link></li>)}</ul></nav>}
    {stages.map((stage, index) => <section className="topic-group" id={`case-${index + 1}`} key={stage.question} aria-labelledby={`case-${index + 1}-title`}>
      <h2 id={`case-${index + 1}-title`}>{stage.question}</h2>
      <div className="trust-grid">{stage.articleSlugs.flatMap(articleSlug => items.filter(article => article.slug === articleSlug)).map((article) => <section className="trust-card" key={article.slug}>
      <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3><p>{article.quickAnswer}</p>
      <Link href={`/articles/${article.slug}#summary`}>راجع الملخص والمتطلبات</Link> · <Link href={`/articles/${article.slug}#checklist`}>قائمة المتابعة</Link>
    </section>)}</div></section>)}
    {cluster && <p><Link href={`/guides#${cluster.slug}`}>العودة إلى موضوع {cluster.title}</Link></p>}
    <p className="path-note">راجع تاريخ التحقق داخل كل مقال. لوسيل يشرح الإجراء؛ تقديم الطلب أو تغيير الإعدادات يتم لدى الخدمة الرسمية.</p>
    <Link href="/contact">أبلغ عن خطوة تغيرت أو رابط لا يعمل</Link>
  </div>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</main>;
}
