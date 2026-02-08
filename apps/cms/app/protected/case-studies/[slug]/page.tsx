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
  const mdxContent = await fetchMdxFromStorage(caseStudy.mdxPath)

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center gap-4">
        <Link href="/protected/case-studies">
          <Button variant="ghost" size="sm">
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Back to Case Studies
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Case Study</h1>
        <p className="text-muted-foreground">
          Update your case study metadata and content
        </p>
      </div>

      <CaseStudyForm caseStudy={caseStudy} mdxContent={mdxContent} />
    </div>
  )
}





