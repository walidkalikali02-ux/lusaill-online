import { articles, clusters, isArticleIndexable } from "@/lib/content";
import { encyclopediaCategories } from "@/lib/encyclopedia-taxonomy";
import { getEncyclopediaCategoryItems, TOPIC_PAGE_SIZE } from "@/lib/encyclopedia-catalog";
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

const allowedTopicPagination = encyclopediaCategories.flatMap((category) =>
  Array.from(
    { length: Math.max(0, Math.ceil(getEncyclopediaCategoryItems(category).length / TOPIC_PAGE_SIZE) - 1) },
    (_, index) => "/topics/" + category.slug + "?page=" + (index + 2) + "$"
  )
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: ["*", "Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Claude-User", "Claude-SearchBot"],
      allow: ["/", "/_next/", "/images/", "/api/editorial-image/", ...allowedCategoryPagination, ...allowedTopicPagination],
      disallow: ["/api/", "/admin/", "/search", "/*?*"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    ...(siteConfig.verification.bing ? { host: siteConfig.url } : {}),
  };
}
