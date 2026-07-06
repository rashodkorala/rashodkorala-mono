"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { jakartaSans, cormorantGaramond } from "@/lib/font";
import type { Project, CaseStudy } from "@/lib/types";
import CaseStudiesList from "./CaseStudiesList";

/**
 * Cycling 12-column grid pattern — 6 slots per cycle:
 *   0 → span-7  wide (16/9)
 *   1 → span-5  wide (4/3)
 *   2 → span-4  wide (4/3)
 *   3 → span-8  wide (16/9)
 *   4 → span-6  wide (3/2)
 *   5 → span-6  wide (3/2)
 */
const GRID_PATTERN = [
  { span: 7, aspect: "16 / 9" },
  { span: 5, aspect: "4 / 3"  },
  { span: 4, aspect: "4 / 3"  },
  { span: 8, aspect: "16 / 9" },
  { span: 6, aspect: "3 / 2"  },
  { span: 6, aspect: "3 / 2"  },
] as const;

interface WorkPageContentProps {
  caseStudies: CaseStudy[];
  projects: Project[];
}

/** Minimal tonal SVG placeholder shown when a project has no cover image */
function CoverPlaceholder({ fill, initial }: { fill: string; initial: string }) {
  return (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", display: "block", position: "absolute", inset: 0 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="500" height="500" fill={fill} />
      <rect x="0" y="0" width="500" height="280" fill="#cdc7be" opacity="0.5" />
      {/* Minimal abstract figure */}
      <ellipse cx="250" cy="460" rx="170" ry="88" fill="#7a7870" opacity="0.7" />
      <rect x="172" y="258" width="156" height="240" rx="14" fill="#8c8a84" opacity="0.8" />
      <rect x="214" y="155" width="72" height="108" rx="16" fill="#b4b0a8" />
      <ellipse cx="250" cy="142" rx="78" ry="85" fill="#bcb8b0" />
      <ellipse cx="250" cy="90"  rx="76" ry="60" fill="#222018" />
      {/* First letter of project */}
      <text
        x="250" y="320"
        textAnchor="middle"
        fontFamily={jakartaSans}
        fontSize="96"
        fontWeight="700"
        fill="var(--color-inverse)"
        opacity="0.18"
        letterSpacing="-2"
      >
        {initial}
      </text>
    </svg>
  );
}

