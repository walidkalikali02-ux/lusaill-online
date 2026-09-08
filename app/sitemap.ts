import type { MetadataRoute } from "next";
import { articles, clusters } from "@/lib/content";
import { entities } from "@/lib/entities";
import { absoluteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/articles"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/categories"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/entities"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/editorial-policy"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const clusterRoutes: MetadataRoute.Sitemap = clusters.map((cluster) => ({
    url: absoluteUrl(`/categories/${cluster.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const entityRoutes: MetadataRoute.Sitemap = entities.map((entity) => ({
    url: absoluteUrl(`/entities/${entity.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const publishedArticleRoutes: MetadataRoute.Sitemap = articles
    .filter((article) => article.status === "published")
    .map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

  return [...staticRoutes, ...clusterRoutes, ...entityRoutes, ...publishedArticleRoutes];
}
