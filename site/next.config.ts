import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // static export: kein /_next/image-Optimizer
  /* config options here */
};

export default nextConfig;
