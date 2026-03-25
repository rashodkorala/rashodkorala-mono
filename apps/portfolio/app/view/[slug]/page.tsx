import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import BlogPostContent from "@/src/components/blog/blogPostContent";

export const revalidate = 3600;

interface BlogPost {
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

async function getBlogUncached(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")
    .single();

  if (error || !data) {
    console.error("Error fetching blog:", error);
    return null;
  }

  let markdownContent = "";
  if (data.mdx_path) {
    const { data: markdownData, error: markdownError } = await supabase.storage
      .from("blogs-mdx")
      .download(data.mdx_path);
    if (!markdownError && markdownData) {
      markdownContent = await markdownData.text();
    }
  }

  return { ...data, content: markdownContent };
}

function getBlog(slug: string) {
  return unstable_cache(() => getBlogUncached(slug), ["view-blog-portfolio", slug], {
    revalidate: 3600,
    tags: ["blogs-portfolio", `blog-${slug}`],
  })();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return { title: "Post Not Found | The View" };

  return {
    title: blog.seo_title || blog.title,
    description: blog.seo_description || blog.excerpt || undefined,
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt || undefined,
      images: blog.featured_image_url ? [blog.featured_image_url] : undefined,
    },
  };
}

export default async function ViewPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  return <BlogPostContent blog={blog} backHref="/view" backLabel="Back to The View" />;
}
