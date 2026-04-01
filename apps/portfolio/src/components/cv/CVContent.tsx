"use client";

import React from "react";

// Design: editorial sidebar layout
// Sidebar: narrow fixed (clamp 160–224px) with skills/certs/education
// Main: chronological entries with date column + content column
// Hero: large serif name left, contact meta right
// Fonts: portfolio CSS vars (--font-cormorant, --font-dm-sans)

const serif = "var(--font-cormorant), 'Georgia', serif";
const sans  = "var(--font-dm-sans), system-ui, sans-serif";

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
    label: "Core stack",
    items: [
      { name: "TypeScript",   strong: true },
      { name: "React / Next.js", strong: true },
      { name: "React Native", strong: true },
      { name: "Node.js",      strong: true },
      { name: "Supabase",     strong: true },
      { name: "PostgreSQL",   strong: true },
    ],
  },
  {
    label: "Tools & platforms",
    items: [
      { name: "Anthropic API" },
      { name: "Shopify / Liquid" },
      { name: "Framer Motion" },
      { name: "NFC / NDEF" },
      { name: "Docker" },
      { name: "Figma" },
      { name: "AWS" },
      { name: "Turborepo" },
    ],
  },
];

const certs: Cert[] = [
  { name: "Meta Front-End Developer",       issuer: "Meta · 2025" },
  { name: "Google IT Support Professional", issuer: "Google · 2025" },
  { name: "AWS Cloud Practitioner",         issuer: "Amazon · In progress" },
];

