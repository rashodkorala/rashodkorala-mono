"use client"

import { useState } from "react"
import { IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

/**
 * Chip input: Enter or comma adds, Backspace on an empty input removes the last chip.
 * Pasting "React, Supabase, TypeScript" adds all three.
 */
export function TagInput({
  value,
  onChange,
  placeholder = "Add and press Enter",
  id,
  className,
}: {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  id?: string
  className?: string
}) {
  const [draft, setDraft] = useState("")

  const add = (raw: string) => {
    const next = raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !value.some((v) => v.toLowerCase() === t.toLowerCase()))
    if (next.length) onChange([...value, ...next])
    setDraft("")
  }

  return (
    <div
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-2 py-1.5 text-sm shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className
      )}
    >
      {value.map((tag, i) => (
        <span key={`${tag}-${i}`} className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-muted-foreground hover:text-foreground"
          >
            <IconX className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        placeholder={value.length ? "" : placeholder}
        onChange={(e) => {
          const v = e.target.value
          if (v.includes(",")) add(v)
          else setDraft(v)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            add(draft)
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={() => draft.trim() && add(draft)}
        className="min-w-[6rem] flex-1 bg-transparent py-0.5 outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
