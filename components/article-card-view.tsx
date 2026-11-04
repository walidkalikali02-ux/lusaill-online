"use client";
import Image from "next/image";
import Link from "next/link";
import { SiteIcon } from "./site-icon";
export type ArticleCardSummary = { href: string; title: string; description: string; coverImage?: string; coverImageAlt: string; clusterName?: string; minutes: number };
export type ArticleCardVariant = "tile" | "lead" | "compact";
// SSR remains enabled: the complete card and its link are present in the initial HTML.
export function ArticleCardView({ card, variant, priority }: { card: ArticleCardSummary; variant: ArticleCardVariant; priority: boolean }) {
  return <Link className={`article-card article-card--${variant}`} href={card.href}>
    {card.coverImage && <div className="article-card-media"><Image src={card.coverImage} alt={card.coverImageAlt} width={720} height={378} sizes={variant === "compact" ? "(max-width: 600px) 112px, 156px" : variant === "lead" ? "(max-width: 900px) 100vw, 720px" : "(max-width: 600px) calc(100vw - 32px), (max-width: 1000px) 45vw, 360px"} priority={priority} /></div>}
    <div className="article-card-copy">{card.clusterName && <span className="article-card-tag"><i aria-hidden="true" />{card.clusterName}</span>}<h3>{card.title}</h3><p className="article-card-desc">{card.description}</p><div className="article-card-footer"><span className="article-card-time"><SiteIcon name="clock" width="14" height="14" />{card.minutes} د قراءة</span><span className="article-card-link">اقرأ الدليل <SiteIcon name="arrow" width="16" height="16" /></span></div></div>
  </Link>;
}
