/** @type {import('next').NextConfig} */
function supabaseImageRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fallback = {
    protocol: "https",
    hostname: "okpdetusefuwkxiksksc.supabase.co",
  };
  if (!raw || typeof raw !== "string") return fallback;
  try {
    const u = new URL(raw.trim());
    const protocol = u.protocol.replace(":", "");
    if (!u.hostname) return fallback;
    const pattern = { protocol, hostname: u.hostname };
    if (u.port) pattern.port = u.port;
    return pattern;
  } catch {
    return fallback;
  }
}

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@rashodkorala/posthog-next"],
  images: {
    remotePatterns: [supabaseImageRemotePattern()],
  },
};

module.exports = nextConfig;
