"use client";

import React from "react";
import { useTranslations, type Messages } from "next-intl";

// Design: editorial sidebar layout
// Sidebar: narrow fluid column with skills/certs/education
// Main: chronological entries with date column + content column

// ─── Types ────────────────────────────────────────────────────────────────────

type CvT = ReturnType<typeof useTranslations<"CV">>;
type EntryKey = keyof Messages["CV"]["entries"];

interface SkillItem  { name: string; strong?: boolean; }
interface SkillGroup { key: keyof Messages["CV"]["skillGroups"]; items: SkillItem[]; }
interface Cert       { name: string; issuerKey: keyof Messages["CV"]["certIssuers"]; }
/** Text (date/title/org/description) lives in messages under CV.entries.<id>. */
interface EntryRef   { id: EntryKey; tags?: string[]; }
interface Entry {
  id: string;
  date: string;
  title: string;
  org: string;
  description: string;
  tags?: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Skill and certification names are proper nouns and stay untranslated.

const skills: SkillGroup[] = [
  {
    key: "languages",
    items: [
      { name: "TypeScript",  strong: true },
      { name: "JavaScript",  strong: true },
      { name: "HTML5 / CSS3", strong: true },
      { name: "Java" },
    ],
  },
  {
    key: "frameworks",
    items: [
      { name: "React / Next.js", strong: true },
      { name: "React Native",    strong: true },
      { name: "Node.js",         strong: true },
      { name: "Express" },
      { name: "AngularJS" },
    ],
  },
  {
    key: "databases",
    items: [
      { name: "PostgreSQL", strong: true },
      { name: "Supabase",   strong: true },
    ],
  },
  {
    key: "cloud",
    items: [
      { name: "AWS",       strong: true },
      { name: "Azure" },
      { name: "OpenShift" },
      { name: "Docker" },
      { name: "Git" },
    ],
  },
  {
    key: "tools",
    items: [
      { name: "Figma" },
      { name: "Shopify / Liquid" },
      { name: "Cursor" },
      { name: "Claude Code" },
      { name: "OpenAI Codex" },
      { name: "Maven" },
      { name: "Framer Motion" },
      { name: "NFC / NDEF" },
    ],
  },
  {
    key: "concepts",
    items: [
      { name: "REST APIs" },
      { name: "AI Automation" },
      { name: "MCP Integrations" },
      { name: "CI/CD" },
      { name: "Microservices" },
      { name: "Web Security" },
    ],
  },
];

const certs: Cert[] = [
  { name: "Meta Front-End Developer",            issuerKey: "meta" },
  { name: "Google IT Support Professional",      issuerKey: "google" },
  { name: "AWS Cloud Practitioner",              issuerKey: "aws" },
  { name: "Master Java Comprehensive Developer", issuerKey: "java" },
];

const competencies: (keyof Messages["CV"]["competencies"])[] = [
  "fullStack",
  "aiAutomation",
  "productLeadership",
  "productDiscovery",
  "architecture",
  "uxSystems",
  "collaboration",
  "clientDelivery",
  "projectManagement",
];

const experience: EntryRef[] = [
  { id: "rnd",        tags: ["React", "Node.js", "Shopify", "Claude Code", "OpenAI Codex"] },
  { id: "fyynd",      tags: ["UI/UX", "Design Systems", "Mobile", "Figma"] },
  { id: "aetherlabs", tags: ["React Native", "Next.js", "Supabase", "PostgreSQL", "NFC"] },
  { id: "paradies",   tags: [] },
];

const projects: EntryRef[] = [
  { id: "transcript",        tags: ["TypeScript", "Anthropic API", "Node.js"] },
  { id: "moov",              tags: ["Shopify", "Liquid", "CSS", "JavaScript"] },
  { id: "fyyndProject",      tags: ["Figma", "UI/UX", "Mobile", "Web"] },
  { id: "aetherlabsProject", tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "NFC"] },
];

const accelerators: EntryRef[] = [
  { id: "genesis" },
  { id: "propel" },
];

function resolveEntries(refs: EntryRef[], t: CvT): Entry[] {
  return refs.map(({ id, tags }) => ({
    id,
    date: t(`entries.${id}.date`),
    title: t(`entries.${id}.title`),
    org: t(`entries.${id}.org`),
    description: t(`entries.${id}.description`),
    tags,
  }));
}

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

