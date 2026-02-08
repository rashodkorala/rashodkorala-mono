import { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import BlogPostContent from "@/src/components/blog/blogPostContent"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  mdx_path: string | null
  featured_image_url: string | null
  published_at: string | null
  author_name: string | null
  category: string | null
  tags: string[] | null
  seo_title: string | null
  seo_description: string | null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")
    .single()

  if (error) {
    console.error("Error fetching blog:", error)
    return null
  }

  if (!data) return null

  // Fetch markdown content from storage if mdx_path exists
  let markdownContent = ""
  if (data.mdx_path) {
    try {
      const { data: markdownData, error: markdownError } = await supabase.storage
        .from("blogs-mdx")
        .download(data.mdx_path)

      if (!markdownError && markdownData) {
        markdownContent = await markdownData.text()
      }
    } catch (err) {
      console.error("Error fetching markdown from storage:", err)
      // Fallback to empty content if fetch fails
    }
  }

  return {
    ...data,
    content: markdownContent,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "Post Not Found | The View",
    }
  }

  return {
    title: blog.seo_title || blog.title,
    description: blog.seo_description || blog.excerpt || undefined,
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.seo_description || blog.excerpt || undefined,
      images: blog.featured_image_url ? [blog.featured_image_url] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  return <BlogPostContent blog={blog} />
}