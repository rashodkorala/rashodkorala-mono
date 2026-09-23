import type { routing } from "@/i18n/routing";
import type messages from "./messages/en.json";

// Type-checks translation keys against messages/en.json (the source of truth).
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
