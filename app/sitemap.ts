import type { MetadataRoute } from "next";
import { articles, clusters } from "@/lib/content";
import { entities } from "@/lib/entities";
import { absoluteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/articles"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/categories"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/entities"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/editorial-policy"), changeFrequency: "monthly", priority: 0.5 },
  ];

  const clusterRoutes: MetadataRoute.Sitemap = clusters.map((cluster) => ({
    url: absoluteUrl(`/categories/${cluster.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const entityRoutes: MetadataRoute.Sitemap = entities.map((entity) => ({
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
    }));

  return [...staticRoutes, ...clusterRoutes, ...entityRoutes, ...publishedArticleRoutes];
}
