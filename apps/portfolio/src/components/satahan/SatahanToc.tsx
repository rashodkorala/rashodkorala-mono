"use client";

import { useEffect, useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
}

/** Contents list for an entry, collapsed behind a toggle (see `.se-toc-*` CSS). */
export default function SatahanToc({ headings }: { headings: TocHeading[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => !!node);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Band from ~6% to ~30% of the viewport: an anchored heading (header + 21px) lands inside it.
      { rootMargin: "-6% 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="se-toc" aria-label="Contents" data-open={open ? "true" : "false"}>
      <p className="se-toc-label">Contents</p>
      <button
        type="button"
        className="se-toc-toggle"
        aria-expanded={open}
        aria-controls="se-toc-list"
        onClick={() => setOpen((v) => !v)}
      >
        Contents
        <span aria-hidden="true">{open ? "–" : "+"}</span>
      </button>
      <ol id="se-toc-list">
        {headings.map((heading, i) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              onClick={() => {
                setActive(heading.id);
                setOpen(false);
              }}
            >
              <span className="se-toc-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
