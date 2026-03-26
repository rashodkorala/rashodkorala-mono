import { getCaseStudyBySlugAdmin, fetchMdxFromStorage } from "@/lib/actions/case-studies"
import { CaseStudyForm } from "@/components/case-studies/case-study-form"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Check authentication first
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

  // Fetch MDX content from storage
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
      "The original MDX file could not be loaded (likely from migration). You can still edit metadata and re-save content to repair this work item."
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center gap-4">
        <Link href="/protected/work">
          <Button variant="ghost" size="sm">
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Work
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Work Item</h1>
        <p className="text-muted-foreground">
          Update your work item metadata and content
        </p>
      </div>

      {mdxWarning && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {mdxWarning}
        </div>
      )}

      <CaseStudyForm caseStudy={caseStudy} mdxContent={mdxContent} />
    </div>
  )
}





