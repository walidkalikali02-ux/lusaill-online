import type { Metadata } from "next";
import { methodologyNotes, winningArticleTemplate } from "@/lib/content";
import { absoluteUrl, siteConfig, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "منهج التحرير والمراجعة",
  description: "كيف يبني لوسيل الدقة في محتوى الخدمات والإجراءات: مصادر أولية، تاريخ تحقق، بوابة جودة، وتصحيح واضح عند تغير المعلومات.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "منهج التحرير والمراجعة — لوسيل",
    description: "كيف يبني لوسيل الدقة في محتوى الخدمات والإجراءات الحكومية.",
    url: "/editorial-policy",
    type: "website",
    images: [siteSocialImage],
  },
};

export default function EditorialPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "منهج التحرير", item: absoluteUrl("/editorial-policy") },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/editorial-policy/#webpage`,
    url: absoluteUrl("/editorial-policy"),
    name: "منهج التحرير والمراجعة",
    description: "كيف يبني لوسيل الدقة في محتوى الخدمات والإجراءات عبر المصادر الأولية وبوابة الجودة والتحديث.",
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">سياسة التحرير</span>
        <h1>الدقة هنا ليست اختيارية</h1>
        <p className="text-lead">
          رسوم، مواعيد، أرقام هواتف، روابط بوابات — معلومة خاطئة واحدة تكفي لتفقد ثقة القارئ. لهذا نلتزم بمعيار
          واحد لكل مقال قبل نشره.
        </p>

        <div className="method-grid">
          {methodologyNotes.map((note) => (
            <div className="method-card" key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 50 }}>
          <h2 style={{ fontSize: 26, marginBottom: 20 }}>قالب المقال الفائز</h2>
          <table className="article-table">
            <thead><tr><th>#</th><th>العنصر</th><th>التفاصيل</th></tr></thead>
            <tbody>
              {winningArticleTemplate.map((item, index) => (
                <tr key={item.step}>
                  <td className="num">{index + 1}</td>
                  <td>{item.step}</td>
                  <td className="kw">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-cta">
          <div>
            <strong>مراجعة مرتبطة بتغير المصدر</strong>
            <p>نراجع الدليل عند تغير الخدمة أو الرابط أو ظهور مصدر رسمي أحدث، ونثبت تاريخ آخر تحقق داخل المقال.</p>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
    </main>
  );
}
