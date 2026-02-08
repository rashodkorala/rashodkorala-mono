"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Get year from published_at
  const getYear = () => {
    if (post.published_at) {
      return new Date(post.published_at).getFullYear().toString();
    }
    return new Date().getFullYear().toString();
  };

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group border-t border-black/10 dark:border-white/10 py-6 sm:py-8 md:py-12 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-4 mb-3 flex-wrap">
              <span className="text-xs sm:text-sm text-black/30 dark:text-white/30 font-mono whitespace-nowrap">{getYear()}</span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 border border-black/10 dark:border-white/10 rounded-full text-black/50 dark:text-white/50 whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 border border-black/10 dark:border-white/10 rounded-full text-black/50 dark:text-white/50 whitespace-nowrap">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight mb-2 flex items-start sm:items-center gap-2 sm:gap-3 text-black dark:text-white">
              <span className="flex-1 min-w-0 break-words">{post.title}</span>
              <motion.span
                className="flex-shrink-0 mt-1 sm:mt-0"
                animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-black/30 dark:text-white/30 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
              </motion.span>
            </h3>

            {post.excerpt && (
              <p className="text-sm sm:text-base text-black/50 dark:text-white/50 font-light max-w-xl break-words">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.featured_image_url && (
            <motion.div
              animate={{ scale: isHovered ? 1 : 0.95, opacity: isHovered ? 1 : 0.7 }}
              className="relative w-full md:w-48 h-40 sm:h-32 bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0"
            >
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 192px"
                quality={85}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

interface BlogListProps {
  blogs: BlogPost[];
}

export default function BlogList({ blogs }: BlogListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (blogs.length === 0) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-center min-h-[40vh]"
      >
        <p className="text-black/50 dark:text-white/50 font-light">No posts yet. Check back soon!</p>
      </motion.div>
    );
  }

  return (
    <div ref={ref}>
      {blogs.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}