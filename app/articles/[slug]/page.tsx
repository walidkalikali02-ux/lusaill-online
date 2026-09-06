import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getRelatedArticles } from "@/lib/content";
import { clusters } from "@/lib/clusters";
import { ArticleBrief } from "@/components/article-brief";
import { StatusBadge } from "@/components/status-badge";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.quickAnswer ?? `${article.keyword} — دليل عملي محدث مع رسوم ومواعيد وخطوات وروابط رسمية.`,
    alternates: { canonical: `/articles/${article.slug}` },
    robots: { index: article.status === "published", follow: true },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const cluster = clusters.find((item) => item.code === article.clusterCode);
  if (!cluster) notFound();

  const related = getRelatedArticles(article);
  const latestCheck = article.sources?.length
    ? article.sources.reduce((latest, source) => (source.checkedAt > latest ? source.checkedAt : latest), article.sources[0].checkedAt)
    : null;

  const faqSchema = article.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <main id="main-content" className="article-page">
      <div className="shell">
        <div className="breadcrumbs">
          <Link href="/">الرئيسية</Link><span>/</span>
          <Link href={`/clusters/${cluster.slug}`}>{cluster.name}</Link><span>/</span>
          <span>{article.title}</span>
        </div>
        <div className="article-header">
          <h1>{article.title}</h1>
          <p>
            {article.status === "published"
              ? `آخر تحقق من المصدر الرسمي: ${latestCheck} — راجع «الإجابة الفورية» أدناه لخلاصة سريعة.`
              : `مسودة تحريرية لمقال يستهدف «${article.keyword}» — بحاجة لتحقق ميداني من المصدر الرسمي قبل النشر.`}
          </p>
          <div className="article-meta-row">
            <span className="pill">{article.volume.toLocaleString("ar-EG")} بحث/شهر</span>
            <span className="pill">KD {article.kd ?? "—"}</span>
            <span className="pill">الشهر {article.month}</span>
            <StatusBadge status={article.status} />
          </div>
        </div>
        <ArticleBrief article={article} cluster={cluster} related={related} />
      </div>
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    </main>
  );
}
