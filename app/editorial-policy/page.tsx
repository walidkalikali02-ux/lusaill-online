import { pageAlternates } from "@/lib/page-alternates";
import type { Metadata } from "next";
import { methodologyNotes, winningArticleTemplate } from "@/lib/content";
import { absoluteUrl, siteConfig, siteSocialImage } from "@/lib/site-config";

export const metadata: Metadata = {
  twitter: { card: "summary_large_image", title: "منهج التحرير والمراجعة", description: "كيف يوثق لوسيل مقالات الموسوعة وأدلتها في العلوم والصحة والتعليم والتقنية والخدمات: مصادر مناسبة لكل مجال وتواريخ مراجعة وتصحيح.", images: ["https://www.lusaill.online/opengraph-image"] },
  title: "منهج التحرير والمراجعة",
  description: "كيف يبني لوسيل الدقة في محتوى الخدمات والإجراءات: مصادر أولية، تاريخ تحقق، بوابة جودة، وتصحيح واضح عند تغير المعلومات.",
  alternates: pageAlternates("/editorial-policy"),
  openGraph: {
    title: "منهج التحرير والمراجعة — لوسيل",
    description: "كيف يراجع لوسيل المحتوى المعرفي والأدلة العملية ويستند إلى مراجع تناسب كل مجال.",
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
    description: "كيف يبني لوسيل محتوى معرفيًا موثقًا في مختلف التخصصات، مع مراجعة المصادر والإفصاح عن التحديثات.",
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };

  return (
    <main id="main-content" className="text-page">
      <div className="shell text-shell">
        <span className="eyebrow">سياسة التحرير</span>
        <h1>الدقة هنا ليست اختيارية</h1>
        <p className="text-lead">
          الحقائق العلمية والمعلومات الصحية والتعليمية، كما الرسوم والمواعيد وروابط الخدمات، تحتاج مصادر مناسبة وسياقًا واضحًا. نميز بين الدليل العلمي والإرشاد العملي ونوضح حدود كل منهما.
        </p>

        <section className="brief-box"><h2>حدود المراجعة وأدوات الإعداد</h2><p>نستخدم أدوات ذكاء اصطناعي في المساعدة على البحث والصياغة والتدقيق التقني. التوثيق بالمصدر الرسمي لا يعني تجربة الإجراء بحساب فعلي، ولا يعني اعتماد الجهة الرسمية للمقال. نوضح حدود البلد والخدمة، ولا نختلق لقطات واجهات أو خبرات شخصية.</p><p>درجة الجودة من 100 تقدير داخلي وليست درجة بحث أو ضمان ترتيب. تقييم نجاح المحتوى يعتمد على حل المشكلة وعلى بيانات ظهور ونقرات فعلية عندما تتاح.</p></section>
        <section className="brief-box">
          <h2>كيف نختار المصادر بحسب المجال؟</h2>
          <p>في العلوم والصحة نستند إلى الأبحاث والمراجعات العلمية والهيئات المختصة، ونوضح قوة الدليل والاختلافات المهمة. في التعليم والتقنية نستخدم المراجع التعليمية ووثائق الأدوات الأصلية. في الخدمات والإجراءات نرجع إلى الجهات الرسمية ذات الصلة. لا نعامل مصدرًا واحدًا بوصفه إثباتًا لكل الادعاءات.</p>
          <p>تُقدَّم موضوعات الطب والقانون والمال للمعلومات العامة، دون ادعاء مراجعة متخصصة لم تحدث أو استبدال الاستشارة المؤهلة. وعند تحديث مقال، نوضح ما تغير بحسب نوع المحتوى ومصادره.</p>
        </section>
        <div className="method-grid">
          {methodologyNotes.map((note) => (
            <div className="method-card" key={note.title}>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 50 }}>
          <h2 style={{ fontSize: 26, marginBottom: 20 }}>عناصر الدليل العملي</h2>
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
