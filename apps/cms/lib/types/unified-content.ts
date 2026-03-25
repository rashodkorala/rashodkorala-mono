/**
 * Where MDX-based content is stored and surfaced in the CMS.
 * - the_view: blogs table, full The View settings (target app, free category)
 * - insight | project_writeup: blogs table with fixed category for filtering
 * - case_study: case_studies table + case-studies-mdx storage
 */
export type UnifiedContentKind = "the_view" | "insight" | "project_writeup" | "case_study"

export const UNIFIED_KIND_LABELS: Record<UnifiedContentKind, string> = {
  the_view: "The View (blog)",
  insight: "Insight",
  project_writeup: "Project write-up",
  case_study: "Case study",
}

export function inferKindFromBlogCategory(category: string | null | undefined): UnifiedContentKind {
  if (category === "insight") return "insight"
  if (category === "project") return "project_writeup"
  return "the_view"
}
