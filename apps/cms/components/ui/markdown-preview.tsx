"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function MarkdownPreview({ content }: { content: string }) {
  if (!content?.trim()) {
    return <p className="text-sm text-muted-foreground italic">No content yet.</p>
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none
      prose-headings:font-semibold prose-headings:tracking-tight
      prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
      prose-p:text-sm prose-p:leading-relaxed
      prose-li:text-sm prose-li:leading-relaxed
      prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
      prose-pre:bg-muted prose-pre:text-xs
      prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground
      prose-a:text-primary prose-a:underline">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
