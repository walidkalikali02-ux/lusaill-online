import type { MetadataRoute } from "next";
import { articles, clusters, clusterProgress } from "@/lib/content";
import { entities } from "@/lib/entities";
import { absoluteUrl } from "@/lib/site-config";
import { courseMeta, drivingLessons } from "@/lib/driving-course";

const siteUpdatedAt = new Date("2026-09-21");

function latestPublishedUpdate(items: Array<{ updatedAt?: string }>): Date {
  const timestamps = items
    .map((item) => item.updatedAt)
    .filter((value): value is string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);

  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : siteUpdatedAt;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/articles"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/categories"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/entities"), lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published")), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: siteUpdatedAt, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), lastModified: new Date("2026-09-24"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: new Date("2026-09-24"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/contact"), lastModified: new Date("2026-09-24"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/editorial-policy"), lastModified: siteUpdatedAt, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/authors/editorial-team"), lastModified: siteUpdatedAt, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/courses/learn-driving"), lastModified: new Date(courseMeta.updatedAt), changeFrequency: "monthly", priority: 0.9, images: [drivingLessons[0].image.src] },
  ];

  const courseRoutes: MetadataRoute.Sitemap = drivingLessons.map((lesson) => ({
    url: absoluteUrl(`/courses/learn-driving/${lesson.slug}`),
    lastModified: new Date(courseMeta.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
    images: [lesson.image.src],
  }));

  const clusterRoutes: MetadataRoute.Sitemap = clusters.filter((cluster) => clusterProgress(cluster.slug).published > 0).map((cluster) => ({
    url: absoluteUrl(`/categories/${cluster.slug}`),
    lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published" && article.clusterCode === cluster.code)),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const entityRoutes: MetadataRoute.Sitemap = entities
    .filter((entity) => articles.some((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode)))
    .map((entity) => ({
    url: absoluteUrl(`/entities/${entity.slug}`),
    lastModified: latestPublishedUpdate(articles.filter((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode))),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const publishedArticleRoutes: MetadataRoute.Sitemap = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: article.updatedAt ? new Date(article.updatedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: article.coverImage ? [absoluteUrl(article.coverImage)] : undefined,
    }));

  return [...staticRoutes, ...courseRoutes, ...clusterRoutes, ...entityRoutes, ...publishedArticleRoutes];
}
