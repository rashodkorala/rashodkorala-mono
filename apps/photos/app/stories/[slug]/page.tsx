import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getPublishedStoryBySlug,
    getPhotosForStory,
} from "@/app/actions/stories";
import StoryPhotoGrid from "@/components/stories/StoryPhotoGrid";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const story = await getPublishedStoryBySlug(slug);
    if (!story) {
        return { title: "Story" };
    }
    return {
        title: story.title,
        description: story.description ?? undefined,
        openGraph: {
            title: `${story.title} | Rashod Korala Photography`,
            description: story.description ?? undefined,
            images: story.cover_image_url ? [{ url: story.cover_image_url }] : undefined,
        },
    };
}

export default async function StoryDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const story = await getPublishedStoryBySlug(slug);
    if (!story) {
        notFound();
    }

    const photos = await getPhotosForStory(story.id);
    const heroSrc = story.cover_image_url || photos[0]?.image_url || null;

    return (
        <article>
            {heroSrc ? (
                <div className="relative aspect-[21/10] w-full min-h-[220px] md:aspect-[21/9] md:min-h-[320px]">
                    <Image
                        src={heroSrc}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 px-6 pb-10 pt-24 md:px-12 md:pb-14 lg:px-16">
                        <Link
                            href="/stories"
                            className="text-xs uppercase tracking-[0.35em] text-muted-foreground transition hover:text-foreground"
                        >
                            All stories
                        </Link>
                        <h1
                            className="mt-4 max-w-4xl text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl"
                            style={{ fontFamily: "var(--font-story-display), serif" }}
                        >
                            {story.title}
                        </h1>
                        {story.description && (
                            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                                {story.description}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <header className="border-b border-border px-6 py-12 md:px-12 lg:px-16">
                    <Link
                        href="/stories"
                        className="text-xs uppercase tracking-[0.35em] text-muted-foreground transition hover:text-foreground"
                    >
                        All stories
                    </Link>
                    <h1
                        className="mt-6 max-w-4xl text-4xl font-light tracking-tight md:text-5xl"
                        style={{ fontFamily: "var(--font-story-display), serif" }}
                    >
                        {story.title}
                    </h1>
                    {story.description && (
                        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
                            {story.description}
                        </p>
                    )}
                </header>
            )}

            <StoryPhotoGrid photos={photos} />
        </article>
    );
}
