import CaseStudiesList from "@/src/components/work/CaseStudiesList";
import Startup from "@/src/components/main/startup";
import AboutSection from "@/src/components/main/aboutSection";
// import Work from "@/src/components/main/work"; // Disabled - keeping code for future use

import { Metadata } from "next";
import { getCachedCaseStudies } from "@/lib/supabase/cached-case-studies";

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
    const initialCaseStudies = await getCachedCaseStudies();
    return (
        <>
            {/* <Work /> Disabled - keeping code for future use */}
            <CaseStudiesList items={initialCaseStudies} />
            <AboutSection />
            
            <Startup /> {/* Disabled - keeping code for future use */}
        </>
    );
}
