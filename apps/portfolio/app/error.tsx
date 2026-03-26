"use client"

import { useEffect } from "react"

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
    <div className="h-screen overflow-hidden bg-cream text-ink">
      <div className="h-full overflow-y-auto lg:ml-48 px-6 md:px-12 lg:px-14 flex flex-col items-start justify-end pb-24">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-ink/40 mb-4">
          Something went wrong
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light leading-none tracking-tight mb-6">
          Unexpected error
        </h1>
        <p className="text-lg sm:text-xl text-muted_ink font-light mb-10 max-w-md">
          An error occurred while loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 border border-ink/20 rounded-full text-sm hover:bg-ink hover:text-cream transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
