import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { overallProgress, clusters } from "@/lib/content";

export const metadata: Metadata = {
  title: "عن لوسيل",
  description: "لوسيل موسوعة عربية شاملة للخدمات والإجراءات الحكومية، مع مصدر رسمي وتاريخ مراجعة لكل معلومة.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "عن لوسيل",
    description: "لوسيل موسوعة عربية شاملة للخدمات والإجراءات الحكومية، مع مصدر رسمي وتاريخ مراجعة لكل معلومة.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  const progress = overallProgress();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "عن لوسيل", item: absoluteUrl("/about") },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/about/#webpage`,
    url: absoluteUrl("/about"),
    name: "عن لوسيل",
    description: "لوسيل موسوعة عربية شاملة للخدمات والإجراءات الحكومية، مع مصدر رسمي وتاريخ مراجعة لكل معلومة.",
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">عن المشروع</span>
        <h1>لوسيل — موسوعة عربية للخدمات والإجراءات الحكومية</h1>
        <p className="text-lead">
          {siteConfig.description} نستهدف القارئ العربي عبر {siteConfig.searchEngine}، ونبني كل صفحة حول قيمة يفشل
          الموقع الرسمي في تقديمها للزائر: رابط مباشر، خطوات مصوّرة، أرقام دعم، وحل للأعطال الشائعة.
        </p>
        <div className="text-grid">
          <section>
            <span>الهدف</span>
            <h2>١٠٠ ألف زائر شهريًا خلال ٦ أشهر</h2>
            <p>عبر {clusters.length} تصنيف كلمات مفتاحية تغطي أكثر من مليون بحث شهري بصعوبة منخفضة في السوق العربي.</p>
          </section>
          <section>
            <span>الحالة الآن</span>
            <h2>{progress.corePublished} من {progress.coreTotal} مقالاً منشورًا</h2>
            <p>كل مقال يمر بمرحلة تحقق ميداني من المصدر الرسمي قبل النشر — راجع سياسة التحرير لتفاصيل المعيار.</p>
          </section>
        </div>
        <div className="text-cta">
          <div>
            <strong>محتوى إرشادي عام</strong>
            <p>لا يغني عن مراجعة الجهة الرسمية المختصة قبل اتخاذ أي إجراء رسمي أو مالي.</p>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </main>
  );
}
