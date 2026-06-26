import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/src/components/page-shell";

const supportEmail = "inkbar@rashodkorala.com";

const sections = [
  {
    title: "Data collected",
    body: "None. InkBar does not ask you to create an account, does not request personal information, and does not include analytics or tracking of any kind.",
  },
  {
    title: "Network use",
    body: "InkBar works entirely offline. The app makes no network connections and sends no information off your device.",
  },
  {
    title: "Where your data lives",
    body: "Any recipes or notes you create are stored locally on your device. They are never transmitted to anyone. Removing the app removes that data.",
  },
  {
    title: "Third parties",
    body: "InkBar contains no third-party advertising, analytics, or tracking software, and shares no data with anyone.",
  },
  {
    title: "Children",
    body: "Because InkBar collects no data, it collects none from children. The app references alcohol and carries an age rating to reflect that.",
  },
  {
    title: "Changes",
    body: "If this policy changes, the updated version will be posted on this page with a new date.",
  },
];

export const metadata: Metadata = {
  title: "InkBar Privacy Policy",
  description: "InkBar is designed to collect nothing. Read the privacy policy for the iPhone app.",
  alternates: {
    canonical: "/apps/inkbar/privacy",
  },
};

export default function InkBarPrivacyPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-[58rem] pb-fib-89 pt-fib-55">
        <Link
          href="/apps/inkbar"
          className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary hover:text-heading"
        >
          InkBar
        </Link>
        <h1 className="mt-fib-13 font-serif text-h1 font-medium leading-heading text-heading">
          InkBar Privacy Policy
        </h1>
        <p className="mt-fib-13 font-sans text-sm leading-body text-body-secondary">Last updated: 26 June 2026</p>
        <p className="mt-fib-21 max-w-reading font-sans text-lead leading-sub text-body-secondary">
          InkBar is designed to collect nothing. This policy explains what that means.
        </p>

        <section className="mt-fib-34 divide-y divide-line border-y border-line">
          {sections.map((section) => (
            <article key={section.title} className="py-fib-21">
              <h2 className="font-sans text-base font-semibold leading-ui text-heading">{section.title}</h2>
              <p className="mb-0 mt-fib-8 font-sans text-sm leading-body text-body-secondary">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-fib-55 rounded-md border border-line-strong bg-surface-raised p-fib-34">
          <h2 className="font-serif text-h2 font-medium leading-heading text-heading">Contact</h2>
          <p className="mb-0 mt-fib-13 font-sans text-sm leading-body text-body-secondary">
            Questions about privacy can be sent to{" "}
            <a className="text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
            .
          </p>
        </section>
      </main>
    </PageShell>
  );
}
