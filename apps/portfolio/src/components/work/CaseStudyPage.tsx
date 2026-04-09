import Image from "next/image";
import Link from "next/link";
import { jakartaSans, cormorantGaramond } from "@/lib/font";
import type { CaseStudy, Project } from "@/lib/types";
import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";
import CaseStudyMediaBlocks from "./CaseStudyMediaBlocks";
import MobileToc from "./MobileToc";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function mediaUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

function asStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function sanitizeMd(md: string): string {
  return md
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "\n")
    .replace(/<[^>\n]+\/>/g, "\n")
    .replace(/<\/?[A-Za-z][^>\n]*>/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function slugify(text: string): string {
  return "cs-md-" + text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
}

/** Extract H2 headings from raw markdown for the "On this page" nav. */
function extractMdHeadings(md: string): { id: string; label: string }[] {
  return md.split("\n")
    .filter(line => /^##\s/.test(line))
    .map(line => ({ label: line.replace(/^##\s+/, "").trim(), id: "" }))
    .map(h => ({ ...h, id: slugify(h.label) }));
}

/** Inject id attributes into rendered h1/h2/h3 tags based on their text content. */
function injectHeadingIds(html: string): string {
  return html.replace(/<(h[1-3])([^>]*)>([\s\S]*?)<\/\1>/gi, (_, tag, attrs, content) => {
    const text = content.replace(/<[^>]+>/g, "").trim();
    const id = slugify(text);
    return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
  });
}

// Markdown class config — styled via .cs-prose-* in <style> block
const mdConfig: MarkdownParserConfig = {
  h1: "cs-h1",
  h2: "cs-h2",
  h3: "cs-h3",
  p: "cs-p",
  ul: "cs-ul",
  li: "cs-li",
  blockquote: "cs-blockquote",
  strong: "cs-strong",
  em: "cs-em",
  a: "cs-a",
  code: "cs-code",
  pre: "cs-pre",
  hr: "cs-hr",
  img: "cs-md-img",
  imgBorder: "cs-md-img-border",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "var(--text-label)",
      color: "var(--color-body-secondary)",
      letterSpacing: "var(--tracking-caps)",
      textTransform: "uppercase",
      fontFamily: jakartaSans,
      margin: 0,
      marginBottom: "var(--fib-8)",
    }}>
      {children}
    </p>
  );
}

function SidebarDivider({ className }: { className?: string }) {
  return (
    <div
      className={className ? `cs-sidebar-divider ${className}` : "cs-sidebar-divider"}
      aria-hidden
    />
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={{ width: "var(--fib-13)", height: "var(--fib-13)", flexShrink: 0 }}>
      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PageNav({ sections }: { sections: { id: string; label: string }[] }) {
  if (sections.length < 2) return null;
  return (
    <div className="cs-sidebar-meta-row">
      <SidebarLabel>On this page</SidebarLabel>
      <nav className="cs-page-nav" aria-label="On this page">
        {sections.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className="cs-nav-link">
            <span className="cs-nav-dash" />
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function RelatedProjectCard({ project }: { project: Project }) {
  const cover = project.cover_image ? mediaUrl(project.cover_image) : null;
  const fills = ["#a8a49c", "#d8d2c8", "#cac4bc", "#b8b2aa"];
  const fill  = fills[project.title.charCodeAt(0) % fills.length];
  return (
    <Link href={`/work/projects/${project.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{ width: "100%", aspectRatio: "16/9", background: fill, overflow: "hidden", position: "relative" }}>
        {cover ? (
          <Image src={cover} alt={project.title} fill className="object-cover" sizes="(max-width:900px) 50vw, 25vw" />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: jakartaSans, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 700, color: "var(--color-inverse)", opacity: 0.3 }}>
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div style={{ paddingTop: "clamp(6px,0.6vw,10px)" }}>
        <p style={{ fontFamily: jakartaSans, fontSize: "clamp(13px,1vw,16px)", color: "var(--color-heading)", fontWeight: 600, margin: "0 0 2px", letterSpacing: "-0.01em" }}>
          {project.title}
        </p>
        {project.subtitle && (
          <p style={{ fontSize: "clamp(10px,0.75vw,11px)", color: "var(--color-body-secondary)", fontFamily: jakartaSans, margin: 0 }}>
            {project.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  const tags          = asStrings(caseStudy.tags);
  const stack         = asStrings(caseStudy.stack);
  const gallery       = asStrings(caseStudy.gallery).map(mediaUrl);
  const coverSrc      = caseStudy.cover_path ? mediaUrl(caseStudy.cover_path) : gallery[0] ?? null;
  const screenshots   = gallery.slice(0, 4);
  const ba            = caseStudy.before_after ?? null;
  const relatedProjects = caseStudy.relatedProjects ?? [];

  // Links from the links[] array
  const links    = caseStudy.links ?? [];
  const liveLink = links.find(l => l.type === "live" || l.label?.toLowerCase().includes("live") || l.label?.toLowerCase().includes("site"));
  const ghLink   = links.find(l => l.type === "github" || l.label?.toLowerCase().includes("github") || l.label?.toLowerCase().includes("git"));

  const subtitle = caseStudy.summary ?? null;

  const statsBarItems: (
    | { label: string; type: "text"; value: string }
    | { label: string; type: "link"; href: string; text: string }
  )[] = [
    ...(caseStudy.timeline
      ? [{ label: "Timeline", type: "text" as const, value: caseStudy.timeline }]
      : []),
    ...(liveLink
      ? [{
          label: "Live site",
          type: "link" as const,
          href: liveLink.url,
          text: liveLink.url.replace(/^https?:\/\//, ""),
        }]
      : []),
  ];

  // Two-line title: first word large, rest indented
  const titleWords = caseStudy.title.split(" ");
  const titleLine1 = titleWords[0];
  const titleLine2 = titleWords.length > 1 ? titleWords.slice(1).join(" ") : null;

  // Markdown
  const sanitized = caseStudy.content_md ? sanitizeMd(caseStudy.content_md) : "";
  const mdHtml = sanitized ? injectHeadingIds(renderMarkdown(sanitized, mdConfig)) : "";
  const mdHeadings = sanitized ? extractMdHeadings(sanitized) : [];

  // In-page nav sections — markdown H2s first, then fixed sections
  const sections: { id: string; label: string }[] = [
    ...mdHeadings,
    ...((ba?.beforeImage || ba?.afterImage) ? [{ id: "cs-before-after", label: "Before / After" }] : []),
    ...(screenshots.length > 0 ? [{ id: "cs-gallery", label: "Gallery" }] : []),
    ...(stack.length > 0 ? [{ id: "cs-stack", label: "Technology" }] : []),
    ...(relatedProjects.length > 0 ? [{ id: "cs-related", label: "Related" }] : []),
  ];

  const sectionLabel: React.CSSProperties = {
    fontSize: "clamp(10px,0.8vw,12px)", color: "var(--color-body-secondary)",
    letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: jakartaSans,
  };

  return (
    <>
      <style>{`
        /* Markdown prose */
        .cs-h1,.cs-h2,.cs-h3 { font-family:${cormorantGaramond}; color:var(--color-heading); letter-spacing:-0.02em; }
        .cs-h1 { font-size:clamp(28px,3vw,58px); font-weight:400; margin:clamp(32px,4vw,56px) 0 clamp(12px,1.2vw,18px); line-height:1.05; }
        .cs-h2 { font-size:clamp(22px,2.4vw,46px); font-weight:700; margin:clamp(28px,3.5vw,52px) 0 clamp(12px,1.2vw,18px); line-height:1.18; }
        .cs-h3 { font-size:clamp(18px,1.8vw,34px); font-weight:500; margin:clamp(20px,2.5vw,36px) 0 clamp(8px,0.8vw,12px); line-height:1.25; }
        .cs-p  { font-size:clamp(17px,calc(13.67px + 0.434vw),22px); color:var(--color-body); line-height:1.65; letter-spacing:0; font-family:${jakartaSans}; margin-bottom:clamp(14px,1.4vw,20px); }
        .cs-ul { padding-left:0; list-style:none; margin-bottom:clamp(14px,1.4vw,20px); }
        .cs-li { font-size:clamp(17px,calc(13.67px + 0.434vw),22px); color:var(--color-body); line-height:1.65; font-family:${jakartaSans}; padding-left:20px; position:relative; margin-bottom:8px; }
        .cs-li::before { content:'–'; position:absolute; left:0; color:var(--color-body-secondary); }
        .cs-blockquote { border-left:3px solid var(--color-heading); padding:clamp(12px,1.5vw,20px) clamp(16px,2vw,28px); margin:clamp(24px,3vw,40px) 0; }
        .cs-blockquote .cs-p { font-family:${cormorantGaramond}; font-size:clamp(18px,1.8vw,34px); color:var(--color-heading); font-style:italic; line-height:1.6; margin:0; }
        .cs-strong { font-weight:600; color:var(--color-heading); }
        .cs-em { font-style:italic; }
        .cs-a  { color:var(--color-link); text-decoration:underline; text-underline-offset:3px; }
        .cs-code { font-size:0.875em; background:var(--color-surface); padding:2px 6px; font-family:${jakartaSans}; }
        .cs-pre  { background:var(--color-surface-elevated); color:var(--color-inverse); padding:clamp(14px,1.5vw,20px); overflow-x:auto; margin:clamp(16px,2vw,24px) 0; font-size:13px; line-height:1.6; font-family:${jakartaSans}; }
        .cs-hr   { border:none; border-top:1px solid var(--color-border-subtle); margin:clamp(24px,3vw,40px) 0; }

        /* Markdown inline images — cap height (portraits) on small viewports */
        .theview-md-img-wrap { display:block; margin:clamp(22px,2.8vw,32px) 0; text-align:center; }
        .theview-md-img-wrap .cs-md-img { display:inline-block; vertical-align:middle; max-width:100%; width:auto; height:auto; max-height:min(80vh,900px); object-fit:contain; object-position:center; border-radius:8px; }
        .theview-md-img-wrap .cs-md-img-border { border:1px solid var(--color-border-subtle); }
        @media (max-width:900px) { .theview-md-img-wrap .cs-md-img { max-height:min(68dvh,520px); } }

        /* Before/after + gallery — intrinsic aspect (portrait + landscape), contain; lightbox for full screen */
        .cs-case-thumb-btn { padding:0; border:none; margin:0; width:100%; cursor:pointer; display:block; text-align:center; background:transparent; font:inherit; transition:opacity 0.2s; }
        .cs-case-thumb-btn:hover { opacity:0.92; }
        .cs-case-thumb-btn:focus-visible { outline:2px solid var(--color-heading); outline-offset:3px; }
        .cs-case-ba-frame, .cs-case-gallery-frame {
          display:flex; align-items:center; justify-content:center; width:100%;
          background:var(--color-surface); border-radius:4px; overflow:hidden;
        }
        .cs-case-ba-img, .cs-case-gallery-img {
          width:100%; max-width:100%; height:auto; display:block; object-fit:contain;
        }
        .cs-case-ba-img { max-height:min(78vh,900px); }
        .cs-case-gallery-img { max-height:min(70vh,760px); }
        .cs-case-gallery-lead .cs-case-gallery-img { max-height:min(80vh,920px); }
        .cs-case-gallery-lead { grid-column:span 2; }
        @media (max-width:600px) { .cs-case-gallery-lead { grid-column:auto; } }
        @media (max-width:900px) {
          .cs-case-ba-img { max-height:min(66dvh,640px); }
          .cs-case-gallery-img { max-height:min(54dvh,480px); }
          .cs-case-gallery-lead .cs-case-gallery-img { max-height:min(58dvh,540px); }
        }

        /* Tags + tool pills */
        .cs-tag, .cs-tool {
          font-size: clamp(10px,0.8vw,12px); color:var(--color-heading);
          border:1px solid var(--color-border-strong); padding:5px 12px;
          font-family:${jakartaSans}; letter-spacing:0.06em; text-transform:uppercase;
        }
        .cs-tool { font-size:clamp(11px,0.85vw,13px); letter-spacing:0.03em; text-transform:none; padding:6px 14px; }

        /* Sticky aside — tokens only (no inline hardcoded px) */
        .cs-sidebar {
          position: sticky;
          top: calc(4 * var(--fib-8));
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .cs-sidebar-stack {
          display: flex;
          flex-direction: column;
          gap: var(--fib-21);
        }

        /* Horizontal rules — explicit separators; spacing comes from parent flex gap */
        .cs-sidebar-divider {
          height: 1px;
          margin: 0;
          flex-shrink: 0;
          width: 100%;
          border: none;
          background: var(--color-border);
        }

        /* Sidebar link */
        .cs-sidebar-link { font-family:${jakartaSans}; font-size:clamp(12px,0.95vw,14px); color:var(--color-link); text-decoration:underline; text-underline-offset:4px; display:inline-flex; align-items:center; gap:var(--fib-8); }

        .cs-page-nav {
          display: flex;
          flex-direction: column;
          gap: var(--fib-8);
          margin: 0;
          padding: 0;
        }

        /* In-page nav — matches global nav/caption scale */
        .cs-nav-link {
          font-size: var(--text-nav-size);
          line-height: var(--leading-ui);
          color: var(--color-body-secondary);
          font-family: ${jakartaSans};
          text-decoration: none;
          letter-spacing: var(--tracking-ui);
          display: flex;
          align-items: center;
          gap: var(--fib-8);
          transition: color 0.15s;
        }
        .cs-nav-link:hover { color:var(--color-heading); }
        .cs-nav-dash { width:var(--fib-13); height:1px; background:currentColor; flex-shrink:0; display:inline-block; }

        /* Back link */
        .cs-back-link:hover { color: var(--color-heading); }

        /* Scroll offset — leaves breathing room so the heading doesn't slam the top */
        [id^="cs-md-"], #cs-before-after, #cs-gallery, #cs-stack, #cs-related {
          scroll-margin-top: 72px;
        }

        /* Stats bar — Timeline + Live site (1–2 columns) */
        .cs-stats-grid { display:grid; border-top:1px solid var(--color-border); border-bottom:1px solid var(--color-border); }
        .cs-stats-grid[data-stats-cols="1"] { grid-template-columns: minmax(0, 1fr); }
        .cs-stats-grid[data-stats-cols="2"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }

        /* Mobile sticky TOC — wrapper hidden on desktop */
        .cs-mobile-toc-wrap { display:none; }
        .cs-mobile-toc { display:none; }
        .cs-mobile-toc-summary {
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--fib-13) 0;
          cursor: pointer;
          font-size: var(--text-label);
          color: var(--color-body-secondary);
          letter-spacing: var(--tracking-caps);
          text-transform: uppercase;
          font-family: ${jakartaSans};
          user-select: none;
        }
        .cs-mobile-toc-summary::-webkit-details-marker { display:none; }
        .cs-mobile-toc-nav {
          padding-bottom: var(--fib-13);
          display: flex;
          flex-direction: column;
          gap: var(--fib-8);
        }

        @media (max-width:900px) {
          .cs-body-grid     { grid-template-columns:1fr !important; }
          /* Live site / GitHub → On this page → article */
          .cs-sidebar       { position:static !important; order:1; }
          .cs-mobile-toc-wrap {
            display:flex;
            flex-direction:column;
            gap:var(--fib-13);
            order:2;
          }
          .cs-case-article  { order:3; }
          .cs-desktop-toc   { display:none; }
          .cs-sidebar-divider--desktop-only { display:none; }
          .cs-mobile-toc    {
            display:block; position:sticky; top:0; z-index:10;
            background:var(--color-page);
            border-bottom:1px solid var(--color-border-subtle);
            margin-bottom:clamp(24px,3vw,44px);
          }
          [id^="cs-md-"], #cs-before-after, #cs-gallery, #cs-stack, #cs-related {
            scroll-margin-top: var(--mobile-toc-height, 56px);
          }
          .cs-related-grid  { grid-template-columns:1fr 1fr !important; }
          .cs-outcomes-grid { grid-template-columns:repeat(3,1fr) !important; }
        }
        @media (max-width:600px) {
          .cs-img-duo       { grid-template-columns:1fr !important; }
          .cs-outcomes-grid { grid-template-columns:1fr !important; }
          .cs-related-grid  { grid-template-columns:1fr !important; }
          .cs-title-row     { flex-direction:column !important; align-items:flex-start !important; }
        }
      `}</style>

      <div style={{ paddingBottom: "89px", fontFamily: jakartaSans }}>

        {/* Breadcrumb / back */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px,1vw,12px)", marginBottom: "clamp(20px,2.5vw,32px)" }}>
          <Link
            href="/work"
            className="cs-back-link"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              color: "var(--color-body-secondary)", textDecoration: "none",
              fontFamily: jakartaSans, fontSize: "clamp(12px,0.85vw,13px)",
              letterSpacing: "0.04em", padding: "6px 0", transition: "color 0.15s",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Work
          </Link>
          <span style={{ color: "var(--color-border-strong)", fontSize: "12px", userSelect: "none" }}>/</span>
          <span style={{ fontFamily: jakartaSans, fontSize: "clamp(12px,0.85vw,13px)", color: "var(--color-heading)", letterSpacing: "0.04em" }}>
            {caseStudy.title}
          </span>
        </div>

        {/* Title row */}
        <div
          className="cs-title-row"
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: "clamp(24px,3vw,40px)", flexWrap: "wrap" }}
        >
          <h1 style={{ fontFamily: cormorantGaramond, fontWeight: 500, fontSize: "clamp(44px,7.5vw,144px)", color: "var(--color-heading)", letterSpacing: "-0.025em", lineHeight: 1.02 }}>
            {titleLine1}
            {titleLine2 && (
              <span style={{ paddingLeft: "clamp(28px,4vw,64px)", display: "block" }}>
                {titleLine2}
              </span>
            )}
          </h1>

        </div>

        {/* Subtitle */}
        {subtitle && (
          <p style={{ fontFamily: jakartaSans, fontSize: "clamp(17px,1.8vw,26px)", color: "var(--color-body-secondary)", fontWeight: 400, marginBottom: "clamp(16px,2vw,28px)", letterSpacing: "-0.01em" }}>
            {subtitle}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "clamp(24px,3vw,44px)" }}>
            {tags.map(t => <span key={t} className="cs-tag">{t}</span>)}
          </div>
        )}

        {/* Cover */}
        {coverSrc && (
          <div style={{ width: "100%", aspectRatio: "21/8", background: "var(--color-heading)", overflow: "hidden", position: "relative", marginBottom: 0 }}>
            <Image src={coverSrc} alt={caseStudy.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}

        {/* Stats bar — timeline + live site only (same row) */}
        {statsBarItems.length > 0 && (
          <div
            className="cs-stats-grid"
            data-stats-cols={statsBarItems.length === 1 ? "1" : "2"}
            style={{ marginBottom: "clamp(32px,4vw,62px)" }}
          >
            {statsBarItems.map((item, i, arr) => {
              const valueStyle: React.CSSProperties = {
                fontFamily: jakartaSans,
                fontSize: "clamp(15px,1.4vw,26px)",
                color: "var(--color-heading)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                margin: 0,
              };
              return (
                <div
                  key={item.label}
                  style={{
                    padding: "clamp(16px,2vw,28px) clamp(12px,1.5vw,20px)",
                    borderRight: i < arr.length - 1 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <p style={{ ...sectionLabel, marginBottom: 6 }}>{item.label}</p>
                  {item.type === "text" ? (
                    <p style={valueStyle}>{item.value}</p>
                  ) : (
                    <p style={{ ...valueStyle, color: "var(--color-link)" }}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "inherit",
                          textDecoration: "underline",
                          textUnderlineOffset: 4,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "var(--fib-8)",
                        }}
                      >
                        {item.text}
                        <ArrowIcon />
                      </a>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Body: prose | sidebar */}
        {/* Body grid — golden ratio: minmax(0,55fr) prose / 34fr sidebar.
            φ = 55/34 ≈ 1.618. Gap clamp bounds → Fibonacci: 32→34px, 72→55px. */}
        <div
          className="cs-body-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) clamp(13.75rem,22vw,18.75rem)",
            gap: "clamp(var(--fib-34),5vw,var(--fib-55))",
            alignItems: "start",
          }}
        >
          {/* ── Left ── */}
          <article className="cs-case-article">
            {/* Markdown body */}
            {mdHtml && (
              <div
                style={{ maxWidth: "80ch", width: "100%" }}
                dangerouslySetInnerHTML={{ __html: mdHtml }}
              />
            )}

            <CaseStudyMediaBlocks
              caseTitle={caseStudy.title}
              beforeSrc={ba?.beforeImage ? mediaUrl(ba.beforeImage) : null}
              afterSrc={ba?.afterImage ? mediaUrl(ba.afterImage) : null}
              screenshotSrcs={screenshots}
              sectionLabel={sectionLabel}
            />

            {/* Stack */}
            {stack.length > 0 && (
              <div id="cs-stack" style={{ marginTop: "clamp(24px,3vw,44px)" }}>
                <p style={{ ...sectionLabel, marginBottom: "clamp(12px,1.2vw,16px)" }}>Tools &amp; tech stack</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {stack.map(t => <span key={t} className="cs-tool">{t}</span>)}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside className="cs-sidebar">
            <div className="cs-sidebar-stack">
              {ghLink && (
                <div className="cs-sidebar-meta-row">
                  <SidebarLabel>GitHub</SidebarLabel>
                  <a className="cs-sidebar-link" href={ghLink.url} target="_blank" rel="noreferrer">
                    {ghLink.url.replace(/^https?:\/\//, "")} <ArrowIcon />
                  </a>
                </div>
              )}

              {ghLink && sections.length > 1 && (
                <SidebarDivider className="cs-sidebar-divider--desktop-only" />
              )}

              {/* In-page navigation — desktop only; mobile TOC is after Live/GitHub in grid */}
              <div className="cs-desktop-toc">
                {sections.length > 1 && <PageNav sections={sections} />}
              </div>
            </div>
          </aside>

          {sections.length > 1 && (
            <div className="cs-mobile-toc-wrap">
              <SidebarDivider />
              <MobileToc
                sections={sections}
                wrapperClass="cs-mobile-toc"
                summaryClass="cs-mobile-toc-summary"
                navClass="cs-mobile-toc-nav"
                linkClass="cs-nav-link"
                dashClass="cs-nav-dash"
              />
            </div>
          )}
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <>
            <div id="cs-related" style={{ height: 1, background: "var(--color-border)", margin: "clamp(32px,4vw,56px) 0 0" }} />
            <div style={{ marginTop: "clamp(20px,2.5vw,36px)" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(12px,1.4vw,20px)" }}>
                <p style={{ ...sectionLabel, marginBottom: 0 }}>Related projects</p>
                <Link href="/work" style={{ fontSize: "clamp(11px,0.85vw,13px)", color: "var(--color-link)", textDecoration: "underline", textUnderlineOffset: "4px", fontFamily: jakartaSans }}>
                  View all
                </Link>
              </div>
              <div
                className="cs-related-grid"
                style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(Math.max(relatedProjects.length, 3), 5)},1fr)`, gap: "clamp(8px,1vw,16px)" }}
              >
                {relatedProjects.map(p => <RelatedProjectCard key={p.id} project={p} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
