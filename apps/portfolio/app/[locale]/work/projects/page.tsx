import type { Locale } from "next-intl";
import { redirect } from "@/i18n/navigation";

export default async function ProjectsRedirect({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    redirect({ href: "/work", locale });
}
