import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // R78: Build-Cache aus — Next 16.3.0 Default turbopackFileSystemCacheForBuild=true
  // kann stale Artefakte nach .next/cache-Restore wiederherstellen (Vercel-Issue #87283,
  // Next-16.3-Doku 03.08.2026). Determinismus > Speed bei Kunden-Deploys (Build 11–25 s).
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
  images: { unoptimized: true }, // static export: kein /_next/image-Optimizer
  /* config options here */
};

export default nextConfig;
