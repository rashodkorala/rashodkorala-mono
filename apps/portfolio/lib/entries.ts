import type { CaseStudy, Project } from "./types";
import { firstImageSrcFromMarkdown } from "./first-image-from-markdown";

/**
 * The site has two listings:
 * - /projects — one entry per project (the thing that was built).
 * - /satahan   — written pieces: case studies and other write-ups, each on its own page.
 *
 * A case study can belong to a project; the project page links to it in Satahan and the
 * Satahan entry links back to the project.
 */

export interface Cover {
  src: string;
  variant: "hero" | "inline";
}

export interface ProjectItem {
  slug: string;
  title: string;
  subtitle: string | null;
  year: number;
  role: string | null;
  cover: Cover | null;
  /** For sorting (newest first). */
  date: string;
  updatedAt: string;
}

export interface SatahanItem {
  slug: string;
  title: string;
  /** Permanent notebook number ("Nº 02"). */
  number: number;
  kind: "case_study" | "note";
  /** One line: the index row and the entry's deck. */
  summary: string | null;
  year: number;
  /** Publish date (falls back to created_at for rows published before it was recorded). */
  date: string;
  updatedAt: string;
  cover: Cover | null;
  readingMinutes: number | null;
  role: string | null;
  timeline: string | null;
  stack: string[];
  tags: string[];
  /** The project this piece is about, if any. */
  project: { slug: string; title: string } | null;
}

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");

/** Public URL for a storage path in the `media` bucket, or pass-through for absolute URLs. */
export function mediaUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  const path = t.replace(/^\/+/, "");
  if (!supabaseUrl) return path;
  if (path.startsWith("storage/v1/")) return `${supabaseUrl}/${path}`;
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}

function publishedDate(cs: CaseStudy): string {
  return cs.published_at || cs.created_at;
}

function isPublished(cs: CaseStudy): boolean {
  return !cs.status || cs.status === "published";
}

export function countWords(md: string | null | undefined): number {
  if (!md) return 0;
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_`|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingMinutes(cs: CaseStudy | null): number | null {
  if (!cs?.content_md?.trim()) return null;
  return Math.max(1, Math.round(countWords(cs.content_md) / 220));
}

export function caseStudyCover(cs: CaseStudy): Cover | null {
  const cover = cs.cover_path?.trim();
  if (cover) return { src: mediaUrl(cover), variant: "hero" };
  const fromGallery = cs.gallery?.find((g) => typeof g === "string" && g.trim());
  if (fromGallery) return { src: mediaUrl(fromGallery), variant: "hero" };
  const md = firstImageSrcFromMarkdown(cs.content_md);
  if (md) return { src: mediaUrl(md), variant: "inline" };
  return null;
}

/** Published case studies for a project: featured first, then CMS order. */
export function projectCaseStudies(projectId: string, caseStudies: CaseStudy[]): CaseStudy[] {
  return caseStudies
    .filter((cs) => cs.project_id === projectId && isPublished(cs))
    .sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      if ((a.order ?? 0) !== (b.order ?? 0)) return (a.order ?? 0) - (b.order ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function buildProjectItems(projects: Project[], caseStudies: CaseStudy[]): ProjectItem[] {
  return projects
    .map((project) => {
      // Fall back to the project's case study for a cover/role when the project has none.
      const story = projectCaseStudies(project.id, caseStudies)[0] ?? null;
      return {
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle || project.short_description || story?.summary || null,
        year: new Date(project.created_at).getFullYear(),
        role: project.role || story?.role || null,
        cover: project.cover_image
          ? { src: mediaUrl(project.cover_image), variant: "hero" as const }
          : story
            ? caseStudyCover(story)
            : null,
        date: project.created_at,
        updatedAt: project.updated_at,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Published Satahan entries, newest number first. Numbers come from the CMS (`entry_number`);
 * rows without one (saved before numbering existed) are numbered after them, oldest first.
 */
function toSatahanItem(cs: CaseStudy, number: number, projectsById: Map<string, Project>): SatahanItem {
  const project = cs.project_id ? projectsById.get(cs.project_id) : undefined;
  return {
    slug: cs.slug,
    title: cs.title,
    number,
    kind: cs.kind === "note" ? "note" : "case_study",
    summary: cs.summary?.trim() || cs.in_short?.trim() || null,
    year: new Date(publishedDate(cs)).getFullYear(),
    date: publishedDate(cs),
    updatedAt: cs.updated_at,
    cover: caseStudyCover(cs),
    readingMinutes: readingMinutes(cs),
    role: cs.role?.trim() || null,
    timeline: cs.timeline?.trim() || null,
    stack: (cs.stack ?? []).filter(Boolean),
    tags: (cs.tags ?? []).filter(Boolean),
    project: project ? { slug: project.slug, title: project.title } : null,
  };
}

export function buildSatahanItems(caseStudies: CaseStudy[], projects: Project[]): SatahanItem[] {
  const projectsById = new Map(projects.map((p) => [p.id, p]));
  const published = caseStudies
    .filter(isPublished)
    .sort((a, b) => new Date(publishedDate(a)).getTime() - new Date(publishedDate(b)).getTime());
  let next = Math.max(0, ...published.map((cs) => cs.entry_number ?? 0));

  return published
    .map((cs) => toSatahanItem(cs, cs.entry_number ?? ++next, projectsById))
    .sort((a, b) => b.number - a.number);
}

/**
 * An unpublished entry as it will appear once published: it takes the next free number
 * and sits in front of the newest published entry.
 */
export function buildPreviewItem(entry: CaseStudy, published: SatahanItem[], projects: Project[]): SatahanItem {
  const projectsById = new Map(projects.map((p) => [p.id, p]));
  const nextNumber = Math.max(0, ...published.map((i) => i.number)) + 1;
  const item = toSatahanItem(entry, entry.entry_number ?? nextNumber, projectsById);
  // Drafts have no publish date yet; show today's, which is what publishing will record.
  return entry.published_at ? item : { ...item, date: new Date().toISOString(), year: new Date().getFullYear() };
}

/** "02", "14" — Satahan numbers are always shown with at least two digits. */
export function formatEntryNumber(n: number): string {
  return String(n).padStart(2, "0");
}
