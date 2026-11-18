import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
  },
  // Redirect only where a genuine content-equivalent destination is verified.
  // Keep weaker historical matches in the review inventory; never redirect everything to /.
  async redirects() {
    return [
      // Legacy ?page/section links resolve to the exact same content on cacheable path routes.
      // Keep these rules before generic redirects; path names and query captures are distinct.
      {
        source: "/topics/:slug",
        has: [
          { type: "query" as const, key: "section", value: "(?<section>.+)" },
          { type: "query" as const, key: "page", value: "(?<page>(?:[2-9]|[1-9][0-9]+))" },
        ],
        destination: "/topics/:slug/section/:section/page/:page",
        permanent: true,
      },
      {
        source: "/topics/:slug",
        has: [{ type: "query" as const, key: "page", value: "(?<page>(?:[2-9]|[1-9][0-9]+))" }],
        destination: "/topics/:slug/page/:page",
        permanent: true,
      },
      {
        source: "/topics/:slug",
        has: [{ type: "query" as const, key: "section", value: "(?<section>.+)" }],
        destination: "/topics/:slug/section/:section",
        permanent: true,
      },
      {
        source: "/categories/:slug",
        has: [{ type: "query" as const, key: "page", value: "(?<page>(?:[2-9]|[1-9][0-9]+))" }],
        destination: "/categories/:slug/page/:page",
        permanent: true,
      },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", statusCode: 301 },
      { source: "/articles/active-recall", destination: "/knowledge/active-recall-retrieval-practice-self-testing", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Baseline CSP: allows existing Next.js inline hydration and analytics.
          // Move to a nonce-based policy after a production CSP violation review.
          { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https:; frame-src 'self' https:; media-src 'self' https: blob:; worker-src 'self' blob:; upgrade-insecure-requests" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
      {
        source: "/llms.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
