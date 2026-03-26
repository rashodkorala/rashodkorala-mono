"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IconChevronLeft, IconFileText, IconCode } from "@tabler/icons-react"
import { CaseStudyForm } from "@/components/case-studies/case-study-form"
import { ProjectForm } from "@/components/projects/project-form"

type Kind = "case_study" | "project" | null

interface NewWorkClientProps {
  availableProjects: { id: string; title: string; slug: string }[]
  availableCaseStudies: { id: string; title: string; slug: string }[]
}

export function NewWorkClient({ availableProjects, availableCaseStudies }: NewWorkClientProps) {
  const [selectedKind, setSelectedKind] = useState<Kind>(null)

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
          <h1 className="text-2xl font-bold">New Work Item</h1>
          <p className="text-sm text-muted-foreground">
            {selectedKind === null
              ? "Choose what you want to create."
              : selectedKind === "case_study"
              ? "Create a case study with section-based storytelling."
              : "Create a project with concise quick info and media."}
          </p>
        </div>
      </div>

      {selectedKind === null && (
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <button
            type="button"
            onClick={() => setSelectedKind("case_study")}
            className="text-left"
          >
            <Card className="p-6 h-full cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all duration-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconFileText className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">Case Study</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A structured case study linked to a project, organized by problem, approach, solution, impact, and learnings.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Section-based narrative
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Gallery and before/after media
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Tags, featured flag, and order
                </li>
              </ul>
            </Card>
          </button>

          <button
            type="button"
            onClick={() => setSelectedKind("project")}
            className="text-left"
          >
            <Card className="p-6 h-full cursor-pointer border-2 hover:border-primary hover:shadow-md transition-all duration-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconCode className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">Project</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A single project record with title, short description, quick info, cover image, and project media.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Short description + quick info
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Cover image and media files
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#10003;</span> Live &amp; GitHub links
                </li>
              </ul>
            </Card>
          </button>
        </div>
      )}

      {selectedKind === "case_study" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedKind(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <IconChevronLeft className="h-4 w-4 mr-1" />
              Change type
            </Button>
          </div>
          <CaseStudyForm availableProjects={availableProjects} />
        </div>
      )}

      {selectedKind === "project" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedKind(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <IconChevronLeft className="h-4 w-4 mr-1" />
              Change type
            </Button>
          </div>
          <ProjectForm availableCaseStudies={availableCaseStudies} />
        </div>
      )}
    </div>
  )
}
