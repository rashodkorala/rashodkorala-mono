import { hasLocale, type AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = AbstractIntlMessages;

/** Overlay `override` on `base`, so any key missing from a translation falls back to English. */
function mergeMessages(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    out[key] =
      value && typeof value === "object" && baseValue && typeof baseValue === "object"
        ? mergeMessages(baseValue as Messages, value as Messages)
        : value;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const english = (await import("../messages/en.json")).default as Messages;
  const messages =
    locale === routing.defaultLocale
      ? english
      : mergeMessages(english, (await import(`../messages/${locale}.json`)).default as Messages);

  return { locale, messages };
});
