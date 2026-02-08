import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on software development",
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
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm tracking-[0.3em] uppercase text-black/40 dark:text-white/40 mb-4">
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Thoughts & Insights
          </h1>
          <p className="text-lg text-black/50 dark:text-white/50 font-light">
            Writing about software development, design, and technology.
          </p>
        </div>

        {/* Blog List */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-black/40 dark:text-white/40">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="flex flex-col md:flex-row gap-6 p-6 -mx-6 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  {post.featured_image_url && (
                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 flex-shrink-0">
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {post.category && (
                        <span className="text-xs tracking-wider uppercase text-black/40 dark:text-white/40">
                          {post.category}
                        </span>
                      )}
                      {post.published_at && (
                        <span className="text-xs text-black/30 dark:text-white/30">
                          {new Date(post.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-medium mb-2 group-hover:text-black/70 dark:group-hover:text-white/70 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-black/50 dark:text-white/50 font-light line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-black/5 dark:bg-white/5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
