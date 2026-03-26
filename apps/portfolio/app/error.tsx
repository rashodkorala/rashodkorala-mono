"use client"

import { useEffect } from "react"
import PageShell from "@/src/components/page-shell"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageShell>
      <div className="min-h-full flex flex-col items-start justify-end pb-24 md:pb-32">
        <p className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-xs sm:text-sm tracking-[0.3em] uppercase text-ink/40 dark:text-[#8f8780] mb-4">
          Something went wrong
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light leading-none tracking-tight mb-6">
          Unexpected error
        </h1>
        <p className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-lg sm:text-xl text-muted_ink font-light mb-10 max-w-md dark:text-[#b5ada6]">
          An error occurred while loading this page. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] inline-flex items-center gap-2 px-6 py-3 border border-ink/20 dark:border-[#4d4844] rounded-full text-sm text-ink dark:text-[#ece7df] hover:bg-ink hover:text-cream dark:hover:bg-[#ece7df] dark:hover:text-[#121110] transition-colors"
        >
          Try again
        </button>
      </div>
    </PageShell>
  )
}
