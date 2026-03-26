import AboutMe from "@/src/components/main/about";
import PageShell from "@/src/components/page-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'About Me',
    description: 'Learn about Rashod Korala, a Software Developer specializing in Next.js, React Native, and AI solutions.',
};

export default function Index() {
    return (
        <PageShell>
            <AboutMe />
        </PageShell>
    );
}
