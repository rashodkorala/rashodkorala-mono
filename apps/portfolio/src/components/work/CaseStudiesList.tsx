"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/types";

interface CaseStudiesListProps {
  items: CaseStudy[];
}

export default function CaseStudiesList({ items }: CaseStudiesListProps) {
  return (
    <section className="bg-[#080808] text-[#e8e6e0] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65] mb-3">Work</p>
        <h1 className="text-4xl md:text-5xl mb-12 font-light" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Selected case studies
        </h1>

        <div className="space-y-8">
          {items.map((item) => (
            <Link key={item.id} href={`/work/${item.slug}`} className="block border-t border-[#1f1f1c] pt-6 group">
              <div className="grid md:grid-cols-[1fr_220px] gap-6 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {item.category ? (
                      <span className="text-[11px] px-2 py-1 rounded-full border border-[#1f1f1c] text-[#e8e6e0] uppercase tracking-[0.08em]">
                        {item.category}
                      </span>
                    ) : null}
                    {item.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-1 rounded-full border border-[#1f1f1c] text-[#6b6a65] uppercase tracking-[0.08em]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-3xl flex items-center gap-2" style={{ fontFamily: "Playfair Display, serif" }}>
                    {item.title}
                    <ArrowUpRight className="w-4 h-4 text-[#6b6a65] group-hover:text-[#e8e6e0]" />
                  </h2>
                  {item.summary ? <p className="text-[#6b6a65] mt-2">{item.summary}</p> : null}
                </div>

                {item.cover_url ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#1f1f1c]">
                    <Image src={item.cover_url} alt={item.title} fill className="object-cover" sizes="220px" />
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
