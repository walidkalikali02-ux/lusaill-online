import { articles, clusters } from "@/lib/content";
import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

// Only valid, canonical category pagination may bypass the query-string block.
// Keep the page size aligned with app/categories/[slug]/page.tsx.
const CATEGORY_PAGE_SIZE = 30;
const allowedCategoryPagination = clusters.flatMap((cluster) => {
  const published = articles.filter((article) => article.status === "published" && article.clusterCode === cluster.code);
  return Array.from({ length: Math.max(0, Math.ceil(published.length / CATEGORY_PAGE_SIZE) - 1) },
    (_, index) => `/categories/${cluster.slug}?page=${index + 2}import { articles, clusters } from "@/lib/content";
import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

);
});

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Specific crawler groups do not inherit wildcard exclusions.
      userAgent: ["*", "Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Anthropic-ai", "ClaudeBot"],
      allow: ["/", "/_next/", "/images/", ...allowedCategoryPagination],
      disallow: ["/api/", "/admin/", "/search", "/*?*"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    ...(siteConfig.verification.bing ? { host: siteConfig.url } : {}),
  };
}
