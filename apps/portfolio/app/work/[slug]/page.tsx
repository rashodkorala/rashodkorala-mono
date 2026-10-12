import { notFound, permanentRedirect } from "next/navigation";
import { getCachedProjectBySlug } from "@/lib/supabase/cached-projects";
import { getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";

/**
 * Projects and case studies used to share /work/{slug}. Projects now live at /projects/{slug}
 * and case studies at /satahan/{slug}; old links are sent to whichever one the slug belongs to.
 */
export default async function LegacyWorkRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (await getCachedProjectBySlug(slug)) permanentRedirect(`/projects/${slug}`);
  if (await getCachedCaseStudyBySlug(slug)) permanentRedirect(`/satahan/${slug}`);
  notFound();
}
