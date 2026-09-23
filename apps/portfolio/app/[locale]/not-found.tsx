import { Metadata } from "next"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import PageShell from "@/src/components/page-shell"

export const metadata: Metadata = {
  title: "404 — Page Not Found",
}

export default function NotFound() {
  const t = useTranslations("NotFound")

  return (
    <PageShell>
      <div className="min-h-full flex flex-col items-start justify-end pb-24 md:pb-32">
        <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-label mb-4">
          {t("eyebrow")}
        </p>
        <h1 className="text-[clamp(6rem,20vw,18rem)] font-sans font-light leading-none tracking-tight mb-6">
          404
        </h1>
        <p className="font-sans text-lg sm:text-xl text-body-secondary font-light mb-10 max-w-md">
          {t("body")}
        </p>
        <Link
          href="/"
          className="font-sans inline-flex items-center gap-2 px-6 py-3 border border-line-strong rounded-full text-sm text-link hover:bg-surface-elevated hover:text-inverse transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </PageShell>
  )
}
