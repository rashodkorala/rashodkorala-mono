import Projects from "@/src/components/main/projects";
import Startup from "@/src/components/main/startup";
import AboutSection from "@/src/components/main/aboutSection";
// import Work from "@/src/components/main/work"; // Disabled - keeping code for future use

import { Metadata } from "next";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Home',
    description: 'Welcome to Rashod Korala\'s portfolio. Explore innovative software solutions, projects, and expertise in Next.js, React Native, and AI development.',
    openGraph: {
        title: 'Rashod Korala | Software Developer Portfolio',
        description: 'Welcome to Rashod Korala\'s portfolio. Explore innovative software solutions, projects, and expertise in Next.js, React Native, and AI development.',
    },
    twitter: {
        title: 'Rashod Korala | Software Developer Portfolio',
        description: 'Welcome to Rashod Korala\'s portfolio. Explore innovative software solutions, projects, and expertise in Next.js, React Native, and AI development.',
    },
};



export default async function Index() {
    const initialProjects = await getCachedAllProjects();
    return (
        <>
            {/* <Work /> Disabled - keeping code for future use */}
            <Projects initialProjects={initialProjects} />
            <AboutSection />
            
            <Startup /> {/* Disabled - keeping code for future use */}
        </>
    );
}
