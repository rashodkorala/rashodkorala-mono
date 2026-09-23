"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Extension, type Editor, type Range } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import Suggestion, { type SuggestionKeyDownProps, type SuggestionProps } from "@tiptap/suggestion"
import {
  IconBlockquote,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconListNumbers,
  IconMovie,
  IconPhoto,
  IconSeparatorHorizontal,
  IconTable,
  IconTypography,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export interface SlashItem {
  title: string
  description: string
  keywords: string[]
  icon: React.ComponentType<{ className?: string }>
  run: (editor: Editor, range: Range) => void
}

/** Opens a file picker and resolves with the chosen file (or null). */
function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = accept
    input.onchange = () => resolve(input.files?.[0] ?? null)
    input.click()
  })
}

export function buildSlashItems(upload?: (file: File) => Promise<void>): SlashItem[] {
  const items: SlashItem[] = [
    {
      title: "Text",
      description: "Plain paragraph",
      keywords: ["paragraph", "p"],
      icon: IconTypography,
      run: (e, r) => e.chain().focus().deleteRange(r).setParagraph().run(),
    },
    {
      title: "Heading 1",
      description: "Big section title",
      keywords: ["h1", "title"],
      icon: IconH1,
      run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 1 }).run(),
    },
    {
      title: "Heading 2",
      description: "Section — shows in “On this page”",
      keywords: ["h2", "section"],
      icon: IconH2,
      run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 2 }).run(),
    },
    {
      title: "Heading 3",
      description: "Sub-section",
      keywords: ["h3", "subheading"],
      icon: IconH3,
      run: (e, r) => e.chain().focus().deleteRange(r).setHeading({ level: 3 }).run(),
    },
    {
      title: "Bulleted list",
      description: "Simple list",
      keywords: ["ul", "bullet", "list"],
      icon: IconList,
      run: (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run(),
    },
    {
      title: "Numbered list",
      description: "Ordered steps",
      keywords: ["ol", "number", "ordered"],
      icon: IconListNumbers,
      run: (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run(),
    },
    {
      title: "Quote",
      description: "Pull quote",
      keywords: ["blockquote", "quote"],
      icon: IconBlockquote,
      run: (e, r) => e.chain().focus().deleteRange(r).toggleBlockquote().run(),
    },
    {
      title: "Code block",
      description: "Monospaced snippet",
      keywords: ["code", "snippet", "pre"],
      icon: IconCode,
      run: (e, r) => e.chain().focus().deleteRange(r).toggleCodeBlock().run(),
    },
    {
      title: "Table",
      description: "3 × 3 grid",
      keywords: ["table", "grid"],
      icon: IconTable,
      run: (e, r) => e.chain().focus().deleteRange(r).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      title: "Divider",
      description: "Horizontal rule",
      keywords: ["hr", "divider", "line", "separator"],
      icon: IconSeparatorHorizontal,
      run: (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run(),
    },
  ]

  if (upload) {
    items.push(
      {
        title: "Image",
        description: "Upload an image",
        keywords: ["image", "photo", "picture", "img"],
        icon: IconPhoto,
        run: async (e, r) => {
          e.chain().focus().deleteRange(r).run()
          const file = await pickFile("image/*")
          if (file) await upload(file)
        },
      },
      {
        title: "Video",
        description: "Upload a video (autoplays, muted, loops)",
        keywords: ["video", "movie", "clip", "mp4"],
        icon: IconMovie,
        run: async (e, r) => {
          e.chain().focus().deleteRange(r).run()
          const file = await pickFile("video/*")
          if (file) await upload(file)
        },
      }
    )
  }
  return items
}

interface SlashMenuHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean
}

const SlashMenu = forwardRef<SlashMenuHandle, SuggestionProps<SlashItem, SlashItem>>(function SlashMenu(
  { items, command },
  ref
) {
  const [selected, setSelected] = useState(0)
  useEffect(() => setSelected(0), [items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (!items.length) return false
      if (event.key === "ArrowDown") {
        setSelected((i) => (i + 1) % items.length)
        return true
      }
      if (event.key === "ArrowUp") {
        setSelected((i) => (i - 1 + items.length) % items.length)
        return true
      }
      if (event.key === "Enter") {
        command(items[selected])
        return true
      }
      return false
    },
  }))

  if (!items.length) {
    return (
      <div className="w-64 rounded-lg border bg-popover p-3 text-sm text-muted-foreground shadow-lg">
        No matching blocks
      </div>
    )
  }

  return (
    <div className="max-h-80 w-72 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg">
      {items.map((item, i) => (
        <button
          key={item.title}
          type="button"
          onMouseEnter={() => setSelected(i)}
          onMouseDown={(e) => {
            e.preventDefault()
            command(item)
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left",
            i === selected && "bg-accent text-accent-foreground"
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background">
            <item.icon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">{item.title}</span>
            <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
          </span>
        </button>
      ))}
    </div>
  )
})

/** Notion-style "/" menu for inserting blocks. */
export const SlashCommand = Extension.create<{ items: SlashItem[] }>({
  name: "slashCommand",

  addOptions() {
    return { items: [] }
  },

  addProseMirrorPlugins() {
    const allItems = this.options.items
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: "/",
        startOfLine: false,
        allowSpaces: false,
        items: ({ query }) => {
          const q = query.toLowerCase()
          return allItems.filter(
            (item) => item.title.toLowerCase().includes(q) || item.keywords.some((k) => k.startsWith(q))
          )
        },
        command: ({ editor, range, props }) => props.run(editor, range),
        render: () => {
          let renderer: ReactRenderer<SlashMenuHandle, SuggestionProps<SlashItem, SlashItem>> | null = null
          let unmount: (() => void) | null = null
          return {
            onStart: (props) => {
              renderer = new ReactRenderer(SlashMenu, { props, editor: props.editor })
              unmount = props.mount(renderer.element as HTMLElement)
            },
            onUpdate: (props) => renderer?.updateProps(props),
            onKeyDown: (props) => {
              if (props.event.key === "Escape") return false
              return renderer?.ref?.onKeyDown(props) ?? false
            },
            onExit: () => {
              unmount?.()
              renderer?.destroy()
              renderer = null
              unmount = null
            },
          }
        },
      }),
    ]
  },
})
