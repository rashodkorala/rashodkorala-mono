import type { Locale } from "next-intl";
import { redirect } from "@/i18n/navigation";

export default async function InkBarPrivacyRedirectPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect({ href: "/apps/inkbar/privacy", locale });
}
