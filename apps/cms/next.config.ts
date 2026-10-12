import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@rashodkorala/posthog-next"],
  // Server Action payload limit (default 1 MB). Next 15.5 reads this from
  // `experimental.serverActions`; a top-level `serverActions` key is rejected.
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  // Set output file tracing root to the workspace root for monorepo support
  outputFileTracingRoot: path.join(__dirname, "../.."),
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // "Work" was split into Projects and Satahan (case studies); keep old bookmarks working.
  async redirects() {
    return [
      { source: "/protected/work", destination: "/protected/projects", permanent: true },
      { source: "/protected/work/new", destination: "/protected/projects/new", permanent: true },
      { source: "/protected/work/projects/view/:slug", destination: "/protected/projects/view/:slug", permanent: true },
      { source: "/protected/work/projects/:slug", destination: "/protected/projects/:slug", permanent: true },
      { source: "/protected/work/view/:slug", destination: "/protected/satahan/view/:slug", permanent: true },
      { source: "/protected/work/:slug", destination: "/protected/satahan/:slug", permanent: true },
    ];
  },
  images: {
    // Allow images from Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "okpdetusefuwkxiksksc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.in",
      },
      // Add common image hosting services
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.imgur.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.pexels.com",
      },
    ],
    // Enable image optimization with modern formats
    formats: ["image/avif", "image/webp"],
    // Image quality levels (must include all qualities used in components)
    qualities: [75, 85, 90, 95],
    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache time (in seconds) - 60 seconds for frequently changing images
    minimumCacheTTL: 60,
    // Allow unoptimized images for external domains not in remotePatterns
    // This helps during development - restrict in production
    unoptimized: false,
    // Enable dangerous allow all for development (remove in production)
    // In production, add specific domains to remotePatterns above
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

const withMDX = createMDX({
  // MDX options for file-based MDX pages (like docs)
});

// @next/mdx imports `NextConfig` from whichever `next` the installer hoists.
// This repo has 15.0.5, 15.3.6, and 15.5.9, so that type can disagree with
// this app's config even though the wrapper only passes the object through.
type MDXNextConfig = Parameters<typeof withMDX>[0];

export default withMDX(nextConfig as MDXNextConfig);
