import { articles, clusters, isArticleIndexable } from "@/lib/content";
import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

// Keep the category-page size aligned with app/categories/[slug]/page.tsx.
// Only existing canonical category pagination URLs may bypass the query-string block.
const CATEGORY_PAGE_SIZE = 30;
const allowedCategoryPagination = clusters.flatMap((cluster) => {
  const publishedCount = articles.filter(
    (article) => isArticleIndexable(article) && article.clusterCode === cluster.code
  ).length;
  const lastPage = Math.ceil(publishedCount / CATEGORY_PAGE_SIZE);
  return Array.from(
    { length: Math.max(0, lastPage - 1) },
    (_, index) => `/categories/${cluster.slug}?page=${index + 2}$`
  );
});

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: ["*", "Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Anthropic-ai", "ClaudeBot"],
      allow: ["/", "/_next/", "/images/", ...allowedCategoryPagination],
      disallow: ["/api/", "/admin/", "/search", "/*?*"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    ...(siteConfig.verification.bing ? { host: siteConfig.url } : {}),
  };
}
