"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { CaseStudy } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
function mediaUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

interface CaseStudiesListProps {
  items: CaseStudy[];
}

export default function CaseStudiesList({ items }: CaseStudiesListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="max-w-4xl">
      <div>
        {items.map((item, index) => {
          const itemView = item;

          return (
            <Link
            key={item.id}
            href={`/work/${item.slug}`}
            className="block border-b border-line-subtle py-7 group rounded-lg px-fib-13 -mx-fib-13 transition-colors duration-200 ease-out hover:bg-surface focus-visible:outline-none focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-line-strong focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="grid md:grid-cols-[1fr_160px] gap-5 items-start"
            >
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {item.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-line-subtle text-label uppercase tracking-[0.08em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg md:text-xl font-semibold tracking-tight flex items-center gap-2 text-title">
                  {item.title}
                  <ArrowUpRight className="w-3.5 h-3.5 text-icon group-hover:text-icon-hover transition-colors" strokeWidth={1.5} />
                </h2>
                {itemView.summary && (
                  <p className="text-body-secondary mt-fib-21 font-light leading-relaxed max-w-lg text-[15px]">{itemView.summary}</p>
                )}
              </div>
              {itemView.cover_path && (
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-line-subtle">
                  <Image src={mediaUrl(itemView.cover_path)} alt={item.title} fill className="object-fit opacity-75 group-hover:opacity-100 transition-opacity dark:brightness-[0.9]" sizes="160px" />
                </div>
              )}
            </motion.div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
