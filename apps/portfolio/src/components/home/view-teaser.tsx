import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getCachedPortfolioBlogs } from "@/lib/supabase/portfolio-blogs";

export default async function ViewTeaser() {
  const posts = await getCachedPortfolioBlogs(4);

  if (posts.length === 0) {
    return (
      <section className="border-t border-black/10 bg-white py-20 text-black dark:border-white/10 dark:bg-black dark:text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40">The View</p>
          <h2 className="mt-3 text-3xl font-light md:text-4xl">
            Writing & <span className="font-medium">perspectives</span>
          </h2>
          <p className="mt-4 max-w-xl text-black/50 dark:text-white/50">
            New posts will appear here when published.
          </p>
          <Link
            href="/view"
            className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em] text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            Open The View
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-black/10 bg-white py-20 text-black dark:border-white/10 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40">The View</p>
            <h2 className="mt-3 text-3xl font-light md:text-4xl">
              Writing & <span className="font-medium">perspectives</span>
            </h2>
            <p className="mt-4 max-w-xl text-black/50 dark:text-white/50">
              Essays, insights, and notes — same feed as{" "}
              <Link href="/view" className="underline decoration-black/20 underline-offset-4 dark:decoration-white/20">
                /view
              </Link>
              .
            </p>
          </div>
          <Link
            href="/view"
            className="inline-flex shrink-0 items-center gap-2 text-sm uppercase tracking-[0.12em] text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
          >
            All posts
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/view/${post.slug}`}
              className="group flex gap-6 border-t border-black/10 pt-6 dark:border-white/10"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-light tracking-tight group-hover:opacity-80 md:text-2xl">
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-black/50 dark:text-white/50">{post.excerpt}</p>
                ) : null}
              </div>
              {post.featured_image_url ? (
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                  <Image
                    src={post.featured_image_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
