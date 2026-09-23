import { Metadata } from "next"
import type { Locale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import ProjectPage from "@/src/components/work/ProjectPage"
import PageShell from "@/src/components/page-shell"
import { getCachedProjectBySlug } from "@/lib/supabase/cached-projects"
import { localizeProject } from "@/lib/localize"
import { localeAlternates } from "@/i18n/routing"
import { notFound } from "next/navigation"

export const revalidate = 3600;

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const cached = await getCachedProjectBySlug(slug);
    const t = await getTranslations({ locale, namespace: "Work" });

    if (!cached) {
        return { title: t("projectNotFound") };
    }

    const project = localizeProject(cached, locale);
    const description = project.short_description || project.subtitle || t("projectFallbackDescription", { title: project.title });

    return {
        title: project.title,
        description,
        alternates: localeAlternates(`/work/projects/${slug}`, locale),
        openGraph: {
            title: `${project.title} | Rashod Korala`,
            description,
            images: project.cover_image ? [{ url: project.cover_image }] : [],
        },
        twitter: {
            title: `${project.title} | Rashod Korala`,
            description,
            images: project.cover_image ? [project.cover_image] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const project = await getCachedProjectBySlug(slug);
    if (!project) {
        notFound();
    }
    return (
        <PageShell>
            <ProjectPage project={localizeProject(project, locale)} />
        </PageShell>
    )
}
