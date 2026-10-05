import { articles } from "@/lib/content";
import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Specific crawler groups do not inherit wildcard exclusions.
      userAgent: ["*", "Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Anthropic-ai", "ClaudeBot"],
      allow: ["/", "/_next/", "/images/", ...Array.from({ length: Math.max(1, Math.ceil(articles.filter((article) => article.status === "published").length / 30)) }, (_, index) => `/categories/*?page=${index + 1}$`)],
      disallow: ["/api/", "/admin/", "/search", "/*?*"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    ...(siteConfig.verification.bing ? { host: siteConfig.url } : {}),
  };
}
