import type { CaseStudyKind } from "@/lib/types/case-study"

/** Summary is the index line and the entry deck on the portfolio, so it has to stay short. */
export const SUMMARY_MAX_LENGTH = 160

export interface PublishIssue {
  field: string
  message: string
}

export interface PublishCheck extends PublishIssue {
  ok: boolean
}

interface PublishableFields {
  title?: string | null
  slug?: string | null
  kind?: CaseStudyKind | null
  summary?: string | null
  contentMd?: string | null
  role?: string | null
  timeline?: string | null
}

const filled = (v?: string | null) => !!v && v.trim().length > 0

/**
 * Every field a Satahan entry needs before it can be published, with whether it is met.
 * Title, slug, kind, summary and body apply to every entry; cover, role and timeline only to case studies.
 */
export function getPublishChecks(data: PublishableFields, { hasCover }: { hasCover: boolean }): PublishCheck[] {
  const summary = data.summary?.trim() ?? ""
  const checks: PublishCheck[] = [
    { field: "title", message: "Title", ok: filled(data.title) },
    { field: "slug", message: "URL slug", ok: filled(data.slug) },
    { field: "kind", message: "Kind", ok: data.kind === "case_study" || data.kind === "article" || data.kind === "note" },
    {
      field: "summary",
      message: summary.length > SUMMARY_MAX_LENGTH ? `Summary (max ${SUMMARY_MAX_LENGTH} characters)` : "Summary",
      ok: summary.length > 0 && summary.length <= SUMMARY_MAX_LENGTH,
    },
    { field: "contentMd", message: "Body", ok: filled(data.contentMd) },
  ]
  if (data.kind === "case_study") {
    checks.push(
      { field: "cover", message: "Cover image", ok: hasCover },
      { field: "role", message: "Role", ok: filled(data.role) },
      { field: "timeline", message: "Timeline", ok: filled(data.timeline) }
    )
  }
  return checks
}

/** The requirements an entry still misses before it can be published. Empty means ready. */
export function getPublishIssues(data: PublishableFields, options: { hasCover: boolean }): PublishIssue[] {
  return getPublishChecks(data, options)
    .filter((c) => !c.ok)
    .map(({ field, message }) => ({ field, message }))
}
