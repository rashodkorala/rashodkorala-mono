"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ViewPost {
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

function ViewPostCard({ post, index, basePath }: { post: ViewPost; index: number; basePath: string }) {
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
        className="group border-t border-line-subtle py-7 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="text-[11px] text-label font-mono whitespace-nowrap">
                {post.published_at
                  ? new Date(post.published_at).getFullYear().toString()
                  : new Date().getFullYear().toString()}
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 border border-line-subtle rounded-full text-label whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <h3 className="font-display text-lg md:text-xl font-normal tracking-tight mb-1.5 flex items-start sm:items-center gap-2 text-title">
              <span className="flex-1 min-w-0 break-words">{post.title}</span>
              <motion.span
                className="flex-shrink-0 mt-1 sm:mt-0"
                animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-icon group-hover:text-icon-hover transition-colors" strokeWidth={1.5} />
              </motion.span>
            </h3>

            {post.excerpt && (
              <p className="font-reading text-body-secondary font-light max-w-lg break-words text-[14px]">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.featured_image_url && (
            <motion.div
              animate={{ scale: isHovered ? 1 : 0.95, opacity: isHovered ? 1 : 0.7 }}
              className="relative w-full md:w-40 h-24 bg-surface-raised rounded-lg overflow-hidden flex-shrink-0"
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

interface ViewPostListProps {
  posts: ViewPost[];
  basePath?: string;
}

export default function ViewPostList({ posts, basePath = "/view" }: ViewPostListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (posts.length === 0) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-center min-h-[40vh]"
      >
        <p className="text-caption font-light">No posts yet. Check back soon!</p>
      </motion.div>
    );
  }

  return (
    <div ref={ref}>
      {posts.map((post, index) => (
        <ViewPostCard key={post.id} post={post} index={index} basePath={basePath} />
      ))}
    </div>
  );
}
