import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCaseStudyBySlug } from "@/lib/actions/case-studies"
import { getProjects } from "@/lib/actions/projects"
import { CaseStudyForm } from "@/components/case-studies/case-study-form"
import { Button } from "@/components/ui/button"
import { IconChevronLeft } from "@tabler/icons-react"

interface EditWorkPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { slug } = await params
  const [caseStudy, projects] = await Promise.all([
    getCaseStudyBySlug(slug),
    getProjects(),
  ])
  if (!caseStudy) redirect("/protected/work")

  const availableProjects = projects.map(p => ({ id: p.id, title: p.title, slug: p.slug }))

  return (
    <div className="space-y-2">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 pt-4 md:px-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/work">
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Edit case study</p>
        </div>
      </div>
      <CaseStudyForm caseStudy={caseStudy} availableProjects={availableProjects} />
    </div>
  )
}
