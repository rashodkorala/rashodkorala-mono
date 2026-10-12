import Link from "next/link"
import { redirect } from "next/navigation"
import { getProjects } from "@/lib/actions/projects"
import { createClient } from "@/lib/supabase/server"
import { CaseStudyForm } from "@/components/case-studies/case-study-form"
import { Button } from "@/components/ui/button"
import { IconChevronLeft } from "@tabler/icons-react"

export default async function NewSatahanEntryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const projects = await getProjects()
  const availableProjects = projects.map((p) => ({ id: p.id, title: p.title, slug: p.slug }))

  return (
    <div className="space-y-2">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 pt-4 md:px-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/satahan">
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">New satahan entry</p>
      </div>
      <CaseStudyForm availableProjects={availableProjects} />
    </div>
  )
}
