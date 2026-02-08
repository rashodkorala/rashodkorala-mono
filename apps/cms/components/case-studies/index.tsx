"use client"

import { useState, useEffect } from "react"
import { IconDotsVertical, IconEdit, IconEye, IconBriefcase, IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CaseStudy } from "@/lib/types/case-study"
import { deleteCaseStudy } from "@/lib/actions/case-studies"
import { cn } from "@/lib/utils"

interface CaseStudiesProps {
  initialCaseStudies: CaseStudy[]
}

const statusColors = {
  draft: "secondary",
  published: "default",
  archived: "outline",
} as const

export function CaseStudies({ initialCaseStudies }: CaseStudiesProps) {
  const router = useRouter()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    setCaseStudies(initialCaseStudies)
  }, [initialCaseStudies])

  const filteredCaseStudies = statusFilter === "all"
    ? caseStudies
    : caseStudies.filter((cs) => cs.status === statusFilter)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) {
      return
    }

    try {
      await deleteCaseStudy(id)
      setCaseStudies(caseStudies.filter((cs) => cs.id !== id))
      toast.success("Case study deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete case study"
      )
    }
  }

  const handleEdit = (caseStudy: CaseStudy) => {
    router.push(`/protected/case-studies/${caseStudy.slug}`)
  }

  const handleNew = () => {
    router.push("/protected/case-studies/new")
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const stats = {
    total: caseStudies.length,
    published: caseStudies.filter((cs) => cs.status === "published").length,
    draft: caseStudies.filter((cs) => cs.status === "draft").length,
    views: caseStudies.reduce((sum, cs) => sum + cs.views, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="text-muted-foreground">
            Showcase your best work and success stories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <IconRefresh className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button onClick={handleNew}>
            <IconPlus className="h-4 w-4 mr-2" />
            New Case Study
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Studies</CardTitle>
          </CardHeader>
          <CardDescription className="text-2xl font-bold">{stats.total}</CardDescription>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardDescription className="text-2xl font-bold">{stats.published}</CardDescription>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardDescription className="text-2xl font-bold">{stats.draft}</CardDescription>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardDescription className="text-2xl font-bold">{stats.views}</CardDescription>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "published" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("published")}
        >
          Published
        </Button>
        <Button
          variant={statusFilter === "draft" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("draft")}
        >
          Drafts
        </Button>
        <Button
          variant={statusFilter === "archived" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("archived")}
        >
          Archived
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCaseStudies.map((caseStudy) => (
              <TableRow key={caseStudy.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {caseStudy.featured && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                    {caseStudy.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[caseStudy.status]}>
                    {caseStudy.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <IconEye className="h-4 w-4 text-muted-foreground" />
                    {caseStudy.views}
                  </div>
                </TableCell>
                <TableCell>
                  {caseStudy.publishedAt
                    ? new Date(caseStudy.publishedAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconDotsVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(caseStudy)}>
                        <IconEdit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/protected/case-studies/${caseStudy.slug}`}>
                          <IconEye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(caseStudy.id)}
                      >
                        <IconTrash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCaseStudies.length === 0 && (
        <div className="text-center py-12">
          <IconBriefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No case studies found</p>
          <Button onClick={handleNew} className="mt-4">
            <IconPlus className="h-4 w-4 mr-2" />
            Create Your First Case Study
          </Button>
        </div>
      )}

    </div>
  )
}





