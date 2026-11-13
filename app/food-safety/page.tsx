import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { editorialImagePath } from "@/lib/editorial-image-url";
import { foodSafetyArticles } from "@/lib/food-safety";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl } from "@/lib/site-config";
import "./food-safety.css";

export const metadata: Metadata = {
  title: "سلامة الغذاء والتسمم الغذائي",
  description: "أدلة عملية ومصورة حول الأطعمة التي قد تسبب التسمم الغذائي، حفظ الأرز، الوقاية المنزلية، والأعراض التي تستدعي الطبيب.",
  alternates: pageAlternates("/food-safety"),
  robots: { index: false, follow: true },
  openGraph: { type: "website", url: "/food-safety", title: "سلامة الغذاء | لوسيل" },
};

export default function FoodSafetyHub() {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "موسوعة لوسيل", item: absoluteUrl("/knowledge") },
      { "@type": "ListItem", position: 3, name: "سلامة الغذاء", item: absoluteUrl("/food-safety") },
    ],
  };
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "سلامة الغذاء",
    url: absoluteUrl("/food-safety"),
    inLanguage: "ar",
    description: "أدلة عربية مصورة للوقاية من التسمم الغذائي وفهم المخاطر.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: foodSafetyArticles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.title,
        url: absoluteUrl(`/food-safety/${article.slug}`),
      })),
    },
  };
  return (
    <main id="main-content" className="food-section-page">
      <div className="shell">
        <nav className="food-breadcrumbs" aria-label="مسار التنقل"><Link href="/knowledge">موسوعة لوسيل</Link><span>/</span><span>سلامة الغذاء</span></nav>
        <header className="category-hero">
          <span className="article-card-tag">أدلة مصورة ومراجع علمية</span>
          <h1>سلامة الغذاء والتسمم الغذائي</h1>
          <p>أربع صفحات متكاملة عن الأطعمة التي قد تنقل مسببات المرض، وكيفية حفظها، والوقاية من التسمم، ومتى ينبغي الحصول على المساعدة الطبية.</p>
        </header>
        <section aria-label="أدلة سلامة الغذاء" className="food-safety-cards">
          {foodSafetyArticles.map((article) => (
            <Link className="food-safety-card" href={`/food-safety/${article.slug}`} key={article.slug}>
              <Image src={editorialImagePath("food-safety", article.slug)} alt={`غلاف لوسيل: ${article.title}`} width={720} height={378} unoptimized loading="lazy" />
              <div className="food-safety-card-copy"><h2>{article.title}</h2><p>{article.description}</p></div>
            </Link>
          ))}
        </section>
        <p style={{marginTop:36,color:"#60746d",fontSize:14}}>هذه معلومات تثقيفية عامة ولا تحل محل الرعاية الطبية أو فحص سلامة الطعام بواسطة مختص.</p>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </main>
  );
}
