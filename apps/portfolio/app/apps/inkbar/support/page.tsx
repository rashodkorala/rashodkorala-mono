import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/src/components/page-shell";

const supportEmail = "inkbar@rashodkorala.com";

const questions = [
  {
    question: "How does scaling work?",
    answer:
      "Choose one of three modes. Multiplier resizes the whole recipe by a factor. Servings scales to a target number of drinks. Batch volume scales the recipe to a finished total you set.",
  },
  {
    question: "Which units are supported?",
    answer:
      "Ounces, millilitres, centilitres, and parts. You can enter a recipe in one unit and read it back in another.",
  },
  {
    question: "What does the dilution estimate do?",
    answer:
      "It adds approximate water for batching, based on whether the drink is stirred, shaken, or built. The figures are a guide, so taste and adjust.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "On your device only. InkBar has no account and makes no network connection, so your saved specs never leave your phone.",
  },
  {
    question: "The amounts for dashes or bar spoons look approximate.",
    answer:
      "They are. Dashes and bar spoons vary by bartender, so treat them as a starting point rather than an exact measure.",
  },
];

export const metadata: Metadata = {
  title: "InkBar Support",
  description: "Support information and common questions for InkBar, a cocktail scaling tool for iPhone.",
  alternates: {
    canonical: "/apps/inkbar/support",
  },
};

export default function InkBarSupportPage() {
  return (
    <PageShell>
      <main className="mx-auto max-w-[58rem] pb-fib-89 pt-fib-55">
        <Link
          href="/apps/inkbar"
          className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-body-secondary hover:text-heading"
        >
          InkBar
        </Link>
        <h1 className="mt-fib-13 font-serif text-h1 font-medium leading-heading text-heading">InkBar Support</h1>
        <p className="mt-fib-21 max-w-reading font-sans text-lead leading-sub text-body-secondary">
          InkBar is a cocktail scaling tool for iPhone. If you have a question, a problem, or a
          request, get in touch and I will help.
        </p>

        <section className="mt-fib-34 rounded-md border border-line-strong bg-surface-raised p-fib-34">
          <p className="mb-fib-8 font-sans text-sm leading-body text-body-secondary">
            Contact:{" "}
            <a className="text-link underline decoration-link-underline underline-offset-4 hover:text-link-hover" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
          <p className="mb-0 font-sans text-sm leading-body text-body-secondary">
            Typical response time: two to three business days.
          </p>
        </section>

        <section className="mt-fib-55">
          <h2 className="font-serif text-h2 font-medium leading-heading text-heading">Common questions</h2>
          <div className="mt-fib-21 divide-y divide-line border-y border-line">
            {questions.map((item) => (
              <article key={item.question} className="py-fib-21">
                <h3 className="font-sans text-base font-semibold leading-ui text-heading">{item.question}</h3>
                <p className="mb-0 mt-fib-8 font-sans text-sm leading-body text-body-secondary">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-fib-55">
          <h2 className="font-serif text-h2 font-medium leading-heading text-heading">Feedback</h2>
          <p className="mb-0 mt-fib-13 font-sans text-sm leading-body text-body-secondary">
            Feature ideas and bug reports are welcome at{" "}
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
