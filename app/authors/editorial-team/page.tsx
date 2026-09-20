import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "فريق تحرير لوسيل",
  description: "تعرف إلى منهج فريق تحرير لوسيل في اختيار الأدلة، مراجعة المصادر الرسمية، وتحديث المحتوى المنشور.",
  alternates: { canonical: "/authors/editorial-team" },
  openGraph: {
    title: "فريق تحرير لوسيل",
    description: "منهج فريق تحرير لوسيل في التحقق من المصادر وتحديث الأدلة العملية.",
    url: "/authors/editorial-team",
    type: "profile",
  },
};

export default function EditorialTeamPage() {
  const published = articles.filter((article) => article.status === "published");
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/authors/editorial-team/#author`,
    name: siteConfig.publisher,
    url: absoluteUrl("/authors/editorial-team"),
    description: "فريق عربي يراجع الأدلة العملية اعتمادًا على المصادر الرسمية، ويعرض تاريخ التحقق داخل كل مقال.",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "فريق التحرير", item: absoluteUrl("/authors/editorial-team") },
    ],
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">الكاتب والمراجع</span>
        <h1>فريق تحرير لوسيل</h1>
        <p className="text-lead">
          يختار الفريق سؤالًا عمليًا محددًا، ويعود إلى الموقع الرسمي للجهة صاحبة الخدمة، ثم يكتب الإجابة بلغة عربية واضحة ويثبت رابط المصدر وتاريخ التحقق.
        </p>
        <div className="text-grid">
          <section><span>قبل النشر</span><h2>تحقق ومطابقة</h2><p>نطابق الإجراء والأرقام والروابط مع مصادر أولية، ونستبعد ما لا يمكن توثيقه بالكامل.</p></section>
          <section><span>بعد النشر</span><h2>مراجعة وتصحيح</h2><p>نحدّث الدليل عندما تتغير الخدمة أو يظهر مصدر رسمي أحدث، مع إبقاء تاريخ المراجعة ظاهرًا.</p></section>
        </div>
        <div className="text-cta">
          <div><strong>{published.length} أدلة منشورة</strong><p>يمكن مراجعة المصادر وتاريخ التحقق داخل كل دليل.</p></div>
          <Link className="button button-secondary" href="/editorial-policy">منهج التحرير</Link>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </main>
  );
}
