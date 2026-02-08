import { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import BlogList from "@/src/components/blog/blogList"
import BlogNavigation from "@/src/components/blog/blogNavigation"

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

async function getBlogs(): Promise<BlogPost[]> {
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

export default async function BlogPage() {
  const blogs = await getBlogs()

  return (
    <div className="min-h-screen bg-white text-black">
      <BlogNavigation />
      <div className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-black/40 mb-3 sm:mb-4">
              The View
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-3 sm:mb-4">
              how I view <span className="font-medium">things</span>
            </h1>
            <p className="text-base sm:text-lg text-black/50 font-light max-w-3xl">
              Thoughts, insights, and perspectives on software development, design, and technology.
            </p>
          </div>

          <BlogList blogs={blogs} />
        </div>
      </div>
    </div>
  )
}