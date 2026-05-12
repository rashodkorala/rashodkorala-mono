import React from "react";
import CalendlyPopupButton from "./CalendlyPopupButton";
import CalendlyInlineWidget from "./CalendlyInlineWidget";
import { Suspense } from "react";
type ContactRow = { label: string; value: string; href: string | null };

type ContactGroup = { title: string; items: ContactRow[] };

const contactGroups: ContactGroup[] = [
  {
    title: "Reach me",
    items: [
      { label: "Email", value: "hello@rashodkorala.com", href: "mailto:hello@rashodkorala.com" },
      { label: "Based in", value: "Canada", href: null },
      { label: "Typical response", value: "Within 48 hours", href: null },
    ],
  },
  {
    title: "Studios & portfolio",
    items: [
      {
        label: "R&D Creative Agency",
        value: "r-d-creative.vercel.app",
        href: "https://r-d-creative.vercel.app/",
      },
      {
        label: "AetherLabs",
        value: "aetherlabs.art",
        href: "https://www.aetherlabs.art",
      },
      {
        label: "Photography",
        value: "photos.rashodkorala.com",
        href: "https://photos.rashodkorala.com",
      },
    ],
  },
  {
    title: "Social",
    items: [
      { label: "GitHub", value: "rashodkorala", href: "https://github.com/rashodkorala" },
      { label: "Instagram", value: "@rashodk_", href: "https://instagram.com/rashodk_" },
      { label: "LinkedIn", value: "rashodk", href: "https://linkedin.com/in/rashodk" },
    ],
  },
];

const [reachGroup, ...linkGroups] = contactGroups;

const linkUnderlineClass = "text-link underline decoration-link-underline underline-offset-4 transition-colors hover:text-link-hover";

function groupHeadingId(title: string) {
  return `ct-group-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function ContactField({ label, value, href }: ContactRow) {
  return (
    <div className="ct-contact-field mb-[clamp(var(--fib-13),1.8vw,var(--fib-21))]">
      <p className="mb-fib-8 font-sans text-label uppercase tracking-caps text-body-secondary">
        {label}
      </p>
      <p className="ct-contact-value font-sans font-semibold leading-[1.35] tracking-h2 text-heading">
        {href ? (
          <a
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            className={linkUnderlineClass}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

function ContactGroupSection({
  group,
  sectionId,
}: {
  group: ContactGroup;
  sectionId?: string;
}) {
  return (
    <section
      className="ct-contact-group"
      id={sectionId}
      aria-labelledby={groupHeadingId(group.title)}
    >
      <h2
        id={groupHeadingId(group.title)}
        className="mb-[clamp(var(--fib-21),2vw,1.375rem)] font-sans text-label font-semibold uppercase tracking-caps text-heading"
      >
        {group.title}
      </h2>
      {group.items.map((row, i) => (
        <ContactField key={`${group.title}-${row.label}-${i}`} {...row} />
      ))}
    </section>
  );
}

export default function ContactContent() {
  return (
    <>
      <style>{`
        .ct-contact-value {
          font-size: clamp(var(--fib-21), 1.45vw, 1.375rem);
        }
        .ct-contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          align-items: start;
          column-gap: clamp(var(--fib-34), 5vw, var(--fib-89));
          row-gap: clamp(var(--fib-34), 5vw, var(--fib-55));
        }
        @media (min-width: 1024px) {
          .ct-contact-grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            column-gap: clamp(var(--fib-34), 6vw, var(--fib-89));
            row-gap: 0;
          }
        }
        .ct-hero-contact {
          font-family: var(--font-jakarta), system-ui, sans-serif;
          font-weight: 700;
          letter-spacing: var(--tracking-h1);
          line-height: 0.88;
          color: var(--color-heading);
          font-size: clamp(2.75rem, 7vw, 8rem);
        }
        @media (min-width: 1024px) {
          .ct-hero-contact {
            font-size: clamp(2.375rem, 4.2vw, 5.25rem);
          }
        }
        .ct-reach-section {
          margin-top: clamp(var(--fib-34), 5vw, var(--fib-55));
          padding-top: clamp(var(--fib-34), 3.5vw, 2.5rem);
          border-top: 1px solid var(--color-border-subtle);
        }
        @media (min-width: 1024px) {
          .ct-reach-section {
            border-top: none;
            padding-top: 0;
            margin-top: clamp(var(--fib-34), 5vw, var(--fib-89));
          }
        }
        .ct-col-links .ct-contact-group + .ct-contact-group {
          margin-top: clamp(var(--fib-34), 4vw, var(--fib-55));
          padding-top: clamp(var(--fib-34), 3.5vw, 2.5rem);
          border-top: 1px solid var(--color-border-subtle);
        }
        .ct-contact-field:last-child { margin-bottom: 0 !important; }
      `}</style>

      {/* lg+: fill viewport below fixed header and vertically center */}
      <div className="pb-fib-89 lg:flex lg:min-h-[calc(100dvh-var(--header-h-lg))] lg:flex-col lg:justify-center">
        <main className="ct-contact-grid min-w-0 max-w-full">
          <div className="ct-col-intro">
            <h1 className="ct-hero-contact mb-[clamp(var(--fib-21),3.5vw,var(--fib-34))]">
              Get
              <span className="block pl-[clamp(var(--fib-21),3.5vw,var(--fib-55))] text-body-secondary">
                in touch
              </span>
            </h1>

            <p className="mb-[clamp(var(--fib-21),3vw,var(--fib-34))] max-w-reading font-sans text-[length:clamp(var(--fib-21),1.3vw,1.125rem)] leading-body text-body-secondary">
              Email is the best way to reach me for project inquiries and
              collaborations. Find the details below, or{" "}
              <a href="mailto:hello@rashodkorala.com" className={linkUnderlineClass}>
                open your mail app
              </a>{" "}
              directly. If you would rather talk,{" "}
              <Suspense>
                <CalendlyPopupButton className={linkUnderlineClass}>
                  book a quick coffee chat
                </CalendlyPopupButton>
              </Suspense>{" "}
              and let&rsquo;s connect.
            </p>

            <div className="flex items-center gap-fib-13">
              <div
                className="h-fib-8 w-fib-8 shrink-0 rounded-full bg-[var(--color-success)]"
                aria-hidden
              />
              <span className="font-sans text-nav font-medium text-[var(--color-success)]">
                Available for new projects
              </span>
            </div>

            <div className="ct-reach-section">
              <ContactGroupSection group={reachGroup} sectionId="reach-me" />
              <div className="ct-contact-field mb-[clamp(var(--fib-13),1.8vw,var(--fib-21))]">
                <p className="mb-fib-8 font-sans text-label uppercase tracking-caps text-body-secondary">
                  Book a call
                </p>
                <p className="ct-contact-value font-sans font-semibold leading-[1.35] tracking-h2 text-heading">
                  <Suspense>
                    <CalendlyPopupButton className={linkUnderlineClass} />
                  </Suspense>
                </p>
              </div>
            </div>
          </div>

          <div className="ct-col-links">
            {linkGroups.map((group) => (
              <ContactGroupSection key={group.title} group={group} />
            ))}
          </div>
        </main>
      </div>

      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <CalendlyInlineWidget />
    </>
  );
}
