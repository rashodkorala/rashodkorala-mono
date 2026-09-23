"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { TableKit } from "@tiptap/extension-table"
import { Placeholder } from "@tiptap/extensions"
import { Markdown } from "@tiptap/markdown"
import { toast } from "sonner"
import {
  IconBold,
  IconCode,
  IconH2,
  IconH3,
  IconItalic,
  IconLink,
  IconQuote,
  IconStrikethrough,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Video } from "./video-node"
import { SlashCommand, buildSlashItems } from "./slash-command"
import { fromEditorMarkdown, toEditorMarkdown } from "./markdown-dialect"

interface MarkdownEditorProps {
  /** Initial markdown. Later changes to this prop are ignored (the editor owns the content). */
  initialValue: string
  onChange: (markdown: string) => void
  /** Uploads a pasted/dropped/picked file and resolves with its public URL. Omit to disable uploads. */
  uploadFile?: (file: File) => Promise<string>
  placeholder?: string
  className?: string
}

function countWords(text: string): number {
  const t = text.trim()
  return t ? t.split(/\s+/).length : 0
}

/**
 * Notion-style block editor that reads and writes Markdown, so `content_md` and the
 * portfolio renderer stay exactly as they are. Type "/" for blocks, select text to format,
 * paste or drop images/videos to upload them in place.
 */
export function MarkdownEditor({
  initialValue,
  onChange,
  uploadFile,
  placeholder = "Start writing, or type “/” for blocks…",
  className,
}: MarkdownEditorProps) {
  const [words, setWords] = useState(0)
  const [uploading, setUploading] = useState(0)
  const editorRef = useRef<Editor | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const uploadRef = useRef(uploadFile)
  uploadRef.current = uploadFile

  /** Uploads files and inserts them at `pos` (or the cursor). */
  const insertFiles = useCallback(async (files: File[], pos?: number) => {
    const editor = editorRef.current
    const upload = uploadRef.current
    if (!editor || !upload) return
    for (const file of files) {
      const isVideo = file.type.startsWith("video/")
      if (!isVideo && !file.type.startsWith("image/")) {
        toast.error(`${file.name}: only images and videos can be added here`)
        continue
      }
      setUploading((n) => n + 1)
      try {
        const url = await upload(file)
        const node = isVideo
          ? { type: "video", attrs: { src: url } }
          : { type: "image", attrs: { src: url, alt: file.name.replace(/\.[^/.]+$/, "") } }
        if (typeof pos === "number") editor.chain().focus().insertContentAt(pos, node).run()
        else editor.chain().focus().insertContent(node).run()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Failed to upload ${file.name}`)
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }, [])

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Markdown has no underline; keep the toolbar honest.
        underline: false,
        // Adds an empty paragraph on load, which counts as an edit (and rewrites untouched markdown).
        trailingNode: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image,
      Video,
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({
        placeholder: ({ node }) => (node.type.name === "heading" ? "Heading" : placeholder),
      }),
      Markdown,
      SlashCommand.configure({
        items: buildSlashItems(uploadFile ? (file) => insertFiles([file]) : undefined),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const editor = useEditor({
    extensions,
    content: toEditorMarkdown(initialValue),
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "cms-editor-content focus:outline-none" },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? [])
        if (!files.length || !uploadRef.current) return false
        event.preventDefault()
        void insertFiles(files)
        return true
      },
      handleDrop: (view, event, _slice, moved) => {
        const files = Array.from(event.dataTransfer?.files ?? [])
        if (moved || !files.length || !uploadRef.current) return false
        event.preventDefault()
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
        void insertFiles(files, pos)
        return true
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor
      setWords(countWords(editor.getText()))
    },
    // Only fires on real document changes, so opening and saving an untouched case study
    // leaves its stored markdown byte-for-byte identical.
    onUpdate: ({ editor }) => {
      onChangeRef.current(fromEditorMarkdown(editor.getMarkdown()))
      setWords(countWords(editor.getText()))
    },
  })

  const setLink = () => {
    if (!editor) return
    const previous = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Link URL (leave empty to remove)", previous ?? "https://")
    if (url === null) return
    if (!url.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run()
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run()
  }

  const bubbleButton = (
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    active: boolean,
    run: () => void
  ) => (
    <button
      key={label}
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent",
        active && "bg-accent text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  return (
    <div className={cn("cms-editor relative", className)}>
      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor, from, to }) =>
            from !== to && !editor.isActive("image") && !editor.isActive("video") && !editor.isActive("codeBlock")
          }
          className="z-50 flex items-center gap-0.5 rounded-lg border bg-popover p-1 text-muted-foreground shadow-lg"
        >
          {bubbleButton("Bold", IconBold, editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
          {bubbleButton("Italic", IconItalic, editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
          {bubbleButton("Strikethrough", IconStrikethrough, editor.isActive("strike"), () =>
            editor.chain().focus().toggleStrike().run()
          )}
          {bubbleButton("Inline code", IconCode, editor.isActive("code"), () => editor.chain().focus().toggleCode().run())}
          {bubbleButton("Link", IconLink, editor.isActive("link"), setLink)}
          <span className="mx-1 h-5 w-px bg-border" />
          {bubbleButton("Heading 2", IconH2, editor.isActive("heading", { level: 2 }), () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          )}
          {bubbleButton("Heading 3", IconH3, editor.isActive("heading", { level: 3 }), () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          )}
          {bubbleButton("Quote", IconQuote, editor.isActive("blockquote"), () =>
            editor.chain().focus().toggleBlockquote().run()
          )}
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />

      <div className="pointer-events-none sticky bottom-16 mt-6 flex justify-end text-xs text-muted-foreground">
        <span className="rounded-full bg-background/80 px-2 py-0.5 backdrop-blur">
          {uploading > 0 ? `Uploading ${uploading}…` : `${words.toLocaleString()} words`}
        </span>
      </div>
    </div>
  )
}
