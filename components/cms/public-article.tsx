import "./public-article.css";
import Link from "next/link";
import { CmsPreview } from "./render-document";
import type { CmsDocument } from "@/lib/cms/model";
import { absoluteUrl } from "@/lib/site-config";
export function CmsPublicArticle({ document: d }: { document: CmsDocument }) {
  const url = absoluteUrl(`/articles/${d.slug}`);
  const schemas: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: d.title,
      description: d.description,
      url,
      dateModified: d.updatedAt,
      author: { "@type": "Organization", name: "فريق لوسيل" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "الرئيسية",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "الأدلة",
          item: absoluteUrl("/articles"),
        },
        { "@type": "ListItem", position: 3, name: d.title, item: url },
      ],
    },
  ];
  const faqs = d.blocks.filter((b) => b.kind === "faq");
  if (faqs.length)
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.title,
        acceptedAnswer: { "@type": "Answer", text: f.text },
      })),
    });
  return (
    <main className="shell" dir="rtl">
      <nav aria-label="مسار التصفح">
        <Link href="/">الرئيسية</Link> / <Link href="/articles">كل الأدلة</Link>
      </nav>
      <CmsPreview document={d} />
      <section className="brief-box">
        <h2>الخطوة التالية</h2>
        <Link href="/articles">تصفّح الأدلة المرتبطة بالخدمة</Link>
      </section>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </main>
  );
}
