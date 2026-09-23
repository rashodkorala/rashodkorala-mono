/**
 * Bridges the portfolio's markdown dialect and the editor's CommonMark.
 *
 * Case studies are rendered on the portfolio by `renderMarkdown` in packages/theView, a
 * line-based parser that differs from CommonMark in ways that matter:
 *   - a single newline inside a paragraph is a visible line break (<br />);
 *   - a line starting with #, -, >, ---, ``` always starts a new block (so "text\n---" is a
 *     paragraph followed by a divider, not a setext heading);
 *   - backslash escapes are not understood — "\*" is shown with the backslash.
 *
 * `toEditorMarkdown` rewrites stored content into CommonMark that means the same thing, and
 * `fromEditorMarkdown` strips the escapes the editor adds, so what the editor shows is what
 * the portfolio renders.
 */

function isBlockStart(line: string): boolean {
  const t = line.trim()
  if (!t) return false
  return (
    t.startsWith("```") ||
    t.startsWith("#") ||
    /^[-*+]\s/.test(t) ||
    /^\d+\.\s/.test(t) ||
    t.startsWith(">") ||
    /^---+$/.test(t) ||
    /^\*{3,}$/.test(t)
  )
}

function isTableAt(lines: string[], i: number): boolean {
  return (lines[i]?.includes("|") ?? false) && /^\|?\s*:?-{3,}/.test(lines[i + 1]?.trim() ?? "")
}

const IMAGE_ONLY = /^!\[[^\]]*\]\([^)]+\)$/

/** Portfolio dialect → CommonMark with the same meaning (mirrors theView's block parser). */
export function toEditorMarkdown(stored: string): string {
  const lines = stored.replace(/\r\n?/g, "\n").split("\n")
  const blocks: string[] = []
  let i = 0

  const collect = (keep: (trimmed: string) => boolean) => {
    const out: string[] = []
    while (i < lines.length && lines[i].trim() !== "" && keep(lines[i].trim())) {
      out.push(lines[i].trim())
      i++
    }
    return out
  }

  while (i < lines.length) {
    const t = lines[i].trim()
    if (!t) {
      i++
      continue
    }

    if (/^<[a-zA-Z]/.test(t)) {
      blocks.push(collect(() => true).join("\n"))
      continue
    }

    if (t.startsWith("```")) {
      const fence = [lines[i]]
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) fence.push(lines[i++])
      fence.push(i < lines.length ? lines[i++] : "```")
      blocks.push(fence.join("\n"))
      continue
    }

    if (isTableAt(lines, i)) {
      const rows = [lines[i].trim(), lines[i + 1].trim()]
      i += 2
      rows.push(...collect((l) => l.includes("|")))
      blocks.push(rows.join("\n"))
      continue
    }

    if (/^#{1,3} /.test(t)) {
      blocks.push(t)
      i++
      continue
    }

    if (/^---+$/.test(t) || /^\*{3,}$/.test(t)) {
      blocks.push("---")
      i++
      continue
    }

    if (t.startsWith(">")) {
      // theView renders each quoted line as its own line inside one quote.
      const quoted = collect((l) => l.startsWith(">")).map((l) => l.replace(/^>\s?/, ""))
      blocks.push(quoted.map((l) => `> ${l}`).join("\n>\n"))
      continue
    }

    if (/^[-*+]\s/.test(t)) {
      const items = collect((l) => /^[-*+]\s+/.test(l)).map((l) => l.replace(/^[-*+]\s+/, ""))
      blocks.push(items.map((item) => `- ${item}`).join("\n"))
      continue
    }

    if (/^\d+\.\s/.test(t)) {
      const items = collect((l) => /^\d+\.\s+/.test(l)).map((l) => l.replace(/^\d+\.\s+/, ""))
      blocks.push(items.map((item, n) => `${n + 1}. ${item}`).join("\n"))
      continue
    }

    // Paragraph: runs until a blank line or a line that starts another block.
    const para: string[] = []
    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim()) break
      if (para.length > 0 && isBlockStart(line)) break
      para.push(line.trim())
      i++
    }

    // Images get their own block in the editor; the remaining lines keep their hard breaks.
    let run: string[] = []
    const flush = () => {
      if (run.length) blocks.push(run.join("  \n"))
      run = []
    }
    for (const line of para) {
      if (IMAGE_ONLY.test(line)) {
        flush()
        blocks.push(line)
      } else {
        run.push(line)
      }
    }
    flush()
  }

  return blocks.join("\n\n")
}

/** Characters the editor escapes that theView would print literally. */
const ESCAPED = /\\([\\`*_{}[\]()#+\-.!|>~<])/g
/** HTML entities the editor writes (e.g. in table cells); theView escapes text itself. */
const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }
const ENTITY = /&(?:amp|lt|gt|quot|#39);/g

function unescapeText(text: string): string {
  return text.replace(ESCAPED, "$1").replace(ENTITY, (e) => ENTITIES[e])
}

/** Editor CommonMark → portfolio dialect: drops backslash escapes and entities outside code. */
export function fromEditorMarkdown(markdown: string): string {
  const out: string[] = []
  let inFence = false
  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence
      out.push(line)
      continue
    }
    if (inFence) {
      out.push(line)
      continue
    }
    // Raw HTML lines (videos) pass through theView untouched, so keep their attributes as-is.
    if (/^\s*<[a-zA-Z]/.test(line)) {
      out.push(line)
      continue
    }
    // Leave inline `code` spans untouched.
    out.push(
      line
        .split(/(`[^`]*`)/)
        .map((part) => (part.startsWith("`") && part.endsWith("`") && part.length > 1 ? part : unescapeText(part)))
        .join("")
    )
  }
  return out.join("\n")
}
