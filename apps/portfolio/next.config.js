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
      // "Work" became Projects (+ Digest for case studies). /work/{slug} is resolved in
      // app/work/[slug] because a slug there can be either a project or a case study.
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/work/projects", destination: "/projects", permanent: true },
      { source: "/work/projects/:slug", destination: "/projects/:slug", permanent: true },
      // Renamed slugs (old links keep working).
      { source: "/work/atlier", destination: "/projects/atelier", permanent: true },
      { source: "/projects/atlier", destination: "/projects/atelier", permanent: true },
    ];
  },
};

module.exports = nextConfig;
