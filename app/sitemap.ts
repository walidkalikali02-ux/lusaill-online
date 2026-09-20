import type { MetadataRoute } from "next";
import { articles, clusters, clusterProgress } from "@/lib/content";
import { entities } from "@/lib/entities";
import { absoluteUrl } from "@/lib/site-config";
import { courseMeta, drivingLessons } from "@/lib/driving-course";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/articles"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/categories"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/entities"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/editorial-policy"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/authors/editorial-team"), changeFrequency: "monthly", priority: 0.5 },
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
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const entityRoutes: MetadataRoute.Sitemap = entities
    .filter((entity) => articles.some((article) => article.status === "published" && entity.clusterCodes.includes(article.clusterCode)))
    .map((entity) => ({
    url: absoluteUrl(`/entities/${entity.slug}`),
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
