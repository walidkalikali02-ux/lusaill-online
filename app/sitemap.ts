import type { MetadataRoute } from "next";
import { articles, clusters } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["/", "/articles", "/clusters", "/about", "/editorial-policy"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
  }));

  const clusterRoutes = clusters.map((cluster) => ({
    url: absoluteUrl(`/clusters/${cluster.slug}`),
    lastModified: now,
  }));

  const publishedArticleRoutes = articles
    .filter((article) => article.status === "published")
    .map((article) => ({ url: absoluteUrl(`/articles/${article.slug}`), lastModified: now }));

  return [...staticRoutes, ...clusterRoutes, ...publishedArticleRoutes];
}
