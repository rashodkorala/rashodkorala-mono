import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getCachedCaseStudies, getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";
import { getCachedAllProjects, getCachedProjectBySlug } from "@/lib/supabase/cached-projects";
import { renderStory } from "@/lib/case-study-markdown";
import { mediaUrl, primaryStory, storyReadingMinutes } from "@/lib/work";
import type { CaseStudy, Project } from "@/lib/types";
import CaseStudyPage from "@/src/components/work/CaseStudyPage";
import ProjectPage, { type ProjectStory } from "@/src/components/work/ProjectPage";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

function asStrings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x.trim()) : [];
}

function toProjectStory(cs: CaseStudy): ProjectStory {
  const { html, headings } = renderStory(cs.content_md);
  const links = cs.links ?? [];
  const live = links.find((l) => l.type === "live" || /live|site/i.test(l.label ?? ""));
  const github = links.find((l) => l.type === "github" || /git/i.test(l.label ?? ""));
  return {
    id: cs.id,
    title: cs.title,
    html,
    headings,
    readingMinutes: storyReadingMinutes(cs),
    beforeSrc: cs.before_after?.beforeImage ? mediaUrl(cs.before_after.beforeImage) : null,
    afterSrc: cs.before_after?.afterImage ? mediaUrl(cs.before_after.afterImage) : null,
    gallery: asStrings(cs.gallery).map(mediaUrl).slice(0, 4),
    stack: asStrings(cs.stack),
    role: cs.role ?? null,
    timeline: cs.timeline ?? null,
    liveUrl: live?.url ?? null,
    githubUrl: github?.url ?? null,
  };
}

/**
 * A slug is either a project (rendered with its case study as the story) or a case study.
 * A case study that is a project's story redirects to the project's page.
 */
async function resolve(slug: string): Promise<
  | { kind: "project"; project: Project; story: CaseStudy | null }
  | { kind: "case-study"; caseStudy: CaseStudy }
  | { kind: "redirect"; to: string }
  | null
> {
  const project = await getCachedProjectBySlug(slug);
  if (project) {
    return { kind: "project", project, story: primaryStory(project.id, project.relatedCaseStudies ?? []) };
  }

  const caseStudy = await getCachedCaseStudyBySlug(slug);
  if (!caseStudy) return null;

  if (caseStudy.project_id) {
    const [projects, caseStudies] = await Promise.all([getCachedAllProjects(), getCachedCaseStudies()]);
    const owner = projects.find((p) => p.id === caseStudy.project_id);
    if (owner && primaryStory(owner.id, caseStudies)?.id === caseStudy.id) {
      return { kind: "redirect", to: `/work/${owner.slug}` };
    }
  }
  return { kind: "case-study", caseStudy };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await resolve(slug);
  if (!item) return { title: "Not found" };
  // Redirecting to the project page — keep the default title rather than flashing "Not found".
  if (item.kind === "redirect") return {};

  if (item.kind === "project") {
    const { project, story } = item;
    const description =
      project.subtitle || project.short_description || story?.summary || `Explore ${project.title} by Rashod Korala.`;
    const image = project.cover_image ? mediaUrl(project.cover_image) : null;
    return {
      title: project.title,
      description,
      alternates: { canonical: `/work/${project.slug}` },
      openGraph: {
        title: `${project.title} | Rashod Korala`,
        description,
        images: image ? [{ url: image }] : [],
      },
      twitter: {
        title: `${project.title} | Rashod Korala`,
        description,
        images: image ? [image] : [],
      },
    };
  }

  const { caseStudy } = item;
  const description = caseStudy.summary || caseStudy.content_md?.slice(0, 160) || undefined;
  return {
    title: caseStudy.title,
    description,
    alternates: { canonical: `/work/${caseStudy.slug}` },
    openGraph: { title: `${caseStudy.title} | Work`, description },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await resolve(slug);

  if (!item) notFound();
  if (item.kind === "redirect") permanentRedirect(item.to);

  if (item.kind === "project") {
    return (
      <PageShell>
        <ProjectPage project={item.project} story={item.story ? toProjectStory(item.story) : null} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <CaseStudyPage caseStudy={item.caseStudy} />
    </PageShell>
  );
}
