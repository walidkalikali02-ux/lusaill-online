import type { MetadataRoute } from "next";
import { articles, clusters, clusterProgress } from "@/lib/content";
import { entities } from "@/lib/entities";
import { absoluteUrl } from "@/lib/site-config";
import { guidePaths } from "@/lib/guide-paths";
import { guideIllustrations } from "@/lib/guide-illustrations";
import { courseMeta, drivingLessons } from "@/lib/driving-course";

import { categoryIntroductions } from "@/lib/category-introductions";

// Pin known content changes; never substitute build or deployment time.
const articleTemplateUpdatedAt = new Date("2026-10-04");

function latestPublishedUpdate(items: Array<{ updatedAt?: string }>): Date | undefined {
  const timestamps = items
    .map((item) => item.updatedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : undefined;
}

export function sitemapGroups(): Record<string, MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/articles"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/categories"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/entities"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"),  changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/privacy"),  changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: new Date("2026-09-24"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/contact"),  changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/editorial-policy"), lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/authors/editorial-team"), lastModified: new Date("2026-10-01"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/courses/learn-driving"), lastModified: new Date(courseMeta.updatedAt), changeFrequency: "monthly", priority: 0.9, images: [absoluteUrl(drivingLessons[0].image.src)] },
  ];

  const courseRoutes: MetadataRoute.Sitemap = drivingLessons.map((lesson) => ({
    url: absoluteUrl(`/courses/learn-driving/${lesson.slug}`),
    lastModified: new Date(courseMeta.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
    images: [absoluteUrl(lesson.image.src)],
  }));

  const clusterRoutes: MetadataRoute.Sitemap = clusters.filter((cluster) => clusterProgress(cluster.slug).published > 0).map((cluster) => ({
    url: absoluteUrl(`/categories/${cluster.slug}`),
    lastModified: new Date(Math.max(latestPublishedUpdate(articles.filter((article) => article.status === "published" && article.clusterCode === cluster.code))?.getTime() ?? 0, new Date(categoryIntroductions[cluster.slug]?.updatedAt ?? 0).getTime())),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const entityRoutes: MetadataRoute.Sitemap = entities
    .filter((entity) => articles.some((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode)))
    .map((entity) => ({
    url: absoluteUrl(`/entities/${entity.slug}`),
    lastModified: entity.updatedAt ? new Date(entity.updatedAt) : latestPublishedUpdate(articles.filter((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode))),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const publishedArticleRoutes: MetadataRoute.Sitemap = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: new Date(Math.max(new Date(article.updatedAt ?? article.publishedAt ?? 0).getTime(), articleTemplateUpdatedAt.getTime())),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [article.coverImage, guideIllustrations[article.slug]?.src].filter((src): src is string => Boolean(src)).map(absoluteUrl),
    }));

  const guideRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/guides"), lastModified: new Date("2026-10-02"), changeFrequency: "monthly", priority: 0.8 },
    ...guidePaths.map((path) => ({ url: absoluteUrl(`/guides/${path.slug}`), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published" && path.articleSlugs.includes(article.slug))), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
  return {
    "sitemap-articles.xml": publishedArticleRoutes,
    "sitemap-categories.xml": clusterRoutes,
    "sitemap-guides.xml": [...guideRoutes, ...courseRoutes, ...staticRoutes.filter((route) => route.url.includes("/courses/"))],
    "sitemap-entities.xml": entityRoutes,
    "sitemap-pages.xml": staticRoutes.filter((route) => !route.url.includes("/courses/")),
  };
}

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]!);
export function sitemapResponse(name?: string) {
  const groups = sitemapGroups();
  const body = name
    ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' + groups[name].map((item) => '<url><loc>' + escapeXml(item.url) + '</loc>' + (item.lastModified ? '<lastmod>' + new Date(item.lastModified).toISOString() + '</lastmod>' : '') + (item.images ?? []).map((src) => '<image:image><image:loc>' + escapeXml(src) + '</image:loc></image:image>').join('') + '</url>').join('') + '</urlset>'
    : '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + Object.keys(groups).map((file) => '<sitemap><loc>' + absoluteUrl('/' + file) + '</loc></sitemap>').join('') + '</sitemapindex>';
  return new Response('<?xml version="1.0" encoding="UTF-8"?>' + body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
