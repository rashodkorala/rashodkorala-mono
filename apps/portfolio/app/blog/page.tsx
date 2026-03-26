import { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"
import BlogList from "@/src/components/blog/blogList"
import PageShell from "@/src/components/page-shell"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, insights, and perspectives on software development, design, and technology",
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  published_at: string | null
  author_name: string | null
  category: string | null
  tags: string[] | null
}

async function getBlogsUncached(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, featured_image_url, published_at, author_name, category, tags")
    .eq("status", "published")
    .or("target_app.eq.portfolio,target_app.eq.both")
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching blogs:", error)
    return []
  }

  return data || []
}

const getBlogs = unstable_cache(getBlogsUncached, ["blogs-portfolio-list"], { revalidate: 3600, tags: ["blogs-portfolio"] })

export default async function BlogPage() {
  const blogs = await getBlogs()

  return (
    <PageShell>
      <div className="max-w-3xl py-12 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
          Blog
        </h1>
        <p className="text-muted_ink font-light max-w-2xl mb-12">
          Thoughts, insights, and perspectives on software development, design, and technology.
        </p>
        <BlogList blogs={blogs} />
      </div>
    </PageShell>
  )
}
