import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import ProjectGallery from "./ProjectGallery";
import ProjectRelatedCaseStudies from "./ProjectRelatedCaseStudies";

const ui =
  "[font-family:var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={`${ui} text-[11px] font-medium uppercase tracking-[0.18em] text-label`}
    >
      {children}
    </p>
  );
}

function normalizeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(mailto|tel):/i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
}

export default function ProjectPage({ project }: { project: Project }) {
  const tech = project.tech_stack ?? [];
  const roles = project.role ? [project.role] : [];
  const media = project.project_media ?? [];
  const relatedCaseStudies = project.relatedCaseStudies ?? [];
  const galleryUrls = media.filter((m) => m.type === "image").map((m) => m.url);
  const galleryVideos = media.filter((m) => m.type === "video").map((m) => m.url);
  const liveUrl = normalizeExternalUrl(project.live_url);
  const githubUrl = normalizeExternalUrl(project.github_url);

  const hasDetails = Boolean(project.timeline) || roles.length > 0;

  const backBar =
    "fixed top-header z-30 flex h-12 items-center border-b border-line bg-surface-overlay-strong backdrop-blur-md left-0 right-0 px-page-px md:px-page-px-md lg:left-sidenav lg:right-0 lg:px-page-px-lg lg:top-header-lg";

  return (
    <>
      <div className={backBar} role="navigation" aria-label="Back to work">
        <div className="mx-auto flex w-full max-w-4xl">
          <Link
            href="/work"
            className={`${ui} inline-flex items-center gap-2 text-sm text-caption transition-colors hover:text-heading group`}
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              strokeWidth={1.5}
            />
            Back to work
          </Link>
        </div>
      </div>

      <article
        className={`mx-auto max-w-4xl pb-16 pt-2 md:pb-24 md:pt-4 ${ui}`}
      >
        <div className="h-12 shrink-0" aria-hidden />

        <header className="space-y-6">
          {tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-line text-label"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
              <div className="min-w-0 flex-1 space-y-3">
                <h1 className="font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-heading md:text-[2.75rem] md:leading-[1.08]">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="text-lg font-normal leading-snug text-body-secondary md:text-xl">
                    {project.subtitle}
                  </p>
                )}
              </div>
              {project.logo && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-white/90 p-2 shadow-sm dark:bg-surface-raised dark:shadow-none sm:h-[4.5rem] sm:w-[4.5rem]">
                  <Image
                    src={project.logo}
                    alt={`${project.title} logo`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              )}
            </div>

            {project.short_description && (
              <p className="max-w-2xl text-[17px] leading-[1.75] text-body-secondary">
                {project.short_description}
              </p>
            )}
          </div>

          {(liveUrl ||
            githubUrl ||
            hasDetails) && (
            <div
              role="group"
              aria-label="Project links and context"
              className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-sm"
            >
              {(liveUrl || githubUrl) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-body-secondary transition-colors hover:text-heading"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Live site
                    </a>
                  )}
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-body-secondary transition-colors hover:text-heading"
                    >
                      <Github className="h-3.5 w-3.5" strokeWidth={1.5} />
                      GitHub
                    </a>
                  )}
                </div>
              )}
              {(liveUrl || githubUrl) && hasDetails && (
                <span
                  className="select-none text-faint"
                  aria-hidden
                >
                  |
                </span>
              )}
              {hasDetails && (
                <div className="min-w-0 text-body-tertiary leading-snug">
                  {project.timeline && (
                    <span>
                      <span className="text-label">
                        Timeline{" "}
                      </span>
                      {project.timeline}
                    </span>
                  )}
                  {project.timeline && roles.length > 0 && (
                    <span className="mx-1.5 text-faint">
                      ·
                    </span>
                  )}
                  {roles.length > 0 && (
                    <span>
                      <span className="text-label">
                        Role{" "}
                      </span>
                      {roles.join(" · ")}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </header>

        {relatedCaseStudies.length > 0 && (
          <section className="mt-8 md:mt-10" aria-labelledby="project-cs-heading">
            <header className="mb-6 md:mb-8">
              <SectionLabel>Related</SectionLabel>
              <h2
                id="project-cs-heading"
                className="mt-2 font-serif text-2xl font-semibold tracking-tight text-title md:text-[1.65rem]"
              >
                Case studies
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-body-tertiary">
                Long-form write-ups that cover research, decisions, and outcomes for this work.
              </p>
            </header>
            <ProjectRelatedCaseStudies
              caseStudies={relatedCaseStudies}
              headingId="project-cs-heading"
            />
          </section>
        )}

        {project.cover_image && (
          <div className="mt-12 md:mt-14">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line shadow-[0_1px_0_rgba(43,43,43,0.06)] dark:shadow-none md:aspect-video md:rounded-[1.25rem]">
              <Image
                src={project.cover_image}
                alt={project.title}
                fill
                className="object-cover saturate-95 dark:brightness-[0.86] dark:saturate-90"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        )}

        {galleryUrls.length > 0 && (
          <section className="mt-14 md:mt-20" aria-labelledby="project-gallery-heading">
            <header className="mb-6 md:mb-8">
              <h2
                id="project-gallery-heading"
                className="font-serif text-2xl font-semibold tracking-tight text-title md:text-[1.65rem]"
              >
                <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-label">
                  Gallery
                </span>
                <span className="mt-2 block">Selected frames</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-body-tertiary">
                Click any image for a full-screen view. Use arrow keys or the on-screen controls to
                move between images.
              </p>
            </header>
            <ProjectGallery images={galleryUrls} projectTitle={project.title} />
          </section>
        )}

        {galleryVideos.length > 0 && (
          <section className="mt-14 md:mt-20" aria-labelledby="project-videos-heading">
            <header className="mb-6 md:mb-8">
              <SectionLabel>Video</SectionLabel>
              <h2
                id="project-videos-heading"
                className="mt-2 font-serif text-2xl font-semibold tracking-tight text-title md:text-[1.65rem]"
              >
                Video
              </h2>
            </header>
            <div className="grid gap-5">
              {galleryVideos.map((url, i) => (
                <video
                  key={i}
                  src={url}
                  controls
                  className="w-full overflow-hidden rounded-xl border border-line shadow-sm dark:shadow-none"
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
