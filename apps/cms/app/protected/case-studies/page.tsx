import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCaseStudies } from "@/lib/actions/case-studies"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import { IconPlus, IconBook, IconDownload } from "@tabler/icons-react"
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

export default async function ProtectedCaseStudiesPage() {
  // Check authentication first
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const caseStudies = await getCaseStudies()

  const stats = {
    total: caseStudies.length,
    published: caseStudies.filter((cs) => cs.status === "published").length,
    draft: caseStudies.filter((cs) => cs.status === "draft").length,
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="text-muted-foreground">Manage your case studies</p>
        </div>
        <div className="flex gap-2">
          <Link href="/api/case-studies/download-template">
            <Button variant="outline" size="sm">
              <IconDownload className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </Link>
          <Link href="/protected/case-studies/guide">
            <Button variant="outline" size="sm">
              <IconBook className="h-4 w-4 mr-2" />
              Writing Guide
            </Button>
          </Link>
          <Link href="/protected/case-studies/new">
            <Button>
              <IconPlus className="h-4 w-4 mr-2" />
              New Case Study
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
            <CardDescription>Total Case Studies</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.published}</CardTitle>
            <CardDescription>Published</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.draft}</CardTitle>
            <CardDescription>Drafts</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {caseStudies.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">No case studies yet</h3>
            <p className="text-muted-foreground">Get started by creating your first case study</p>
            <div className="flex gap-3 justify-center">
              <Link href="/protected/case-studies/guide">
                <Button variant="outline">
                  <IconBook className="h-4 w-4 mr-2" />
                  Read Guide
                </Button>
              </Link>
              <Link href="/protected/case-studies/new">
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Create Case Study
                </Button>
              </Link>
            </div>
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
                <TableHead>Featured</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caseStudies.map((caseStudy) => (
                <TableRow key={caseStudy.id}>
                  <TableCell className="font-medium">{caseStudy.title}</TableCell>
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
                  <TableCell>{caseStudy.featured ? "⭐" : ""}</TableCell>
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
