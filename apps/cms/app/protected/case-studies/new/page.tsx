import { CaseStudyForm } from "@/components/case-studies/case-study-form"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function NewCaseStudyPage() {
  // Check authentication first
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }
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
        <h1 className="text-3xl font-bold">Create New Case Study</h1>
        <p className="text-muted-foreground">
          Fill in the metadata and write your case study content in MDX format
        </p>
      </div>

      <CaseStudyForm />
    </div>
  )
}





