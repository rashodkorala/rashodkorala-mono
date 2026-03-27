import { Metadata } from "next"
import ProjectPage from "@/src/components/work/ProjectPage"
import PageShell from "@/src/components/page-shell"
import { getCachedProjectBySlug } from "@/lib/supabase/cached-projects"
import { notFound } from "next/navigation"

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    const project = await getCachedProjectBySlug(slug);

    if (!project) {
        return { title: "Project Not Found" };
    }

    const description = project.short_description || project.subtitle || `Explore the ${project.title} project by Rashod Korala.`;

    return {
        title: project.title,
        description,
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

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const project = await getCachedProjectBySlug(slug);
    if (!project) {
        notFound();
    }
    return (
        <PageShell>
            <ProjectPage project={project} />
        </PageShell>
    )
}
