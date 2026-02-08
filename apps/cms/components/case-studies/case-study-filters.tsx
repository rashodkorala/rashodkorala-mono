"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

const statuses = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Drafts", value: "draft" },
  { label: "Archived", value: "archived" },
]

export function CaseStudyFilters({ currentStatus }: { currentStatus: string }) {
  const router = useRouter()

  const setFilter = (status: string) => {
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    router.push(`/protected/case-studies${params.toString() ? `?${params}` : ""}`)
  }

  return (
    <div className="flex gap-2">
      {statuses.map((s) => (
        <Button
          key={s.value}
          variant={currentStatus === s.value ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(s.value)}
        >
          {s.label}
        </Button>
      ))}
    </div>
  )
}
