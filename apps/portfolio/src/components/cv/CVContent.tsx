"use client";

import React, { useState } from "react";

// Design: editorial sidebar layout
// Sidebar: narrow fluid column with skills/certs/education
// Main: chronological entries with date column + content column

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * How a skill links to the entries that show it:
 *   - `match` highlights the specific bullets that mention it (tested against context + bullets);
 *   - `entries` links whole entries by id, for skills used there but not named in a bullet.
 * Skills with neither (or that link to nothing) render as plain labels.
 */
interface Skill      { name: string; match?: RegExp; entries?: string[]; }
interface SkillGroup { label: string; items: Skill[]; }
interface Cert       { name: string; issuer: string; }
interface Entry {
  id: string;
  date: string;
  title: string;
  /** Company / client, plus any qualifier ("Paid client project", location…). */
  org: string;
  /** One-line context in italics under the org (what the product is). */
  context?: string;
  bullets: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Mirrors public/Rashod_Korala_Resume.pdf — keep the two in sync.

const profile =
  "Full-stack engineer who can take a product from the circuit board to the App Store. I have been the only engineer on a connected hardware product, owning the firmware, the iPhone app, and the cloud backend through to real customers. I work carefully where mistakes are expensive, and my business background means I can explain technical trade-offs to people who decide on cost and risk.";

const plain = (...names: string[]): Skill[] => names.map((name) => ({ name }));

const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript" },
      { name: "Swift", entries: ["moov", "aetherlabs"] },
      { name: "Kotlin", entries: ["moov", "aetherlabs"] },
      ...plain("Python", "C", "SQL"),
    ],
  },
  {
    label: "Mobile",
    items: [
      ...plain("SwiftUI", "Core NFC", "CoreBluetooth"),
      { name: "AlarmKit", match: /AlarmKit/ },
      ...plain("WidgetKit", "Jetpack Compose", "React Native"),
    ],
  },
  {
    label: "Backend & Cloud",
    items: [
      ...plain("Node.js", "NestJS", "Hono", "PostgreSQL", "Prisma", "Drizzle"),
      { name: "AWS (Lambda, Aurora, RDS, Fargate, S3, KMS, Cognito)", match: /\bAWS\b|\bKMS\b|serverless/i },
    ],
  },
  {
    label: "Embedded",
    items: [
      { name: "nRF52840" },
      { name: "Zephyr RTOS", entries: ["moov"] },
      { name: "Bluetooth Low Energy" },
      { name: "Over-the-air updates (MCUboot)", match: /over-the-air|firmware/i },
      { name: "NFC (NTAG 424 DNA)", match: /\bNFC\b|NTAG/, entries: ["aetherlabs"] },
    ],
  },
  {
    label: "Practices",
    items: [
      ...plain("Infrastructure as code (CDK, SST)", "Cloudflare", "CI/CD"),
      { name: "Automated testing", match: /\btests?\b/i },
      { name: "Security & access control", match: /secur|cryptograph|counterfeit/i },
      { name: "Disaster recovery", match: /backups?|recovery|rollback/i },
    ],
  },
];

const certs: Cert[] = [
  { name: "Google IT Support Professional Certificate", issuer: "Google" },
  { name: "Meta Front-End Developer Certificate",       issuer: "Meta" },
  { name: "AWS Cloud Practitioner",                     issuer: "Amazon · In progress" },
];

