import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
