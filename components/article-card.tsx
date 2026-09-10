import Link from "next/link";
import type { Article } from "@/lib/content";
import { clusters } from "@/lib/clusters";

function readingTime(article: Article): number {
  const words = (article.quickAnswer?.length ?? 0) + (article.steps?.length ?? 0) * 40 + 200;
  return Math.max(3, Math.round(words / 200));
}

export function ArticleCard({ article }: { article: Article }) {
  const cluster = clusters.find((c) => c.code === article.clusterCode);

  return (
    <Link className="article-card" href={`/articles/${article.slug}`}>
      {cluster && <span className="article-card-tag">{cluster.name}</span>}
      <h3>{article.title}</h3>
      <p className="article-card-desc">
        {article.quickAnswer
          ? article.quickAnswer.slice(0, 120) + (article.quickAnswer.length > 120 ? "…" : "")
          : `دليل شامل عن ${article.keyword} مع خطوات عملية وأرقام دعم رسمية.`}
      </p>
      <div className="article-card-footer">
        <span className="article-card-time">{readingTime(article)} دقائق قراءة</span>
        <span className="article-card-link">اقرأ الدليل ←</span>
      </div>
    </Link>
  );
}