const experience: Entry[] = [
  {
    id: "rnd",
    date: "Mar 2026 — Present",
    title: "Technical Product Engineer",
    org: "R&D Creative Agency · Canada",
    description:
      "Architect and deliver full-stack solutions for clients across React, Node.js, and Shopify stacks. Integrated Claude Code and OpenAI Codex via MCP, reducing average build-to-launch time by ~40%. Lead structured discovery sessions and enforce Git branching strategies across all projects.",
    tags: ["React", "Node.js", "Shopify", "Anthropic API", "MCP"],
  },
  {
    id: "fyynd",
    date: "Jan 2026 — Present",
    title: "Product Design Specialist",
    org: "Fyynd Fit · Remote",
    description:
      "Redesigned end-to-end navigation architecture across mobile app and web platform, reducing friction in core user journeys. Overhauled the visual design system for cross-platform consistency and applied strategic CTA placement to increase engagement.",
    tags: ["UI/UX", "Design Systems", "Mobile", "Web"],
  },
  {
    id: "aetherlabs",
    date: "Jun 2025 — Present",
    title: "Founder & Lead Engineer",
    org: "AetherLabs · Canada",
    description:
      "Built and scaled a full back-office platform for 30,000+ independent artists across Canada — inventory, NFC provenance tagging, AI document extraction, and CRM. React Native mobile app, Next.js web client, Supabase backend in a Turborepo monorepo. Selected for Propel ICT Vision and Genesis Evolve accelerator programmes.",
    tags: ["React Native", "Next.js", "Supabase", "Anthropic API", "NFC"],
  },
  {
    id: "paradies",
    date: "Jun 2022 — Present",
    title: "Technical Associate",
    org: "Paradies Lagardere · St. John's International Airport",
    description:
      "Managed POS systems supporting 200–400 daily customer interactions. Analysed product performance data to inform merchandising decisions, resulting in a 30% sales increase on underperforming lines.",
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
      "Pipeline that processes raw meeting transcripts into structured CRM-ready data using a three-tier confidence classification system. Strong technical feedback from the engineering review team.",
    tags: ["TypeScript", "Anthropic API", "Node.js"],
  },
  {
    id: "moov",
    date: "2024",
    title: "MOOV Shopify Storefront",
    org: "Shopify · Liquid · CSS · JavaScript",
    description:
      "Custom dark-themed storefront with a tailored design system, responsive UI components, and optimised checkout flow for a smart alarm hardware product.",
    tags: ["Shopify", "Liquid", "CSS"],
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

const DownloadIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" style={{ width: 10, height: 10, flexShrink: 0 }}>
    <path d="M6 1v7M6 8l-3-3M6 8l3-3M1 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" style={{ width: 10, height: 10, flexShrink: 0 }}>
    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function HRule() {
  return <div style={{ height: 1, background: "var(--color-border)", margin: "0 0 clamp(20px,2.5vw,36px)" }} />;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(16px,2vw,28px)" }}>
      <h2 style={{
        fontFamily: serif,
        fontSize: "clamp(18px,1.8vw,26px)",
        fontWeight: 700,
        color: "var(--color-heading)",
        letterSpacing: "-0.015em",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
    </div>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: sans,
      fontSize: "clamp(10px,0.78vw,11px)",
      color: "var(--color-label)",
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      fontWeight: 400,
      marginBottom: "clamp(8px,1vw,12px)",
    }}>
      {children}
    </p>
  );
}

function EntryGrid({ entries, showTags = true }: { entries: Entry[]; showTags?: boolean }) {
  const subBorder = "1px solid var(--color-border-subtle)";
  return (
    <>
      {entries.map((e, i) => (
        <div
          key={e.id}
          className="cv-entry-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(72px,9vw,108px) 1fr",
            gap: "clamp(12px,2vw,24px)",
            paddingBottom: i < entries.length - 1 ? "clamp(20px,2.5vw,32px)" : 0,
            borderBottom: i < entries.length - 1 ? subBorder : "none",
            marginBottom: i < entries.length - 1 ? "clamp(20px,2.5vw,32px)" : 0,
          }}
        >
          {/* Date column — hidden on mobile via .cv-entry-date-col */}
          <p className="cv-entry-date-col" style={{
            fontFamily: sans,
            fontSize: "clamp(10px,0.78vw,11px)",
            color: "var(--color-label)",
            fontWeight: 300,
            lineHeight: 1.6,
            paddingTop: 4,
          }}>
            {e.date.includes("—") ? (
              <>
                {e.date.split("—")[0].trim()} —<br />
                {e.date.split("—")[1].trim()}
              </>
            ) : e.date}
          </p>

          {/* Content column */}
          <div>
            <p style={{
              fontFamily: serif,
              fontSize: "clamp(15px,1.4vw,21px)",
              color: "var(--color-heading)",
              fontWeight: 700,
              marginBottom: 3,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
            }}>
              {e.title}
            </p>
            <p style={{
              fontFamily: sans,
              fontSize: "clamp(11px,0.85vw,13px)",
              color: "var(--color-body-secondary)",
              fontWeight: 300,
              marginBottom: "clamp(8px,1vw,12px)",
            }}>
              {e.org}
            </p>
            <p style={{
              fontFamily: sans,
              fontSize: "clamp(12px,0.92vw,14px)",
              color: "var(--color-body-secondary)",
              fontWeight: 300,
              lineHeight: 1.8,
            }}>
              {e.description}
            </p>
            {showTags && e.tags && e.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginTop: 10 }}>
                {e.tags.map((t) => (
                  <span key={t} style={{
                    fontFamily: sans,
                    fontSize: "clamp(10px,0.75vw,11px)",
                    color: "var(--color-body-secondary)",
                    border: "1px solid var(--color-border-strong)",
                    padding: "3px 9px",
                    fontWeight: 300,
                    letterSpacing: "0.03em",
                  }}>
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
  const border = "1px solid var(--color-border)";

  return (
    <>
      <style>{`
        /* CV body grid: sidebar only appears when there is enough content-area
           width AFTER the global sidenav (192px) + page padding (~110px).
           At 1440px viewport: content = 1440-302 = 1138px — comfortable.
           At 1280px viewport: content = 1280-302 = 978px — still ok.
           Below 1200px the sidenav + CV sidebar together feel cramped,
           so collapse the CV sidebar into a stacked header section. */
        @media (max-width: 1200px) {
          .cv-body-grid  { grid-template-columns: 1fr !important; }
          .cv-sidebar    {
            border-right: none !important;
            border-bottom: 1px solid var(--color-border) !important;
            padding-right: 0 !important;
            padding-bottom: clamp(24px,3vw,40px) !important;
            margin-right: 0 !important;
            margin-bottom: clamp(28px,3.5vw,44px) !important;
            /* Lay skills/certs/education horizontally instead of stacking */
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: clamp(28px,4vw,56px) !important;
            align-items: flex-start;
          }
        }
        @media (max-width: 640px) {
          .cv-hero-inner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .cv-hero-meta  { text-align: left !important; align-items: flex-start !important; }
          .cv-sidebar    { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .cv-entry-date-col { display: none !important; }
          .cv-entry-grid     { grid-template-columns: 1fr !important; }
        }
        @media print {
          .cv-no-print   { display: none !important; }
          .cv-body-grid  { grid-template-columns: clamp(160px,17vw,220px) 1fr !important; }
          .cv-sidebar    { flex-direction: column !important; border-right: 1px solid #d4d0c8 !important; border-bottom: none !important; }
        }
      `}</style>

      <div style={{ fontFamily: sans, color: "var(--color-heading)", paddingBottom: "var(--fib-89)" }}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div
          className="cv-hero-inner"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap" as const,
            gap: "var(--fib-21)",
            paddingBottom: "clamp(20px,3vw,44px)",
          }}
        >
          <h1 style={{
            fontFamily: serif,
            fontWeight: 700,
            fontSize: "clamp(44px,7vw,104px)",
            color: "var(--color-heading)",
            letterSpacing: "-0.025em",
            lineHeight: 0.88,
          }}>
            Rashod
            <span style={{ display: "block", paddingLeft: "clamp(var(--fib-21),4vw,var(--fib-55))" }}>
              Korala
            </span>
          </h1>

          <div
            className="cv-hero-meta"
            style={{
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "flex-end",
              gap: 4,
              paddingBottom: "clamp(4px,0.5vw,10px)",
            }}
          >
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
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: sans,
                    fontSize: "clamp(11px,0.88vw,13px)",
                    color: "var(--color-body-secondary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    textDecorationColor: "var(--color-border-hover)",
                  }}
                >
                  {text} <ArrowIcon />
                </a>
              ) : (
                <p key={text} style={{ fontFamily: sans, fontSize: "clamp(11px,0.88vw,13px)", color: "var(--color-body-secondary)" }}>
                  {text}
                </p>
              )
            )}
            <button
              className="cv-no-print"
              onClick={() => window.print()}
              style={{
                fontFamily: sans,
                fontSize: "clamp(11px,0.85vw,13px)",
                color: "var(--color-heading)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                textDecoration: "underline",
                textUnderlineOffset: 4,
                textDecorationColor: "var(--color-border-hover)",
                marginTop: 4,
              }}
            >
              Download PDF <DownloadIcon />
            </button>
          </div>
        </div>

        <HRule />

        {/* ── Body: sidebar + main ─────────────────────────────────────────── */}
        <div
          className="cv-body-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(160px,17vw,220px) 1fr",
          }}
        >

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <aside
            className="cv-sidebar"
            style={{
              borderRight: border,
              padding: "0 clamp(16px,2vw,32px) 0 0",
              marginRight: "clamp(24px,3vw,48px)",
              display: "flex",
              flexDirection: "column" as const,
              gap: "clamp(28px,3vw,44px)",
            }}
          >
            {/* Skills */}
            {skills.map((group) => (
              <div key={group.label}>
                <SidebarLabel>{group.label}</SidebarLabel>
                {group.items.map((skill) => (
                  <div key={skill.name} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                    <div style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: skill.strong ? "var(--color-heading)" : "var(--color-border-strong)",
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: sans,
                      fontSize: "clamp(11px,0.85vw,13px)",
                      color: skill.strong ? "var(--color-heading)" : "var(--color-body-secondary)",
                      fontWeight: skill.strong ? 400 : 300,
                      lineHeight: 1.75,
                    }}>
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            {/* Certifications */}
            <div>
              <SidebarLabel>Certifications</SidebarLabel>
              {certs.map((c) => (
                <div key={c.name} style={{ marginBottom: 10 }}>
                  <p style={{ fontFamily: sans, fontSize: "clamp(11px,0.85vw,13px)", color: "var(--color-body-secondary)", fontWeight: 300, lineHeight: 1.6 }}>
                    {c.name}
                  </p>
                  <p style={{ fontFamily: sans, fontSize: "clamp(10px,0.78vw,11px)", color: "var(--color-label)", fontWeight: 300 }}>
                    {c.issuer}
                  </p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div>
              <SidebarLabel>Education</SidebarLabel>
              <p style={{ fontFamily: sans, fontSize: "clamp(12px,0.9vw,14px)", color: "var(--color-heading)", fontWeight: 400, lineHeight: 1.55 }}>
                BSc Computer Science
              </p>
              <p style={{ fontFamily: sans, fontSize: "clamp(11px,0.85vw,13px)", color: "var(--color-body-secondary)", fontWeight: 300, lineHeight: 1.55 }}>
                Minor in Business Admin
              </p>
              <p style={{ fontFamily: sans, fontSize: "clamp(10px,0.78vw,11px)", color: "var(--color-label)", fontWeight: 300, marginTop: 2 }}>
                Memorial University · 2025
              </p>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────────── */}
          <main style={{ display: "flex", flexDirection: "column" as const, gap: "clamp(36px,4.5vw,60px)" }}>

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
