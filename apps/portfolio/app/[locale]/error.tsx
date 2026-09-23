"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import PageShell from "@/src/components/page-shell"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("Error")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageShell>
      <div className="min-h-full flex flex-col items-start justify-end pb-24 md:pb-32">
        <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-label mb-4">
          {t("eyebrow")}
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-sans font-light leading-none tracking-tight mb-6">
          {t("title")}
        </h1>
        <p className="font-sans text-lg sm:text-xl text-body-secondary font-light mb-10 max-w-md">
          {t("body")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="font-sans inline-flex items-center gap-2 px-6 py-3 border border-line-strong rounded-full text-sm text-link hover:bg-surface-elevated hover:text-inverse transition-colors"
        >
          {t("retry")}
        </button>
      </div>
    </PageShell>
  )
}
