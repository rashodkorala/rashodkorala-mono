import { BlogEditor } from "@/components/blogs/blog-editor"
import type { UnifiedContentKind } from "@/lib/types/unified-content"

const KIND_FROM_QUERY: Record<string, UnifiedContentKind> = {
  "the-view": "the_view",
  insight: "insight",
  project: "project_writeup",
  "case-study": "case_study",
}

export default async function NewBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>
}) {
  const { kind } = await searchParams
  const initialKind =
    kind && KIND_FROM_QUERY[kind] ? KIND_FROM_QUERY[kind] : "the_view"
  const lockKind = Boolean(kind && KIND_FROM_QUERY[kind])

  return (
    <BlogEditor
      initialKind={initialKind}
      lockKind={lockKind}
      backHref="/protected/blogs"
    />
  )
}
