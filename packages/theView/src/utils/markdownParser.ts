import type { MarkdownParserConfig } from "../types"

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function sanitizeUrl(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  if (t.startsWith("http://") || t.startsWith("https://")) return t
  if (t.startsWith("/") || t.startsWith("#") || t.startsWith("mailto:")) return t
  return null
}

function resolveDefaults(config: MarkdownParserConfig) {
  return {
    ul:
      config.ul ??
      "my-6 pl-6 list-disc space-y-2 marker:text-black/35 [&_li]:pl-0.5",
    ol:
      config.ol ??
      "my-6 pl-6 list-decimal list-outside space-y-2 marker:text-black/35 [&_li]:pl-0.5",
    li: config.li ?? "text-black/70 leading-relaxed",
    blockquote:
      config.blockquote ??
      "my-6 border-l-4 border-black/20 pl-4 italic text-black/60 [&_p]:mb-2 [&_p:last-child]:mb-0",
    hr: config.hr ?? "my-10 border-0 border-t border-black/10",
    th: config.th ?? "px-3 py-2 text-left font-medium border-b border-black/10",
    td: config.td ?? "px-3 py-2 align-top border-b border-black/5",
  }
}

/** Inline markdown on a single escaped segment (no backticks — those are split out earlier). */
function formatInlineSegment(s: string, config: MarkdownParserConfig): string {
  let t = escapeHtml(s)
  // Bold ** and __ (before single * / _)
  t = t.replace(/\*\*([\s\S]+?)\*\*/g, `<strong class="${config.strong}">$1</strong>`)
  t = t.replace(/__(.+?)__/g, `<strong class="${config.strong}">$1</strong>`)
  // Italic * and _
  t = t.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, `<em class="${config.em}">$1</em>`)
  t = t.replace(/(?<!_)_([^_]+)_(?!_)/g, `<em class="${config.em}">$1</em>`)
  // Strikethrough
  t = t.replace(/~~(.+?)~~/g, `<del class="opacity-75">$1</del>`)
  // Images (block-level in flow)
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    const safe = sanitizeUrl(url)
    if (!safe) return `![${escapeHtml(alt)}](${escapeHtml(url)})`
    const altText = alt || safe.split("/").pop()?.split("?")[0] || "Image"
    return `<span class="theview-md-img-wrap"><img src="${safe}" alt="${escapeHtml(altText)}" class="${config.img} border ${config.imgBorder}" loading="lazy" /></span>`
  })
  // Links
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const safe = sanitizeUrl(url)
    if (!safe) return `[${label}](${escapeHtml(url)})`
    const isExternal = /^https?:\/\//i.test(safe)
    const rel = isExternal ? ' rel="noopener noreferrer"' : ""
    return `<a href="${safe}" class="${config.a}"${rel}>${label}</a>`
  })
  return t
}

/**
 * Apply inline markdown: code spans first, then bold/italic/links/images on text parts.
 */
function applyInlineMarkdown(text: string, config: MarkdownParserConfig): string {
  const parts: Array<{ type: "code" | "text"; value: string }> = []
  let remaining = text
  while (remaining.length > 0) {
    const idx = remaining.indexOf("`")
    if (idx === -1) {
      parts.push({ type: "text", value: remaining })
      break
    }
    if (idx > 0) parts.push({ type: "text", value: remaining.slice(0, idx) })
    remaining = remaining.slice(idx + 1)
    const end = remaining.indexOf("`")
    if (end === -1) {
      parts.push({ type: "text", value: "`" + remaining })
      break
    }
    parts.push({ type: "code", value: remaining.slice(0, end) })
    remaining = remaining.slice(end + 1)
  }

  return parts
    .map((part) => {
      if (part.type === "code") {
        return `<code class="${config.code}">${escapeHtml(part.value)}</code>`
      }
      return formatInlineSegment(part.value, config)
    })
    .join("")
}

function isBlockStart(line: string): boolean {
  const t = line.trim()
  if (!t) return false
  if (t.startsWith("```")) return true
  if (t.startsWith("#")) return true
  if (/^[-*+]\s/.test(t)) return true
  if (/^\d+\.\s/.test(t)) return true
  if (t.startsWith(">")) return true
  if (/^\s*---+\s*$/.test(t) || /^\s*\*{3,}\s*$/.test(t)) return true
  return false
}

function parseTable(
  lines: string[],
  start: number
): { headers: string[]; bodyRows: string[][]; nextIndex: number } | null {
  const row0 = lines[start]?.trim() ?? ""
  if (!row0.includes("|")) return null
  const row1 = lines[start + 1]?.trim() ?? ""
  if (!/^\|?\s*:?-{3,}/.test(row1)) return null

  const parseRow = (line: string) =>
    line
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((cell) => cell.trim())

  const headers = parseRow(row0)
  if (headers.length === 0) return null

  const bodyRows: string[][] = []
  let j = start + 2
  while (j < lines.length) {
    const L = lines[j].trim()
    if (L === "" || !L.includes("|")) break
    bodyRows.push(parseRow(L))
    j++
  }

  return { headers, bodyRows, nextIndex: j }
}

