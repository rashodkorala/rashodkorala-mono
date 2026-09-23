import { Node, mergeAttributes } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType
    }
  }
}

/**
 * Inline `<video>` blocks in case study markdown.
 *
 * Markdown has no video syntax, so the CMS has always stored these as a raw HTML line:
 *   <video src="…" autoplay muted loop playsInline style="width:100%"></video>
 * The markdown parser hands that HTML to `parseHTML` below, and `renderMarkdown` writes the
 * same tag back, so existing case studies round-trip unchanged. The portfolio renders it as-is.
 */
export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: "video[src]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        muted: "true",
        playsinline: "true",
        class: "cms-editor-video",
      }),
    ]
  },

  // A `<video …></video>` line in markdown becomes a video block. Without this tokenizer the
  // markdown parser treats the tag as inline HTML inside a paragraph and the video is dropped.
  markdownTokenName: "video",
  markdownTokenizer: {
    name: "video",
    level: "block",
    start: (src: string) => {
      const match = /^[ \t]*<video\b/m.exec(src)
      return match ? match.index : -1
    },
    tokenize: (src: string) => {
      const match = /^[ \t]*(<video\b[^>]*>(?:[\s\S]*?<\/video>)?)[^\n]*(?:\n|$)/.exec(src)
      if (!match) return undefined
      const tag = match[1]
      const videoSrc = /\bsrc\s*=\s*"([^"]*)"/.exec(tag)?.[1] ?? /\bsrc\s*=\s*'([^']*)'/.exec(tag)?.[1]
      if (!videoSrc) return undefined
      return { type: "video", raw: match[0], src: videoSrc }
    },
  },

  parseMarkdown: (token, helpers) => helpers.createNode("video", { src: token.src }),

  renderMarkdown: (node) => {
    const src = String(node.attrs?.src ?? "").replace(/"/g, "&quot;")
    return `<video src="${src}" autoplay muted loop playsInline style="width:100%"></video>`
  },

  addCommands() {
    return {
      setVideo:
        ({ src }) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    }
  },
})
