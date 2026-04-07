import Image from "next/image";
import Link from "next/link";
import type { CaseStudy, Project } from "@/lib/types";
import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";
import MobileToc from "./MobileToc";

const serif = "var(--font-active-display), 'Georgia', serif";
const sans  = "var(--font-active-sans), system-ui, sans-serif";

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
  img: "cs-img",
  imgBorder: "cs-img-border",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "clamp(11px,0.8vw,12px)", color: "#8a8a7a", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: sans, marginBottom: 8 }}>
      {children}
    </p>
  );
}

function SidebarValue({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: serif, fontSize: "clamp(14px,1.2vw,18px)", color: "#1a1a1a", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.45 }}>
      {children}
    </p>
  );
}

function SidebarDivider() {
  return <div style={{ height: 1, background: "rgba(26,26,26,0.1)" }} />;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" style={{ width: 11, height: 11, flexShrink: 0 }}>
      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PageNav({ sections }: { sections: { id: string; label: string }[] }) {
  if (sections.length < 2) return null;
  return (
    <div>
      <p style={{ fontSize: "10px", color: "#b4b0a8", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: sans, marginBottom: 14 }}>
        On this page
      </p>
      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
            <span style={{ fontFamily: serif, fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 700, color: "#f0ede8", opacity: 0.3 }}>
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div style={{ paddingTop: "clamp(6px,0.6vw,10px)" }}>
        <p style={{ fontFamily: serif, fontSize: "clamp(13px,1vw,16px)", color: "#1a1a1a", fontWeight: 600, margin: "0 0 2px", letterSpacing: "-0.01em" }}>
          {project.title}
        </p>
        {project.subtitle && (
          <p style={{ fontSize: "clamp(10px,0.75vw,11px)", color: "#8a8a7a", fontFamily: sans, margin: 0 }}>
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

  // Stats bar
  const subtitle = caseStudy.summary ?? null;
  const statusLabel = caseStudy.status ? (caseStudy.status.charAt(0).toUpperCase() + caseStudy.status.slice(1)) : null;

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
    fontSize: "clamp(10px,0.8vw,12px)", color: "#8a8a7a",
    letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: sans,
  };

  return (
    <>
      <style>{`
        /* Markdown prose */
        .cs-h1,.cs-h2,.cs-h3 { font-family:${serif}; color:#1a1a1a; font-weight:700; letter-spacing:-0.02em; }
        .cs-h1 { font-size:clamp(28px,3vw,44px); margin:clamp(32px,4vw,56px) 0 clamp(12px,1.2vw,18px); line-height:1.05; }
        .cs-h2 { font-size:clamp(22px,2.4vw,36px); margin:clamp(28px,3.5vw,52px) 0 clamp(12px,1.2vw,18px); line-height:1.18; }
        .cs-h3 { font-size:clamp(18px,1.8vw,26px); font-weight:600; margin:clamp(20px,2.5vw,36px) 0 clamp(8px,0.8vw,12px); line-height:1.25; }
        .cs-p  { font-size:clamp(15px,1.05vw,17px); color:#3a3a3a; line-height:1.65; letter-spacing:0.01em; font-family:${sans}; margin-bottom:clamp(14px,1.4vw,20px); }
        .cs-ul { padding-left:0; list-style:none; margin-bottom:clamp(14px,1.4vw,20px); }
        .cs-li { font-size:clamp(15px,1.05vw,17px); color:#3a3a3a; line-height:1.65; font-family:${sans}; padding-left:20px; position:relative; margin-bottom:8px; }
        .cs-li::before { content:'–'; position:absolute; left:0; color:#8a8a7a; }
        .cs-blockquote { border-left:3px solid #1a1a1a; padding:clamp(12px,1.5vw,20px) clamp(16px,2vw,28px); margin:clamp(24px,3vw,40px) 0; }
        .cs-blockquote .cs-p { font-family:${serif}; font-size:clamp(18px,1.8vw,26px); color:#1a1a1a; font-style:italic; line-height:1.6; margin:0; }
        .cs-strong { font-weight:600; color:#1a1a1a; }
        .cs-em { font-style:italic; }
        .cs-a  { color:#1a1a1a; text-decoration:underline; text-underline-offset:3px; }
        .cs-code { font-size:0.875em; background:#e8e4de; padding:2px 6px; font-family:monospace; }
        .cs-pre  { background:#1a1a1a; color:#f0ede8; padding:clamp(14px,1.5vw,20px); overflow-x:auto; margin:clamp(16px,2vw,24px) 0; font-size:13px; line-height:1.6; }
        .cs-hr   { border:none; border-top:1px solid rgba(26,26,26,0.12); margin:clamp(24px,3vw,40px) 0; }

        /* Tags + tool pills */
        .cs-tag, .cs-tool {
          font-size: clamp(10px,0.8vw,12px); color:#1a1a1a;
          border:1px solid #c4c0b8; padding:5px 12px;
          font-family:${sans}; letter-spacing:0.06em; text-transform:uppercase;
        }
        .cs-tool { font-size:clamp(11px,0.85vw,13px); letter-spacing:0.03em; text-transform:none; padding:6px 14px; }

        /* Sidebar link */
        .cs-sidebar-link { font-family:${sans}; font-size:clamp(12px,0.95vw,14px); color:#1a1a1a; text-decoration:underline; text-underline-offset:4px; display:inline-flex; align-items:center; gap:5px; }

        /* In-page nav */
        .cs-nav-link { font-size:clamp(11px,0.9vw,13px); color:#8a8a7a; font-family:${sans}; text-decoration:none; letter-spacing:0.01em; display:flex; align-items:center; gap:8px; transition:color 0.15s; }
        .cs-nav-link:hover { color:#1a1a1a; }
        .cs-nav-dash { width:14px; height:1px; background:currentColor; flex-shrink:0; display:inline-block; }

        /* Scroll offset — leaves breathing room so the heading doesn't slam the top */
        [id^="cs-md-"], #cs-before-after, #cs-gallery, #cs-stack, #cs-related {
          scroll-margin-top: 72px;
        }

        /* Stats bar */
        .cs-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); border-top:1px solid rgba(26,26,26,0.1); border-bottom:1px solid rgba(26,26,26,0.1); }

        /* Mobile sticky TOC */
        .cs-mobile-toc { display:none; }
        .cs-mobile-toc-summary {
          list-style:none; display:flex; align-items:center; justify-content:space-between;
          padding:12px 0; cursor:pointer; font-size:10px; color:#b4b0a8;
          letter-spacing:0.14em; text-transform:uppercase; font-family:${sans}; user-select:none;
        }
        .cs-mobile-toc-summary::-webkit-details-marker { display:none; }
        .cs-mobile-toc-nav { padding-bottom:14px; display:flex; flex-direction:column; gap:10px; }

        @media (max-width:900px) {
          .cs-body-grid     { grid-template-columns:1fr !important; }
          .cs-sidebar       { position:static !important; order:-1; }
          .cs-sidebar-meta  { display:none; }
          .cs-desktop-toc   { display:none; }
          .cs-mobile-toc    {
            display:block; position:sticky; top:0; z-index:10;
            background:var(--color-page,#f0ede8);
            border-bottom:1px solid rgba(26,26,26,0.08);
            margin-bottom:clamp(24px,3vw,44px);
          }
          [id^="cs-md-"], #cs-before-after, #cs-gallery, #cs-stack, #cs-related {
            scroll-margin-top: var(--mobile-toc-height, 56px);
          }
          .cs-stats-grid    { grid-template-columns:repeat(2,1fr) !important; }
          .cs-related-grid  { grid-template-columns:1fr 1fr !important; }
          .cs-outcomes-grid { grid-template-columns:repeat(3,1fr) !important; }
        }
        @media (max-width:600px) {
          .cs-stats-grid    { grid-template-columns:1fr 1fr !important; }
          .cs-img-duo       { grid-template-columns:1fr !important; }
          .cs-outcomes-grid { grid-template-columns:1fr !important; }
          .cs-related-grid  { grid-template-columns:1fr !important; }
          .cs-title-row     { flex-direction:column !important; align-items:flex-start !important; }
        }
      `}</style>

      <div style={{ paddingBottom: "89px", fontFamily: sans }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: "clamp(11px,0.85vw,13px)", color: "#8a8a7a", letterSpacing: "0.04em", marginBottom: "clamp(16px,2vw,28px)", display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/work" style={{ color: "#8a8a7a", textDecoration: "none" }}>Work</Link>
          &nbsp;/&nbsp;
          <span style={{ color: "#1a1a1a" }}>{caseStudy.title}</span>
        </p>

        {/* Title row */}
        <div
          className="cs-title-row"
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: "clamp(6px,1vw,16px)", flexWrap: "wrap" }}
        >
          <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: "clamp(44px,7.5vw,112px)", color: "#1a1a1a", letterSpacing: "-0.025em", lineHeight: 0.88 }}>
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
          <p style={{ fontFamily: serif, fontSize: "clamp(17px,1.8vw,26px)", color: "#6b6b6b", fontWeight: 400, marginBottom: "clamp(16px,2vw,28px)", letterSpacing: "-0.01em" }}>
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
          <div style={{ width: "100%", aspectRatio: "21/8", background: "#1a1a1a", overflow: "hidden", position: "relative", marginBottom: 0 }}>
            <Image src={coverSrc} alt={caseStudy.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}

        {/* Stats bar */}
        {[caseStudy.role, caseStudy.timeline, statusLabel].some(Boolean) && (
          <div className="cs-stats-grid" style={{ marginBottom: "clamp(32px,4vw,56px)" }}>
            {[
              { label: "Role",     value: caseStudy.role },
              { label: "Timeline", value: caseStudy.timeline },
              { label: "Status",   value: statusLabel },
            ].filter(item => item.value).map((item, i, arr) => (
              <div key={item.label} style={{ padding: "clamp(16px,2vw,28px) clamp(12px,1.5vw,20px)", borderRight: i < arr.length - 1 ? "1px solid rgba(26,26,26,0.1)" : "none" }}>
                <p style={{ ...sectionLabel, marginBottom: 6 }}>{item.label}</p>
                <p style={{ fontFamily: serif, fontSize: "clamp(15px,1.4vw,22px)", color: "#1a1a1a", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.2 }}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mobile sticky TOC — hidden on desktop, sticky bar on mobile */}
        {sections.length > 1 && (
          <MobileToc
            sections={sections}
            wrapperClass="cs-mobile-toc"
            summaryClass="cs-mobile-toc-summary"
            navClass="cs-mobile-toc-nav"
            linkClass="cs-nav-link"
            dashClass="cs-nav-dash"
          />
        )}

        {/* Body: prose | sidebar */}
        {/* Body grid — golden ratio: minmax(0,55fr) prose / 34fr sidebar.
            φ = 55/34 ≈ 1.618. Gap clamp bounds → Fibonacci: 32→34px, 72→55px. */}
        <div
          className="cs-body-grid"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) clamp(220px,22vw,300px)", gap: "clamp(34px,5vw,55px)", alignItems: "start" }}
        >
          {/* ── Left ── */}
          <article>
            {/* Markdown body */}
            {mdHtml && (
              <div dangerouslySetInnerHTML={{ __html: mdHtml }} />
            )}

            {/* Before / After */}
            {(ba?.beforeImage || ba?.afterImage) && (
              <section id="cs-before-after" style={{ margin: "clamp(24px,3vw,44px) 0" }}>
                <p style={{ ...sectionLabel, marginBottom: "clamp(12px,1.2vw,16px)" }}>Before / After</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px,1vw,16px)" }}>
                  {ba.beforeImage && (
                    <div>
                      <p style={{ fontSize: "clamp(10px,0.75vw,11px)", color: "#8a8a7a", fontFamily: sans, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Before</p>
                      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                        <Image src={mediaUrl(ba.beforeImage)} alt="Before" fill className="object-cover" sizes="(max-width:900px) 50vw, 27vw" />
                      </div>
                    </div>
                  )}
                  {ba.afterImage && (
                    <div>
                      <p style={{ fontSize: "clamp(10px,0.75vw,11px)", color: "#8a8a7a", fontFamily: sans, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>After</p>
                      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                        <Image src={mediaUrl(ba.afterImage)} alt="After" fill className="object-cover" sizes="(max-width:900px) 50vw, 27vw" />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Screenshot gallery */}
            {screenshots.length > 0 && (
              <div id="cs-gallery" style={{ margin: "clamp(24px,3vw,44px) 0" }}>
                <p style={{ ...sectionLabel, marginBottom: "clamp(12px,1.2vw,16px)" }}>Gallery</p>
                <div
                  className="cs-img-duo"
                  style={{ display: "grid", gridTemplateColumns: screenshots.length === 1 ? "1fr" : "1fr 1fr", gap: "clamp(8px,1vw,16px)" }}
                >
                  {screenshots.map((src, i) => (
                    <div key={i} style={{ position: "relative", overflow: "hidden", aspectRatio: i === 0 && screenshots.length > 2 ? "16/9" : "4/3", gridColumn: i === 0 && screenshots.length > 2 ? "span 2" : undefined }}>
                      <Image src={src} alt={`${caseStudy.title} screenshot ${i + 1}`} fill className="object-cover" sizes="(max-width:900px) 100vw, 55vw" />
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          <aside className="cs-sidebar" style={{ position: "sticky", top: 32, display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)" }}>

            <div className="cs-sidebar-meta">
              {caseStudy.role && (
                <>
                  <div><SidebarLabel>Role</SidebarLabel><SidebarValue>{caseStudy.role}</SidebarValue></div>
                  <SidebarDivider />
                </>
              )}

              {caseStudy.timeline && (
                <>
                  <div><SidebarLabel>Timeline</SidebarLabel><SidebarValue>{caseStudy.timeline}</SidebarValue></div>
                  <SidebarDivider />
                </>
              )}
            </div>

            {liveLink && (
              <>
                <div>
                  <SidebarLabel>Live site</SidebarLabel>
                  <a className="cs-sidebar-link" href={liveLink.url} target="_blank" rel="noreferrer">
                    {liveLink.url.replace(/^https?:\/\//, "")} <ArrowIcon />
                  </a>
                </div>
                <SidebarDivider />
              </>
            )}

            {ghLink && (
              <>
                <div>
                  <SidebarLabel>GitHub</SidebarLabel>
                  <a className="cs-sidebar-link" href={ghLink.url} target="_blank" rel="noreferrer">
                    {ghLink.url.replace(/^https?:\/\//, "")} <ArrowIcon />
                  </a>
                </div>
                <SidebarDivider />
              </>
            )}

            {/* In-page navigation — hidden on mobile (mobile TOC is sticky above) */}
            <div className="cs-desktop-toc">
              {sections.length > 1 && <PageNav sections={sections} />}
            </div>
          </aside>
        </div>

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <>
            <div id="cs-related" style={{ height: 1, background: "rgba(26,26,26,0.1)", margin: "clamp(32px,4vw,56px) 0 0" }} />
            <div style={{ marginTop: "clamp(20px,2.5vw,36px)" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "clamp(12px,1.4vw,20px)" }}>
                <p style={{ ...sectionLabel, marginBottom: 0 }}>Related projects</p>
                <Link href="/work" style={{ fontSize: "clamp(11px,0.85vw,13px)", color: "#1a1a1a", textDecoration: "underline", textUnderlineOffset: "4px", fontFamily: sans }}>
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
