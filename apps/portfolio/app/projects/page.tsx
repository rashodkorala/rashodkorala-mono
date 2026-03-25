import { Metadata } from "next";
import Projects from "@/src/components/main/projects";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Projects",
    description: "A collection of web, mobile, and AI projects built by Rashod Korala. Explore case studies, live demos, and open-source work.",
    openGraph: {
        title: "Projects | Rashod Korala",
        description: "A collection of web, mobile, and AI projects built by Rashod Korala. Explore case studies, live demos, and open-source work.",
    },
    twitter: {
        title: "Projects | Rashod Korala",
        description: "A collection of web, mobile, and AI projects built by Rashod Korala. Explore case studies, live demos, and open-source work.",
    },
};

export default async function Index() {
    const initialProjects = await getCachedAllProjects();
    return <Projects initialProjects={initialProjects} />;
}
