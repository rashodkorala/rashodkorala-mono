"use client";

import { useState } from "react";
import Link from "next/link";
import { poppins, satoshi, notoSerifSinhala } from "@/lib/font";
import { formatEntryNumber, type SatahanItem } from "@/lib/entries";

type Filter = "all" | "case_study" | "note";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "case_study", label: "Case studies" },
  { id: "note", label: "Notes" },
];

const KIND_LABEL: Record<SatahanItem["kind"], string> = { case_study: "Case study", note: "Note" };

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " ’");
}

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * One ledger line. Default: Nº | title + summary | kind | date.
 * From 1280px the summary and project get their own columns; below 700px kind and date fold above the title.
 */
function Row({ item }: { item: SatahanItem }) {
  return (
    <li>
      <Link href={`/satahan/${item.slug}`} className="st-row">
        <span className="st-num">{formatEntryNumber(item.number)}</span>
        <span className="st-main">
          <span className="st-title">{item.title}</span>
          {item.summary && <span className="st-summary st-narrow">{item.summary}</span>}
          <span className="st-fold">
            {[KIND_LABEL[item.kind], longDate(item.date), item.project?.title].filter(Boolean).join(" · ")}
          </span>
        </span>
        <span className="st-wide st-summary-col">{item.summary}</span>
        <span className="st-wide st-project">{item.project?.title ?? "—"}</span>
        <span className="st-kind">{KIND_LABEL[item.kind]}</span>
        <span className="st-date">{shortDate(item.date)}</span>
      </Link>
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
        .st-chips { display:flex; flex-wrap:wrap; gap:8px; margin:clamp(20px,2.4vw,32px) 0 clamp(8px,1vw,14px); }
        .st-chip { font-family:${satoshi}; font-size:12px; letter-spacing:0.02em; padding:5px 12px; border-radius:999px;
          border:1px solid var(--color-border-strong); background:transparent; color:var(--color-body-secondary); cursor:pointer; transition:color .15s, border-color .15s; }
        .st-chip:hover { color:var(--color-heading); border-color:var(--color-border-hover); }
        .st-chip[aria-pressed="true"] { background:var(--color-heading); border-color:var(--color-heading); color:var(--color-page); }
        .st-table { max-width:1040px; }
        .st-ledger { list-style:none; margin:0; padding:0; }
        .st-row, .st-head { display:grid; grid-template-columns:clamp(48px,6vw,84px) minmax(0,1fr) 120px 72px; gap:clamp(12px,2vw,28px); align-items:baseline; }
        .st-wide { display:none; }
        .st-summary-col { font-size:15px; line-height:1.55; color:var(--color-body-secondary); max-width:56ch;
          -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .st-project { font-size:13px; color:var(--color-body-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .st-head { padding:0 0 10px; font-family:${satoshi}; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-label); }
        .st-head span:last-child, .st-date { text-align:right; }
        .st-row { border-top:1px solid var(--color-border); padding:clamp(16px,1.8vw,24px) 0; text-decoration:none; color:inherit; }
        .st-ledger li:last-child .st-row { border-bottom:1px solid var(--color-border); }
        .st-num { font-family:${poppins}; font-weight:400; font-size:clamp(24px,2.4vw,36px); line-height:1; color:var(--color-faint); font-variant-numeric:tabular-nums; transition:color .15s; }
        .st-main { display:flex; flex-direction:column; gap:6px; min-width:0; }
        .st-title { font-family:${poppins}; font-weight:400; font-size:clamp(19px,1.6vw,24px); line-height:1.2; letter-spacing:-0.01em; color:var(--color-heading); text-wrap:balance; }
        .st-summary { font-size:14px; line-height:1.55; color:var(--color-body-secondary); max-width:60ch;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .st-kind, .st-date { font-size:13px; color:var(--color-body-secondary); white-space:nowrap; }
        .st-date { color:var(--color-label); font-variant-numeric:tabular-nums; }
        .st-fold { display:none; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-label); }
        .st-row:hover .st-num { color:var(--color-heading); }
        .st-row:hover .st-title { text-decoration:underline; text-underline-offset:5px; text-decoration-thickness:1px; }
        @media (max-width:699px) {
          .st-row { grid-template-columns:40px minmax(0,1fr); }
          .st-head, .st-kind, .st-date { display:none; }
          .st-fold { display:block; order:-1; }
        }
        @media (min-width:1280px) {
          .st-table { max-width:none; }
          .st-row, .st-head { grid-template-columns:clamp(64px,5vw,96px) minmax(0,1fr) minmax(0,1.15fr) minmax(120px,0.4fr) 110px 80px; gap:clamp(24px,2.2vw,48px); }
          .st-wide { display:block; }
          .st-summary-col { display:-webkit-box; }
          .st-narrow { display:none; }
          .st-title { font-size:clamp(22px,1.5vw,28px); }
          .st-row { padding:clamp(24px,2vw,36px) 0; }
        }
        .st-say { font-family:${satoshi}; font-size:clamp(14px,1.1vw,17px); letter-spacing:0.08em; color:var(--color-label); margin:clamp(6px,0.8vw,12px) 0 0; }
        .st-wordmark { display:flex; align-items:baseline; flex-wrap:wrap; gap:0.12em 0.22em; margin:0;
          font-family:${poppins}; font-size:clamp(40px, 5.4vw, 88px); font-weight:400; color:var(--color-heading);
          letter-spacing:-0.03em; line-height:1; overflow:visible; }
        .st-gloss { display:inline-block; white-space:nowrap; letter-spacing:-0.03em; line-height:1.85; overflow:visible; }
        .st-si { font-family:${notoSerifSinhala}; letter-spacing:0; }
        .st-slash { font-weight:300; color:var(--color-faint); }
        .st-si-cap { font-size:1.6em; line-height:0; }
        /* Latin caps already stand taller than Sinhala letters, so a smaller step matches ස by eye. */
        .st-en-cap { font-size:1.35em; line-height:0; }
      `}</style>

      <div style={{ paddingBottom: "89px", fontFamily: satoshi }}>
        <header>
          <h1 className="st-wordmark">
            <span lang="si" className="st-gloss st-si"><span className="st-si-cap">ස</span>ටහන්</span>
            <span className="st-slash" aria-hidden="true">/</span>
            <span className="st-gloss"><span className="st-en-cap">S</span>atahan</span>
          </h1>
          <p className="st-say">sa&middot;ta&middot;han</p>
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
          <div className="st-table" style={{ marginTop: hasBothKinds ? "clamp(12px, 1.4vw, 20px)" : "clamp(28px, 3vw, 44px)" }}>
            <div className="st-head" aria-hidden="true">
              <span>Nº</span>
              <span>Entry</span>
              <span className="st-wide">Summary</span>
              <span className="st-wide">Project</span>
              <span>Kind</span>
              <span>Date</span>
            </div>
            <ol className="st-ledger">
              {visible.map((item) => (
                <Row key={item.slug} item={item} />
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
