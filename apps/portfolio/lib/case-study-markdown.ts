import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";
import { cormorantGaramond, jakartaSans } from "@/lib/font";

/**
 * Case study markdown → HTML, shared by the standalone case study page and the combined
 * project + story page. Styled by CASE_STUDY_PROSE_CSS (the `.cs-*` classes).
 */

// Tags we want to preserve as raw HTML in rendered output
const SAFE_HTML_TAGS = /^\/?(video|audio|source|track|figure|figcaption|picture)\b/i

function sanitizeMd(md: string): string {
  return md
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "\n")
    // Strip self-closing JSX components (e.g. <Component />) but not safe HTML
    .replace(/<([^>\n]+)\/>/g, (match, inner) =>
      SAFE_HTML_TAGS.test(inner.trim()) ? match : "\n"
    )
    // Strip HTML/JSX tags but preserve safe media tags
    .replace(/<\/?[A-Za-z][^>\n]*>/g, (match) => {
      const inner = match.replace(/^<\/?/, "").replace(/>$/, "")
      return SAFE_HTML_TAGS.test(inner.trim()) ? match : "\n"
    })
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

export interface StoryHeading {
  id: string;
  label: string;
}

/** Renders a case study body and returns its H2s for the "On this page" nav. */
export function renderStory(md: string | null | undefined): { html: string; headings: StoryHeading[]; words: number } {
  const sanitized = md ? sanitizeMd(md) : "";
  if (!sanitized) return { html: "", headings: [], words: 0 };
  const words = sanitized
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    html: injectHeadingIds(renderMarkdown(sanitized, mdConfig)),
    headings: extractMdHeadings(sanitized),
    words,
  };
}

/** Minutes to read at ~220 words per minute (min 1). */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 220));
}

export const CASE_STUDY_PROSE_CSS = `
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
  /* Scroll offset — leaves breathing room so a heading doesn't slam the top */
  [id^="cs-md-"] { scroll-margin-top: 72px; }
`;
