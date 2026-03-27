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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/work">
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Case Study</h1>
          <p className="text-sm text-muted-foreground">{caseStudy.title}</p>
        </div>
      </div>
      <CaseStudyForm caseStudy={caseStudy} availableProjects={availableProjects} />
    </div>
  )
}
