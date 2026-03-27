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
        <p className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-xs sm:text-sm tracking-[0.3em] uppercase text-ink/40 dark:text-[#8f8780] mb-4">
          Not found
        </p>
        <h1 className="text-[clamp(6rem,20vw,18rem)] font-serif font-light leading-none tracking-tight mb-6">
          404
        </h1>
        <p className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-lg sm:text-xl text-muted_ink font-light mb-10 max-w-md dark:text-[#b5ada6]">
          This page doesn&apos;t exist. It may have been moved or removed.
        </p>
        <Link
          href="/"
          className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] inline-flex items-center gap-2 px-6 py-3 border border-ink/20 dark:border-[#4d4844] rounded-full text-sm text-ink dark:text-[#ece7df] hover:bg-ink hover:text-cream dark:hover:bg-[#ece7df] dark:hover:text-[#151311] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </PageShell>
  )
}
