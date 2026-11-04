import { electricityDetailText } from "@/lib/electricity-inquiry-detail";
import type { Article } from "@/lib/content";
import { clusters } from "@/lib/clusters";
import { ArticleCardView } from "./article-card-view";
function readingTime(article:Article) {
  const text=[article.quickAnswer,article.slug==="electricity-bill-inquiry"?electricityDetailText:undefined,...(article.summaryTable??[]).flatMap(row=>[row.label,row.value]),...(article.commonMistakes??[]),...(article.steps??[]).flatMap(s=>[s.title,s.detail]),...(article.practicalSections??[]).flatMap(s=>[s.title,s.intro,...s.columns,...s.rows.flat()]),...(article.faqs??[]).flatMap(f=>[f.question,f.answer])].filter(Boolean).join(" ");
  return Math.max(1,Math.ceil(text.split(/\s+/u).length/200));
}
export function ArticleCard({article,variant="tile",priority=false}:{article:Article;variant?:"tile"|"lead"|"compact";priority?:boolean}) {
  const cluster=clusters.find(c=>c.code===article.clusterCode);
  return <ArticleCardView variant={variant} priority={priority} card={{
    href: `/articles/${article.slug}`,
    title: article.title,
    description: article.quickAnswer ? article.quickAnswer.slice(0,135)+(article.quickAnswer.length>135?"…":"") : `دليل عملي عن ${article.keyword} مع خطوات ومصادر.`,
    coverImage: article.coverImage,
    coverImageAlt: article.coverImageAlt ?? article.title,
    clusterName: cluster?.name,
    minutes: readingTime(article),
  }} />;
}
