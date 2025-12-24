import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
