import Link from "next/link";
import Image from "next/image";
import { poppins, satoshi } from "@/lib/font";
import type { ProjectItem } from "@/lib/entries";

interface ProjectsPageContentProps {
  items: ProjectItem[];
}

const APPS = [
  {
    href: "/apps/inkbar",
    title: "InkBar",
    body: "A cocktail spec scaler for iPhone. Scale, convert, batch, and keep house specs in one offline app.",
    image: "/inkbar/scaler.png",
    alt: "InkBar cocktail scaler screen.",
    frame: "#f7f2e8",
  },
  {
    href: "/apps/moov",
    title: "MOOV",
    body: "A morning app for iPhone, built during an internship. Wake alarm, sleep sounds, and a short list for the day.",
    image: "/moov/launch.png",
    alt: "MOOV welcome screen on iPhone.",
    frame: "#1a1816",
  },
] as const;

function ProjectCard({ item }: { item: ProjectItem }) {
  const meta = [String(item.year), item.role].filter(Boolean).join(" · ");
  const inline = item.cover?.variant === "inline";

  return (
    <li className="pf-card">
      <Link href={`/projects/${item.slug}`} className="pf-link">
        <div className="pf-frame">
          {item.cover ? (
            <Image
              src={item.cover.src}
              alt={item.title}
              fill
              className={`pf-img ${inline ? "object-contain" : "object-cover"}`}
              style={inline ? { padding: "8%" } : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 33vw"
            />
          ) : (
            <span className="pf-initial" aria-hidden="true">
              {item.title.charAt(0)}
            </span>
          )}
        </div>

        <div className="pf-caption">
          <p className="pf-title">{item.title}</p>
          {meta && <p className="pf-meta">{meta}</p>}
          {item.subtitle && <p className="pf-subtitle">{item.subtitle}</p>}
        </div>
      </Link>
    </li>
  );
}

export default function ProjectsPageContent({ items }: ProjectsPageContentProps) {
  const years = items.map((i) => i.year);
  const yearRange = years.length
    ? Math.min(...years) === Math.max(...years)
      ? `${years[0]}`
      : `${Math.min(...years)} — ${Math.max(...years)}`
    : null;
  const headerMeta = [
    yearRange,
    items.length > 0 ? `${items.length} ${items.length === 1 ? "project" : "projects"}` : null,
  ].filter(Boolean);

  return (
    <>
      <style>{`
        .pf-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: clamp(16px, 2vw, 32px);
        }
        .pf-h1 {
          font-family: ${poppins};
          font-weight: 400;
          letter-spacing: var(--tracking-h1);
          line-height: 0.88;
          color: var(--color-heading);
          font-size: clamp(2.75rem, 7vw, 8rem);
          margin: 0;
        }
        .pf-h1-line {
          display: block;
          padding-left: clamp(var(--fib-21), 3.5vw, var(--fib-55));
          color: var(--color-body-secondary);
        }
        .pf-header-meta {
          font-family: ${satoshi};
          font-size: clamp(12px, 0.9vw, 14px);
          line-height: 1.6;
          color: var(--color-body-secondary);
          text-align: right;
          padding-bottom: clamp(4px, 0.5vw, 10px);
          margin: 0;
        }
        @media (min-width: 1024px) {
          .pf-h1 { font-size: clamp(2.375rem, 4.2vw, 5.25rem); }
        }
        @media (max-width: 640px) {
          .pf-header { flex-direction: column; align-items: flex-start; }
          .pf-header-meta { text-align: left; padding-bottom: 0; }
        }
        .pf-rule {
          height: 1px;
          background: var(--color-border-subtle);
          margin: clamp(24px, 3vw, 40px) 0;
        }
        .pf-grid {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: clamp(20px, 2.5vw, 40px);
          row-gap: clamp(30px, 3.75vw, 60px);
        }
        @media (min-width: 1280px) {
          .pf-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .pf-grid { grid-template-columns: minmax(0, 1fr); }
        }
        .pf-card { min-width: 0; }
        .pf-link {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .pf-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 2;
          background: var(--color-surface);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pf-img { transition: opacity 0.2s ease; }
        .pf-link:hover .pf-img { opacity: 0.92; }
        .pf-initial {
          font-family: ${poppins};
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 400;
          line-height: 1;
          color: var(--color-faint);
          user-select: none;
        }
        .pf-caption { padding-top: clamp(10px, 1vw, 14px); }
        .pf-title {
          font-family: ${poppins};
          font-size: clamp(16px, 1.3vw, 20px);
          font-weight: 400;
          color: var(--color-heading);
          letter-spacing: -0.015em;
          line-height: 1.2;
          margin: 0;
          text-decoration: none;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
        }
        .pf-link:hover .pf-title { text-decoration: underline; }
        .pf-meta {
          font-family: ${satoshi};
          font-size: 12px;
          color: var(--color-label);
          line-height: 1.5;
          margin: 4px 0 0;
        }
        .pf-subtitle {
          font-family: ${satoshi};
          font-size: clamp(13px, 0.85vw, 14px);
          color: var(--color-body-secondary);
          line-height: 1.5;
          margin: 6px 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pf-link:focus-visible {
          outline: 2px solid var(--color-heading);
          outline-offset: 4px;
        }
        .pf-apps {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: clamp(12px, 1.4vw, 16px);
        }
        @media (min-width: 768px) {
          .pf-apps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-img { transition: none; }
        }
      `}</style>

      <div style={{ paddingBottom: "89px" }}>
        <header className="pf-header">
          <h1 className="pf-h1">
            Selected
            <span className="pf-h1-line">Projects</span>
          </h1>
          {headerMeta.length > 0 && (
            <p className="pf-header-meta">
              {headerMeta.map((line) => (
                <span key={line} style={{ display: "block" }}>{line}</span>
              ))}
            </p>
          )}
        </header>

        <div className="pf-rule" />

        {items.length === 0 ? (
          <p style={{ fontFamily: satoshi, fontSize: "14px", color: "var(--color-body-secondary)" }}>
            No projects to show yet.
          </p>
        ) : (
          <ul className="pf-grid">
            {items.map((item) => (
              <ProjectCard key={item.slug} item={item} />
            ))}
          </ul>
        )}

        {/* Apps sit apart from the project grid. */}
        <section style={{ marginTop: "clamp(48px, 6vw, 96px)" }}>
          <p style={{
            fontFamily: satoshi,
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-body-secondary)",
            margin: "0 0 clamp(12px, 1.4vw, 20px)",
          }}>
            Apps
          </p>
          <div className="pf-apps">
            {APPS.map((app) => (
              <Link
                key={app.href}
                href={app.href}
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
                }}
              >
                <div>
                  <h2 style={{
                    fontFamily: poppins,
                    fontSize: "clamp(26px, 3vw, 40px)",
                    fontWeight: 400,
                    lineHeight: 1,
                    color: "var(--color-heading)",
                    margin: 0,
                  }}>
                    {app.title}
                  </h2>
                  <p style={{
                    maxWidth: "54ch",
                    fontFamily: satoshi,
                    fontSize: "clamp(13px, 0.9vw, 15px)",
                    lineHeight: 1.6,
                    color: "var(--color-body-secondary)",
                    margin: "10px 0 0",
                  }}>
                    {app.body}
                  </p>
                </div>
                <div style={{
                  position: "relative",
                  aspectRatio: "1320 / 2868",
                  overflow: "hidden",
                  background: app.frame,
                  border: "1px solid var(--color-border-subtle)",
                }}>
                  <Image
                    src={app.image}
                    alt={app.alt}
                    fill
                    className="object-cover"
                    sizes="110px"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
