import Image from "next/image";
import Link from "next/link";
import { jakartaSans, cormorantGaramond } from "@/lib/font";
import { formatEntryNumber, type SatahanItem } from "@/lib/entries";
import { SATAHAN_PROSE_CSS } from "@/lib/satahan-markdown";

export interface SatahanEntryProps {
  item: SatahanItem;
  inShort: string | null;
  html: string;
  /** Gallery images, shown inside the reading column after the body. */
  images: string[];
  previous: SatahanItem | null;
  next: SatahanItem | null;
}

function fullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function Neighbour({ item, label, align }: { item: SatahanItem | null; label: string; align: "left" | "right" }) {
  if (!item) return <span />;
  return (
    <Link href={`/satahan/${item.slug}`} className="se-neighbour" style={{ textAlign: align }}>
      <span className="se-label">{label} · Nº {formatEntryNumber(item.number)}</span>
      <span className="se-neighbour-title">{item.title}</span>
    </Link>
  );
}

export default function SatahanEntry({ item, inShort, html, images, previous, next }: SatahanEntryProps) {
  const meta = [
    `Satahan Nº ${formatEntryNumber(item.number)}`,
    fullDate(item.date),
    item.kind === "case_study" && item.readingMinutes ? `${item.readingMinutes} min read` : null,
  ].filter(Boolean);

  return (
    <>
      <style>{`
        ${SATAHAN_PROSE_CSS}
        .se-wrap { max-width:640px; padding-bottom:89px; font-family:${jakartaSans}; }
        .se-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; letter-spacing:0.04em; color:var(--color-body-secondary);
          text-decoration:none; padding:6px 0; margin-bottom:clamp(28px,4vw,56px); transition:color .15s; }
        .se-back:hover { color:var(--color-heading); }
        .se-label { display:block; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-label); }
        .se-title { font-family:${cormorantGaramond}; font-weight:400; font-size:clamp(40px,5.4vw,76px); line-height:1; letter-spacing:-0.02em;
          color:var(--color-heading); margin:14px 0 clamp(20px,2.4vw,30px); }
        .se-short { border-left:1px solid var(--color-border-strong); padding-left:18px; margin:0 0 clamp(32px,4vw,48px); }
        .se-short p { font-family:${cormorantGaramond}; font-style:italic; font-size:clamp(20px,1.8vw,24px); line-height:1.4; color:var(--color-title); margin:6px 0 0; }
        .se-images { display:grid; gap:14px; margin:clamp(24px,3vw,36px) 0; }
        .se-images div { position:relative; aspect-ratio:16 / 10; background:var(--color-surface); overflow:hidden; }
        .se-end { border-top:1px solid var(--color-border); margin-top:clamp(32px,4vw,48px); padding-top:clamp(20px,2.4vw,28px); }
        .se-sign { font-family:${cormorantGaramond}; font-style:italic; font-size:22px; color:var(--color-heading); margin:0 0 clamp(24px,3vw,32px); }
        .se-project { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px 18px; background:var(--color-surface);
          text-decoration:none; color:inherit; transition:background .15s; }
        .se-project:hover { background:var(--color-surface-raised); }
        .se-project-title { display:block; font-size:16px; color:var(--color-heading); margin-top:4px; }
        .se-project-cta { font-size:13px; color:var(--color-link); white-space:nowrap; }
        .se-nav { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:clamp(24px,3vw,32px); }
        .se-neighbour { text-decoration:none; color:inherit; }
        .se-neighbour-title { display:block; font-family:${cormorantGaramond}; font-size:19px; line-height:1.2; color:var(--color-heading); margin-top:6px; }
        .se-neighbour:hover .se-neighbour-title { text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1px; }
        @media (max-width:600px) { .se-nav { grid-template-columns:1fr; } .se-neighbour { text-align:left !important; } }
      `}</style>

      <article className="se-wrap">
        <Link href="/satahan" className="se-back">
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }} aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Satahan
        </Link>

        <header>
          <p className="se-label" style={{ margin: 0 }}>{meta.join(" · ")}</p>
          <h1 className="se-title">{item.title}</h1>
          {inShort && (
            <div className="se-short">
              <span className="se-label">In short</span>
              <p>{inShort}</p>
            </div>
          )}
        </header>

        <div className="st-body" dangerouslySetInnerHTML={{ __html: html }} />

        {images.length > 0 && (
          <div className="se-images">
            {images.map((src, i) => (
              <div key={src}>
                <Image src={src} alt={`${item.title}, image ${i + 1}`} fill className="object-cover" sizes="(max-width: 700px) 100vw, 640px" />
              </div>
            ))}
          </div>
        )}

        <footer className="se-end">
          <p className="se-sign">— Rashod</p>
          {item.project && (
            <Link href={`/projects/${item.project.slug}`} className="se-project">
              <span>
                <span className="se-label">About the project</span>
                <span className="se-project-title">{item.project.title}</span>
              </span>
              <span className="se-project-cta">View project →</span>
            </Link>
          )}
          {(previous || next) && (
            <nav className="se-nav" aria-label="More from Satahan">
              <Neighbour item={previous} label="Previous" align="left" />
              <Neighbour item={next} label="Next" align="right" />
            </nav>
          )}
        </footer>
      </article>
    </>
  );
}
