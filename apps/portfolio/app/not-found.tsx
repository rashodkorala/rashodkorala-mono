import Link from "next/link"
import { Metadata } from "next"
import PageShell from "@/src/components/page-shell"

export const metadata: Metadata = {
  title: "404 — Page Not Found",
}

export default function NotFound() {
  return (
    <PageShell>
      <div className="min-h-full flex flex-col items-start justify-end pb-24 md:pb-32">
        <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-label mb-4">
          Not found
        </p>
        <h1 className="text-[clamp(6rem,20vw,18rem)] font-sans font-light leading-none tracking-tight mb-6">
          404
        </h1>
        <p className="font-sans text-lg sm:text-xl text-body-secondary font-light mb-10 max-w-md">
          This page doesn&apos;t exist. It may have been moved or removed.
        </p>
        <Link
          href="/"
          className="font-sans inline-flex items-center gap-2 px-6 py-3 border border-line-strong rounded-full text-sm text-link hover:bg-surface-elevated hover:text-inverse transition-colors"
        >
          Back to home
        </Link>
      </div>
    </PageShell>
  )
}
