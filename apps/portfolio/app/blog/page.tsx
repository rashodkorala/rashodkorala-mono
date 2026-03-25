import { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"
import BlogList from "@/src/components/blog/blogList"

export const revalidate = 3600 // Revalidate at most every hour

export const metadata: Metadata = {
  title: "The View",
  description: "how I view things — Thoughts, insights, and perspectives on software development, design, and technology",
  openGraph: {
    title: "The View | Rashod Korala",
    description: "how I view things — Thoughts, insights, and perspectives on software development, design, and technology",
  },
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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="pt-24 mb-16">
            <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40 mb-3">
              The View
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              how I view <span className="font-medium">things</span>
            </h1>
            <p className="text-lg text-black/50 dark:text-white/50 font-light max-w-3xl">
              Thoughts, insights, and perspectives on software development, design, and technology.
            </p>
          </div>

          <BlogList blogs={blogs} />
        </div>
      </div>
    </div>
  )
}