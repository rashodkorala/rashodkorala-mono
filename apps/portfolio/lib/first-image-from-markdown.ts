/**
 * First image source found in markdown / loose HTML, for list thumbnails.
 * Does not parse reference-style images. Strips fenced code blocks first.
 */
export function firstImageSrcFromMarkdown(md: string | null | undefined): string | null {
  if (!md?.trim()) return null;

  let text = md.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/^~~~[\s\S]*?~~~/gm, " ");

  const mdImg = text.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (mdImg?.[1]) {
    const raw = stripMarkdownLinkTarget(mdImg[1]);
    if (raw) return raw;
  }

  const htmlImg = text.match(/<img[^>]+src\s*=\s*["']([^"']+)["']/i);
  if (htmlImg?.[1]?.trim()) return htmlImg[1].trim();

  return null;
}

/** `url`, `<url>`, or `url "optional title"` */
function stripMarkdownLinkTarget(inner: string): string | null {
  let u = inner.trim();
  if (!u) return null;
  const angle = u.match(/^<([^>]+)>$/);
  if (angle?.[1]) u = angle[1].trim();
  const withTitle = u.match(/^(\S+)(?:\s+["'][^"']*["'])?$/);
  if (withTitle?.[1]) return withTitle[1].trim();
  return u;
}
