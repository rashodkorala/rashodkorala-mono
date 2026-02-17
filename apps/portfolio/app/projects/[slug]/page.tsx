import ProjectComp from "@/src/components/main/projectComp"
import { getCachedProjectBySlug } from "@/lib/supabase/cached-projects"
import { notFound } from "next/navigation"

export const revalidate = 3600;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const initialProject = await getCachedProjectBySlug(slug);
    if (!initialProject) {
        notFound();
    }
    return (
        <div>
            <ProjectComp projectSlug={slug} initialProject={initialProject} />
        </div>
    )
}