const experience: Entry[] = [
  {
    id: "moov",
    date: "Jun 2026 — Present",
    title: "Software Engineering Intern (Mitacs)",
    org: "Moov Technologies · St. John's, NL",
    context: "Connected smart alarm: device firmware, iPhone app, and cloud backend",
    bullets: [
      "Sole engineer across firmware, iOS, and cloud; delivered the product's first end-to-end over-the-air update.",
      "Audited the legacy backend with the team, found critical security flaws, and built a secure AWS replacement with 194 tests.",
      "Cut monthly AWS costs by over 55% through right-sizing, while keeping the system ready to scale.",
      "Resolved a firmware defect that bypassed the low-battery update check; added automatic rollback for failed updates.",
      "Worked around iOS limits with AlarmKit and layered fallback alarms, so only the physical device can stop the alarm.",
      "Rebuilt the iPhone app, won Apple's approval for restricted Screen Time access, and submitted it to the App Store.",
    ],
  },
  {
    id: "aetherlabs",
    date: "Aug 2024 — Present",
    title: "Founding Engineer",
    org: "AetherLabs · aetherlabs.art · Propel ICT & Genesis Evolve accelerators",
    context: "Proof of authenticity for physical artwork",
    bullets: [
      "Designed, built, and launched a platform that uses NFC to give physical artwork a digital identity, so artists can create verifiable provenance for their work and anyone can confirm it with a tap.",
      "Architected a serverless AWS backend that scales to zero when idle, keeping MVP running costs under $15 a month while ready to scale with demand.",
      "Engineered a fault-tolerant backend for permanently deployed NFC tags, with server-side record correction, append-only audit history, and immutable, restore-tested backups with 35-day point-in-time recovery.",
      "Implemented cryptographic tag authentication (NTAG 424 DNA, AES-CMAC) with per-tag keys managed in AWS KMS, preventing cloned or counterfeit chips from passing verification.",
    ],
  },
];

const projects: Entry[] = [
  {
    id: "moov-shopify",
    date: "Mar 2026 — Jun 2026",
    title: "Moov Shopify Storefront",
    org: "Paid client project",
    bullets: [
      "Built a custom Shopify 2.0 theme that merged two legacy websites into one storefront, with a custom product page and live pricing.",
      "Made all site copy editable from Shopify admin, so the client can update content without a developer.",
    ],
  },
  {
    id: "transcript",
    date: "GitHub",
    title: "Transcript Processing Pipeline",
    org: "AI tool for financial advisers",
    bullets: [
      "Built a tool that turns client meeting transcripts into CRM updates, action items, and follow-up emails, and designed it to flag anything uncertain for a person to check instead of guessing.",
    ],
  },
  {
    id: "fyyndfit",
    date: "Jan 2026",
    title: "Fyyndfit",
    org: "Dashboard & UI Design",
    bullets: [
      "Redesigned the progress dashboard of an AI fitness app so non-technical users could read their results at a glance.",
    ],
  },
];

