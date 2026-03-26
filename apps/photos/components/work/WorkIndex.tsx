"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { WorkProject } from "@/app/actions/work";

interface WorkIndexProps {
  projects: WorkProject[];
}

function getPrimaryLink(project: WorkProject): string | null {
  return project.case_study_url || project.live_url || project.github_url || null;
}

export default function WorkIndex({ projects }: WorkIndexProps) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center md:px-12 lg:px-16">
        <p className="max-w-md text-3xl font-light leading-snug tracking-tight md:text-4xl">
          No work published yet.
        </p>
        <p className="mt-6 max-w-sm text-sm text-muted-foreground">
          Work projects will appear here once they are published from the CMS.
        </p>
      </div>
    );
  }

  return (
    <div className="relative px-6 pb-24 pt-12 md:px-12 lg:px-16">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 max-w-3xl"
      >
        <p className="text-xs uppercase tracking-[0.45em] text-muted-foreground">
          Selected work
        </p>
        <h1 className="mt-4 text-4xl font-light leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          Commercial & personal projects
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          A curated set of projects from the CMS, including product, platform, and
          technical work.
        </p>
      </motion.header>

      <motion.ul
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {projects.map((project) => {
          const href = getPrimaryLink(project);

          return (
            <motion.li
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: "easeOut" },
                },
              }}
              className="overflow-hidden border border-border bg-background"
            >
              {project.cover_image_url ? (
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={project.cover_image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : null}

              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  {project.created_at
                    ? new Date(project.created_at).getFullYear().toString()
                    : "Project"}
                </p>
                <h2 className="mt-3 text-2xl font-light tracking-tight">{project.title}</h2>
                {project.subtitle ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {project.subtitle}
                  </p>
                ) : null}
                {project.tech && project.tech.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((item) => (
                      <span
                        key={`${project.id}-${item}`}
                        className="border border-border px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-foreground underline underline-offset-4"
                  >
                    View project
                  </a>
                ) : (
                  <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Link coming soon
                  </p>
                )}
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
