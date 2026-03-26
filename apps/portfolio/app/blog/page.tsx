import { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"
import BlogList from "@/src/components/blog/blogList"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, insights, and perspectives on software development, design, and technology",
  openGraph: {
    title: "Blog | Rashod Korala",
    description: "Thoughts, insights, and perspectives on software development, design, and technology",
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
    <div className="min-h-screen bg-black text-white py-12 px-6 md:px-12">
      <div className="max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          Back
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            All Posts
          </h1>
          <p className="text-white/40 font-light max-w-2xl">
            Thoughts, insights, and perspectives on software development, design, and technology.
          </p>
        </div>

        <BlogList blogs={blogs} />
      </div>
    </div>
  )
}
