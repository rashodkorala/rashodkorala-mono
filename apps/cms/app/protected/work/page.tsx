import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCaseStudies } from "@/lib/actions/case-studies"
import { getProjects } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CaseStudyActions } from "@/components/case-studies/case-study-actions"
import { ProjectActions } from "@/components/projects/project-actions"
import { IconPlus, IconBriefcase } from "@tabler/icons-react"

interface WorkPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  await searchParams

  const [caseStudies, projects] = await Promise.all([
    getCaseStudies(),
    getProjects(),
  ])

  const allItems = [
    ...caseStudies.map((cs) => ({
      id: cs.id,
      kind: "case_study" as const,
      title: cs.title,
      subtitle: cs.problem || null,
      updatedAt: cs.updatedAt,
      slug: cs.slug,
      data: cs,
    })),
    ...projects.map((p) => ({
      id: p.id,
      kind: "project" as const,
      title: p.title,
      subtitle: p.shortDescription || null,
      updatedAt: p.updatedAt,
      slug: p.slug,
      data: p,
    })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const total = allItems.length
  const caseStudyCount = caseStudies.length
  const projectCount = projects.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Work</h1>
          <p className="text-sm text-muted-foreground">Manage projects and related case studies.</p>
        </div>
        <Button asChild>
          <Link href="/protected/work/new">
            <IconPlus className="h-4 w-4 mr-2" />
            New Entry
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Case Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{caseStudyCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <IconBriefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No entries yet</p>
          <p className="text-sm text-muted-foreground mb-4">Create your first project or case study.</p>
          <Button asChild>
            <Link href="/protected/work/new">
              <IconPlus className="h-4 w-4 mr-2" />
              New Entry
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((item) => (
                <TableRow key={`${item.kind}-${item.id}`}>
                  <TableCell className="font-medium">
                    <div>
                      <p>{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {item.kind === "case_study" ? "Case Study" : "Project"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(item.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {item.kind === "case_study" ? (
                      <CaseStudyActions caseStudy={item.data as any} />
                    ) : (
                      <ProjectActions project={item.data as any} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
