"use client";

import { useState } from "react";
import MobileToc from "./MobileToc";
import ProjectPhotoLightbox from "./ProjectPhotoLightbox";
import Image from "next/image";
import Link from "next/link";
import { jakartaSans, cormorantGaramond } from "@/lib/font";
import type { Project, CaseStudy } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function resolveUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("http")) return raw;
  return `${supabaseUrl}/storage/v1/object/public/media/${raw}`;
}

function normalizeHref(url: string | null | undefined): string | null {
  if (!url) return null;
  const t = url.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "clamp(10px, 0.8vw, 12px)", color: "var(--color-body-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: jakartaSans, marginBottom: 8 }}>
      {children}
    </p>
  );
}

function MetaValue({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: jakartaSans, fontSize: "clamp(15px, 1.3vw, 20px)", color: "var(--color-heading)", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--color-border)" }} />;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={{ width: 11, height: 11, flexShrink: 0 }}>
      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CoverPlaceholder({ initial }: { initial: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #c4beb6 0%, #a8a49c 40%, #8a8880 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: jakartaSans, fontSize: "clamp(4rem, 12vw, 10rem)", fontWeight: 700, color: "var(--color-inverse)", opacity: 0.18 }}>
        {initial}
      </span>
    </div>
  );
}

function GalleryImage({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#c4beb6", ...style }}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 900px) 100vw, 55vw" />
    </div>
  );
}

function RelatedCard({ cs }: { cs: CaseStudy }) {
  const thumb = (cs.cover_path ? resolveUrl(cs.cover_path) : null) ?? (cs.gallery?.[0] ? resolveUrl(cs.gallery[0]) : null);
  const fills = ["#a8a49c", "#d8d2c8", "#cac4bc", "#b8b2aa"];
  const fill  = fills[cs.title.charCodeAt(0) % fills.length];

  return (
    <Link href={`/work/${cs.slug}`} style={{ textDecoration: "none", display: "block", cursor: "pointer" }}>
      <div style={{ width: "100%", aspectRatio: "4 / 3", background: fill, overflow: "hidden", position: "relative" }}>
        {thumb ? (
          <Image src={thumb} alt={cs.title} fill className="object-cover" sizes="(max-width: 900px) 50vw, 25vw" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: jakartaSans, fontSize: "clamp(2rem, 4vw, 4rem)", fontWeight: 700, color: "var(--color-inverse)", opacity: 0.3 }}>
              {cs.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div style={{ paddingTop: "clamp(8px, 0.8vw, 12px)" }}>
        <p style={{ fontFamily: jakartaSans, fontSize: "clamp(14px, 1.2vw, 18px)", color: "var(--color-heading)", fontWeight: 500, margin: "0 0 3px", letterSpacing: "0.007em" }}>
          {cs.title}
        </p>
        {cs.tags && cs.tags.length > 0 && (
          <p style={{ fontSize: "clamp(10px, 0.8vw, 12px)", color: "var(--color-body-secondary)", fontFamily: jakartaSans, margin: 0, letterSpacing: "0.02em" }}>
            {cs.tags.slice(0, 2).join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── In-page navigation ───────────────────────────────────────────────────────

function PageNav({ sections }: { sections: { id: string; label: string }[] }) {
  if (sections.length === 0) return null;
  return (
    <div>
      <p style={{ fontSize: "10px", color: "var(--color-body-secondary)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: jakartaSans, marginBottom: 14 }}>
        On this page
      </p>
      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            style={{
              fontSize: "clamp(11px, 0.9vw, 13px)",
              color: "var(--color-body-secondary)",
              fontFamily: jakartaSans,
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "color 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--color-heading)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--color-body-secondary)")}
          >
            <span style={{ width: 14, height: 1, background: "currentColor", flexShrink: 0, display: "inline-block" }} />
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectPage({ project }: { project: Project }) {
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const coverSrc  = resolveUrl(project.cover_image);
  const logoSrc   = resolveUrl(project.logo);
  const liveUrl   = normalizeHref(project.live_url);
  const githubUrl = normalizeHref(project.github_url);
  const year      = new Date(project.created_at).getFullYear();
  const tech      = project.tech_stack ?? [];
  const media     = (project.project_media ?? []).filter(m => m.type === "image");
  const videos    = (project.project_media ?? []).filter(m => m.type === "video");
  const galleryResolvedUrls = media.map(m => resolveUrl(m.url) ?? m.url);
  const related   = project.relatedCaseStudies ?? [];

  // First 3 images shown by default: 1 wide + 2 square
  const visibleMedia  = galleryExpanded ? media : media.slice(0, 3);
  const hiddenCount   = media.length - 3;

  // Build in-page nav based on what sections actually exist
  const sections: { id: string; label: string }[] = [];
  if (project.short_description) sections.push({ id: "pd-overview",  label: "Overview" });
  if (media.length > 0)          sections.push({ id: "pd-photos",    label: "Photos" });
  if (videos.length > 0)         sections.push({ id: "pd-video",     label: "Video" });
  if (related.length > 0)        sections.push({ id: "pd-related",   label: "Case studies" });

  const sectionLabel: React.CSSProperties = {
    fontSize: "clamp(10px, 0.8vw, 12px)",
    color: "var(--color-body-secondary)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: jakartaSans,
    marginBottom: "clamp(16px, 1.8vw, 24px)",
  };

  return (
    <>
      <style>{`
        .pd-tag {
          font-size: clamp(11px, 0.85vw, 13px);
          color: var(--color-heading);
          border: 1px solid var(--color-border-strong);
          padding: 6px 14px;
          font-family: ${jakartaSans};
          letter-spacing: 0.03em;
          background: transparent;
        }
        .pd-meta-link {
          font-family: ${jakartaSans};
          font-size: clamp(13px, 1vw, 15px);
          color: var(--color-link);
          text-decoration: underline;
          text-underline-offset: 4px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .pd-view-more-btn {
          background: transparent;
          border: 1px solid var(--color-border-strong);
          padding: clamp(10px, 1.2vw, 16px) clamp(20px, 2.5vw, 36px);
          font-size: clamp(11px, 0.9vw, 13px);
          font-family: ${jakartaSans};
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          color: var(--color-heading);
          transition: background 0.2s, color 0.2s;
        }
        .pd-view-more-btn:hover { background: var(--color-heading); color: var(--color-inverse); }

        .pd-gallery-thumb {
          padding: 0; border: none; margin: 0; width: 100%; cursor: pointer; display: block;
          text-align: left; background: transparent; font: inherit; color: inherit;
          transition: opacity 0.2s;
        }
        .pd-gallery-thumb:hover { opacity: 0.92; }
        .pd-gallery-thumb:focus-visible {
          outline: 2px solid var(--color-heading);
          outline-offset: 3px;
        }

        /* Back link */
        .pd-back-link:hover { color: var(--color-heading); }

        /* In-page nav link classes (used by MobileToc) */
        .pd-nav-link { font-size:clamp(11px,0.9vw,13px); color:var(--color-body-secondary); font-family:${jakartaSans}; text-decoration:none; letter-spacing:0.01em; display:flex; align-items:center; gap:8px; transition:color 0.15s; }
        .pd-nav-link:hover { color:var(--color-heading); }
        .pd-nav-dash { width:14px; height:1px; background:currentColor; flex-shrink:0; display:inline-block; }

        /* Mobile sticky TOC */
        .pd-mobile-toc { display: none; }
        .pd-mobile-toc-summary {
          list-style: none; display: flex; align-items: center; justify-content: space-between;
          padding: 12px 0; cursor: pointer; font-size: 10px; color: var(--color-body-secondary);
          letter-spacing: 0.14em; text-transform: uppercase;
          font-family: ${jakartaSans}; user-select: none;
        }
        .pd-mobile-toc-summary::-webkit-details-marker { display: none; }
        .pd-mobile-toc-nav { padding-bottom: 14px; display: flex; flex-direction: column; gap: 10px; }

        @media (max-width: 900px) {
          .pd-body-grid    { grid-template-columns: 1fr !important; }
          .pd-sidebar      { position: static !important; order: -1; }
          .pd-desktop-toc  { display: none; }
          .pd-mobile-toc   {
            display: block; position: sticky; top: 0; z-index: 10;
            background: var(--color-page);
            border-bottom: 1px solid var(--color-border-subtle);
            margin-bottom: clamp(24px, 3vw, 44px);
          }
          #pd-overview, #pd-photos, #pd-video, #pd-tech, #pd-related {
            scroll-margin-top: var(--mobile-toc-height, 56px);
          }
          .pd-related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .pd-photos-grid  { grid-template-columns: 1fr !important; }
          .pd-photo-wide   { grid-column: span 1 !important; aspect-ratio: 4/3 !important; }
          .pd-related-grid { grid-template-columns: 1fr !important; }
          .pd-title-row    { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div style={{ paddingBottom: "89px", fontFamily: jakartaSans }}>

        {/* Breadcrumb / back */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px,1vw,12px)", marginBottom: "clamp(20px,2.5vw,32px)" }}>
          <Link
            href="/work"
            className="pd-back-link"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              color: "var(--color-body-secondary)", textDecoration: "none",
              fontFamily: jakartaSans, fontSize: "clamp(12px, 0.85vw, 13px)",
              letterSpacing: "0.04em", padding: "6px 0", transition: "color 0.15s",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Work
          </Link>
          <span style={{ color: "var(--color-border-strong)", fontSize: "12px", userSelect: "none" }}>/</span>
          <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px, 0.85vw, 13px)", color: "var(--color-heading)", letterSpacing: "0.04em" }}>
            {project.title}
          </span>
        </div>

        {/* Title row */}
        <div
          className="pd-title-row"
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: "clamp(6px, 1vw, 16px)", flexWrap: "wrap" }}
        >
          <h1 style={{ fontFamily: cormorantGaramond, fontWeight: 600, fontSize: "clamp(40px, 7vw, 96px)", color: "var(--color-heading)", letterSpacing: "-0.025em", lineHeight: 0.9 }}>
            {project.title}
          </h1>

          <div style={{
            width: "clamp(44px, 4vw, 64px)",
            height: "clamp(44px, 4vw, 64px)",
            background: "var(--color-heading)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginBottom: "clamp(4px, 0.5vw, 8px)",
            position: "relative",
            overflow: "hidden",
          }}>
            {logoSrc ? (
              <Image src={logoSrc} alt={`${project.title} logo`} fill className="object-cover" sizes="64px" />
            ) : (
              <span style={{ color: "var(--color-inverse)", fontSize: "clamp(14px, 1.4vw, 22px)", fontWeight: 700, fontFamily: jakartaSans }}>
                {project.title.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {project.subtitle && (
          <p style={{ fontFamily: jakartaSans, fontSize: "clamp(18px, 2vw, 28px)", color: "var(--color-body-secondary)", fontWeight: 300, marginBottom: "clamp(24px, 3vw, 44px)", letterSpacing: "0" }}>
            {project.subtitle}
          </p>
        )}

        {/* Cover */}
        <div style={{ width: "100%", aspectRatio: "16 / 7", background: "#b8b2aa", overflow: "hidden", position: "relative", marginBottom: "clamp(28px, 4vw, 56px)" }}>
          {coverSrc ? (
            <Image src={coverSrc} alt={project.title} fill className="object-cover" priority sizes="100vw" />
          ) : (
            <CoverPlaceholder initial={project.title.charAt(0)} />
          )}
        </div>

        {/* Mobile sticky TOC — hidden on desktop, sticky bar on mobile */}
        {sections.length > 1 && (
          <MobileToc
            sections={sections}
            wrapperClass="pd-mobile-toc"
            summaryClass="pd-mobile-toc-summary"
            navClass="pd-mobile-toc-nav"
            linkClass="pd-nav-link"
            dashClass="pd-nav-dash"
          />
        )}

        {/* Body grid: content | sidebar */}
        {/* Body grid — golden ratio: 55fr main / 34fr sidebar (φ = 55/34 ≈ 1.618).
            Gap clamp bounds changed to Fibonacci: 32→34px min, 72→55px max. */}
        <div
          className="pd-body-grid"
          style={{ display: "grid", gridTemplateColumns: "55fr 34fr", gap: "clamp(34px, 5vw, 55px)", alignItems: "start" }}
        >
          {/* ── Left ── */}
          <div>
            {project.short_description && (
              <p id="pd-overview" style={{ fontSize: "clamp(14px, 1.15vw, 18px)", color: "var(--color-body)", lineHeight: 1.65, fontFamily: jakartaSans, fontWeight: 400, marginBottom: "clamp(32px, 4vw, 56px)", maxWidth: "var(--measure-reading)" }}>
                {project.short_description}
              </p>
            )}

            {/* Photos */}
            {media.length > 0 && (
              <div id="pd-photos" style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}>
                <p style={sectionLabel}>Project photos</p>
                {/* gap: 16px→13px (fib); margin-bottom: 16px→13px, 24px→21px (fib) */}
                <div
                  className="pd-photos-grid"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1.2vw, 13px)", marginBottom: hiddenCount > 0 && !galleryExpanded ? "clamp(13px, 1.5vw, 21px)" : 0 }}
                >
                  {visibleMedia.map((m, globalIdx) => {
                    const src = galleryResolvedUrls[globalIdx] ?? resolveUrl(m.url) ?? m.url;
                    return (
                      <button
                        key={`${m.url}-${globalIdx}`}
                        type="button"
                        className="pd-gallery-thumb"
                        aria-label={`Open photo ${globalIdx + 1} of ${media.length} in full screen`}
                        onClick={() => setLightboxIndex(globalIdx)}
                        style={globalIdx === 0
                          ? { gridColumn: "span 2", aspectRatio: "16 / 9" } as React.CSSProperties
                          : { aspectRatio: "4 / 3" }
                        }
                      >
                        <GalleryImage
                          src={src}
                          alt={`${project.title} photo ${globalIdx + 1}`}
                          style={{ width: "100%", height: "100%", minHeight: 0 }}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Expand / collapse */}
                {media.length > 3 && (
                  <button
                    className="pd-view-more-btn"
                    onClick={() => setGalleryExpanded(v => !v)}
                  >
                    {galleryExpanded
                      ? "Show less"
                      : `View all photos  (+${hiddenCount})`}
                  </button>
                )}
              </div>
            )}

            {/* Video */}
            {videos.length > 0 && (
              <div id="pd-video" style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}>
                <p style={sectionLabel}>Video</p>
                <div style={{ display: "grid", gap: "clamp(8px, 1.2vw, 16px)" }}>
                  {videos.map((v, i) => (
                    <video key={i} src={v.url} controls style={{ width: "100%", display: "block" }} />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── Sidebar ── */}
          <aside className="pd-sidebar" style={{ position: "sticky", top: 32, display: "flex", flexDirection: "column", gap: "clamp(20px, 2.2vw, 32px)" }}>

            {/* Meta details */}
            <div>
              <MetaLabel>Year</MetaLabel>
              <MetaValue>{year}</MetaValue>
            </div>

            {project.role && (
              <>
                <Divider />
                <div>
                  <MetaLabel>Role</MetaLabel>
                  <MetaValue>{project.role}</MetaValue>
                </div>
              </>
            )}

            {project.timeline && (
              <>
                <Divider />
                <div>
                  <MetaLabel>Timeline</MetaLabel>
                  <MetaValue>{project.timeline}</MetaValue>
                </div>
              </>
            )}

            {liveUrl && (
              <>
                <Divider />
                <div>
                  <MetaLabel>Live site</MetaLabel>
                  <a className="pd-meta-link" href={liveUrl} target="_blank" rel="noreferrer">
                    {liveUrl.replace(/^https?:\/\//, "")}
                    <ArrowIcon />
                  </a>
                </div>
              </>
            )}

            {githubUrl && (
              <>
                <Divider />
                <div>
                  <MetaLabel>GitHub</MetaLabel>
                  <a className="pd-meta-link" href={githubUrl} target="_blank" rel="noreferrer">
                    {githubUrl.replace(/^https?:\/\//, "")}
                    <ArrowIcon />
                  </a>
                </div>
              </>
            )}

            {/* Tech stack */}
            {tech.length > 0 && (
              <>
                <Divider />
                <div id="pd-tech">
                  <MetaLabel>Tools &amp; technology</MetaLabel>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                    {tech.map(t => <span key={t} className="pd-tag">{t}</span>)}
                  </div>
                </div>
              </>
            )}

            {/* In-page navigation — hidden on mobile (mobile TOC is sticky above) */}
            <div className="pd-desktop-toc">
              {sections.length > 1 && (
                <>
                  <Divider />
                  <PageNav sections={sections} />
                </>
              )}
            </div>
          </aside>
        </div>

        {/* Related case studies */}
        {related.length > 0 && (
          <>
            <div id="pd-related" style={{ height: 1, background: "var(--color-border)", margin: "clamp(32px, 4vw, 56px) 0 0" }} />
            <div style={{ marginTop: "clamp(24px, 3vw, 44px)" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(16px, 1.8vw, 24px)" }}>
                <p style={{ ...sectionLabel, marginBottom: 0 }}>Related case studies</p>
                <Link href="/work" style={{ fontSize: "clamp(11px, 0.85vw, 13px)", color: "var(--color-link)", textDecoration: "underline", textUnderlineOffset: "4px", fontFamily: jakartaSans }}>
                  View all
                </Link>
              </div>
              <div
                className="pd-related-grid"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(12px, 1.5vw, 24px)" }}
              >
                {related.map(cs => <RelatedCard key={cs.id} cs={cs} />)}
              </div>
            </div>
          </>
        )}

        {lightboxIndex !== null && galleryResolvedUrls.length > 0 && (
          <ProjectPhotoLightbox
            images={galleryResolvedUrls}
            projectTitle={project.title}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        )}
      </div>
    </>
  );
}
