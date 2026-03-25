/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@rashodkorala/posthog-next"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "okpdetusefuwkxiksksc.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
