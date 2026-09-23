"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getTranslationQueue, translateItem } from "@/lib/actions/translations"

/**
 * Backfill: translates every project / case study that has no up-to-date Sinhala.
 * Items are processed one request at a time so a long run never hits a server timeout.
 */
export function TranslateMissingButton({ count }: { count: number }) {
  const router = useRouter()
  const [progress, setProgress] = useState<{ done: number; total: number; current: string } | null>(null)

  const run = async () => {
    try {
      const queue = await getTranslationQueue()
      if (!queue.length) {
        toast.success("Everything is already translated")
        router.refresh()
        return
      }
      let failed = 0
      for (const [i, item] of queue.entries()) {
        setProgress({ done: i, total: queue.length, current: item.title })
        try {
          const result = await translateItem(item.kind, item.id, false)
          if (!result.ok) failed++
        } catch (error) {
          failed++
          console.error(`Translating ${item.title} failed:`, error)
        }
      }
      if (failed) toast.error(`${failed} of ${queue.length} item(s) could not be fully translated`)
      else toast.success(`Translated ${queue.length} item(s) into Sinhala`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Translation failed")
    } finally {
      setProgress(null)
      router.refresh()
    }
  }

  return (
    <Button type="button" variant="outline" onClick={run} disabled={!!progress || count === 0}>
      {progress
        ? `Translating ${progress.done + 1}/${progress.total}: ${progress.current.slice(0, 24)}…`
        : count === 0
          ? "Sinhala up to date"
          : `Translate ${count} to Sinhala`}
    </Button>
  )
}
