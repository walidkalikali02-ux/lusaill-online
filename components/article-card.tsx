import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";
import { clusters } from "@/lib/clusters";
import { SiteIcon } from "./site-icon";
function readingTime(article:Article) {
  const text=[article.quickAnswer,...(article.steps??[]).flatMap(s=>[s.title,s.detail]),...(article.practicalSections??[]).flatMap(s=>[s.title,s.intro,...s.rows.flat()]),...(article.faqs??[]).flatMap(f=>[f.question,f.answer])].filter(Boolean).join(" ");
  return Math.max(1,Math.ceil(text.split(/\s+/u).length/200));
}
export function ArticleCard({article,variant="tile",priority=false}:{article:Article;variant?:"tile"|"lead"|"compact";priority?:boolean}) {
  const cluster=clusters.find(c=>c.code===article.clusterCode);
  return <Link className={`article-card article-card--${variant}`} href={`/articles/${article.slug}`}>
    {article.coverImage&&<div className="article-card-media"><Image src={article.coverImage} alt={article.coverImageAlt??article.title} width={720} height={378} sizes={variant==="compact"?"(max-width: 600px) 112px, 156px":variant==="lead"?"(max-width: 900px) 100vw, 720px":"(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 45vw, 360px"} priority={priority} /></div>}
    <div className="article-card-copy">{cluster&&<span className="article-card-tag"><i aria-hidden="true" />{cluster.name}</span>}<h3>{article.title}</h3><p className="article-card-desc">{article.quickAnswer?article.quickAnswer.slice(0,135)+(article.quickAnswer.length>135?"…":""):`دليل عملي عن ${article.keyword} مع خطوات ومصادر.`}</p><div className="article-card-footer"><span className="article-card-time"><SiteIcon name="clock" width="14" height="14" />{readingTime(article)} د قراءة</span><span className="article-card-link">اقرأ الدليل <SiteIcon name="arrow" width="16" height="16" /></span></div></div>
  </Link>;
}
