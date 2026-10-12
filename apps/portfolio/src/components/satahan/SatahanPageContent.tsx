"use client";

import { useState } from "react";
import Link from "next/link";
import { satoshi, cormorantGaramond, notoSerifSinhala } from "@/lib/font";
import { formatEntryNumber, type SatahanItem } from "@/lib/entries";
import { SATAHAN_PROSE_CSS } from "@/lib/satahan-markdown";

type Filter = "all" | "case_study" | "note";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "case_study", label: "Case studies" },
  { id: "note", label: "Notes" },
];

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function Meta({ item }: { item: SatahanItem }) {
  const parts = [
    item.kind === "note" ? "Note" : "Case study",
    monthYear(item.date),
    item.project?.title,
    item.kind === "case_study" && item.readingMinutes ? `${item.readingMinutes} min` : null,
  ].filter(Boolean);
  return <p className="st-meta">{parts.join(" · ")}</p>;
}

function Entry({ item }: { item: SatahanItem }) {
  const href = `/satahan/${item.slug}`;
  return (
    <li className="st-entry">
      <span className="st-num" aria-hidden="true">{formatEntryNumber(item.number)}</span>
      <div style={{ minWidth: 0 }}>
        <Meta item={item} />
        <h2 className="st-title">
          <Link href={href}>{item.title}</Link>
        </h2>
        {item.kind === "note" && item.noteHtml ? (
          // Short notes read in full right here.
          <div className="st-body st-note" dangerouslySetInnerHTML={{ __html: item.noteHtml }} />
        ) : (
          <>
            {(item.opening || item.summary) && (
              <p className="st-opening">&ldquo;{item.opening ?? item.summary}&rdquo;</p>
            )}
            <Link href={href} className="st-read">
              Read the note
            </Link>
          </>
        )}
      </div>
    </li>
  );
}

export default function SatahanPageContent({ items }: { items: SatahanItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const hasBothKinds = items.some((i) => i.kind === "note") && items.some((i) => i.kind === "case_study");
  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <>
      <style>{`
        ${SATAHAN_PROSE_CSS}
        .st-chips { display:flex; flex-wrap:wrap; gap:8px; margin:clamp(20px,2.4vw,32px) 0 clamp(8px,1vw,14px); }
        .st-chip { font-family:${satoshi}; font-size:12px; letter-spacing:0.02em; padding:5px 12px; border-radius:999px;
          border:1px solid var(--color-border-strong); background:transparent; color:var(--color-body-secondary); cursor:pointer; transition:color .15s, border-color .15s; }
        .st-chip:hover { color:var(--color-heading); border-color:var(--color-border-hover); }
        .st-chip[aria-pressed="true"] { background:var(--color-heading); border-color:var(--color-heading); color:var(--color-page); }
        .st-list { list-style:none; margin:0; padding:0; max-width:760px; }
        .st-entry { display:grid; grid-template-columns:clamp(44px,5vw,72px) minmax(0,1fr); gap:clamp(12px,1.6vw,20px);
          border-top:1px solid var(--color-border); padding:clamp(22px,2.6vw,34px) 0; }
        .st-num { font-family:${cormorantGaramond}; font-style:italic; font-size:clamp(22px,2vw,30px); line-height:1; color:var(--color-faint); }
        .st-meta { font-family:${satoshi}; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-label); margin:0 0 8px; }
        .st-title { font-family:${satoshi}; font-weight:500; font-size:clamp(24px,2.2vw,32px); line-height:1.12; letter-spacing:-0.01em; margin:0 0 10px; }
        .st-title a { color:var(--color-heading); text-decoration:none; }
        .st-title a:hover { text-decoration:underline; text-underline-offset:5px; text-decoration-thickness:1px; }
        .st-opening { font-family:${cormorantGaramond}; font-style:italic; font-size:clamp(18px,1.5vw,21px); line-height:1.45; color:var(--color-body-secondary); margin:0; max-width:56ch; }
        .st-read { display:inline-block; margin-top:12px; font-family:${satoshi}; font-size:13px; color:var(--color-link);
          text-decoration:underline; text-underline-offset:4px; text-decoration-color:var(--color-link-underline); }
        .st-note { max-width:60ch; }
        .st-wordmark { display:flex; align-items:baseline; flex-wrap:wrap; gap:0.12em 0.22em; margin:0;
          font-family:${satoshi}; font-size:clamp(40px, 5.4vw, 88px); font-weight:400; color:var(--color-heading);
          letter-spacing:-0.03em; line-height:1; overflow:visible; }
        .st-gloss { display:inline-block; white-space:nowrap; letter-spacing:-0.03em; line-height:1.85; overflow:visible; }
        .st-si { font-family:${notoSerifSinhala}; letter-spacing:0; line-height:inherit; }
        .st-note .st-p, .st-note .st-li { font-size:15px; line-height:1.75; }
        .st-note .st-lead::first-letter { all:unset; }
        .st-note .st-margin { float:none; width:auto; margin:0 0 1em; }
      `}</style>

      <div style={{ paddingBottom: "89px", fontFamily: satoshi }}>
        <header>
          <h1 className="st-wordmark">
            Satahan
            <span className="st-gloss">(<span lang="si" className="st-si">සටහන්</span>, sa&middot;ta&middot;han)</span>
          </h1>
          <p style={{ margin: "clamp(10px, 1.2vw, 16px) 0 0", maxWidth: "70ch", fontSize: "clamp(13px, 0.95vw, 15px)", lineHeight: 1.6, color: "var(--color-body-secondary)" }}>
            A Sinhala word that translates to notes or records.
            <br />
            About how I work, what I&rsquo;ve learnt, and what I think.
          </p>
        </header>

        {hasBothKinds && (
          <div className="st-chips" role="group" aria-label="Filter entries">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className="st-chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        )}

        {visible.length === 0 ? (
          <p style={{ fontSize: "14px", color: "var(--color-body-secondary)", marginTop: 24 }}>No entries yet.</p>
        ) : (
          <ol className="st-list" style={{ marginTop: hasBothKinds ? 0 : "clamp(20px, 2.4vw, 32px)" }}>
            {visible.map((item) => (
              <Entry key={item.slug} item={item} />
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
