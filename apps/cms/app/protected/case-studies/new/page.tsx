import { BlogEditor } from "@/components/blogs/blog-editor"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewCaseStudyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <BlogEditor
      initialKind="case_study"
      lockKind
      backHref="/protected/case-studies"
    />
  )
}





