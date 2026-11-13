import type { Metadata } from "next";
import Link from "next/link";
import { EncyclopediaCategories } from "@/components/encyclopedia-categories";
import { pageAlternates } from "@/lib/page-alternates";
import { encyclopediaCategories } from "@/lib/encyclopedia-taxonomy";
import { getEncyclopediaCategoryCounts } from "@/lib/encyclopedia-catalog";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "جميع فئات الموسوعة العربية",
  description: "دليل جميع فئات موسوعة لوسيل: العلوم والصحة والتعليم والتقنية والمال والأعمال والتاريخ والجغرافيا واللغة والأسرة والخدمات وغيرها من مجالات المعرفة.",
  alternates: pageAlternates("/topics"),
  robots: { index: true, follow: true },
  openGraph: { title: "الفئات والتخصصات | موسوعة لوسيل", url: "/topics", type: "website" },
};

export default function TopicsIndexPage() {
  const counts = getEncyclopediaCategoryCounts();
  const publishedCategories = encyclopediaCategories.filter(item => (counts[item.slug] ?? 0) > 0).length;
  const schema = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: "فئات موسوعة لوسيل", url: absoluteUrl("/topics"),
    description: "تصفح فهرس موضوعات الموسوعة العربية عبر التخصصات الرئيسية والفروع.",
    inLanguage: "ar",
    mainEntity: {
      "@type": "ItemList", numberOfItems: encyclopediaCategories.length,
      itemListElement: encyclopediaCategories.map((item, i) => ({
        "@type": "ListItem", position: i + 1, name: item.title, url: absoluteUrl(`/topics/${item.slug}`),
      })),
    },
  };
  return <main id="main-content" className="shell" style={{ paddingBlock: 35 }}>
    <nav aria-label="مسار التنقل" style={{ fontSize: 13, color: "#617181" }}><Link href="/knowledge">رئيسية المشروع</Link> / فئات الموسوعة</nav>
    <div style={{ marginBlock: 25 }}>
      <h1 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 800, color: "#182e49", lineHeight: 1.4 }}>فهرس موسوعة لوسيل</h1>
      <p style={{ maxWidth: 840, lineHeight: 2, color: "#4b5c6d", marginTop: 10 }}>فهرس شامل للمجالات الرئيسية والتخصصات الفرعية في الموسوعة. يتوافر محتوى منشور حاليًا في {publishedCategories} مجالًا، ونعمل على توسيع بقية المجالات تدريجيًا. المقالات والأدلة مرتبطة بفئاتها حسب الموضوع.</p>
    </div>
    <EncyclopediaCategories expanded />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </main>;
}
