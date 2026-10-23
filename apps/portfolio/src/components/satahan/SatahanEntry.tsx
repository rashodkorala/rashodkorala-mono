import Image from "next/image";
import Link from "next/link";
import { poppins, satoshi, cormorantGaramond } from "@/lib/font";
import type { SatahanItem } from "@/lib/entries";
import { SATAHAN_PROSE_CSS } from "@/lib/satahan-markdown";
import SatahanToc, { type TocHeading } from "@/src/components/satahan/SatahanToc";

export interface SatahanEntryProps {
  item: SatahanItem;
  html: string;
  /** Gallery images, shown after the body. */
  images: string[];
  previous: SatahanItem | null;
  next: SatahanItem | null;
}

/** Contents only earn their place on longer case studies. */
const MIN_TOC_HEADINGS = 3;

function decodeHeading(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Give each section heading an anchor so the contents can link to it. */
function withHeadingIds(html: string): { html: string; toc: TocHeading[] } {
  const toc: TocHeading[] = [];
  const used = new Map<string, number>();
  const next = html.replace(/<h2 class="st-h">([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = decodeHeading(inner);
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    toc.push({ id, text });
    return `<h2 class="st-h" id="${id}">${inner}</h2>`;
  });
  return { html: next, toc };
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function Neighbour({ item, label, align }: { item: SatahanItem | null; label: string; align: "left" | "right" }) {
  if (!item) return <span />;
  return (
    <Link href={`/satahan/${item.slug}`} className="se-neighbour" style={{ textAlign: align }}>
      <span className="se-label">{label}</span>
      <span className="se-neighbour-title">{item.title}</span>
    </Link>
  );
}

const KIND_LABEL: Record<SatahanItem["kind"], string> = { case_study: "Case study", article: "Article", note: "Note" };

/**
 * Editorial entry. Case studies and articles open on a wide cover and get contents when long
 * enough; case studies add a facts strip (role, timeline, project). Notes are just the reading
 * column. One layout at every width.
 */
export default function SatahanEntry({ item, html, images, previous, next }: SatahanEntryProps) {
  const isCaseStudy = item.kind === "case_study";
  const isLongForm = item.kind !== "note";
  const headed = withHeadingIds(html);
  const showToc = isLongForm && headed.toc.length >= MIN_TOC_HEADINGS;
  // An "inline" cover is the body's first image; showing it as the hero would repeat it.
  const hero = isLongForm && item.cover?.variant === "hero" ? item.cover.src : null;

  const kicker = [
    KIND_LABEL[item.kind],
    monthYear(item.date),
    item.readingMinutes ? `${item.readingMinutes} min` : null,
  ].filter(Boolean);

  const facts: { label: string; value: React.ReactNode }[] = [];
  if (isCaseStudy) {
    if (item.role) facts.push({ label: "Role", value: item.role });
    if (item.timeline) facts.push({ label: "Timeline", value: item.timeline });
    if (item.project)
      facts.push({ label: "Project", value: <Link href={`/projects/${item.project.slug}`}>{item.project.title}</Link> });
    if (item.stack.length > 0) facts.push({ label: "Stack", value: item.stack.join(", ") });
  }

  return (
    <>
      <style>{`
        ${SATAHAN_PROSE_CSS}

        .se { font-family:${satoshi}; padding-bottom:var(--fib-89); }
        .se-col { max-width:760px; margin:0 auto; min-width:0; }
        .se-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; letter-spacing:0.04em;
          color:var(--color-body-secondary); text-decoration:none; padding:6px 0; margin-bottom:var(--fib-34); transition:color .15s; }
        .se-back:hover { color:var(--color-heading); }
        .se-label { display:block; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-label); margin:0; }

        /* ── Hero ─────────────────────────────────────────────────────────── */
        .se-hero { position:relative; aspect-ratio:16 / 8; max-height:72vh; width:100%; margin:0 0 var(--fib-55);
          background:var(--color-surface); overflow:hidden; }
        @media (max-width:699px) { .se-hero { aspect-ratio:4 / 3; margin-bottom:var(--fib-34); } }

        /* ── Front matter ─────────────────────────────────────────────────── */
        .se-kicker span + span::before { content:"·"; margin:0 0.6em; color:var(--color-faint); }
        .se-title { font-family:${poppins}; font-weight:400; font-size:clamp(2.25rem,4vw,3.5rem); line-height:1.06; letter-spacing:-0.025em;
          text-wrap:balance; color:var(--color-heading); margin:var(--fib-13) 0 0; }
        .se-deck { font-family:${cormorantGaramond}; font-style:italic; font-size:clamp(1.25rem,1.6vw,1.5rem); line-height:1.4;
          color:var(--color-body-secondary); margin:var(--fib-21) 0 0; max-width:48ch; text-wrap:pretty; }
        .se-facts { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:var(--fib-13) var(--fib-21);
          margin:var(--fib-34) 0 0; padding:var(--fib-21) 0; border-top:1px solid var(--color-border); border-bottom:1px solid var(--color-border); }
        .se-fact-value { display:block; margin-top:6px; font-size:15px; line-height:1.4; color:var(--color-heading); }
        .se-fact-value a { color:inherit; text-decoration:underline; text-underline-offset:4px; text-decoration-color:var(--color-link-underline); }
        .se-front-end { margin-bottom:var(--fib-55); }
        .se-front-end:not(:has(.se-facts)) { padding-bottom:var(--fib-34); border-bottom:1px solid var(--color-border); }
        .se-front-end .se-toc { margin-top:var(--fib-21); }

        /* ── Contents (a toggle at every width) ───────────────────────────── */
        .se-toc-label { display:none; }
        .se-toc-toggle { display:flex; justify-content:space-between; align-items:center; width:100%; padding:12px 0; margin:0;
          background:none; border:0; border-bottom:1px solid var(--color-border);
          font:inherit; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-body-secondary); cursor:pointer; }
        .se-toc-toggle:hover { color:var(--color-heading); }
        .se-toc-toggle span { font-size:16px; line-height:1; }
        .se-toc ol { list-style:none; margin:0; padding:var(--fib-13) 0; display:none; gap:10px; border-bottom:1px solid var(--color-border); }
        .se-toc[data-open="true"] ol { display:grid; }
        .se-toc a { display:grid; grid-template-columns:2em 1fr; font-size:15px; line-height:1.4; color:var(--color-body-secondary); text-decoration:none; transition:color .15s; }
        .se-toc-num { font-variant-numeric:tabular-nums; color:var(--color-faint); }
        .se-toc a:hover, .se-toc a[aria-current="location"] { color:var(--color-heading); }

        /* ── Body ─────────────────────────────────────────────────────────── */
        .se .st-p, .se .st-li { font-size:clamp(1.0625rem,1.04rem + 0.1vw,1.1875rem); line-height:1.7; }
        .se .st-h { font-family:${poppins}; font-weight:400; font-size:clamp(1.625rem,2.4vw,2.25rem); line-height:1.15; letter-spacing:-0.02em;
          text-transform:none; color:var(--color-heading); margin:var(--fib-55) 0 var(--fib-21); scroll-margin-top:var(--fib-34); text-wrap:balance; }
        .se .st-body > .st-h:first-child { margin-top:0; }
        .se .st-h3 { font-size:clamp(1.25rem,1.8vw,1.5rem); margin:var(--fib-34) 0 var(--fib-13); }

        /* ── Gallery and end matter ───────────────────────────────────────── */
        .se-images { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:var(--fib-13); margin:var(--fib-55) auto 0; max-width:1080px; }
        .se-images div { position:relative; aspect-ratio:16 / 10; background:var(--color-surface); overflow:hidden; }
        .se-end { border-top:1px solid var(--color-border); margin-top:var(--fib-55); padding-top:var(--fib-34); }
        .se-sign { font-family:${cormorantGaramond}; font-style:italic; font-size:22px; color:var(--color-heading); margin:0 0 var(--fib-34); }
        .se-project { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px 18px; background:var(--color-surface);
          text-decoration:none; color:inherit; transition:background .15s; }
        .se-project:hover { background:var(--color-surface-raised); }
        .se-project-title { display:block; font-size:16px; color:var(--color-heading); margin-top:4px; }
        .se-project-cta { font-size:13px; color:var(--color-link); white-space:nowrap; }
        .se-nav { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:var(--fib-34); }
        .se-neighbour { text-decoration:none; color:inherit; }
        .se-neighbour-title { display:block; font-family:${poppins}; font-weight:400; font-size:19px; line-height:1.2; color:var(--color-heading); margin-top:6px; }
        .se-neighbour:hover .se-neighbour-title { text-decoration:underline; text-underline-offset:4px; text-decoration-thickness:1px; }
        @media (max-width:600px) { .se-nav { grid-template-columns:1fr; } .se-neighbour { text-align:left !important; } }
      `}</style>

      <article className="se">
        <Link href="/satahan" className="se-back">
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }} aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Satahan
        </Link>

        {hero && (
          <div className="se-hero">
            <Image src={hero} alt={item.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 1400px" />
          </div>
        )}

        <div className="se-col">
          <header>
            <p className="se-label se-kicker">
              {kicker.map((part) => (
                <span key={part}>{part}</span>
              ))}
            </p>
            <h1 className="se-title">{item.title}</h1>
            {item.summary && <p className="se-deck">{item.summary}</p>}
          </header>

          <div className="se-front-end">
            {facts.length > 0 && (
              <dl className="se-facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="se-label">{fact.label}</dt>
                    <dd className="se-fact-value" style={{ margin: 0 }}>
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {showToc && <SatahanToc headings={headed.toc} />}
          </div>

          <div className="st-body" dangerouslySetInnerHTML={{ __html: headed.html }} />
        </div>

        {images.length > 0 && (
          <div className="se-images">
            {images.map((src, i) => (
              <div key={src}>
                <Image src={src} alt={`${item.title}, image ${i + 1}`} fill className="object-cover" sizes="(max-width: 700px) 100vw, 540px" />
              </div>
            ))}
          </div>
        )}

        <footer className="se-col se-end">
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
