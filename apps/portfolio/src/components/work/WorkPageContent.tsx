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
    <Link href={`/work/${item.slug}`} className="block border-t border-line-subtle py-7 group">
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
                className="text-[10px] px-2 py-0.5 rounded-full border border-line-subtle text-label uppercase tracking-[0.08em]"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg md:text-xl font-normal tracking-tight flex items-center gap-2 text-title">
            {item.title}
            <ArrowUpRight className="w-3.5 h-3.5 text-icon group-hover:text-icon-hover transition-colors" strokeWidth={1.5} />
          </h3>
          {item.content_md && (
            <p className="text-body-secondary mt-1.5 font-light leading-relaxed max-w-lg text-[14px]">
              {item.content_md.slice(0, 140)}{item.content_md.length > 140 ? "..." : ""}
            </p>
          )}
        </div>
        {item.gallery?.[0] && (
          <div className="relative w-full h-24 rounded-lg overflow-hidden border border-line-subtle">
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
        className="group cursor-pointer border-t border-line-subtle py-8 md:py-9"
      >
        <div className="grid items-start gap-6 md:grid-cols-[1fr_minmax(0,112px)] md:gap-7">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-label">{getYear()}</span>
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {project.tech_stack.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border border-line-subtle rounded-full text-label">
                      {tag}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 border border-line-subtle rounded-full text-label">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="mb-2.5 flex items-start gap-3">
              <h3 className="flex items-center gap-2 text-xl font-normal leading-tight tracking-tight text-title md:text-2xl">
                {project.title}
                <motion.span animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }} transition={{ duration: 0.2 }}>
                  <ArrowUpRight className="h-3.5 w-3.5 text-icon transition-colors group-hover:text-icon-hover" strokeWidth={1.5} />
                </motion.span>
              </h3>
            </div>
            {project.subtitle && (
              <p className="max-w-xl text-[14px] leading-relaxed text-body-secondary">
                {project.subtitle}
              </p>
            )}
          </div>
          {project.logo && (
            <motion.div
              animate={{ scale: isHovered ? 1 : 0.95, opacity: isHovered ? 1 : 0.7 }}
              className="relative aspect-square w-24 shrink-0 justify-self-end overflow-hidden rounded-xl border border-line bg-white/70 p-2.5 dark:bg-surface md:w-28"
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
              className="relative aspect-square w-24 shrink-0 justify-self-end overflow-hidden rounded-xl border border-line-subtle bg-surface-raised md:w-28"
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
        className="mb-14 font-serif text-5xl tracking-tight text-heading md:text-6xl"
      >
        Work
      </motion.h1>

      {caseStudies.length > 0 && (
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-label"
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
            className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-label"
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
          <p className="text-caption font-light">No work to show yet</p>
        </div>
      )}
    </div>
  );
}
