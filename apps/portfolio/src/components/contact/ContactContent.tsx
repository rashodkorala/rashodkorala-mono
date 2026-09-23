import React from "react";
import { useTranslations } from "next-intl";
import CalendlyPopupButton from "./CalendlyPopupButton";
import CalendlyInlineWidget from "./CalendlyInlineWidget";
import { Suspense } from "react";
type ContactRow = { label: string; value: string; href: string | null };

/** `id` is stable (used for element ids); `title` is the translated heading. */
type ContactGroup = { id: string; title: string; items: ContactRow[] };

type ContactT = ReturnType<typeof useTranslations<"Contact">>;

const buildContactGroups = (t: ContactT): ContactGroup[] => [
  {
    id: "reach-me",
    title: t("groupReach"),
    items: [
      { label: t("email"), value: "hello@rashodkorala.com", href: "mailto:hello@rashodkorala.com" },
      { label: t("basedIn"), value: t("basedInValue"), href: null },
      { label: t("typicalResponse"), value: t("typicalResponseValue"), href: null },
    ],
  },
  {
    id: "studios-portfolio",
    title: t("groupStudios"),
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
        label: t("photography"),
        value: "photos.rashodkorala.com",
        href: "https://photos.rashodkorala.com",
      },
    ],
  },
  {
    id: "social",
    title: t("groupSocial"),
    items: [
      { label: "GitHub", value: "rashodkorala", href: "https://github.com/rashodkorala" },
      { label: "Instagram", value: "@rashodk_", href: "https://instagram.com/rashodk_" },
      { label: "LinkedIn", value: "rashodk", href: "https://linkedin.com/in/rashodk" },
    ],
  },
];

const linkUnderlineClass = "text-link underline decoration-link-underline underline-offset-4 transition-colors hover:text-link-hover";

function groupHeadingId(id: string) {
  return `ct-group-${id}`;
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
      aria-labelledby={groupHeadingId(group.id)}
    >
      <h2
        id={groupHeadingId(group.id)}
        className="mb-[clamp(var(--fib-21),2vw,1.375rem)] font-sans text-label font-semibold uppercase tracking-caps text-heading"
      >
        {group.title}
      </h2>
      {group.items.map((row, i) => (
        <ContactField key={`${group.id}-${i}`} {...row} />
      ))}
    </section>
  );
}

export default function ContactContent() {
  const t = useTranslations("Contact");
  const [reachGroup, ...linkGroups] = buildContactGroups(t);

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
          font-family: var(--font-sans-stack);
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
              {t("heroLine1")}
              <span className="block pl-[clamp(var(--fib-21),3.5vw,var(--fib-55))] text-body-secondary">
                {t("heroLine2")}
              </span>
            </h1>

            <p className="mb-[clamp(var(--fib-21),3vw,var(--fib-34))] max-w-reading font-sans text-[length:clamp(var(--fib-21),1.3vw,1.125rem)] leading-body text-body-secondary">
              {t.rich("intro", {
                mail: (chunks) => (
                  <a href="mailto:hello@rashodkorala.com" className={linkUnderlineClass}>
                    {chunks}
                  </a>
                ),
                call: (chunks) => (
                  <Suspense>
                    <CalendlyPopupButton className={linkUnderlineClass}>
                      {chunks}
                    </CalendlyPopupButton>
                  </Suspense>
                ),
              })}
            </p>

            <div className="flex items-center gap-fib-13">
              <div
                className="h-fib-8 w-fib-8 shrink-0 rounded-full bg-[var(--color-success)]"
                aria-hidden
              />
              <span className="font-sans text-nav font-medium text-[var(--color-success)]">
                {t("available")}
              </span>
            </div>

            <div className="ct-reach-section">
              <ContactGroupSection group={reachGroup} sectionId={reachGroup.id} />
              <div className="ct-contact-field mb-[clamp(var(--fib-13),1.8vw,var(--fib-21))]">
                <p className="mb-fib-8 font-sans text-label uppercase tracking-caps text-body-secondary">
                  {t("bookCall")}
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
              <ContactGroupSection key={group.id} group={group} />
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
