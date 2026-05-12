"use client";

import React from "react";

// Design: editorial sidebar layout
// Sidebar: narrow fluid column with skills/certs/education
// Main: chronological entries with date column + content column

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillItem  { name: string; strong?: boolean; }
interface SkillGroup { label: string; items: SkillItem[]; }
interface Cert       { name: string; issuer: string; }
interface Entry {
  id: string;
  date: string;
  title: string;
  org: string;
  description: string;
  tags?: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript",  strong: true },
      { name: "JavaScript",  strong: true },
      { name: "HTML5 / CSS3", strong: true },
      { name: "Java" },
    ],
  },
  {
    label: "Frameworks & Libraries",
    items: [
      { name: "React / Next.js", strong: true },
      { name: "React Native",    strong: true },
      { name: "Node.js",         strong: true },
      { name: "Express" },
      { name: "AngularJS" },
    ],
  },
  {
    label: "Databases",
    items: [
      { name: "PostgreSQL", strong: true },
      { name: "Supabase",   strong: true },
    ],
  },
  {
    label: "Cloud & DevOps",
    items: [
      { name: "AWS",       strong: true },
      { name: "Azure" },
      { name: "OpenShift" },
      { name: "Docker" },
      { name: "Git" },
    ],
  },
  {
    label: "Tools & Platforms",
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
    label: "Concepts",
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
  { name: "Meta Front-End Developer",         issuer: "Meta · Oct 2025" },
  { name: "Google IT Support Professional",   issuer: "Google · Nov 2025" },
  { name: "AWS Cloud Practitioner",           issuer: "Amazon · In progress" },
  { name: "Master Java Comprehensive Developer", issuer: "2018" },
];

const experience: Entry[] = [
  {
    id: "rnd",
    date: "Mar 2025 — Present",
    title: "Technical Product Engineer & Co-Founder",
    org: "R&D Creative Agency · St. John's, NL",
    description:
      "Led full-cycle delivery of web projects across multiple sectors, from brief to production-ready digital products. Leveraged AI tooling including Claude Code and OpenAI Codex to automate development workflows. Designed and implemented RESTful APIs and third-party integrations for clients including Rob Roy, Konfusion, and MOOV. Applied UI/UX principles to improve live products, enhancing engagement and conversion.",
    tags: ["React", "Node.js", "Shopify", "Claude Code", "OpenAI Codex"],
  },
  {
    id: "fyynd",
    date: "Jan 2026 — Present",
    title: "Product Design Consultant",
    org: "Fyynd Fit · Remote — Part-Time",
    description:
      "Redesigned navigation architecture across mobile app and website, reducing user friction and simplifying core user flows. Overhauled the visual design system for cross-platform consistency. Improved data visualisation and layout to make complex information more scannable, driving higher conversion on key actions.",
    tags: ["UI/UX", "Design Systems", "Mobile", "Figma"],
  },
  {
    id: "aetherlabs",
    date: "Jun 2025 — Present",
    title: "Co-Founder & Engineering Team Lead",
    org: "AetherLabs · St. John's, NL",
    description:
      "Architected and led end-to-end development of a back-office platform enabling independent artists to manage inventory, documentation, provenance, and business workflows. Drove product-market fit through customer discovery and user interviews with artists, galleries, and museums. Scaled the platform to support 30,000+ artists across Canada. Implemented NFC-embedded certificate-of-authenticity workflows and AI-assisted document extraction.",
    tags: ["React Native", "Next.js", "Supabase", "PostgreSQL", "NFC"],
  },
  {
    id: "paradies",
    date: "Jun 2022 — Present",
    title: "Technical Associate",
    org: "Paradies Lagardère · St. John's International Airport — Part-Time",
    description:
      "Managed POS systems and transaction workflows, maintaining operational reliability across daily retail operations. Analysed product performance and sales data to inform stocking and merchandising decisions, contributing to a 30% increase in sales for underperforming product lines.",
    tags: [],
  },
];

