import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCaseStudies } from "@/lib/actions/case-studies"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { IconPlus } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CaseStudyActions } from "@/components/case-studies/case-study-actions"
import { CaseStudyFilters } from "@/components/case-studies/case-study-filters"

export default async function ProtectedCaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const statusFilter = params.status || "all"

  const caseStudies = await getCaseStudies(statusFilter === "all" ? undefined : statusFilter)
  const allCaseStudies = statusFilter === "all" ? caseStudies : await getCaseStudies()

  const stats = {
    total: allCaseStudies.length,
    published: allCaseStudies.filter((cs) => cs.status === "published").length,
    draft: allCaseStudies.filter((cs) => cs.status === "draft").length,
    views: allCaseStudies.reduce((sum, cs) => sum + cs.views, 0),
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="text-muted-foreground">Manage your case studies</p>
        </div>
        <Link href="/protected/case-studies/new">
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            New Case Study
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.published}</CardTitle>
            <CardDescription>Published</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.draft}</CardTitle>
            <CardDescription>Drafts</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.views}</CardTitle>
            <CardDescription>Total Views</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <CaseStudyFilters currentStatus={statusFilter} />

      {caseStudies.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">
              {statusFilter === "all" ? "No case studies yet" : `No ${statusFilter} case studies`}
            </h3>
            <p className="text-muted-foreground">
              {statusFilter === "all"
                ? "Get started by creating your first case study"
                : "Try a different filter or create a new case study"}
            </p>
            <Link href="/protected/case-studies/new">
              <Button>
                <IconPlus className="h-4 w-4 mr-2" />
                Create Case Study
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caseStudies.map((caseStudy) => (
                <TableRow key={caseStudy.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {caseStudy.featured && <span className="text-yellow-500">*</span>}
                      {caseStudy.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {caseStudy.type === "problem-solving" ? "Problem-Solving" : "Descriptive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        caseStudy.status === "published"
                          ? "default"
                          : caseStudy.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {caseStudy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{caseStudy.views}</TableCell>
                  <TableCell>
                    {new Date(caseStudy.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <CaseStudyActions caseStudy={caseStudy} />
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
