"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { jakartaSans, cormorantGaramond } from "@/lib/font";
import type { WorkItem } from "@/lib/work";

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
  items: WorkItem[];
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

function WorkCard({
  item,
  index,
}: {
  item: WorkItem;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const slot = GRID_PATTERN[index % GRID_PATTERN.length];
  const meta = [String(item.year), item.role].filter(Boolean).join(" · ");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 21 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: (index % 6) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={`pf-item span-${slot.span}`}
      style={{ overflow: "hidden", cursor: "pointer" }}
    >
      <Link href={`/work/${item.slug}`} style={{ textDecoration: "none", display: "block" }}>
        {/* Image */}
        <div className="group rounded-xl" style={{
          width: "100%",
          aspectRatio: slot.aspect,
          overflow: "hidden",
          backgroundColor: PLACEHOLDER_FILLS[index % PLACEHOLDER_FILLS.length],
          position: "relative",
          display: "block",
        }}>
          {item.cover ? (
            <Image
              src={item.cover.src}
              alt={item.title}
              fill
              className={`${item.cover.variant === "inline" ? "object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-[1.04]`}
              sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 40vw"
            />
          ) : (
            <CoverPlaceholder
              fill={PLACEHOLDER_FILLS[index % PLACEHOLDER_FILLS.length]}
              initial={item.title.charAt(0)}
            />
          )}

          {/* "Case study" badge — tells visitors there's a full write-up behind this card */}
          {item.readingMinutes && (
            <span style={{
              position: "absolute",
              top: "clamp(8px, 1vw, 14px)",
              left: "clamp(8px, 1vw, 14px)",
              zIndex: 1,
              fontFamily: jakartaSans,
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-heading)",
              background: "var(--color-page)",
              padding: "4px 9px",
              borderRadius: "999px",
              opacity: 0.92,
            }}>
              Case study · {item.readingMinutes} min
            </span>
          )}
        </div>

        {/* Meta + title + subtitle */}
        <div style={{ padding: "clamp(8px, 1vw, 14px) 0 clamp(16px, 2vw, 28px)" }}>
          <p style={{
            fontFamily: jakartaSans,
            fontSize: "clamp(11px, 0.8vw, 12px)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-body-tertiary)",
            fontWeight: 500,
            margin: "0 0 6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }} title={meta}>
            {meta}
          </p>
          <p style={{
            fontFamily: jakartaSans,
            fontSize: "clamp(16px, 1.5vw, 22px)",
            color: "var(--color-heading)",
            fontWeight:400,
            margin: "0 0 3px",
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}>
            {item.title}
          </p>
          {item.subtitle && (
            <p style={{
              fontSize: "clamp(13px, 0.85vw, 14px)",
              color: "var(--color-body-secondary)",
              fontFamily: jakartaSans,
              margin: 0,
              letterSpacing: "0.02em",
              lineHeight: 1.5,
            }}>
              {item.subtitle}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function WorkPageContent({ items }: WorkPageContentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const years = items.map((i) => i.year);
  const yearRange = years.length
    ? Math.min(...years) === Math.max(...years)
      ? `${years[0]}`
      : `${Math.min(...years)} — ${Math.max(...years)}`
    : null;
  const storyCount = items.filter((i) => i.readingMinutes).length;

  return (
    <>
      <style>{`
        .pf-item.span-7 { grid-column: span 7; }
        .pf-item.span-5 { grid-column: span 5; }
        .pf-item.span-4 { grid-column: span 4; }
        .pf-item.span-8 { grid-column: span 8; }
        .pf-item.span-6 { grid-column: span 6; }

        @media (max-width: 720px) {
          .pf-item.span-7,
          .pf-item.span-5,
          .pf-item.span-4,
          .pf-item.span-8,
          .pf-item.span-6 { grid-column: span 12 !important; }
          .pf-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: clamp(12px, 3vw, 20px) !important;
          }
          .pf-header-meta { text-align: left !important; }
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

          {items.length > 0 && (
            <div className="pf-header-meta" style={{ textAlign: "right", paddingBottom: "clamp(4px, 0.5vw, 10px)" }}>
              {yearRange && (
                <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px, 0.9vw, 14px)", color: "var(--color-body-secondary)", display: "block" }}>
                  {yearRange}
                </span>
              )}
              <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px, 0.9vw, 14px)", color: "var(--color-body-secondary)", display: "block", marginTop: "4px" }}>
                {items.length} {items.length === 1 ? "piece" : "pieces"} of work
                {storyCount > 0 && storyCount < items.length && ` · ${storyCount} with case studies`}
              </span>
            </div>
          )}
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

        {items.length === 0 ? (
          <p style={{ fontFamily: jakartaSans, fontSize: "14px", color: "var(--color-body-secondary)" }}>
            No work to show yet.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "clamp(8px, 1.2vw, 21px)",
          }}>
            {items.map((item, i) => (
              <WorkCard key={item.slug} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Apps — products rather than client/case-study work, so they sit apart */}
        <section style={{ marginTop: "clamp(34px, 5vw, 89px)" }}>
          <p style={{
            fontFamily: jakartaSans,
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-body-secondary)",
            margin: "0 0 clamp(12px, 1.4vw, 20px)",
          }}>
            Apps
          </p>
          <Link
            href="/apps/inkbar"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(72px, 110px)",
              gap: "clamp(16px, 2vw, 34px)",
              alignItems: "center",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface-raised)",
              color: "inherit",
              padding: "clamp(14px, 2vw, 24px)",
              textDecoration: "none",
              maxWidth: "46rem",
            }}
          >
            <div>
              <h2 style={{
                fontFamily: cormorantGaramond,
                fontSize: "clamp(26px, 3vw, 40px)",
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
                margin: "10px 0 0",
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
                sizes="110px"
              />
            </div>
          </Link>
        </section>
      </div>
    </>
  );
}
