import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import ViewPostContent from "@/src/components/blog/blogPostContent";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

interface ViewPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  mdx_path: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  author_name: string | null;
  category: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getViewPostUncached(slug: string): Promise<ViewPost | null> {
  const { data, error } = await supabase
    .from("view_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")
    .single();

  if (error || !data) {
    console.error("Error fetching view post:", error);
    return null;
  }

  let markdownContent = "";
  if (data.mdx_path) {
    const mdxPath = data.mdx_path.startsWith("the-view/") ? data.mdx_path : `the-view/${data.mdx_path}`;
    const { data: markdownData, error: markdownError } = await supabase.storage
      .from("content")
      .download(mdxPath);
    if (markdownError) {
      console.error("Error downloading view post markdown:", {
        slug,
        mdxPath,
        message: markdownError.message,
      });
    } else if (markdownData) {
      markdownContent = await markdownData.text();
    }
  }

  return { ...data, content: markdownContent };
}

function getViewPost(slug: string) {
  return unstable_cache(() => getViewPostUncached(slug), ["view-post-portfolio-v2", slug], {
    revalidate: 3600,
    tags: ["view-posts-portfolio", `view-post-${slug}`],
  })();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const viewPost = await getViewPost(slug);

  if (!viewPost) return { title: "Post Not Found | The View" };

  return {
    title: viewPost.seo_title || viewPost.title,
    description: viewPost.seo_description || viewPost.excerpt || undefined,
    openGraph: {
      title: viewPost.seo_title || viewPost.title,
      description: viewPost.seo_description || viewPost.excerpt || undefined,
      images: viewPost.featured_image_url ? [viewPost.featured_image_url] : undefined,
    },
  };
}

export default async function ViewPostPage({ params }: PageProps) {
  const { slug } = await params;
  const viewPost = await getViewPost(slug);
  if (!viewPost) notFound();

  return <PageShell><ViewPostContent post={viewPost} backHref="/view" backLabel="Back to The View" /></PageShell>;
}
