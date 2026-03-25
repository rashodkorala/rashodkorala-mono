"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
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
  const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  useEffect(() => {
    if (!key || !host) return;

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

  if (!key || !host) {
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
