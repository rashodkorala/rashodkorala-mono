"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PublishedStory } from "@/app/actions/stories";
import { cn } from "@/lib/utils";

interface StoriesIndexProps {
    stories: PublishedStory[];
}

function StoryCard({
    story,
    featured,
}: {
    story: PublishedStory;
    featured?: boolean;
}) {
    const cover = story.cover_image_url;

    return (
        <Link
            href={`/stories/${story.slug}`}
            className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
            <article
                className={cn(
                    "relative h-full min-h-[260px] overflow-hidden border border-border bg-muted/30 transition-shadow duration-500 group-hover:shadow-lg",
                    featured && "min-h-[340px] md:min-h-[380px]"
                )}
            >
                {cover ? (
                    <Image
                        src={cover}
                        alt=""
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        sizes={
                            featured
                                ? "(max-width: 768px) 100vw, 100vw"
                                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <h2
                        className={cn(
                            "font-light tracking-tight text-foreground",
                            featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
                        )}
                        style={{ fontFamily: "var(--font-story-display), serif" }}
                    >
                        {story.title}
                    </h2>
                    {story.description && (
                        <p
                            className={cn(
                                "mt-3 text-muted-foreground",
                                featured ? "line-clamp-3 max-w-2xl text-base" : "line-clamp-2 max-w-prose text-sm"
                            )}
                        >
                            {story.description}
                        </p>
                    )}
                    <span className="mt-4 inline-block text-xs uppercase tracking-[0.35em] text-muted-foreground transition group-hover:text-foreground">
                        View story
                    </span>
                </div>
            </article>
        </Link>
    );
}

export default function StoriesIndex({ stories }: StoriesIndexProps) {
    if (stories.length === 0) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center md:px-12 lg:px-16">
                <p
                    className="max-w-md text-3xl font-light leading-snug tracking-tight md:text-4xl"
                    style={{ fontFamily: "var(--font-story-display), serif" }}
                >
                    Nothing here yet.
                </p>
                <p className="mt-6 max-w-sm text-sm text-muted-foreground">
                    New visual stories will appear when they&apos;re published from the CMS.
                </p>
            </div>
        );
    }

    const [first, ...rest] = stories;

    return (
        <div className="relative px-6 pb-24 pt-12 md:px-12 lg:px-16">
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="mb-14 max-w-3xl"
            >
                <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
                    Visual stories
                </p>
                <h1
                    className="mt-4 text-4xl font-light leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
                    style={{ fontFamily: "var(--font-story-display), serif" }}
                >
                    Places &amp; threads
                </h1>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                    Longer threads of work — journeys, cities, and seasons — told as
                    sequences of images.
                </p>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <StoryCard story={first} featured />
            </motion.div>

            {rest.length > 0 && (
                <motion.ul
                    className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: { staggerChildren: 0.08 },
                        },
                    }}
                >
                    {rest.map((story) => (
                        <motion.li
                            key={story.id}
                            variants={{
                                hidden: { opacity: 0, y: 24 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.45, ease: "easeOut" },
                                },
                            }}
                        >
                            <StoryCard story={story} />
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </div>
    );
}
