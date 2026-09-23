import type { CaseStudy, Project } from "./types";
import { firstImageSrcFromMarkdown } from "./first-image-from-markdown";

/**
 * One entry on /work = one piece of work.
 *
 * In the CMS, projects and case studies are separate records, and most case studies belong to a
 * project. On the site they're presented together: a project's (primary) case study is the story
 * on the project's page, so each piece of work shows up once. Case studies without a project
 * are their own entries.
 */
export interface WorkItem {
  slug: string;
  title: string;
  subtitle: string | null;
  year: number;
  role: string | null;
  cover: { src: string; variant: "hero" | "inline" } | null;
  project: Project | null;
  story: CaseStudy | null;
  /** Reading time of the story, if there is one. */
  readingMinutes: number | null;
  /** For sorting (newest first). */
  date: string;
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

function isPublished(cs: CaseStudy): boolean {
  return !cs.status || cs.status === "published";
}

function byStoryPriority(a: CaseStudy, b: CaseStudy): number {
  if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
  if ((a.order ?? 0) !== (b.order ?? 0)) return (a.order ?? 0) - (b.order ?? 0);
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

/** The case study shown as a project's story: featured first, then CMS order. */
export function primaryStory(projectId: string, caseStudies: CaseStudy[]): CaseStudy | null {
  return caseStudies.filter((cs) => cs.project_id === projectId && isPublished(cs)).sort(byStoryPriority)[0] ?? null;
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

export function storyReadingMinutes(cs: CaseStudy | null): number | null {
  if (!cs?.content_md?.trim()) return null;
  return Math.max(1, Math.round(countWords(cs.content_md) / 220));
}

function storyCover(cs: CaseStudy): WorkItem["cover"] {
  const cover = cs.cover_path?.trim();
  if (cover) return { src: mediaUrl(cover), variant: "hero" };
  const fromGallery = cs.gallery?.find((g) => typeof g === "string" && g.trim());
  if (fromGallery) return { src: mediaUrl(fromGallery), variant: "hero" };
  const md = firstImageSrcFromMarkdown(cs.content_md);
  if (md) return { src: mediaUrl(md), variant: "inline" };
  return null;
}

export function buildWorkItems(projects: Project[], caseStudies: CaseStudy[]): WorkItem[] {
  const published = caseStudies.filter(isPublished);
  const projectIds = new Set(projects.map((p) => p.id));
  const items: WorkItem[] = [];

  for (const project of projects) {
    const story = primaryStory(project.id, published);
    items.push({
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle || story?.summary || null,
      year: new Date(project.created_at).getFullYear(),
      role: project.role || story?.role || null,
      cover: project.cover_image ? { src: mediaUrl(project.cover_image), variant: "hero" } : story ? storyCover(story) : null,
      project,
      story,
      readingMinutes: storyReadingMinutes(story),
      date: project.created_at,
    });
  }

  // Case studies that aren't a project's story get their own entry.
  const used = new Set(items.map((i) => i.story?.id).filter(Boolean));
  for (const cs of published) {
    if (used.has(cs.id)) continue;
    if (cs.project_id && projectIds.has(cs.project_id) && primaryStory(cs.project_id, published)?.id === cs.id) continue;
    items.push({
      slug: cs.slug,
      title: cs.title,
      subtitle: cs.summary || null,
      year: new Date(cs.created_at).getFullYear(),
      role: cs.role || null,
      cover: storyCover(cs),
      project: null,
      story: cs,
      readingMinutes: storyReadingMinutes(cs),
      date: cs.created_at,
    });
  }

  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
