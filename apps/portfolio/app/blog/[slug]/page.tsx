import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
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

  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "Post Not Found",
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

  return (
    <div className="min-h-screen py-12 md:py-20">
      <article className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to blog</span>
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            {blog.category && (
              <span className="text-xs tracking-wider uppercase text-black/40 dark:text-white/40">
                {blog.category}
              </span>
            )}
            {blog.published_at && (
              <span className="text-xs text-black/30 dark:text-white/30">
                {new Date(blog.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-6">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-xl text-black/50 dark:text-white/50 font-light">
              {blog.excerpt}
            </p>
          )}

          {blog.author_name && (
            <p className="text-sm text-black/40 dark:text-white/40 mt-4">
              By {blog.author_name}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {blog.featured_image_url && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12 bg-black/5 dark:bg-white/5">
            <Image
              src={blog.featured_image_url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-light prose-headings:tracking-tight prose-p:text-black/70 dark:prose-p:text-white/70 prose-p:font-light prose-a:text-black dark:prose-a:text-white prose-a:no-underline hover:prose-a:underline">
          {/* Simple markdown rendering - you can enhance with react-markdown */}
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: blog.content
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*)\*/gim, '<em>$1</em>')
                .replace(/\n/gim, '<br />')
            }}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
            <p className="text-sm text-black/40 dark:text-white/40 mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all posts</span>
          </Link>
        </div>
      </article>
    </div>
  )
}