const projects: Entry[] = [
  {
    id: "transcript",
    date: "2025",
    title: "Transcript Processing Pipeline",
    org: "TypeScript · Node.js · Anthropic API",
    description:
      "AI-powered pipeline that transforms meeting transcripts into structured CRM data using a three-tier confidence taxonomy and RESTful ingestion services.",
    tags: ["TypeScript", "Anthropic API", "Node.js"],
  },
  {
    id: "moov",
    date: "In Development",
    title: "MOOV Shopify Storefront",
    org: "Shopify · Liquid · CSS · JavaScript",
    description:
      "Dark-themed Shopify storefront with a custom design system, responsive UI, and cross-browser-optimised HTML5/CSS3 for a smart alarm product launch.",
    tags: ["Shopify", "Liquid", "CSS", "JavaScript"],
  },
  {
    id: "fyynd-project",
    date: "2026",
    title: "Fyynd Fit — App & Website Redesign",
    org: "Figma · fyyndfit.com",
    description:
      "Redesigned the mobile app and website experience, overhauling navigation architecture, visual design system, and data visualisation to improve usability and interface cohesion.",
    tags: ["Figma", "UI/UX", "Mobile", "Web"],
  },
  {
    id: "aetherlabs-project",
    date: "2025",
    title: "AetherLabs — Back Office Platform",
    org: "Next.js · TypeScript · Supabase · PostgreSQL",
    description:
      "Comprehensive platform for artist business operations including inventory, provenance management, NFC-embedded certificate-of-authenticity workflows, CRM, and invoicing.",
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "NFC"],
  },
];

const accelerators: Entry[] = [
  {
    id: "genesis",
    date: "Winter 2026",
    title: "Genesis Evolve",
    org: "Genesis Centre · Canada",
    description:
      "Selected for the Winter 2026 cohort with AetherLabs. Completed customer discovery, product iteration, and investor pitch preparation. Delivered a final 15-slide pitch to a panel of judges and investors.",
  },
  {
    id: "propel",
    date: "2024",
    title: "Propel ICT Vision",
    org: "Propel · Atlantic Canada",
    description:
      "Participated in accelerator programming focused on go-to-market strategy, investor readiness, and product-market fit validation for early-stage tech ventures.",
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
          <h1 className="cv-hero-name font-serif font-light leading-[0.88] tracking-[-0.025em] text-heading">
            Rashod
            <span className="block pl-[clamp(var(--fib-21),4vw,var(--fib-55))]">
              Korala
            </span>
          </h1>

          <div className="cv-hero-meta flex flex-col items-end gap-1 pb-[clamp(var(--fib-8),0.5vw,var(--fib-13))]">
            {[
              { text: "Canada", href: null },
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
          <SectionHeader title="Professional Competency" />
          <div
            className="cv-competency-grid grid grid-cols-3 gap-x-[clamp(var(--fib-21),2vw,var(--fib-34))] gap-y-[clamp(var(--fib-8),0.8vw,var(--fib-13))]"
          >
            {[
              "Full Stack Engineering",
              "AI Workflow Automation",
              "Technical Product Leadership",
              "Product Discovery & Iteration",
              "System Architecture",
              "UI/UX Systems Design",
              "Cross-Functional Collaboration",
              "Client Delivery Management",
              "Project Management",
            ].map((item) => (
              <div key={item} className="flex items-center gap-fib-13">
                <div className="size-1 shrink-0 rounded-full bg-line-strong" />
                <span className="font-sans text-[length:clamp(var(--text-caption),0.92vw,0.875rem)] font-normal leading-body text-body-secondary">
                  {item}
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
              <div key={group.label}>
                <SidebarLabel>{group.label}</SidebarLabel>
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
                BSc Computer Science
              </p>
              <p className="font-sans text-[length:clamp(var(--text-label),0.85vw,0.8125rem)] font-normal leading-sub text-body-secondary">
                Minor in Business Admin
              </p>
              <p className="mt-0.5 font-sans text-[length:var(--text-label)] font-normal text-[color:var(--color-label)]">
                Memorial University · 2025
              </p>
            </div>
          </aside>

          <main className="cv-main flex flex-col gap-[clamp(var(--fib-34),4.5vw,3.75rem)]">

            <section>
              <SectionHeader title="Experience" />
              <EntryGrid entries={experience} />
            </section>

            <section>
              <SectionHeader title="Selected Projects" />
              <EntryGrid entries={projects} />
            </section>

            <section>
              <SectionHeader title="Accelerators & Programs" />
              <EntryGrid entries={accelerators} showTags={false} />
            </section>

          </main>
        </div>
      </div>
    </>
  );
}
