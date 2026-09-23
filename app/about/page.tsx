import type { Metadata } from "next";
import { siteConfig, absoluteUrl, siteSocialImage } from "@/lib/site-config";
import { overallProgress } from "@/lib/content";

export const metadata: Metadata = {
  title: "عن لوسيل",
  description: "لوسيل موسوعة عربية شاملة للخدمات والإجراءات الحكومية، مع مصدر رسمي وتاريخ مراجعة لكل معلومة.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "عن لوسيل",
    description: "لوسيل موسوعة عربية شاملة للخدمات والإجراءات الحكومية، مع مصدر رسمي وتاريخ مراجعة لكل معلومة.",
    url: "/about",
    type: "website",
    images: [siteSocialImage],
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
          {siteConfig.description} نكتب للقارئ العربي الذي يريد الوصول إلى الإجراء الصحيح بسرعة، ونربط كل معلومة متغيرة
          بمصدرها الرسمي مع تاريخ واضح لآخر تحقق.
        </p>
        <div className="text-grid">
          <section>
            <span>الهدف</span>
            <h2>إجابة موثقة قابلة للتنفيذ</h2>
            <p>نبدأ من سؤال محدد، ثم نشرح الطريق الآمن ونبين حدود المعلومة ومتى يجب الرجوع إلى الجهة المختصة.</p>
          </section>
          <section>
            <span>الحالة الآن</span>
            <h2>{progress.corePublished} من {progress.coreTotal} مقالاً منشورًا</h2>
            <p>لا يدخل أي دليل إلى هذه الحصيلة إلا بعد توثيق ادعاءاته بمصادر رسمية — راجع سياسة التحرير لتفاصيل المعيار.</p>
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