const additionalExperience: Entry[] = [
  {
    id: "ls-travel-retail",
    date: "Jun 2022 — Jun 2026",
    title: "Sales Associate & Technical Support",
    org: "LS Travel Retail",
    bullets: [
      "Became the go-to person for tech problems across several stores, fixing point-of-sale and network issues at peak hours.",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const metaLinkClass =
  "inline-flex items-center gap-1 font-sans text-[length:clamp(var(--text-label),0.88vw,0.8125rem)] text-body-secondary underline decoration-line-hover underline-offset-3 transition-colors hover:text-body";

const DownloadIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" className="h-fib-13 w-fib-13 shrink-0">
    <path d="M6 1v7M6 8l-3-3M6 8l3-3M1 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" className="h-fib-13 w-fib-13 shrink-0">
    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function HRule() {
  return <div className="mb-[clamp(var(--fib-21),2.5vw,var(--fib-34))] h-px bg-line" />;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-[clamp(var(--fib-21),2vw,var(--fib-34))] flex items-center gap-fib-21">
      <h2 className="whitespace-nowrap font-serif text-h3 font-normal leading-none tracking-h1 text-heading">
        {title}
      </h2>
      <div className="h-px min-w-0 flex-1 bg-line" />
    </div>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-[clamp(var(--fib-8),1vw,var(--fib-13))] font-sans text-[length:var(--text-label)] font-normal uppercase tracking-caps text-[color:var(--color-label)]">
      {children}
    </p>
  );
}

/**
 * How `e` relates to the selected skill: `linked` if it shows the skill at all, and which
 * bullets to emphasise (only those that name it — a whole-entry link emphasises none).
 */
function skillHits(e: Entry, skill: Skill): { linked: boolean; bullets: Set<string> } {
  const bullets = new Set(skill.match ? e.bullets.filter((b) => skill.match!.test(b)) : []);
  const inContext = !!skill.match && skill.match.test(`${e.context ?? ""} ${e.org}`);
  // A match only in the context line (e.g. "device firmware") counts for the whole entry.
  if (!bullets.size && inContext) e.bullets.forEach((b) => bullets.add(b));
  const linked = bullets.size > 0 || !!skill.entries?.includes(e.id);
  return { linked, bullets };
}

function EntryGrid({ entries, skill }: { entries: Entry[]; skill: Skill | null }) {
  return (
    <>
      {entries.map((e) => {
        const result = skill ? skillHits(e, skill) : null;
        const hits = result ? result.bullets : null;
        const dimmed = !!result && !result.linked;
        // Linked as a whole entry (no specific bullet): keep every bullet at full strength.
        const emphasise = !!hits && hits.size > 0;
        return (
        <div
          key={e.id}
          data-cv-hit={result?.linked ? "true" : undefined}
          style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 200ms ease" }}
          className="cv-entry-grid mb-[clamp(var(--fib-21),2.5vw,var(--fib-34))] grid [grid-template-columns:clamp(4.5rem,9vw,6.75rem)_1fr] gap-[clamp(var(--fib-13),2vw,var(--fib-21))] border-b border-line-subtle pb-[clamp(var(--fib-21),2.5vw,var(--fib-34))] last:mb-0 last:border-b-0 last:pb-0"
        >
          <p className="cv-entry-date-col pt-1 font-sans text-[length:var(--text-label)] font-normal leading-relaxed text-[color:var(--color-label)]">
            {e.date.includes("—") ? (
              <>
                {e.date.split("—")[0].trim()} —<br />
                {e.date.split("—")[1].trim()}
              </>
            ) : (
              e.date
            )}
          </p>

          <div>
            <p className="mb-0.5 font-sans text-[length:clamp(0.9375rem,1.4vw,1.625rem)] font-semibold leading-tight tracking-h2 text-heading">
              {e.title}
            </p>
            <p className="mb-0 font-sans text-[length:clamp(var(--text-caption),0.85vw,0.8125rem)] font-normal text-body-secondary">
              {e.org}
            </p>
            {e.context && (
              <p className="mb-0 mt-0.5 font-sans text-[length:clamp(var(--text-caption),0.85vw,0.8125rem)] font-normal italic text-[color:var(--color-label)]">
                {e.context}
              </p>
            )}
            <ul className="mt-[clamp(var(--fib-8),1vw,var(--fib-13))] max-w-reading list-none space-y-fib-8 p-0">
              {e.bullets.map((b) => {
                const hit = !!hits && hits.has(b);
                return (
                  <li
                    key={b}
                    className={`relative pl-fib-21 font-sans text-[length:clamp(var(--text-caption),0.92vw,1.0625rem)] font-normal leading-body transition-colors before:absolute before:left-0 before:content-['–'] ${
                      hit
                        ? "text-heading before:text-heading"
                        : `text-body-secondary before:text-[color:var(--color-label)] ${emphasise ? "opacity-50" : ""}`
                    }`}
                  >
                    {b}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        );
      })}
    </>
  );
}

const allEntries = () => [...experience, ...projects, ...additionalExperience];

function hitCount(skill: Skill): number {
  if (!skill.match && !skill.entries?.length) return 0;
  return allEntries().filter((e) => skillHits(e, skill).linked).length;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CVContent() {
  const [selected, setSelected] = useState<Skill | null>(null);

  const toggleSkill = (skill: Skill) => {
    const next = selected?.name === skill.name ? null : skill;
    setSelected(next);
    // On narrow screens the skills sit below the entries — bring the first match into view.
    if (next && window.matchMedia("(max-width: 1200px)").matches) {
      requestAnimationFrame(() =>
        document.querySelector("[data-cv-hit]")?.scrollIntoView({ behavior: "smooth", block: "center" })
      );
    }
  };

  return (
    <>
      <style>{`
        /* CV body grid: sidebar collapses below 1200px (sidenav + CV rail). */
        @media (max-width: 1200px) {
          .cv-body-grid  { grid-template-columns: 1fr !important; }
          .cv-main       { order: 1; }
          .cv-sidebar    {
            order: 2;
            border-left: none !important;
            border-top: 1px solid var(--color-border) !important;
            border-bottom: none !important;
            padding-left: 0 !important;
            padding-top: clamp(var(--fib-21), 3vw, 2.5rem) !important;
            padding-bottom: 0 !important;
            margin-left: 0 !important;
            margin-top: clamp(var(--fib-34), 3.5vw, 2.75rem) !important;
            margin-bottom: 0 !important;
            /* Groups side by side where there's room, one per row on phones. */
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
            gap: var(--fib-34) clamp(var(--fib-21), 4vw, var(--fib-55)) !important;
            align-items: start;
          }
          .cv-sidebar-title, .cv-skill-hint { grid-column: 1 / -1; }
          .cv-sidebar-title > div { margin-bottom: 0 !important; }
          .cv-skill-hint { margin-bottom: 0 !important; }

          /* Skills become wrapping pills instead of a long one-per-line list. */
          .cv-skill-list { display: flex; flex-wrap: wrap; gap: var(--fib-8); }
          .cv-skill {
            width: auto !important;
            margin: 0 !important;
            padding: 5px 12px;
            border: 1px solid var(--color-border-subtle);
            border-radius: 999px;
            text-decoration: none !important;
            line-height: 1.4 !important;
          }
          .cv-skill-dot { display: none; }
          button.cv-skill { border-color: var(--color-border-strong); color: var(--color-body); }
          button.cv-skill[aria-pressed="true"] {
            background: var(--color-heading);
            border-color: var(--color-heading);
            color: var(--color-page);
          }
        }
        @media (max-width: 640px) {
          .cv-hero-inner      { flex-direction: column !important; align-items: flex-start !important; gap: var(--fib-21) !important; }
          .cv-hero-meta       { text-align: left !important; align-items: flex-start !important; }
        }
        @media (max-width: 480px) {
          .cv-entry-date-col  { display: none !important; }
          .cv-entry-grid      { grid-template-columns: 1fr !important; }
        }
        .cv-hero-name {
          font-size: clamp(2.75rem, 7vw, 8rem);
        }
        @media print {
          .cv-no-print   { display: none !important; }
          .cv-body-grid  { grid-template-columns: 1fr clamp(10rem, 17vw, 13.75rem) !important; }
          .cv-sidebar    {
            order: 2 !important;
            position: static !important;
            flex-direction: column !important;
            border-left: 1px solid var(--color-border) !important;
            border-top: none !important;
            border-bottom: none !important;
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
        }
      `}</style>

      <div className="pb-fib-89 font-sans text-heading">

        <div
          className="cv-hero-inner flex flex-wrap items-end justify-between gap-fib-21 pb-[clamp(var(--fib-21),3vw,var(--fib-55))]"
        >
          <h1 className="cv-hero-name font-serif font-light leading-[0.88] tracking-[-0.025em] text-heading">
            Rashod
            <span className="block pl-[clamp(var(--fib-21),4vw,var(--fib-55))]">
              Korala
            </span>
          </h1>

          <div className="cv-hero-meta flex flex-col items-end gap-1 pb-[clamp(var(--fib-8),0.5vw,var(--fib-13))]">
            {[
              { text: "St. John's, NL", href: null },
              { text: "hello@rashodkorala.com", href: "mailto:hello@rashodkorala.com" },
              { text: "rashodkorala.com", href: "https://rashodkorala.com" },
              { text: "github.com/rashodkorala", href: "https://github.com/rashodkorala" },
              { text: "linkedin.com/in/rashodk", href: "https://linkedin.com/in/rashodk" },
            ].map(({ text, href }) =>
              href ? (
                <a
                  key={text}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={metaLinkClass}
                >
                  {text} <ArrowIcon />
                </a>
              ) : (
                <p
                  key={text}
                  className="font-sans text-[length:clamp(var(--text-label),0.88vw,0.8125rem)] text-body-secondary"
                >
                  {text}
                </p>
              ),
            )}
            <a
              className="cv-no-print mt-1 inline-flex items-center gap-fib-8 font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] text-heading underline decoration-line-hover underline-offset-4 transition-colors hover:text-body"
              href="/Rashod_Korala_Resume.pdf"
              download="Rashod_Korala_Resume.pdf"
            >
              Download PDF <DownloadIcon />
            </a>
          </div>
        </div>

        <HRule />

        <div className="mb-[clamp(var(--fib-34),3.5vw,var(--fib-55))]">
          <SectionHeader title="Profile" />
          <p className="max-w-reading font-sans text-[length:clamp(var(--text-caption),1.05vw,1.1875rem)] font-normal leading-body text-body-secondary">
            {profile}
          </p>
        </div>

        <HRule />

        <div
          className="cv-body-grid grid [grid-template-columns:1fr_clamp(12rem,19vw,15.5rem)]"
        >

          <aside
            id="cv-skills"
            className="cv-sidebar order-2 flex flex-col gap-[clamp(var(--fib-34),3vw,2.75rem)] self-start border-l border-line pl-[clamp(var(--fib-21),2vw,var(--fib-34))] ml-[clamp(var(--fib-21),3vw,3rem)] min-[1201px]:sticky min-[1201px]:top-fib-21"
          >
            <div className="cv-sidebar-title min-[1201px]:hidden">
              <SectionHeader title="Skills" />
            </div>
            <p className="cv-skill-hint cv-no-print -mb-fib-13 font-sans text-[length:var(--text-label)] leading-body text-[color:var(--color-label)]">
              Pick a highlighted skill to see where I&apos;ve used it.
            </p>
            {skills.map((group) => (
              <div key={group.label}>
                <SidebarLabel>{group.label}</SidebarLabel>
                <div className="cv-skill-list">
                {group.items.map((skill) => {
                  const count = hitCount(skill);
                  const active = selected?.name === skill.name;
                  const label = (
                    <>
                      <span
                        className={`cv-skill-dot mt-[0.6em] size-1 shrink-0 rounded-full ${
                          active ? "bg-heading" : count ? "bg-body-secondary" : "bg-line-strong"
                        }`}
                      />
                      <span className="min-w-0">{skill.name}</span>
                    </>
                  );
                  const text =
                    "font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-normal leading-body";
                  return count ? (
                    <button
                      key={skill.name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleSkill(skill)}
                      title={`Highlight where I've used ${skill.name}`}
                      className={`cv-skill mb-1 flex w-full items-start gap-fib-13 text-left underline decoration-line-hover underline-offset-4 transition-colors ${text} ${
                        active ? "text-heading decoration-heading" : "text-body hover:text-heading"
                      }`}
                    >
                      {label}
                    </button>
                  ) : (
                    <div key={skill.name} className={`cv-skill mb-1 flex items-start gap-fib-13 text-body-secondary ${text}`}>
                      {label}
                    </div>
                  );
                })}
                </div>
              </div>
            ))}

            <div>
              <SidebarLabel>Certifications</SidebarLabel>
              {certs.map((c) => (
                <div key={c.name} className="mb-fib-13">
                  <p className="font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-normal leading-relaxed text-body-secondary">
                    {c.name}
                  </p>
                  <p className="font-sans text-[length:var(--text-label)] font-normal text-[color:var(--color-label)]">
                    {c.issuer}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <SidebarLabel>Education</SidebarLabel>
              <p className="font-sans text-[length:clamp(var(--text-caption),0.9vw,0.875rem)] font-normal leading-sub text-heading">
                Bachelor of Science in Computer Science
              </p>
              <p className="font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-normal leading-sub text-body-secondary">
                Minor in Business Administration
              </p>
              <p className="mt-0.5 font-sans text-[length:var(--text-label)] font-normal text-[color:var(--color-label)]">
                Memorial University of Newfoundland · Graduated Winter 2025
              </p>
            </div>
          </aside>

          <main className="cv-main order-1 flex min-w-0 flex-col gap-[clamp(var(--fib-34),4.5vw,3.75rem)]">
            {selected && (
              <div
                role="status"
                className="cv-no-print flex flex-wrap items-center justify-between gap-fib-13 border border-line-strong px-fib-21 py-fib-13 font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] text-body-secondary"
              >
                <span>
                  Showing where I&apos;ve used <span className="text-heading">{selected.name}</span>
                </span>
                <span className="flex items-center gap-fib-21">
                  {/* Skills sit below the entries on narrow screens — offer a way back. */}
                  <button
                    type="button"
                    onClick={() => document.getElementById("cv-skills")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="underline underline-offset-4 hover:text-heading min-[1201px]:hidden"
                  >
                    Back to skills
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="underline underline-offset-4 hover:text-heading"
                  >
                    Clear
                  </button>
                </span>
              </div>
            )}

            <section>
              <SectionHeader title="Experience" />
              <EntryGrid entries={experience} skill={selected} />
            </section>

            <section>
              <SectionHeader title="Projects" />
              <EntryGrid entries={projects} skill={selected} />
            </section>

            <section>
              <SectionHeader title="Additional Experience" />
              <EntryGrid entries={additionalExperience} skill={selected} />
            </section>

          </main>
        </div>
      </div>
    </>
  );
}
