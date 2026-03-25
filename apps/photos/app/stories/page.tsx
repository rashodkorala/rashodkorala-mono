import type { Metadata } from "next";
import { getPublishedStories } from "@/app/actions/stories";
import StoriesIndex from "@/components/stories/StoriesIndex";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Stories",
    description:
        "Visual stories — places, journeys, and sequences of photography by Rashod Korala.",
    openGraph: {
        title: "Stories | Rashod Korala Photography",
        description:
            "Visual stories — places, journeys, and sequences of photography.",
    },
};

export default async function StoriesPage() {
    const stories = await getPublishedStories();
    return <StoriesIndex stories={stories} />;
}
