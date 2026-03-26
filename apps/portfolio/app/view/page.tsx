import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import ViewPostList from "@/src/components/blog/blogList";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The View",
  description: "Editorial writing: opinions, observations, and technology notes.",
};

interface ViewPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  author_name: string | null;
  category: string | null;
  tags: string[] | null;
}

async function getViewPostsUncached(): Promise<ViewPost[]> {
  const { data, error } = await supabase
    .from("view_posts")
    .select("id, title, slug, excerpt, featured_image_url, published_at, author_name, category, tags")
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching view posts:", error);
    return [];
  }
  return data || [];
}

const getViewPosts = unstable_cache(getViewPostsUncached, ["view-posts-portfolio-list-v2"], {
  revalidate: 3600,
  tags: ["view-posts-portfolio"],
});

export default async function ViewPage() {
  const viewPosts = await getViewPosts();

  return (
    <PageShell>
      <div className="max-w-3xl py-12 md:py-16">
        <h1 className="font-['Times_New_Roman','Times',serif] text-4xl md:text-5xl tracking-tight mb-4 text-ink dark:text-[#f0ebe4]">
          The <em className="italic">View</em>
        </h1>
        <p className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-muted_ink font-light max-w-2xl mb-12 dark:text-[#b5ada6]">
          Opinions, observations, and technology writing.
        </p>
        <ViewPostList posts={viewPosts} basePath="/view" />
      </div>
    </PageShell>
  );
}
