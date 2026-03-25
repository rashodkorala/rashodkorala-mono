import { getCaseStudyBySlugAdmin, fetchMdxFromStorage } from "@/lib/actions/case-studies"
import { BlogEditor } from "@/components/blogs/blog-editor"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { slug } = await params
  const caseStudy = await getCaseStudyBySlugAdmin(slug)

  if (!caseStudy) {
    notFound()
  }

  let mdxContent = ""
  let mdxWarning: string | null = null

  try {
    mdxContent = await fetchMdxFromStorage(caseStudy.mdxPath)
  } catch (error) {
    console.error("Failed to fetch case study MDX", {
      slug,
      mdxPath: caseStudy.mdxPath,
      error,
    })
    mdxWarning =
      "The original MDX file could not be loaded (likely from migration). You can still edit metadata and re-save content to repair this case study."
  }

  return (
    <BlogEditor
      caseStudy={caseStudy}
      markdownContent={mdxContent}
      mdxWarning={mdxWarning}
      initialKind="case_study"
      lockKind
      backHref="/protected/case-studies"
    />
  )
}
