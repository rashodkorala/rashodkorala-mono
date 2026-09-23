import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import WorkPageContent from "@/src/components/work/WorkPageContent";
import PageShell from "@/src/components/page-shell";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";
import { localizeCaseStudy, localizeProject } from "@/lib/localize";
import { localeAlternates } from "@/i18n/routing";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Work" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localeAlternates("/work", locale),
  };
}

export default async function WorkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Do not catch Supabase errors and fall back to []: ISR would cache that empty
  // response as a successful render, so /work could go blank after revalidation.
  const [projects, caseStudies] = await Promise.all([
    getCachedAllProjects(),
    getCachedCaseStudies(),
  ]);
  return (
    <PageShell>
      <WorkPageContent
        projects={projects.map((p) => localizeProject(p, locale))}
        caseStudies={caseStudies.map((cs) => localizeCaseStudy(cs, locale))}
      />
    </PageShell>
  );
}
