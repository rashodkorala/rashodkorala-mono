import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 — Page Not Found",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-start justify-end pb-24 px-6">
      <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-black/40 dark:text-white/40 mb-4">
        Error
      </p>
      <h1 className="text-[clamp(6rem,20vw,18rem)] font-light leading-none tracking-tight text-black dark:text-white mb-6">
        404
      </h1>
      <p className="text-lg sm:text-xl text-black/50 dark:text-white/50 font-light mb-10 max-w-md">
        This page doesn&apos;t exist. It may have been moved or removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 border border-black/20 dark:border-white/20 rounded-full text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
