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
