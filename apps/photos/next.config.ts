import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@rashodkorala/posthog-next"],
  images: {
    domains: ['images.unsplash.com', 'supabase.co', 'okpdetusefuwkxiksksc.supabase.co'],
  },
};

export default nextConfig;
