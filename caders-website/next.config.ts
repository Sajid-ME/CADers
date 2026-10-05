import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 20 MB — enough for most PDF/PPTX files
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;