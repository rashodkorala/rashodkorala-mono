import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 — Page Not Found",
}

export default function NotFound() {
  return (
    <div className="h-screen overflow-hidden bg-cream text-ink">
      <div className="h-full overflow-y-auto lg:ml-48 px-6 md:px-12 lg:px-14 flex flex-col items-start justify-end pb-24">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-ink/40 mb-4">
          Error
        </p>
        <h1 className="text-[clamp(6rem,20vw,18rem)] font-serif font-light leading-none tracking-tight mb-6">
          404
        </h1>
        <p className="text-lg sm:text-xl text-muted_ink font-light mb-10 max-w-md">
          This page doesn&apos;t exist. It may have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-ink/20 rounded-full text-sm hover:bg-ink hover:text-cream transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
