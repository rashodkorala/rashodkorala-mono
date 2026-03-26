'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { getAllProjects } from '@/lib/supabase/projects';
import { Project } from '@/lib/types';

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

interface ProjectsProps {
  initialProjects?: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ initialProjects = [] }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (initialProjects.length > 0) { setProjects(initialProjects); setIsLoading(false); return; }
    async function fetchProjects() {
      try { setIsLoading(true); const data = await getAllProjects(); setProjects(data); }
      catch (err) { setError('Failed to load projects'); console.error(err); }
      finally { setIsLoading(false); }
    }
    fetchProjects();
  }, [initialProjects]);

  if (isLoading) {
    return (
      <div ref={ref} className="max-w-3xl py-12">
        <div className="space-y-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse border-t border-ink/8 py-8">
              <div className="h-4 bg-ink/5 rounded w-1/4 mb-4" />
              <div className="h-6 bg-ink/5 rounded w-1/2 mb-2" />
              <div className="h-4 bg-ink/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={ref} className="max-w-3xl py-12">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center space-y-4">
            <p className="text-red-600 text-lg">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-ink text-cream rounded hover:bg-ink/80 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="max-w-3xl py-12 md:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="font-serif text-4xl md:text-5xl tracking-tight mb-12"
      >
        Projects
      </motion.h1>

      <div>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))
        ) : (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-ink/30 font-light">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
