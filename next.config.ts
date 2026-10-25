import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/news",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
