import type { Locale } from "@/i18n/routing";
import type { CaseStudy, Project } from "./types";

/** Sinhala value when present, otherwise the English source. */
function pick<T extends string | null | undefined>(en: T, si: string | null | undefined): T | string {
  return si && si.trim() ? si : en;
}

/**
 * Returns the project with its translatable fields swapped to `locale`.
 * Queries/caches stay locale-agnostic (`select('*')` returns both languages); this runs after.
 */
export function localizeProject(project: Project, locale: Locale): Project {
  if (locale === "en") return project;
  return {
    ...project,
    title: pick(project.title, project.title_si),
    subtitle: pick(project.subtitle, project.subtitle_si),
    short_description: pick(project.short_description, project.short_description_si),
    role: pick(project.role, project.role_si),
    timeline: pick(project.timeline, project.timeline_si),
    relatedCaseStudies: project.relatedCaseStudies?.map((cs) => localizeCaseStudy(cs, locale)),
  };
}

export function localizeCaseStudy(caseStudy: CaseStudy, locale: Locale): CaseStudy {
  if (locale === "en") return caseStudy;
  return {
    ...caseStudy,
    title: pick(caseStudy.title, caseStudy.title_si),
    summary: pick(caseStudy.summary, caseStudy.summary_si),
    content_md: pick(caseStudy.content_md, caseStudy.content_md_si),
    role: pick(caseStudy.role, caseStudy.role_si),
    timeline: pick(caseStudy.timeline, caseStudy.timeline_si),
    relatedProjects: caseStudy.relatedProjects?.map((p) => localizeProject(p, locale)),
  };
}
