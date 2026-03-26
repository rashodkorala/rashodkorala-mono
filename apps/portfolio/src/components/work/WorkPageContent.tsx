"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import type { CaseStudy } from "@/lib/types";
import type { Project } from "@/lib/types";

interface WorkPageContentProps {
  caseStudies: CaseStudy[];
  projects: Project[];
}

function CaseStudyCard({ item, index }: { item: CaseStudy; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <Link href={`/work/${item.slug}`} className="block border-t border-ink/8 py-7 group">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="grid md:grid-cols-[1fr_160px] gap-5 items-start"
      >
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {item.category && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-ink/10 text-ink/50 uppercase tracking-[0.08em]">
                {item.category}
              </span>
            )}
            {item.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full border border-ink/8 text-ink/30 uppercase tracking-[0.08em]"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg md:text-xl font-normal tracking-tight flex items-center gap-2">
            {item.title}
            <ArrowUpRight className="w-3.5 h-3.5 text-ink/10 group-hover:text-ink transition-colors" strokeWidth={1.5} />
          </h3>
          {item.summary && (
            <p className="text-muted_ink/70 mt-1.5 font-light leading-relaxed max-w-lg text-[14px]">{item.summary}</p>
          )}
        </div>
        {item.cover_url && (
          <div className="relative w-full h-24 rounded-lg overflow-hidden border border-ink/8">
            <Image src={item.cover_url} alt={item.title} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" sizes="160px" />
          </div>
        )}
      </motion.div>
    </Link>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const getYear = () => {
    if (project.created_at) return new Date(project.created_at).getFullYear().toString();
    return new Date().getFullYear().toString();
  };

  return (
    <Link href={`/projects/${project.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group border-t border-ink/8 py-7 cursor-pointer"
      >
        <div className="grid md:grid-cols-[1fr_160px] gap-5 items-start">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="text-[11px] uppercase tracking-[0.08em] text-ink/25 font-mono">{getYear()}</span>
              {project.tech && project.tech.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {project.tech.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border border-ink/8 rounded-full text-ink/30">
                      {tag}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border border-ink/8 rounded-full text-ink/30">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-normal tracking-tight mb-1.5 flex items-center gap-2">
              {project.title}
              <motion.span animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }} transition={{ duration: 0.2 }}>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink/10 group-hover:text-ink transition-colors" strokeWidth={1.5} />
              </motion.span>
            </h3>
            {project.subtitle && (
              <p className="text-muted_ink/70 leading-relaxed max-w-lg text-[14px]">{project.subtitle}</p>
            )}
          </div>
          {project.cover_image_url && (
            <motion.div
              animate={{ scale: isHovered ? 1 : 0.95, opacity: isHovered ? 1 : 0.7 }}
              className="relative w-full h-24 bg-ink/5 rounded-lg overflow-hidden"
            >
              <Image src={project.cover_image_url} alt={project.title} fill className="object-cover" sizes="160px" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export default function WorkPageContent({ caseStudies, projects }: WorkPageContentProps) {
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

      {caseStudies.length > 0 && (
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] uppercase tracking-[0.12em] text-ink/30 font-mono mb-6"
          >
            Case Studies
          </motion.h2>
          <div>
            {caseStudies.map((item, index) => (
              <CaseStudyCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[11px] uppercase tracking-[0.12em] text-ink/30 font-mono mb-6"
          >
            Projects
          </motion.h2>
          <div>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
      )}

      {caseStudies.length === 0 && projects.length === 0 && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-ink/30 font-light">No work to show yet</p>
        </div>
      )}
    </div>
  );
}
