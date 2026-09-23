"use client";

import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { localizedPath, type Locale } from "@/i18n/routing";

/** Short label shown on the button — always written in its own language. */
const SHORT_LABEL: Record<Locale, string> = {
  en: "EN",
  si: "සිං",
};

/**
 * Toggles between English and Sinhala for the current page. Rendered as a real link
 * (not a router push) so crawlers can follow it and the hreflang pairing is explicit.
 * Uses the canonical URL (/work, not /en/work) to avoid a redirect hop.
 */
export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const target: Locale = locale === "si" ? "en" : "si";

  return (
    <NextLink
      href={localizedPath(pathname, target)}
      hrefLang={target}
      aria-label={t("switchTo", { language: t(target) })}
      title={t(target)}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-ctrl-border bg-ctrl px-2.5 font-sans text-xs font-medium text-ctrl-text backdrop-blur transition hover:bg-ctrl-hover"
    >
      <span lang={target}>{SHORT_LABEL[target]}</span>
    </NextLink>
  );
}
