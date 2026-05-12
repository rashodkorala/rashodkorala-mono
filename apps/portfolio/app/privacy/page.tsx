import type { Metadata } from "next";
import PageShell from "@/src/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How rashodkorala.com uses PostHog analytics, what data is collected, and retention.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-reading pb-fib-55">
        <h1
          className="mt-0 font-serif text-[clamp(2rem,5vw,3.25rem)] font-medium tracking-tight text-heading"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Privacy policy
        </h1>
        <p className="mt-fib-21 font-sans text-sm leading-body text-body-secondary">
          Last updated April 2026. This page describes analytics on this website only.
        </p>

        <section className="mt-fib-34 space-y-fib-21 font-sans text-[length:clamp(15px,0.95vw,17px)] leading-body text-body">
          <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-body-secondary">
            Analytics (PostHog)
          </h2>
          <p>
            This site uses{" "}
            <a
              href="https://posthog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover"
            >
              PostHog
            </a>
            , a product analytics service, to understand traffic and how pages are used (for
            example which pages are viewed and general usage patterns). That helps improve the
            site; it is not used to sell your data.
          </p>

          <h2 className="pt-fib-13 text-xs font-medium uppercase tracking-[0.12em] text-body-secondary">
            What we collect
          </h2>
          <p>
            When you browse the site, PostHog may receive technical and usage information
            associated with page views and events, such as: the page URL, referrer, browser and
            device type, operating system, coarse location derived from IP (for example
            region/country), timestamps, and an anonymous or pseudonymous identifier (for example
            via a cookie or local storage) to distinguish sessions. We do not use PostHog to
            collect your name, email, or the contents of messages you send through other services
            unless we explicitly instrument that elsewhere.
          </p>

          <h2 className="pt-fib-13 text-xs font-medium uppercase tracking-[0.12em] text-body-secondary">
            Retention
          </h2>
          <p>
            Event data is stored on PostHog’s systems and kept for the retention period configured
            on our PostHog project and plan. Details vary by plan and settings; see{" "}
            <a
              href="https://posthog.com/docs/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover"
            >
              PostHog’s privacy and data documentation
            </a>{" "}
            for how they handle and retain data.
          </p>

          <p className="pt-fib-13 text-body-secondary">
            Questions:{" "}
            <a
              href="mailto:hello@rashodkorala.com"
              className="text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover"
            >
              hello@rashodkorala.com
            </a>
            .
          </p>
        </section>
      </article>
    </PageShell>
  );
}
