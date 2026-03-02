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
    <div className="min-h-screen flex flex-col items-start justify-end pb-24 px-6">
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-black/40 dark:text-white/40 mb-4">
        Something went wrong
      </p>
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-light leading-none tracking-tight text-black dark:text-white mb-6">
        Unexpected error
      </h1>
      <p className="text-lg sm:text-xl text-black/50 dark:text-white/50 font-light mb-10 max-w-md">
        An error occurred while loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-6 py-3 border border-black/20 dark:border-white/20 rounded-full text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
