import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "lusaill.online" }],
        destination: "https://www.lusaill.online/:path*",
        permanent: true,
      },
      {
        source: "/clusters/:path*",
        destination: "/categories/:path*",
        permanent: true,
      },
      {
        source: "/clusters",
        destination: "/categories",
        permanent: true,
      },
      {
        source: "/articles/شركة-جنوب-الدلتا-لتوزيع-الكهرباء",
        destination: "/articles/south-delta-electricity",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
