import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the demo has no server code and can be hosted anywhere.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
