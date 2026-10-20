import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";
import { cormorantGaramond, poppins, satoshi } from "@/lib/font";
import { sanitizeMd } from "@/lib/case-study-markdown";

/**
 * Satahan entry markdown → HTML. Styled by SATAHAN_PROSE_CSS (`.st-*` classes): a single
 * reading column, with `> [!margin] …` quotes set off as inline margin notes.
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
  return renderMarkdown(sanitized, mdConfig).replace(
    MARGIN_NOTE,
    (_, inner: string) => `<aside class="st-margin">${inner.trim()}</aside>`,
  );
}

export const SATAHAN_PROSE_CSS = `
  .st-body { font-family:${satoshi}; }
  .st-body::after { content:""; display:block; clear:both; }
  .st-h  { font-family:${satoshi}; font-size:11px; font-weight:400; letter-spacing:0.12em; text-transform:uppercase; color:var(--color-body-secondary); margin:clamp(36px,4vw,52px) 0 14px; }
  .st-h3 { font-family:${poppins}; font-size:clamp(20px,1.8vw,26px); font-weight:400; color:var(--color-heading); margin:28px 0 10px; }
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
  .st-body .theview-md-img-wrap { display:block; margin:clamp(24px,3vw,36px) 0; }
  .st-body .st-img { display:block; width:100%; height:auto; max-height:min(80vh,900px); object-fit:contain; border:none; }
  .st-body .st-img-border { border:none; }
  .st-margin { display:block; font-size:14px; line-height:1.6; color:var(--color-caption); margin:0 0 1.2em;
    border-left:1px solid var(--color-border-strong); padding:2px 0 2px 14px; }
`;
