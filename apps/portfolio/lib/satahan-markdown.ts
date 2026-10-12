import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";
import { cormorantGaramond, satoshi } from "@/lib/font";
import { sanitizeMd } from "@/lib/case-study-markdown";

/**
 * Satahan entry markdown → HTML. Styled by SATAHAN_PROSE_CSS (`.st-*` classes): a single
 * reading column, with `> [!margin] …` quotes pulled out as margin notes.
 */

const mdConfig: MarkdownParserConfig = {
  h1: "st-h",
  h2: "st-h",
  h3: "st-h3",
  p: "st-p",
  ul: "st-ul",
  li: "st-li",
  blockquote: "st-quote",
  strong: "st-strong",
  em: "st-em",
  a: "st-a",
  code: "st-code",
  pre: "st-pre",
  hr: "st-hr",
  img: "st-img",
  imgBorder: "st-img-border",
};

const MARGIN_NOTE = /<blockquote class="st-quote">\s*\[!margin\]\s*([\s\S]*?)<\/blockquote>/g;

export function renderSatahan(md: string | null | undefined): string {
  const sanitized = md ? sanitizeMd(md) : "";
  if (!sanitized) return "";
  let leadMarked = false;
  return renderMarkdown(sanitized, mdConfig)
    .replace(MARGIN_NOTE, (_, inner: string) => `<aside class="st-margin">${inner.trim()}</aside>`)
    // The first paragraph of actual text (not an image) opens with a drop cap.
    .replace(/<p class="st-p">(?!\s*<span class="theview-md-img-wrap")/g, (match) => {
      if (leadMarked) return match;
      leadMarked = true;
      return '<p class="st-p st-lead">';
    });
}

/** First sentence of the body, as plain text — shown on the index instead of a summary. */
export function openingLine(md: string | null | undefined): string | null {
  if (!md) return null;
  const para = sanitizeMd(md)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !/^(#|!\[|>|```|[-*]\s|\|)/.test(block));
  if (!para) return null;
  const plain = para
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const sentence = plain.match(/^(.+?[.!?])(\s|$)/)?.[1] ?? plain;
  return sentence.length > 220 ? `${sentence.slice(0, 217).trim()}…` : sentence;
}

export const SATAHAN_PROSE_CSS = `
  .st-body { font-family:${satoshi}; }
  .st-body::after { content:""; display:block; clear:both; }
  .st-h  { font-family:${satoshi}; font-size:11px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-body-secondary); margin:clamp(36px,4vw,52px) 0 14px; }
  .st-h3 { font-family:${cormorantGaramond}; font-size:clamp(20px,1.8vw,26px); font-weight:500; color:var(--color-heading); margin:28px 0 10px; }
  .st-p, .st-li { font-size:clamp(16px,calc(14px + 0.3vw),19px); line-height:1.8; color:var(--color-body); margin:0 0 1.2em; }
  .st-ul { list-style:none; padding:0; margin:0 0 1.2em; }
  .st-li { position:relative; padding-left:20px; margin-bottom:0.4em; }
  .st-li::before { content:'–'; position:absolute; left:0; color:var(--color-body-tertiary); }
  .st-quote { margin:clamp(28px,3vw,40px) 0; padding-left:clamp(16px,2vw,24px); border-left:1px solid var(--color-border-strong);
    font-family:${cormorantGaramond}; font-style:italic; font-size:clamp(20px,1.8vw,26px); line-height:1.45; color:var(--color-title); }
  .st-strong { font-weight:600; color:var(--color-heading); }
  .st-em { font-style:italic; }
  .st-a { color:var(--color-link); text-decoration:underline; text-underline-offset:4px; text-decoration-color:var(--color-link-underline); }
  .st-code { font-size:0.875em; background:var(--color-surface); padding:2px 6px; }
  .st-pre { background:var(--color-surface); padding:16px; overflow-x:auto; font-size:13px; line-height:1.6; margin:0 0 1.2em; }
  .st-hr { border:none; text-align:center; margin:clamp(32px,4vw,48px) 0; }
  .st-hr::before { content:"· · ·"; color:var(--color-body-tertiary); letter-spacing:0.4em; }
  .st-body .st-lead::first-letter { font-family:${cormorantGaramond}; font-size:3.4em; float:left; line-height:0.82; margin:0.06em 0.08em 0 0; color:var(--color-heading); }
  .st-body .theview-md-img-wrap { display:block; margin:clamp(24px,3vw,36px) 0; }
  .st-body .st-img { display:block; width:100%; height:auto; max-height:min(80vh,900px); object-fit:contain; }
  .st-body .st-img-border { border:1px solid var(--color-border); }
  .st-margin { display:block; font-size:13px; line-height:1.6; color:var(--color-caption); border-top:1px solid var(--color-border); padding-top:8px; margin:0 0 1.2em; }
  @media (min-width:1180px) {
    .st-margin { float:right; clear:right; width:220px; margin:4px -264px 16px 0; }
  }
  @media (max-width:1179px) {
    .st-margin { border-top:none; border-left:1px solid var(--color-border-strong); padding:2px 0 2px 14px; }
  }
`;
