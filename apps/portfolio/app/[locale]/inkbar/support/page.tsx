import type { Locale } from "next-intl";
import { redirect } from "@/i18n/navigation";

export default async function InkBarSupportRedirectPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect({ href: "/apps/inkbar/support", locale });
}
