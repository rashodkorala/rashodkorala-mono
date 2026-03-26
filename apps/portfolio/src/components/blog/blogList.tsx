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

function BlogCard({ post, index, basePath }: { post: BlogPost; index: number; basePath: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <Link href={`${basePath}/${post.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group border-t border-ink/8 py-7 cursor-pointer dark:border-[#33302d]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="text-[11px] text-ink/35 dark:text-[#8f8781] font-mono whitespace-nowrap">
                {post.published_at
                  ? new Date(post.published_at).getFullYear().toString()
                  : new Date().getFullYear().toString()}
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 border border-ink/8 rounded-full text-ink/35 dark:border-[#34312e] dark:text-[#9f9791] whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h3 className="font-['Times_New_Roman','Times',serif] text-lg md:text-xl font-normal tracking-tight mb-1.5 flex items-start sm:items-center gap-2 text-ink dark:text-[#eee8e0]">
              <span className="flex-1 min-w-0 break-words">{post.title}</span>
              <motion.span
                className="flex-shrink-0 mt-1 sm:mt-0"
                animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-ink/20 group-hover:text-ink transition-colors dark:text-[#77706a] dark:group-hover:text-[#e2ddd6]" strokeWidth={1.5} />
              </motion.span>
            </h3>

            {post.excerpt && (
              <p className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-muted_ink/80 font-light max-w-lg break-words text-[14px] dark:text-[#b5ada6]">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.featured_image_url && (
            <motion.div
              animate={{ scale: isHovered ? 1 : 0.95, opacity: isHovered ? 1 : 0.7 }}
              className="relative w-full md:w-40 h-24 bg-ink/5 dark:bg-[#1a1716] rounded-lg overflow-hidden flex-shrink-0"
            >
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                className="object-cover dark:brightness-[0.9]"
                sizes="(max-width: 768px) 100vw, 176px"
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
  basePath?: string;
}

export default function BlogList({ blogs, basePath = "/view" }: BlogListProps) {
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
        <p className="text-ink/40 dark:text-[#9c948e] font-light">No posts yet. Check back soon!</p>
      </motion.div>
    );
  }

  return (
    <div ref={ref}>
      {blogs.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} basePath={basePath} />
      ))}
    </div>
  );
}
