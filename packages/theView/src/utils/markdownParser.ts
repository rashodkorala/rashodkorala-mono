import type { MarkdownParserConfig } from "../types"

export function renderMarkdown(content: string, config: MarkdownParserConfig): string {
  // Check if content is already HTML
  const isHTML = /<[a-z][\s\S]*>/i.test(content)

  if (isHTML) {
    // If it's HTML, wrap it with styling classes
    return `<div class="blog-content">${content}</div>`
  }

  // Otherwise, process as markdown
  let html = content

  // Headers (must come before paragraph processing)
  html = html.replace(/^### (.*)$/gim, `<h3 class="${config.h3}">$1</h3>`)
  html = html.replace(/^## (.*)$/gim, `<h2 class="${config.h2}">$1</h2>`)
  html = html.replace(/^# (.*)$/gim, `<h1 class="${config.h1}">$1</h1>`)

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/gim, `<pre class="${config.pre}"><code class="text-sm font-mono">$1</code></pre>`)

  // Horizontal rules
  html = html.replace(/^\s*---\s*$/gim, `<hr class="my-8 border-0 border-t border-black/10" />`)

  // Inline code
  html = html.replace(/`([^`]+)`/gim, `<code class="${config.code}">$1</code>`)

  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, `<strong class="${config.strong}">$1</strong>`)
  html = html.replace(/\*(.*?)\*/gim, `<em class="${config.em}">$1</em>`)

  // Images - handle markdown image syntax ![alt text](url) - must come before links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (match, alt, url) => {
    // Extract filename for alt text if alt is empty
    const altText = alt || url.split('/').pop()?.split('?')[0] || 'Image'
    // Escape HTML in alt text
    const escapedAlt = altText.replace(/"/g, '&quot;')
    return `<div class="my-8"><img src="${url}" alt="${escapedAlt}" class="w-full h-auto rounded-lg border ${config.imgBorder} object-cover" loading="lazy" /></div>`
  })

  // Links (must come after images to avoid conflicts)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, `<a href="$2" class="${config.a}">$1</a>`)

  // Markdown tables
  html = html.replace(/((?:^\|.*\|\s*$\n?){2,})/gim, (tableBlock) => {
    const lines = tableBlock
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length < 2) return tableBlock

    const separatorLine = lines[1]
    const isSeparator = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(separatorLine)
    if (!isSeparator) return tableBlock

    const parseRow = (line: string) =>
      line
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim())

    const headers = parseRow(lines[0])
    const bodyRows = lines.slice(2).map(parseRow).filter((row) => row.length > 0)

    const thead = `<thead><tr>${headers
      .map((cell) => `<th class="px-3 py-2 text-left font-medium border-b border-black/10">${cell}</th>`)
      .join("")}</tr></thead>`

    const tbody = `<tbody>${bodyRows
      .map(
        (row) =>
          `<tr>${row
            .map((cell) => `<td class="px-3 py-2 align-top border-b border-black/5">${cell}</td>`)
            .join("")}</tr>`
      )
      .join("")}</tbody>`

    return `<div class="my-8 overflow-x-auto"><table class="w-full border-collapse text-sm">${thead}${tbody}</table></div>`
  })

  // Split by double newlines for paragraphs
  const paragraphs = html.split(/\n\n+/)
  html = paragraphs
    .map(para => {
      para = para.trim()
      if (!para) return ''
      // Skip if already wrapped in HTML tags (like images, headers, etc.)
      if (para.startsWith('<')) return para
      return `<p class="${config.p}">${para.replace(/\n/g, '<br />')}</p>`
    })
    .join('')

  return html
}
