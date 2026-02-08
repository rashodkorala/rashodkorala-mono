import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/server"

export const metadata: Metadata = {
  title: "Blog | Photos",
  description: "Stories behind the photos and photography insights",
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
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, featured_image_url, published_at, author_name, category, tags")
    .eq("status", "published")
    .or("target_app.eq.photos,target_app.eq.both")
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
    <div className="min-h-screen py-12 md:py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Stories behind the photos and photography insights.
          </p>
        </div>

        {/* Blog List */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {blogs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="flex flex-col md:flex-row gap-6 p-4 -mx-4 rounded-xl hover:bg-muted/50 transition-colors">
                  {post.featured_image_url && (
                    <div className="relative w-full md:w-56 h-36 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          {post.category}
                        </span>
                      )}
                      {post.published_at && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.published_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-muted rounded-md"
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
