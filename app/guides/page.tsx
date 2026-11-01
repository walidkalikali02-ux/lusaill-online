import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { guidePaths } from "@/lib/guide-paths";
import { readerQuestions, topicClusters } from "@/lib/topic-clusters";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

const description = "ابدأ بالمشكلة التي تريد حلها: فاتورة أو وثيقة أو رخصة أو دعم أو معاش أو معاملة ضريبية، ثم اختر الدليل المناسب لحالتك من مجموعة مترابطة.";
export const metadata: Metadata = {
  title: "مسارات الخدمات وحل المشكلات اليومية", description,
  alternates: pageAlternates("/guides"),
  openGraph: { title: "مسارات الخدمات وحل المشكلات اليومية", description, url: "/guides", images: [siteSocialImage] },
};
export default function GuidesPage() {
  const orderedPaths = topicClusters.flatMap(cluster => cluster.pathSlugs.flatMap(slug => guidePaths.filter(path => path.slug === slug)));
  const schemas = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "مسارات المهام", item: absoluteUrl("/guides") },
    ] },
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "مسارات المهام اليومية", url: absoluteUrl("/guides"), description,
      mainEntity: { "@type": "ItemList", itemListElement: orderedPaths.map((path, index) => ({ "@type": "ListItem", position: index + 1, name: path.title, url: absoluteUrl(`/guides/${path.slug}`) })) } },
  ];
  return <main id="main-content" className="category-page"><div className="shell">
    <div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>/</span><span>مسارات المهام</span></div>
    <div className="category-hero"><h1>ابدأ من المشكلة التي تريد حلها</h1><p>{description}</p></div>
    <nav className="topic-nav" aria-label="موضوعات الأدلة"><ul>{topicClusters.map(cluster => <li key={cluster.slug}><Link href={`#${cluster.slug}`}>{cluster.title}</Link></li>)}</ul></nav>
    {topicClusters.map(cluster => <section className="topic-group" id={cluster.slug} key={cluster.slug} aria-labelledby={`${cluster.slug}-title`}>
      <h2 id={`${cluster.slug}-title`}>{cluster.title}</h2><p>{cluster.readerNeed}</p>
      <div className="trust-grid">{cluster.pathSlugs.map(slug => {
        const path = guidePaths.find(item => item.slug === slug);
        if (!path) return null;
        return <section className="trust-card" key={path.slug}>
          <h3><Link href={`/guides/${path.slug}`}>{readerQuestions[path.slug]}</Link></h3><p>{path.description}</p><p>{path.scope}</p>
          <Link href={`/guides/${path.slug}`}>{path.title}</Link>
        </section>;
      })}</div>
    </section>)}
  </div>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</main>;
}
