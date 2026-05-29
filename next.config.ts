import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 の Cache Components モデルを有効化
  // 詳細は lectures/06-rendering-cache.md
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/image",
      },
      {
        pathname: "/images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
