"use client";

import React from "react";

// Design: editorial sidebar layout
// Sidebar: narrow fixed (clamp 160–224px) with skills/certs/education
// Main: chronological entries with date column + content column
// Hero: large serif name left, contact meta right
// Fonts: use semantic CSS vars controlled by apps/portfolio/config/typography.ts

const serif = "var(--font-active-display), 'Georgia', serif";
const sans  = "var(--font-active-sans), system-ui, sans-serif";

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
        fontWeight: 600,
        color: "var(--color-heading)",
        letterSpacing: "-0.02em",
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
            fontWeight: 400,
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
              fontWeight: 600,
              marginBottom: 3,
              lineHeight: 1.2,
              letterSpacing: "-0.015em",
            }}>
              {e.title}
            </p>
            <p style={{
              fontFamily: sans,
              fontSize: "clamp(11px,0.85vw,13px)",
              color: "var(--color-body-secondary)",
              fontWeight: 400,
              marginBottom: "clamp(8px,1vw,12px)",
            }}>
              {e.org}
            </p>
            <p style={{
              fontFamily: sans,
              fontSize: "clamp(12px,0.92vw,14px)",
              color: "var(--color-body-secondary)",
              fontWeight: 400,
              lineHeight: 1.65,
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
                    fontWeight: 400,
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
           so collapse the CV sidebar into a stacked section after main content. */
        @media (max-width: 1200px) {
          .cv-body-grid  { grid-template-columns: 1fr !important; }
          .cv-main       { order: 1; }
          .cv-sidebar    {
            order: 2;
            border-right: none !important;
            border-top: 1px solid var(--color-border) !important;
            border-bottom: none !important;
            padding-right: 0 !important;
            padding-top: clamp(24px,3vw,40px) !important;
            padding-bottom: 0 !important;
            margin-right: 0 !important;
            margin-top: clamp(28px,3.5vw,44px) !important;
            margin-bottom: 0 !important;
            /* Lay skills/certs/education horizontally instead of stacking */
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: clamp(28px,4vw,56px) !important;
            align-items: flex-start;
          }
        }
        @media (max-width: 640px) {
          .cv-hero-inner      { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
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
        @media print {
          .cv-no-print   { display: none !important; }
          .cv-body-grid  { grid-template-columns: clamp(160px,17vw,220px) 1fr !important; }
          .cv-sidebar    { order: 0 !important; flex-direction: column !important; border-right: 1px solid #d4d0c8 !important; border-top: none !important; border-bottom: none !important; padding-top: 0 !important; margin-top: 0 !important; }
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
            <a
              className="cv-no-print"
              href="/Rashod_Korala_Resume.pdf"
              download="Rashod_Korala_Resume.pdf"
              style={{
                fontFamily: sans,
                fontSize: "clamp(11px,0.85vw,13px)",
                color: "var(--color-heading)",
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
            </a>
          </div>
        </div>

        <HRule />

        {/* ── Professional Competency ───────────────────────────────────────── */}
        <div style={{ marginBottom: "clamp(28px,3.5vw,48px)" }}>
          <SectionHeader title="Professional Competency" />
          <div className="cv-competency-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(6px,0.8vw,10px) clamp(16px,2vw,32px)",
          }}>
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
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--color-border-strong)", flexShrink: 0 }} />
                <span style={{ fontFamily: sans, fontSize: "clamp(12px,0.92vw,14px)", color: "var(--color-body-secondary)", fontWeight: 400, lineHeight: 1.65 }}>
                  {item}
                </span>
              </div>
            ))}
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
                      fontWeight: skill.strong ? 500 : 400,
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
                  <p style={{ fontFamily: sans, fontSize: "clamp(11px,0.85vw,13px)", color: "var(--color-body-secondary)", fontWeight: 400, lineHeight: 1.6 }}>
                    {c.name}
                  </p>
                  <p style={{ fontFamily: sans, fontSize: "clamp(10px,0.78vw,11px)", color: "var(--color-label)", fontWeight: 400 }}>
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
              <p style={{ fontFamily: sans, fontSize: "clamp(11px,0.85vw,13px)", color: "var(--color-body-secondary)", fontWeight: 400, lineHeight: 1.55 }}>
                Minor in Business Admin
              </p>
              <p style={{ fontFamily: sans, fontSize: "clamp(10px,0.78vw,11px)", color: "var(--color-label)", fontWeight: 400, marginTop: 2 }}>
                Memorial University · 2025
              </p>
            </div>
          </aside>

          {/* ── Main content ───────────────────────────────────────────────── */}
          <main className="cv-main" style={{ display: "flex", flexDirection: "column" as const, gap: "clamp(36px,4.5vw,60px)" }}>

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
