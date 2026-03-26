import { Metadata } from "next"
import ProjectComp from "@/src/components/main/projectComp"
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

    const description = project.subtitle || project.problem || `Explore the ${project.title} project by Rashod Korala.`;

    return {
        title: project.title,
        description,
        openGraph: {
            title: `${project.title} | Rashod Korala`,
            description,
            images: project.cover_image_url ? [{ url: project.cover_image_url }] : [],
        },
        twitter: {
            title: `${project.title} | Rashod Korala`,
            description,
            images: project.cover_image_url ? [project.cover_image_url] : [],
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const initialProject = await getCachedProjectBySlug(slug);
    if (!initialProject) {
        notFound();
    }
    return (
        <PageShell>
            <ProjectComp projectSlug={slug} initialProject={initialProject} />
        </PageShell>
    )
}
