import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";
import { getCachedProjectBySlug } from "@/lib/supabase/cached-projects";
import { localizeCaseStudy, localizeProject } from "@/lib/localize";
import { localeAlternates } from "@/i18n/routing";
import CaseStudyPage from "@/src/components/work/CaseStudyPage";
import ProjectPage from "@/src/components/work/ProjectPage";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: Locale; slug: string }> };

async function loadItem(slug: string, locale: Locale) {
  const [caseStudy, project] = await Promise.all([
    getCachedCaseStudyBySlug(slug),
    getCachedProjectBySlug(slug),
  ]);
  return {
    caseStudy: caseStudy ? localizeCaseStudy(caseStudy, locale) : null,
    project: project ? localizeProject(project, locale) : null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { caseStudy, project } = await loadItem(slug, locale);

  const item = caseStudy ?? project;
  if (!item) {
    const t = await getTranslations({ locale, namespace: "Work" });
    return { title: t("notFound") };
  }

  const title = item.title;
  const description =
    "content_md" in item
      ? item.content_md?.slice(0, 160)
      : ("short_description" in item ? item.short_description || undefined : undefined);

  return {
    title,
    description: description ?? undefined,
    alternates: localeAlternates(`/work/${slug}`, locale),
    openGraph: {
      title: `${item.title} | Work`,
      description: description ?? undefined,
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { caseStudy, project } = await loadItem(slug, locale);

  if (caseStudy) {
    return <PageShell><CaseStudyPage caseStudy={caseStudy} /></PageShell>;
  }

  if (project) {
    return <PageShell><ProjectPage project={project} /></PageShell>;
  }

  notFound();
}
