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
    <Link href={`/work/${item.slug}`} className="block border-t border-ink/8 py-7 group dark:border-[#33302d]">
      <motion.div
        ref={ref}
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
                className="text-[10px] px-2 py-0.5 rounded-full border border-ink/8 text-ink/35 uppercase tracking-[0.08em] dark:border-[#34312e] dark:text-[#9f9791]"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg md:text-xl font-normal tracking-tight flex items-center gap-2 text-ink dark:text-[#eee8e0]">
            {item.title}
            <ArrowUpRight className="w-3.5 h-3.5 text-ink/20 group-hover:text-ink transition-colors dark:text-[#77706a] dark:group-hover:text-[#e2ddd6]" strokeWidth={1.5} />
          </h3>
          {item.content_md && (
            <p className="text-muted_ink/80 mt-1.5 font-light leading-relaxed max-w-lg text-[14px] dark:text-[#b5ada6]">
              {item.content_md.slice(0, 140)}{item.content_md.length > 140 ? "..." : ""}
            </p>
          )}
        </div>
        {item.gallery?.[0] && (
          <div className="relative w-full h-24 rounded-lg overflow-hidden border border-ink/8 dark:border-[#33302d]">
            <Image src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${item.gallery[0]}`} alt={item.title} fill className="object-cover opacity-75 group-hover:opacity-100 transition-opacity dark:brightness-[0.9]" sizes="160px" />
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
  const hasLogo = Boolean(project.logo);

  const getYear = () => {
    if (project.created_at) return new Date(project.created_at).getFullYear().toString();
    return new Date().getFullYear().toString();
  };

  return (
    <Link href={`/work/projects/${project.slug}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group cursor-pointer border-t border-ink/8 py-8 md:py-9 dark:border-[#33302d]"
      >
        <div className="grid items-start gap-6 md:grid-cols-[1fr_minmax(0,112px)] md:gap-7">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/35 dark:text-[#8f8781]">{getYear()}</span>
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {project.tech_stack.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border border-ink/8 rounded-full text-ink/35 dark:border-[#34312e] dark:text-[#9f9791]">
                      {tag}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border border-ink/8 rounded-full text-ink/35 dark:border-[#34312e] dark:text-[#9f9791]">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="mb-2.5 flex items-start gap-3">
              <h3 className="flex items-center gap-2 text-xl font-normal leading-tight tracking-tight text-ink md:text-2xl dark:text-[#eee8e0]">
                {project.title}
                <motion.span animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }} transition={{ duration: 0.2 }}>
                  <ArrowUpRight className="h-3.5 w-3.5 text-ink/20 transition-colors group-hover:text-ink dark:text-[#77706a] dark:group-hover:text-[#e2ddd6]" strokeWidth={1.5} />
                </motion.span>
              </h3>
            </div>
            {project.subtitle && (
              <p className="max-w-xl text-[14px] leading-relaxed text-muted_ink/90 dark:text-[#c3bbb4]">
                {project.subtitle}
              </p>
            )}
          </div>
          {project.logo && (
            <motion.div
              animate={{ scale: isHovered ? 1 : 0.95, opacity: isHovered ? 1 : 0.7 }}
              className="relative aspect-square w-24 shrink-0 justify-self-end overflow-hidden rounded-xl border border-ink/10 bg-white/70 p-2.5 dark:border-[#3b3734] dark:bg-[#171413] md:w-28"
            >
              <Image
                src={project.logo}
                alt={`${project.title} logo`}
                fill
                className="object-contain p-1 dark:brightness-[0.94]"
                sizes="(max-width: 768px) 96px, 112px"
              />
            </motion.div>
          )}
          {!hasLogo && project.cover_image && (
            <motion.div
              animate={{ scale: isHovered ? 1 : 0.95, opacity: isHovered ? 1 : 0.7 }}
              className="relative aspect-square w-24 shrink-0 justify-self-end overflow-hidden rounded-xl border border-ink/8 bg-ink/5 dark:border-[#2e2b29] dark:bg-[#1a1716] md:w-28"
            >
              <Image src={project.cover_image} alt={project.title} fill className="object-cover dark:brightness-[0.9]" sizes="112px" />
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
    <div ref={ref} className="mx-auto max-w-4xl py-14 md:py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-14 font-serif text-5xl tracking-tight text-ink md:text-6xl dark:text-[#f0ebe4]"
      >
        Work
      </motion.h1>

      {caseStudies.length > 0 && (
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/35 dark:text-[#8f8781]"
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
            className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/35 dark:text-[#8f8781]"
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
          <p className="text-ink/40 font-light dark:text-[#9c948e]">No work to show yet</p>
        </div>
      )}
    </div>
  );
}
