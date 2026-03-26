"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
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
    <section ref={ref} className="bg-black text-white py-12 px-6 md:px-12">
      <div className="max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">
            All Work
          </h1>
        </motion.div>

        <div>
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/work/${item.slug}`}
              className="block border-t border-white/8 py-7 group"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="grid md:grid-cols-[1fr_160px] gap-5 items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {item.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/50 uppercase tracking-[0.08em]">
                        {item.category}
                      </span>
                    )}
                    {item.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-white/8 text-white/25 uppercase tracking-[0.08em]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg md:text-xl font-normal tracking-tight flex items-center gap-2">
                    {item.title}
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </h2>
                  {item.summary && (
                    <p className="text-white/35 mt-1.5 font-light leading-relaxed max-w-lg text-[14px]">{item.summary}</p>
                  )}
                </div>
                {item.cover_url && (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/8">
                    <Image src={item.cover_url} alt={item.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" sizes="160px" />
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
