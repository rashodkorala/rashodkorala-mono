import { Metadata } from "next";
import Projects from "@/src/components/main/projects";
import PageShell from "@/src/components/page-shell";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Projects",
    description: "A collection of web, mobile, and AI projects built by Rashod Korala.",
};

export default async function Index() {
    const initialProjects = await getCachedAllProjects();
    return (
        <PageShell>
            <Projects initialProjects={initialProjects} />
        </PageShell>
    );
}
