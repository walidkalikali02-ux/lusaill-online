import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Specific crawler groups do not inherit wildcard exclusions.
      userAgent: ["*", "Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Anthropic-ai", "ClaudeBot"],
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    ...(siteConfig.verification.bing ? { host: siteConfig.url } : {}),
  };
}
