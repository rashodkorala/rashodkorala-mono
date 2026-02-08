"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconX, IconPlus } from "@tabler/icons-react"
import type { CaseStudy, CaseStudyFormData, Link } from "@/lib/types/case-study"
import { createOrUpdateCaseStudy, uploadMedia } from "@/lib/actions/case-studies"
import { CASE_STUDY_MDX_TEMPLATE } from "@/lib/constants/case-study-template"

interface CaseStudyFormProps {
  caseStudy?: CaseStudy
  mdxContent?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function CaseStudyForm({ caseStudy, mdxContent = "" }: CaseStudyFormProps) {
  const router = useRouter()
  const isEditing = !!caseStudy

  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: caseStudy?.title || "",
    slug: caseStudy?.slug || "",
    summary: caseStudy?.summary || "",
    type: caseStudy?.type || "problem-solving",
    status: caseStudy?.status || "draft",
    featured: caseStudy?.featured || false,
    publishedAt: caseStudy?.publishedAt || null,
    subjectName: caseStudy?.subjectName || "",
    subjectType: caseStudy?.subjectType || "",
    industry: caseStudy?.industry || "",
    audience: caseStudy?.audience || "",
    role: caseStudy?.role || "",
    teamSize: caseStudy?.teamSize || "",
    timeline: caseStudy?.timeline || "",
    tags: caseStudy?.tags || [],
    skills: caseStudy?.skills || [],
    stack: caseStudy?.stack || [],
    coverUrl: caseStudy?.coverUrl || null,
    galleryUrls: caseStudy?.galleryUrls || [],
    links: caseStudy?.links || [],
    results: caseStudy?.results || [],
    metrics: caseStudy?.metrics || [],
    mdxContent: mdxContent,
    seoTitle: caseStudy?.seoTitle || "",
    seoDescription: caseStudy?.seoDescription || "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([])

  // Array field helpers
  const [stackInput, setStackInput] = useState("")
  const [linkLabelInput, setLinkLabelInput] = useState("")
  const [linkUrlInput, setLinkUrlInput] = useState("")

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: slugify(title),
    })
  }

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverImageFile(file)
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, coverUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setGalleryImageFiles([...galleryImageFiles, ...files])

    // Create previews
    const previews = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
      )
    )

    setFormData({
      ...formData,
      galleryUrls: [...formData.galleryUrls, ...previews],
    })
  }

  const removeGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      galleryUrls: formData.galleryUrls.filter((_, i) => i !== index),
    })
    setGalleryImageFiles(galleryImageFiles.filter((_, i) => i !== index))
  }

  const insertTemplate = () => {
    setFormData({ ...formData, mdxContent: CASE_STUDY_MDX_TEMPLATE })
    toast.success("Template inserted")
  }

  // Array field handlers

  const addStack = () => {
    if (stackInput.trim()) {
      setFormData({
        ...formData,
        stack: [...formData.stack, stackInput.trim()],
      })
      setStackInput("")
    }
  }

  const removeStack = (index: number) => {
    setFormData({
      ...formData,
      stack: formData.stack.filter((_, i) => i !== index),
    })
  }

  const addLink = () => {
    if (linkLabelInput.trim() && linkUrlInput.trim()) {
      setFormData({
        ...formData,
        links: [
          ...formData.links,
          { label: linkLabelInput.trim(), url: linkUrlInput.trim() },
        ],
      })
      setLinkLabelInput("")
      setLinkUrlInput("")
    }
  }

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required")
      return
    }

    if (!formData.mdxContent.trim()) {
      toast.error("Please add MDX content")
      return
    }

    setIsLoading(true)

    try {
      // Upload cover image if there's a new file
      let coverUrl = formData.coverUrl
      if (coverImageFile) {
        coverUrl = await uploadMedia(coverImageFile)
      }

      // Upload gallery images
      const galleryUrls = formData.galleryUrls.filter((url) => url.startsWith("http"))
      for (const file of galleryImageFiles) {
        const url = await uploadMedia(file)
        galleryUrls.push(url)
      }

      const dataToSubmit = {
        ...formData,
        coverUrl,
        galleryUrls,
      }

      await createOrUpdateCaseStudy(dataToSubmit, caseStudy?.id)

      toast.success(isEditing ? "Case study updated successfully" : "Case study created successfully")
      router.push("/protected/case-studies")
      router.refresh()
    } catch (error) {
      console.error("Error saving case study:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save case study")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="context">Context</TabsTrigger>
          <TabsTrigger value="proof">Links</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="My Amazing Project"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="my-amazing-project"
                required
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated from title, but you can customize it
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief introduction or overview (used for listing and SEO)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mdxContent">MDX Content *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={insertTemplate}
                  >
                    Insert Template
                  </Button>
                </div>
                <Textarea
                  id="mdxContent"
                  value={formData.mdxContent}
                  onChange={(e) => setFormData({ ...formData, mdxContent: e.target.value })}
                  placeholder="Paste your MDX content here with charts and all..."
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Paste your markdown/MDX content here. You can use charts from recharts (LineChart, BarChart, etc.)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Case Study Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "problem-solving" | "descriptive") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="problem-solving">Problem-Solving</SelectItem>
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published Date</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishedAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked as boolean })
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured case study
              </Label>
            </div>
          </Card>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
              />
              {formData.coverUrl && (
                <div className="mt-2">
                  <img
                    src={formData.coverUrl}
                    alt="Cover preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="galleryImages">Gallery Images</Label>
              <Input
                id="galleryImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImageUpload}
              />
              {formData.galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.galleryUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="SEO optimized title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="SEO meta description"
                rows={3}
              />
            </div>
          </Card>
        </TabsContent>

        {/* Context Tab */}
        <TabsContent value="context" className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input
                  id="subjectName"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  placeholder="Project or company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjectType">Subject Type</Label>
                <Input
                  id="subjectType"
                  value={formData.subjectType}
                  onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                  placeholder="e.g., Web App, Mobile App"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., B2B SaaS, E-commerce"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Input
                  id="audience"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  placeholder="Target audience"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Lead Developer, Product Designer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  placeholder="e.g., 5 people, Solo project"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                placeholder="e.g., 3 months (Q1 2024)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stack">Tech Stack</Label>
              <div className="flex gap-2">
                <Input
                  id="stack"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addStack()
                    }
                  }}
                  placeholder="Add a technology and press Enter"
                />
                <Button type="button" onClick={addStack} size="icon">
                  <IconPlus className="h-4 w-4" />
                </Button>
              </div>
              {formData.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.stack.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeStack(index)}
                        className="hover:text-destructive"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="proof" className="space-y-6">
          <Card className="p-6 space-y-6">
            <div>
              <Label>Links</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={linkLabelInput}
                  onChange={(e) => setLinkLabelInput(e.target.value)}
                  placeholder="Link label"
                />
                <Input
                  value={linkUrlInput}
                  onChange={(e) => setLinkUrlInput(e.target.value)}
                  placeholder="https://example.com"
                />
                <Button type="button" onClick={addLink} size="icon">
                  <IconPlus className="h-4 w-4" />
                </Button>
              </div>
              {formData.links.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                      <div>
                        <span className="font-medium">{link.label}</span>
                        <span className="text-sm text-muted-foreground ml-2">{link.url}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(index)}
                      >
                        <IconX className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/protected/case-studies")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Case Study" : "Create Case Study"}
        </Button>
      </div>
    </form>
  )
}





