"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { CaseStudy } from "@/lib/types";

interface CaseStudiesListProps {
  items: CaseStudy[];
}

export default function CaseStudiesList({ items }: CaseStudiesListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-white dark:bg-black text-black dark:text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.08em] text-black/40 dark:text-white/40 mb-3">
            Work
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            Selected <span className="font-medium">case studies</span>
          </h1>
        </motion.div>

        <div className="space-y-0">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/work/${item.slug}`}
              className="block border-t border-black/10 dark:border-white/10 py-8 group"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid md:grid-cols-[1fr_220px] gap-6 items-center"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {item.category && (
                      <span className="text-[11px] px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 uppercase tracking-[0.08em]">
                        {item.category}
                      </span>
                    )}
                    {item.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 uppercase tracking-[0.08em]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-light tracking-tight flex items-center gap-2">
                    {item.title}
                    <ArrowUpRight className="w-4 h-4 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </h2>
                  {item.summary && (
                    <p className="text-black/50 dark:text-white/50 mt-2 font-light">{item.summary}</p>
                  )}
                </div>

                {item.cover_url && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
                    <Image
                      src={item.cover_url}
                      alt={item.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      sizes="220px"
                    />
                  </div>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