function renderTable(
  headers: string[],
  bodyRows: string[][],
  config: MarkdownParserConfig,
  d: ReturnType<typeof resolveDefaults>
): string {
  const thead = `<thead><tr>${headers
    .map((cell) => `<th class="${d.th}">${applyInlineMarkdown(cell, config)}</th>`)
    .join("")}</tr></thead>`
  const tbody = `<tbody>${bodyRows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td class="${d.td}">${applyInlineMarkdown(cell, config)}</td>`)
          .join("")}</tr>`
    )
    .join("")}</tbody>`
  return `<div class="my-8 overflow-x-auto"><table class="w-full border-collapse text-sm">${thead}${tbody}</table></div>`
}

export function renderMarkdown(content: string, config: MarkdownParserConfig): string {
  const d = resolveDefaults(config)
  const lines = content.split(/\n/)
  const blocks: string[] = []
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const trimmed = raw.trim()

    if (trimmed === "") {
      i++
      continue
    }

    // Raw HTML block passthrough — lines starting with an HTML tag are passed through as-is
    if (/^<[a-zA-Z]/.test(trimmed)) {
      const htmlLines: string[] = []
      while (i < lines.length && lines[i].trim() !== "") {
        htmlLines.push(lines[i])
        i++
      }
      blocks.push(htmlLines.join("\n"))
      continue
    }

    // Fenced code blocks
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) i++
      const code = codeLines.join("\n")
      blocks.push(
        `<pre class="${config.pre}"><code class="text-sm font-mono">${escapeHtml(code)}</code></pre>`
      )
      continue
    }

    // Pipe tables (must run before generic paragraph)
    if (trimmed.includes("|")) {
      const parsed = parseTable(lines, i)
      if (parsed) {
        blocks.push(renderTable(parsed.headers, parsed.bodyRows, config, d))
        i = parsed.nextIndex
        continue
      }
    }

    // ATX headers
    if (trimmed.startsWith("### ")) {
      blocks.push(`<h3 class="${config.h3}">${applyInlineMarkdown(trimmed.slice(4), config)}</h3>`)
      i++
      continue
    }
    if (trimmed.startsWith("## ")) {
      blocks.push(`<h2 class="${config.h2}">${applyInlineMarkdown(trimmed.slice(3), config)}</h2>`)
      i++
      continue
    }
    if (trimmed.startsWith("# ")) {
      blocks.push(`<h1 class="${config.h1}">${applyInlineMarkdown(trimmed.slice(2), config)}</h1>`)
      i++
      continue
    }

    // Horizontal rules
    if (/^---+$/.test(trimmed) || /^\*{3,}$/.test(trimmed)) {
      blocks.push(`<hr class="${d.hr}" />`)
      i++
      continue
    }

    // Blockquotes
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = []
      while (i < lines.length) {
        const t = lines[i].trim()
        if (t === "") break
        if (!t.startsWith(">")) break
        quoteLines.push(t.replace(/^>\s?/, ""))
        i++
      }
      const inner = quoteLines.join("\n\n")
      blocks.push(
        `<blockquote class="${d.blockquote}">${applyInlineMarkdown(inner, config).replace(/\n/g, "<br />")}</blockquote>`
      )
      continue
    }

    // Unordered lists
    if (/^[-*+]\s/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length) {
        const t = lines[i].trim()
        if (t === "") break
        const m = /^[-*+]\s+(.*)$/.exec(t)
        if (!m) break
        items.push(m[1])
        i++
      }
      const lis = items
        .map((item) => `<li class="${d.li}">${applyInlineMarkdown(item, config)}</li>`)
        .join("")
      blocks.push(`<ul class="${d.ul}">${lis}</ul>`)
      continue
    }

    // Ordered lists
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length) {
        const t = lines[i].trim()
        if (t === "") break
        const m = /^\d+\.\s+(.*)$/.exec(t)
        if (!m) break
        items.push(m[1])
        i++
      }
      const lis = items
        .map((item) => `<li class="${d.li}">${applyInlineMarkdown(item, config)}</li>`)
        .join("")
      blocks.push(`<ol class="${d.ol}">${lis}</ol>`)
      continue
    }

    // Paragraph: lines until blank or block start
    const paraLines: string[] = []
    while (i < lines.length) {
      const L = lines[i]
      if (L.trim() === "") break
      if (paraLines.length > 0 && isBlockStart(L)) break
      paraLines.push(L)
      i++
    }

    if (paraLines.length === 0) continue

    const body = paraLines.map((l) => l.trimEnd()).join("\n")
    const withBreaks = applyInlineMarkdown(body, config).replace(/\n/g, "<br />")
    blocks.push(`<p class="${config.p}">${withBreaks}</p>`)
  }

  return blocks.join("")
}
