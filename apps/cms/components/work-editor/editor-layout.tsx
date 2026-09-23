"use client"

import { useEffect, useLayoutEffect, useReducer, useRef, useState, type ReactNode, type RefObject } from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Two-column editor: a calm writing column on the left, every setting in a sticky sidebar
 * on the right (stacked below the writing on small screens).
 */
export function EditorLayout({ main, sidebar }: { main: ReactNode; sidebar: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-2 md:px-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="mx-auto w-full min-w-0 max-w-[46rem]">{main}</div>
      <aside className="space-y-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:pb-24">
        {sidebar}
      </aside>
    </div>
  )
}

/** Collapsible settings group for the sidebar. */
export function SidebarSection({
  title,
  hint,
  defaultOpen = false,
  children,
}: {
  title: string
  /** Short summary shown next to the title while collapsed (e.g. "3 images"). */
  hint?: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="rounded-xl border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="text-sm font-medium">{title}</span>
        <span className="flex min-w-0 items-center gap-2">
          {!open && hint && <span className="truncate text-xs text-muted-foreground">{hint}</span>}
          <IconChevronDown
            className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </span>
      </button>
      {open && <div className="space-y-4 border-t px-4 pb-4 pt-4">{children}</div>}
    </section>
  )
}

/** Borderless textarea that grows with its content — used for the big title and summary. */
export function AutoGrowTextarea({
  value,
  onChange,
  className,
  ...props
}: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> & {
  value: string
  onChange: (value: string) => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full resize-none overflow-hidden border-0 bg-transparent p-0 shadow-none outline-none placeholder:text-muted-foreground/50 focus:ring-0",
        className
      )}
      {...props}
    />
  )
}

/** Save state + actions, pinned to the bottom of the viewport while the form scrolls. */
export function SaveBar({
  dirty,
  saving,
  submitLabel,
  onCancel,
  extra,
}: {
  dirty: boolean
  saving: boolean
  submitLabel: string
  onCancel: () => void
  extra?: ReactNode
}) {
  return (
    // Sticky (not fixed) so it stays inside the CMS content area whatever the sidebar is doing.
    <div className="sticky bottom-0 z-40 border-t bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <p className="text-xs text-muted-foreground">
          {saving ? "Saving…" : dirty ? "Unsaved changes" : "No unsaved changes"}
          <span className="ml-2 hidden sm:inline">· ⌘S to save</span>
        </p>
        <div className="flex items-center gap-2">
          {extra}
          <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : submitLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Tracks whether the form changed since it loaded, warns before leaving with unsaved work,
 * and submits on ⌘S / Ctrl+S.
 */
export function useEditorShortcuts(formRef: RefObject<HTMLFormElement | null>, values: unknown[], saving: boolean) {
  // Compare against a snapshot of the loaded values (Files by name/size) rather than counting
  // renders, so dev-mode double effects or no-op updates don't flag the form as changed.
  const snapshot = JSON.stringify(values, (_key, v) => (v instanceof File ? `file:${v.name}:${v.size}` : v))
  const saved = useRef(snapshot)
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const dirty = snapshot !== saved.current

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty || saving) return
      e.preventDefault()
      e.returnValue = ""
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        if (!saving) formRef.current?.requestSubmit()
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [dirty, saving, formRef])

  return {
    dirty,
    markSaved: () => {
      saved.current = snapshot
      rerender()
    },
  }
}