function EntryGrid({ entries, showTags = true }: { entries: Entry[]; showTags?: boolean }) {
  return (
    <>
      {entries.map((e) => (
        <div
          key={e.id}
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
            <p className="mb-[clamp(var(--fib-8),1vw,var(--fib-13))] font-sans text-[length:clamp(var(--text-caption),0.85vw,0.8125rem)] font-normal text-body-secondary">
              {e.org}
            </p>
            <p className="max-w-reading font-sans text-[length:clamp(var(--text-caption),0.92vw,1.0625rem)] font-normal leading-body text-body-secondary">
              {e.description}
            </p>
            {showTags && e.tags && e.tags.length > 0 && (
              <div className="mt-fib-13 flex flex-wrap gap-fib-8">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-line-strong px-fib-13 py-fib-8 font-sans text-[length:clamp(var(--text-label),0.75vw,var(--text-caption))] font-normal tracking-ui text-body-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CVContent() {
  const t = useTranslations("CV");

  return (
    <>
      <style>{`
        /* CV body grid: sidebar collapses below 1200px (sidenav + CV rail). */
        @media (max-width: 1200px) {
          .cv-body-grid  { grid-template-columns: 1fr !important; }
          .cv-main       { order: 1; }
          .cv-sidebar    {
            order: 2;
            border-right: none !important;
            border-top: 1px solid var(--color-border) !important;
            border-bottom: none !important;
            padding-right: 0 !important;
            padding-top: clamp(var(--fib-21), 3vw, 2.5rem) !important;
            padding-bottom: 0 !important;
            margin-right: 0 !important;
            margin-top: clamp(var(--fib-34), 3.5vw, 2.75rem) !important;
            margin-bottom: 0 !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: clamp(var(--fib-34), 4vw, var(--fib-55)) !important;
            align-items: flex-start;
          }
        }
        @media (max-width: 640px) {
          .cv-hero-inner      { flex-direction: column !important; align-items: flex-start !important; gap: var(--fib-21) !important; }
          .cv-hero-meta       { text-align: left !important; align-items: flex-start !important; }
          .cv-sidebar         { flex-direction: column !important; }
          .cv-competency-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .cv-entry-date-col  { display: none !important; }
          .cv-entry-grid      { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 380px) {
          .cv-competency-grid { grid-template-columns: 1fr !important; }
        }
        .cv-hero-name {
          font-size: clamp(2.75rem, 7vw, 8rem);
        }
        @media print {
          .cv-no-print   { display: none !important; }
          .cv-body-grid  { grid-template-columns: clamp(10rem, 17vw, 13.75rem) 1fr !important; }
          .cv-sidebar    {
            order: 0 !important;
            flex-direction: column !important;
            border-right: 1px solid var(--color-border) !important;
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
          <h1 lang="en" className="cv-hero-name font-serif font-light leading-[0.88] tracking-[-0.025em] text-heading">
            Rashod
            <span className="block pl-[clamp(var(--fib-21),4vw,var(--fib-55))]">
              Korala
            </span>
          </h1>

          <div className="cv-hero-meta flex flex-col items-end gap-1 pb-[clamp(var(--fib-8),0.5vw,var(--fib-13))]">
            {[
              { text: t("location"), href: null },
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
              {t("downloadPdf")} <DownloadIcon />
            </a>
          </div>
        </div>

        <HRule />

        <div className="mb-[clamp(var(--fib-34),3.5vw,var(--fib-55))]">
          <SectionHeader title={t("competencyTitle")} />
          <div
            className="cv-competency-grid grid grid-cols-3 gap-x-[clamp(var(--fib-21),2vw,var(--fib-34))] gap-y-[clamp(var(--fib-8),0.8vw,var(--fib-13))]"
          >
            {competencies.map((key) => (
              <div key={key} className="flex items-center gap-fib-13">
                <div className="size-1 shrink-0 rounded-full bg-line-strong" />
                <span className="font-sans text-[length:clamp(var(--text-caption),0.92vw,0.875rem)] font-normal leading-body text-body-secondary">
                  {t(`competencies.${key}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <HRule />

        <div
          className="cv-body-grid grid [grid-template-columns:clamp(10rem,17vw,13.75rem)_1fr]"
        >

          <aside
            className="cv-sidebar flex flex-col gap-[clamp(var(--fib-34),3vw,2.75rem)] border-r border-line pr-[clamp(var(--fib-21),2vw,var(--fib-34))] mr-[clamp(var(--fib-21),3vw,3rem)]"
          >
            {skills.map((group) => (
              <div key={group.key}>
                <SidebarLabel>{t(`skillGroups.${group.key}`)}</SidebarLabel>
                {group.items.map((skill) => (
                  <div key={skill.name} className="mb-1 flex items-center gap-fib-13">
                    <div
                      className={
                        skill.strong
                          ? "size-1 shrink-0 rounded-full bg-heading"
                          : "size-1 shrink-0 rounded-full bg-line-strong"
                      }
                    />
                    <span
                      className={
                        skill.strong
                          ? "font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-medium leading-body text-heading"
                          : "font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-normal leading-body text-body-secondary"
                      }
                    >
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div>
              <SidebarLabel>{t("certifications")}</SidebarLabel>
              {certs.map((c) => (
                <div key={c.name} className="mb-fib-13">
                  <p className="font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-normal leading-relaxed text-body-secondary">
                    {c.name}
                  </p>
                  <p className="font-sans text-[length:var(--text-label)] font-normal text-[color:var(--color-label)]">
                    {t(`certIssuers.${c.issuerKey}`)}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <SidebarLabel>{t("education")}</SidebarLabel>
              <p className="font-sans text-[length:clamp(var(--text-caption),0.9vw,0.875rem)] font-normal leading-sub text-heading">
                {t("degree")}
              </p>
              <p className="font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-normal leading-sub text-body-secondary">
                {t("minor")}
              </p>
              <p className="mt-0.5 font-sans text-[length:var(--text-label)] font-normal text-[color:var(--color-label)]">
                {t("school")}
              </p>
            </div>
          </aside>

          <main className="cv-main flex flex-col gap-[clamp(var(--fib-34),4.5vw,3.75rem)]">

            <section>
              <SectionHeader title={t("experienceTitle")} />
              <EntryGrid entries={resolveEntries(experience, t)} />
            </section>

            <section>
              <SectionHeader title={t("projectsTitle")} />
              <EntryGrid entries={resolveEntries(projects, t)} />
            </section>

            <section>
              <SectionHeader title={t("acceleratorsTitle")} />
              <EntryGrid entries={resolveEntries(accelerators, t)} showTags={false} />
            </section>

          </main>
        </div>
      </div>
    </>
  );
}
