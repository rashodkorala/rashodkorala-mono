"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import type { BlogPost, ThemeConfig } from "../types"
import { renderMarkdown } from "../utils/markdownParser"

interface BlogPostContentProps {
  blog: BlogPost
  theme: ThemeConfig
}

export function BlogPostContent({ blog, theme }: BlogPostContentProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const publishYear = blog.published_at
    ? new Date(blog.published_at).getFullYear().toString()
    : null

  return (
    <div className={`min-h-screen ${theme.container.bg} ${theme.container.text}`}>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 sm:px-6 py-6 sm:py-8"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className={`inline-flex items-center gap-2 ${theme.navigation.link} ${theme.navigation.linkHover}`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <span className="text-xs sm:text-sm font-light">Back to The View</span>
          </Link>
        </div>
      </motion.div>

      <div className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              {blog.category && (
                <span className={theme.header.badge}>
                  {blog.category}
                </span>
              )}
              {publishYear && (
                <span className={theme.header.badge}>
                  {publishYear}
                </span>
              )}
              {blog.published_at && (
                <span className={theme.header.badge}>
                  {formatDate(blog.published_at)}
                </span>
              )}
            </div>

            <h1 className={theme.header.title}>
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className={theme.header.excerpt}>
                {blog.excerpt}
              </p>
            )}

            {blog.author_name && (
              <p className={theme.header.author}>
                {blog.author_name}
              </p>
            )}
          </motion.div>

          {/* Hero Image */}
          {blog.featured_image_url && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-20 w-full"
            >
              <div className={`relative w-full aspect-video rounded-lg overflow-hidden border ${theme.heroImage.border} ${theme.heroImage.bg}`}>
                <Image
                  src={blog.featured_image_url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                  quality={90}
                />
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-16"
            >
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-3 py-1.5 ${theme.tags.bg} ${theme.tags.text} rounded-full`}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-20"
          >
            <article className={theme.content.prose}>
              <div
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(blog.content, theme.markdown)
                }}
              />
            </article>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`border-t ${theme.footer.border} pt-16 text-center`}
          >
            <p className={theme.footer.text}>Interested in more?</p>
            <Link
              href="/blog"
              className={theme.footer.button}
            >
              Back to The View
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
