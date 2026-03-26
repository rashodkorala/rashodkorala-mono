"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";

const DEFAULT_POSTHOG_HOST = "https://us.i.posthog.com";

function getPostHogToken() {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ??
    process.env.NEXT_PUBLIC_POSTHOG_KEY ??
    process.env.NEXT_PUBLIC_POSTHOG_TOKEN ??
    ""
  );
}

function normalizePostHogHost(host?: string) {
  const trimmed = host?.trim();
  if (!trimmed) return DEFAULT_POSTHOG_HOST;

  // PostHog JS must send events to ingest hosts, not app UI hosts.
  if (trimmed === "https://app.posthog.com") return DEFAULT_POSTHOG_HOST;
  if (trimmed === "https://eu.posthog.com") return "https://eu.i.posthog.com";

  return trimmed;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = getPostHogToken();
    if (!key || !pathname) return;

    const search = searchParams?.toString();
    const url = `${window.location.origin}${pathname}${search ? `?${search}` : ""}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export type PostHogProviderProps = {
  children: ReactNode;
  /** Super property for filtering in PostHog when multiple apps share one project */
  app?: string;
};

export function PostHogProvider({ children, app }: PostHogProviderProps) {
  const key = getPostHogToken();
  const host = normalizePostHogHost(process.env.NEXT_PUBLIC_POSTHOG_HOST);

  useEffect(() => {
    if (!key) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[posthog] Missing NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN (or NEXT_PUBLIC_POSTHOG_KEY/NEXT_PUBLIC_POSTHOG_TOKEN)."
        );
      }
      return;
    }

    posthog.init(key, {
      api_host: host,
      defaults: "2026-01-30",
      capture_pageview: false,
      loaded: (ph) => {
        if (app) ph.register({ app });
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, [key, host, app]);

  if (!key) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </PHProvider>
  );
}
