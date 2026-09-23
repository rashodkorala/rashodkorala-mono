import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "si"],
  defaultLocale: "en",
  // English keeps its existing unprefixed URLs (/work, /apps/inkbar/privacy, …);
  // Sinhala lives under /si/*.
  localePrefix: "as-needed",
  // Never auto-redirect based on Accept-Language — visitors choose via the switcher.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const SITE_URL = "https://rashodkorala.com";

/** Public path for a locale, e.g. ("/work", "si") → "/si/work". */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** hreflang alternates + canonical for page metadata. */
export function localeAlternates(path: string, locale: Locale) {
  return {
    canonical: localizedPath(path, locale),
    languages: {
      en: localizedPath(path, "en"),
      si: localizedPath(path, "si"),
      "x-default": localizedPath(path, "en"),
    },
  };
}