// Soft tones that cycle for placeholders
const PLACEHOLDER_FILLS = ["#b8b0a6", "#a8a49c", "#d8d2c8", "#c4beb6", "#b0aca4", "#cac4bc"];

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const slot = GRID_PATTERN[index % GRID_PATTERN.length];
  const num  = String(index + 1).padStart(2, "0");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const raw = project.cover_image;
  const coverSrc = raw
    ? raw.startsWith("http")
      ? raw
      : supabaseUrl
        ? `${supabaseUrl}/storage/v1/object/public/media/${raw}`
        : null
    : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 21 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 6) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={`pf-item span-${slot.span}`}
      style={{ overflow: "hidden", cursor: "pointer" }}
    >
      <Link href={`/work/projects/${project.slug}`} style={{ textDecoration: "none", display: "block" }}>
        {/* Image */}
        <div className="group rounded-xl" style={{
          width: "100%",
          aspectRatio: slot.aspect,
          overflow: "hidden",
          backgroundColor: PLACEHOLDER_FILLS[index % PLACEHOLDER_FILLS.length],
          position: "relative",
          display: "block",
        }}>
          {coverSrc ? (
            <Image
              src={coverSrc}
              alt={project.title}
              fill
              className="object-fit transition-transform duration-700 group-hover:scale-[1.04] "
              sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 40vw"
            />
          ) : (
            <CoverPlaceholder
              fill={PLACEHOLDER_FILLS[index % PLACEHOLDER_FILLS.length]}
              initial={project.title.charAt(0)}
            />
          )}

          {/* Number badge */}
          <span style={{
            position: "absolute",
            top: "clamp(8px, 1vw, 14px)",
            left: "clamp(8px, 1vw, 14px)",
            fontSize: "11px",
            color: "var(--color-inverse)",
            fontFamily: jakartaSans,
            opacity: 0.7,
            letterSpacing: "0.06em",
            zIndex: 1,
          }}>
            
          </span>
        </div>

        {/* Title + subtitle */}
        <div style={{ padding: "clamp(8px, 1vw, 14px) 0 clamp(16px, 2vw, 28px)" }}>
          <p style={{
            fontFamily: jakartaSans,
            fontSize: "clamp(16px, 1.5vw, 22px)",
            color: "var(--color-heading)",
            fontWeight:400,
            margin: "0 0 3px",
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}>
            {project.title}
          </p>
          {project.subtitle && (
            <p style={{
              fontSize: "clamp(13px, 0.85vw, 14px)",
              color: "var(--color-body-secondary)",
              fontFamily: jakartaSans,
              margin: 0,
              letterSpacing: "0.02em",
              lineHeight: 1.5,
            }}>
              {project.subtitle}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function WorkPageContent({ projects, caseStudies }: WorkPageContentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [tab, setTab] = useState<"projects" | "case-studies">("projects");

  const yearRange = projects.length
    ? (() => {
        const years = projects.map(p => new Date(p.created_at).getFullYear());
        const min = Math.min(...years);
        const max = Math.max(...years);
        return min === max ? `${min}` : `${min} — ${max}`;
      })()
    : null;

  const csYearRange = caseStudies.length
    ? (() => {
        const years = caseStudies.map(cs => new Date(cs.created_at).getFullYear());
        const min = Math.min(...years);
        const max = Math.max(...years);
        return min === max ? `${min}` : `${min} — ${max}`;
      })()
    : null;

  return (
    <>
      <style>{`
        .pf-item.span-7 { grid-column: span 7; }
        .pf-item.span-5 { grid-column: span 5; }
        .pf-item.span-4 { grid-column: span 4; }
        .pf-item.span-8 { grid-column: span 8; }
        .pf-item.span-6 { grid-column: span 6; }

        .pf-header-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          padding-bottom: clamp(4px, 0.5vw, 10px);
        }

        @media (max-width: 720px) {
          .pf-item.span-7,
          .pf-item.span-5,
          .pf-item.span-4,
          .pf-item.span-8,
          .pf-item.span-6 { grid-column: span 12 !important; }
          .pf-header-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: clamp(12px, 3vw, 20px) !important;
          }
          /* Toggle left, year / count right — same row */
          .pf-header-controls {
            flex-direction: row !important;
            align-items: flex-end !important;
            justify-content: space-between !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .pf-header-meta { text-align: right !important; min-width: 0; }
          .pf-header-toggle { flex-shrink: 0; }
        }

        @media (min-width: 721px) and (max-width: 1080px) {
          .pf-item.span-7 { grid-column: span 6; }
          .pf-item.span-5 { grid-column: span 6; }
          .pf-item.span-4 { grid-column: span 6; }
          .pf-item.span-8 { grid-column: span 6; }
        }
      `}</style>

      <div ref={ref} style={{ paddingBottom: "89px" }}>

        {/* Page header */}
        <motion.div
          className="pf-header-row"
          initial={{ opacity: 0, y: 21 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "clamp(16px, 2vw, 28px)",
          }}
        >
          {/* Title — hidden on case studies tab */}
          {tab === "projects" ? (
            <div>
              <h1 style={{
                fontFamily: cormorantGaramond,
                fontSize: "clamp(48px, 7vw, 128px)",
                fontWeight: 300,
                color: "var(--color-heading)",
                letterSpacing: "-0.025em",
                lineHeight: 0.92,
                margin: 0,
              }}>
                Selected
              </h1>
              <h1 style={{
                fontFamily: cormorantGaramond,
                fontSize: "clamp(48px, 7vw, 128px)",
                fontWeight: 300,
                color: "var(--color-body-secondary)",
                letterSpacing: "-0.025em",
                lineHeight: 0.92,
                margin: 0,
                paddingLeft: "clamp(21px, 3vw, 48px)",
              }}>
                Work
              </h1>
            </div>
          ) : (
            <div>
              <h1 style={{
                fontFamily: cormorantGaramond,
                fontSize: "clamp(48px, 7vw, 128px)",
                fontWeight: 400,
                color: "var(--color-heading)",
                letterSpacing: "-0.025em",
                lineHeight: 0.92,
                margin: 0,
              }}>
                Case
              </h1>
              <h1 style={{
                fontFamily: cormorantGaramond,
                fontSize: "clamp(48px, 7vw, 128px)",
                fontWeight: 400,
                color: "var(--color-body-secondary)",
                letterSpacing: "-0.025em",
                lineHeight: 0.92,
                margin: 0,
                paddingLeft: "clamp(21px, 3vw, 48px)",
              }}>
                Studies
              </h1>
            </div>
          )}

          <div className="pf-header-controls">
            {/* Styled toggle */}
            <div
              className="pf-header-toggle"
              style={{
                display: "inline-flex",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
              }}
            >
              {(["projects", "case-studies"] as const).map((value, i) => (
                <button
                  key={value}
                  onClick={() => setTab(value)}
                  style={{
                    padding: "7px 18px",
                    fontFamily: jakartaSans,
                    fontSize: "clamp(11px, 0.85vw, 12px)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    cursor: "pointer",
                    border: "none",
                    borderLeft: i > 0 ? "1px solid var(--color-border)" : "none",
                    background: tab === value ? "var(--color-heading)" : "transparent",
                    color: tab === value ? "var(--color-page)" : "var(--color-body-secondary)",
                    transition: "background 0.18s, color 0.18s",
                  }}
                >
                  {value === "projects" ? "Projects" : "Case Studies"}
                </button>
              ))}
            </div>

            {/* Count */}
            {tab === "projects" && projects.length > 0 && (
              <div className="pf-header-meta" style={{ textAlign: "right" }}>
                {yearRange && (
                  <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px, 0.9vw, 14px)", color: "var(--color-body-secondary)", display: "block" }}>
                    {yearRange}
                  </span>
                )}
                <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px, 0.9vw, 14px)", color: "var(--color-body-secondary)", display: "block", marginTop: "4px" }}>
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
            {tab === "case-studies" && caseStudies.length > 0 && (
              <div className="pf-header-meta" style={{ textAlign: "right" }}>
                {csYearRange && (
                  <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px, 0.9vw, 14px)", color: "var(--color-body-secondary)", display: "block" }}>
                    {csYearRange}
                  </span>
                )}
                <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px, 0.9vw, 14px)", color: "var(--color-body-secondary)", display: "block", marginTop: "4px" }}>
                  {caseStudies.length} case {caseStudies.length !== 1 ? "studies" : "study"}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            height: "1px",
            backgroundColor: "var(--color-border-subtle)",
            marginBottom: "clamp(16px, 2.5vw, 40px)",
            transformOrigin: "left",
          }}
        />

        {/* Projects tab */}
        {tab === "projects" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 21 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                marginBottom: "clamp(21px, 3vw, 55px)",
              }}
            >
              <Link
                href="/apps/inkbar"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(116px, 180px)",
                  gap: "clamp(16px, 2vw, 34px)",
                  alignItems: "center",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface-raised)",
                  color: "inherit",
                  padding: "clamp(18px, 3vw, 34px)",
                  textDecoration: "none",
                }}
              >
                <div>
                  <p style={{
                    fontFamily: jakartaSans,
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-body-secondary)",
                    margin: "0 0 10px",
                  }}>
                    Apps
                  </p>
                  <h2 style={{
                    fontFamily: cormorantGaramond,
                    fontSize: "clamp(30px, 4vw, 56px)",
                    fontWeight: 400,
                    lineHeight: 1,
                    color: "var(--color-heading)",
                    margin: 0,
                  }}>
                    InkBar
                  </h2>
                  <p style={{
                    maxWidth: "54ch",
                    fontFamily: jakartaSans,
                    fontSize: "clamp(13px, 0.9vw, 15px)",
                    lineHeight: 1.6,
                    color: "var(--color-body-secondary)",
                    margin: "13px 0 0",
                  }}>
                    A cocktail spec scaler for iPhone. Scale, convert, batch, and keep house specs
                    in one offline app.
                  </p>
                </div>
                <div style={{
                  position: "relative",
                  aspectRatio: "1320 / 2868",
                  overflow: "hidden",
                  background: "#f7f2e8",
                  border: "1px solid var(--color-border-subtle)",
                }}>
                  <Image
                    src="/inkbar/scaler.png"
                    alt="InkBar cocktail scaler screen."
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              </Link>
            </motion.div>

            {projects.length === 0 ? (
              <p style={{ fontFamily: jakartaSans, fontSize: "14px", color: "var(--color-body-secondary)" }}>
                No projects to show yet.
              </p>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gap: "clamp(8px, 1.2vw, 21px)",
              }}>
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Case Studies tab */}
        {tab === "case-studies" && (
          caseStudies.length === 0 ? (
            <p style={{ fontFamily: jakartaSans, fontSize: "14px", color: "var(--color-body-secondary)" }}>
              No case studies published yet.
            </p>
          ) : (
            <CaseStudiesList items={caseStudies} />
          )
        )}
      </div>
    </>
  );
}
