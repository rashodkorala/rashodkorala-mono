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
    <div ref={ref} className="max-w-3xl py-12 md:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl tracking-tight mb-12"
      >
        Work
      </motion.h1>

      <div>
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/work/${item.slug}`}
            className="block border-t border-ink/8 py-7 group dark:border-[#33302d]"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="grid md:grid-cols-[1fr_160px] gap-5 items-start"
            >
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {item.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-ink/10 text-ink/55 uppercase tracking-[0.08em] dark:border-[#3b3734] dark:text-[#c0b8b1]">
                      {item.category}
                    </span>
                  )}
                  {item.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-ink/8 text-ink/35 uppercase tracking-[0.08em] dark:border-[#34312e] dark:text-[#9f9791]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg md:text-xl font-normal tracking-tight flex items-center gap-2 text-ink dark:text-[#eee8e0]">
                  {item.title}
                  <ArrowUpRight className="w-3.5 h-3.5 text-ink/20 group-hover:text-ink transition-colors dark:text-[#77706a] dark:group-hover:text-[#e2ddd6]" strokeWidth={1.5} />
                </h2>
                {item.summary && (
                  <p className="text-muted_ink/80 mt-1.5 font-light leading-relaxed max-w-lg text-[14px] dark:text-[#b5ada6]">{item.summary}</p>
                )}
              </div>
              {item.cover_url && (
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-ink/8 dark:border-[#33302d]">
                  <Image src={item.cover_url} alt={item.title} fill className="object-cover opacity-75 group-hover:opacity-100 transition-opacity dark:brightness-[0.9]" sizes="160px" />
                </div>
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
