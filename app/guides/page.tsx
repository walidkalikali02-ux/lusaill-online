import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import Link from "next/link";
import { guidePaths } from "@/lib/guide-paths";
import { absoluteUrl, siteSocialImage } from "@/lib/site-config";

const description = "اختر مسارًا لمهمتك: السكن البديل والتموين والوثائق والمرور والكهرباء في مصر، أو أمان الحسابات ونسخ الهواتف وحل مشكلات Chrome.";
export const metadata: Metadata = {
  title: "مسارات الخدمات وحل المشكلات اليومية", description,
  alternates: pageAlternates("/guides"),
  openGraph: { title: "مسارات الخدمات وحل المشكلات اليومية", description, url: "/guides", images: [siteSocialImage] },
};
export default function GuidesPage() {
  const schemas = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "مسارات المهام", item: absoluteUrl("/guides") },
    ] },
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "مسارات المهام اليومية", url: absoluteUrl("/guides"), description,
      mainEntity: { "@type": "ItemList", itemListElement: guidePaths.map((path, index) => ({ "@type": "ListItem", position: index + 1, name: path.title, url: absoluteUrl(`/guides/${path.slug}`) })) } },
  ];
  return <main id="main-content" className="category-page"><div className="shell">
    <div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>/</span><span>مسارات المهام</span></div>
    <div className="category-hero"><h1>ابدأ من المهمة التي تحتاجها</h1><p>{description}</p></div>
    <div className="trust-grid">{guidePaths.map((path) => <section className="trust-card" key={path.slug}>
      <h2><Link href={`/guides/${path.slug}`}>{path.title}</Link></h2><p>{path.description}</p><p>{path.scope}</p>
    </section>)}</div>
  </div>{schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}</main>;
}
