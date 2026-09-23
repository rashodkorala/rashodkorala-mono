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
  async redirects() {
    return [
      // Projects used to live at /work/projects/{slug}; every piece of work is now /work/{slug}.
      { source: "/work/projects/:slug", destination: "/work/:slug", permanent: true },
    ];
  },
};

module.exports = nextConfig;
