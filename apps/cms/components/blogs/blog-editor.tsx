"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconEye,
  IconTrash,
  IconCode,
  IconPhoto,
  IconPlus,
  IconX,
} from "@tabler/icons-react"
import type { Blog, BlogInsert, BlogUpdate, BlogStatus, TargetApp } from "@/lib/types/blog"
import type { UnifiedContentKind } from "@/lib/types/unified-content"
import { UNIFIED_KIND_LABELS, inferKindFromBlogCategory } from "@/lib/types/unified-content"
import type {
  CaseStudy,
  CaseStudyType,
  Link as CaseStudyLink,
  Result,
  Metric,
} from "@/lib/types/case-study"
import { createBlog, updateBlog, deleteBlog, uploadBlogMedia } from "@/lib/actions/blogs"
import {
  createOrUpdateCaseStudy,
  deleteCaseStudy,
  uploadMedia,
} from "@/lib/actions/case-studies"
import { generateSlug } from "@/lib/utils/slug"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function defaultCaseStudyExtras() {
  return {
    type: "problem-solving" as CaseStudyType,
    subjectName: "",
    subjectType: "",
    industry: "",
    audience: "",
    role: "",
    teamSize: "",
    timeline: "",
    tags: [] as string[],
    skills: [] as string[],
    stack: [] as string[],
    links: [] as CaseStudyLink[],
    results: [] as Result[],
    metrics: [] as Metric[],
  }
}

interface BlogEditorProps {
  blog?: Blog | null
  /** When editing a case study from Case Studies → [slug], same UX as /case-studies/new. */
  caseStudy?: CaseStudy | null
  markdownContent?: string
  /** Shown when MDX could not be loaded from storage (repair flow). */
  mdxWarning?: string | null
  /** When creating content, start as this kind (e.g. case study from Case Studies → New). */
  initialKind?: UnifiedContentKind
  /** If true, user cannot change content kind (e.g. editing an existing post). */
  lockKind?: boolean
  /** Back navigation target (default: The View list). */
  backHref?: string
}

export function BlogEditor({
  blog,
  caseStudy = null,
  markdownContent = "",
  mdxWarning = null,
  initialKind = "the_view",
  lockKind = false,
  backHref = "/protected/blogs",
}: BlogEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!blog
  const editingCaseStudy = !!caseStudy

  const [formData, setFormData] = useState<Omit<BlogInsert, "mdxContent"> & { mdxContent: string }>({
    title: "",
    slug: "",
    excerpt: "",
    mdxContent: "",
    featuredImageUrl: "",
    featuredVideoUrl: "",
    status: "draft",
    targetApp: "portfolio",
    publishedAt: null,
    authorName: "",
    category: "",
    tags: [],
    seoTitle: "",
    seoDescription: "",
    featured: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)
  const [mdxView, setMdxView] = useState<"write" | "preview">("write")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [contentKind, setContentKind] = useState<UnifiedContentKind>(initialKind)
  const [csExtra, setCsExtra] = useState(defaultCaseStudyExtras)
  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [galleryVideoUrls, setGalleryVideoUrls] = useState<string[]>([])
  const [galleryUrlInput, setGalleryUrlInput] = useState("")
  const [galleryVideoUrlInput, setGalleryVideoUrlInput] = useState("")

  const kindLocked = lockKind || isEditing || editingCaseStudy

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || "",
        mdxContent: markdownContent || "",
        featuredImageUrl: blog.featuredImageUrl || "",
        featuredVideoUrl: blog.featuredVideoUrl || "",
        status: blog.status,
        targetApp: blog.targetApp || "portfolio",
        publishedAt: blog.publishedAt ?? null,
        authorName: blog.authorName || "",
        category: blog.category || "",
        tags: blog.tags || [],
        seoTitle: blog.seoTitle || "",
        seoDescription: blog.seoDescription || "",
        featured: blog.featured,
      })
      setContentKind(inferKindFromBlogCategory(blog.category))
      setAutoGenerateSlug(false)
      setImagePreview(blog.featuredImageUrl || "")
    } else {
      setContentKind(initialKind)
    }
  }, [blog, markdownContent, initialKind])

  useEffect(() => {
    if (!caseStudy) return
    setContentKind("case_study")
    setFormData({
      title: caseStudy.title,
      slug: caseStudy.slug,
      excerpt: caseStudy.summary || "",
      mdxContent: markdownContent || "",
      featuredImageUrl: caseStudy.coverUrl || "",
      featuredVideoUrl: "",
      status: caseStudy.status,
      targetApp: "portfolio",
      publishedAt: caseStudy.publishedAt ?? null,
      authorName: "",
      category: "",
      tags: [],
      seoTitle: caseStudy.seoTitle || "",
      seoDescription: caseStudy.seoDescription || "",
      featured: caseStudy.featured,
    })
    setCsExtra({
      type: caseStudy.type,
      subjectName: caseStudy.subjectName || "",
      subjectType: caseStudy.subjectType || "",
      industry: caseStudy.industry || "",
      audience: caseStudy.audience || "",
      role: caseStudy.role || "",
      teamSize: caseStudy.teamSize || "",
      timeline: caseStudy.timeline || "",
      tags: caseStudy.tags || [],
      skills: caseStudy.skills || [],
      stack: caseStudy.stack || [],
      links: caseStudy.links || [],
      results: caseStudy.results || [],
      metrics: caseStudy.metrics || [],
    })
    setGalleryUrls([...(caseStudy.galleryUrls || [])])
    setGalleryVideoUrls([...(caseStudy.galleryVideoUrls || [])])
    setAutoGenerateSlug(false)
    setImageFile(null)
    setImagePreview(caseStudy.coverUrl || "")
  }, [caseStudy, markdownContent])

  const [csTagInput, setCsTagInput] = useState("")
  const [csStackInput, setCsStackInput] = useState("")
  const [csSkillInput, setCsSkillInput] = useState("")
  const [linkLabelInput, setLinkLabelInput] = useState("")
  const [linkUrlInput, setLinkUrlInput] = useState("")
  const [resultInput, setResultInput] = useState("")
  const [metricLabelInput, setMetricLabelInput] = useState("")
  const [metricValueInput, setMetricValueInput] = useState("")

  // Auto-generate slug from title
  useEffect(() => {
    if (autoGenerateSlug && formData.title && !isEditing && !editingCaseStudy) {
      const newSlug = generateSlug(formData.title)
      setFormData((prev) => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, autoGenerateSlug, isEditing, editingCaseStudy])

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB")
      return
    }

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
    setFormData((prev) => ({ ...prev, featuredImageUrl: "" }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index) || [],
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    setIsUploadingImage(true)
    try {
      const imageUrl =
        contentKind === "case_study" ? await uploadMedia(file) : await uploadBlogMedia(file)

      // Insert markdown image syntax at cursor position
      const textarea = contentTextareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const textBefore = formData.mdxContent.substring(0, start)
        const textAfter = formData.mdxContent.substring(end)
        const imageMarkdown = `![${file.name}](${imageUrl})`
        const newContent = textBefore + imageMarkdown + textAfter

        setFormData({ ...formData, mdxContent: newContent })

        // Reset cursor position after the inserted image
        setTimeout(() => {
          const newCursorPos = start + imageMarkdown.length
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
        }, 0)
      } else {
        // If no cursor position, append at the end
        const imageMarkdown = `\n\n![${file.name}](${imageUrl})\n\n`
        setFormData({ ...formData, mdxContent: formData.mdxContent + imageMarkdown })
      }

      toast.success("Image uploaded and inserted")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploadingImage(false)
      // Reset file input
      e.target.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!formData.mdxContent.trim()) {
      toast.error("Content is required")
      return
    }

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("You must be logged in")
      }

      // Case study → case_studies table + case-studies-mdx (create or update)
      if (contentKind === "case_study") {
        let coverUrl: string | null = formData.featuredImageUrl || null
        if (imageFile) {
          coverUrl = await uploadMedia(imageFile)
        }

        await createOrUpdateCaseStudy(
          {
            title: formData.title.trim(),
            slug: (formData.slug || generateSlug(formData.title)).trim(),
            summary: formData.excerpt?.trim() || "",
            type: csExtra.type,
            status: formData.status ?? "draft",
            featured: formData.featured ?? false,
            publishedAt:
              formData.publishedAt ??
              (formData.status === "published" ? new Date().toISOString() : null),
            subjectName: csExtra.subjectName,
            subjectType: csExtra.subjectType,
            industry: csExtra.industry,
            audience: csExtra.audience,
            role: csExtra.role,
            teamSize: csExtra.teamSize,
            timeline: csExtra.timeline,
            tags: csExtra.tags,
            skills: csExtra.skills,
            stack: csExtra.stack,
            coverUrl,
            galleryUrls,
            galleryVideoUrls,
            links: csExtra.links,
            results: csExtra.results,
            metrics: csExtra.metrics,
            mdxContent: formData.mdxContent,
            seoTitle: formData.seoTitle?.trim() || "",
            seoDescription: formData.seoDescription?.trim() || "",
          },
          caseStudy?.id
        )

        toast.success(caseStudy ? "Case study updated" : "Case study created")
        router.push("/protected/case-studies")
        router.refresh()
        return
      }

      // Blog-like rows (The View, Insight, Project write-up)
      let featuredImageUrl = formData.featuredImageUrl
      if (imageFile) {
        const extension = imageFile.name.split(".").pop() ?? "jpg"
        const fileName = `${crypto.randomUUID()}.${extension}`
        const filePath = `blogs/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
          .from("media")
          .getPublicUrl(filePath)

        featuredImageUrl = publicUrl
      }

      let category: string | null = formData.category?.trim() || null
      if (contentKind === "insight") category = "insight"
      if (contentKind === "project_writeup") category = "project"

      const blogData: BlogInsert = {
        ...formData,
        featuredImageUrl,
        slug: formData.slug || generateSlug(formData.title),
        category,
      }

      if (isEditing && blog) {
        const updateData: BlogUpdate = {
          id: blog.id,
          ...blogData,
        }
        await updateBlog(updateData)
        toast.success("Post updated successfully")
      } else {
        await createBlog(blogData)
        toast.success("Post created successfully")
      }

      router.push("/protected/blogs")
      router.refresh()
    } catch (error) {
      console.error("Error saving:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (caseStudy) {
      if (!confirm("Delete this case study? This cannot be undone.")) return
      setIsDeleting(true)
      try {
        await deleteCaseStudy(caseStudy.id)
        toast.success("Case study deleted")
        router.push("/protected/case-studies")
        router.refresh()
      } catch (error) {
        console.error("Error deleting case study:", error)
        toast.error(error instanceof Error ? error.message : "Failed to delete case study")
      } finally {
        setIsDeleting(false)
      }
      return
    }

    if (!blog || !confirm("Are you sure you want to delete this post?")) return

    setIsDeleting(true)
    try {
      await deleteBlog(blog.id)
      toast.success("Post deleted successfully")
      router.push("/protected/blogs")
      router.refresh()
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete post")
    } finally {
      setIsDeleting(false)
    }
  }

  const headerTitle = caseStudy
    ? "Edit case study"
    : isEditing
      ? "Edit post"
      : contentKind === "case_study"
        ? "New case study"
        : contentKind === "insight"
          ? "New insight"
          : contentKind === "project_writeup"
            ? "New project write-up"
            : "New The View post"

  const headerSubtitle = kindLocked
    ? UNIFIED_KIND_LABELS[contentKind]
    : "Choose where this content lives, then write in Markdown with image uploads."

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-hidden">
      {mdxWarning ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {mdxWarning}
        </div>
      ) : null}
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background">
        <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-4 sm:py-4">
          <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-4">
            <Link href={backHref} className="shrink-0">
              <Button variant="ghost" size="icon">
                <IconArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold sm:text-xl">{headerTitle}</h1>
              <p className="break-words text-xs text-muted-foreground sm:text-sm">
                {headerSubtitle}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {(isEditing || caseStudy) && (
              <Button
                type="button"
                variant="destructive"
                className="min-w-0 flex-1 sm:flex-initial"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <IconTrash className="h-4 w-4 sm:mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button
              type="submit"
              form="blog-form"
              className="min-w-0 flex-1 sm:flex-initial"
              disabled={isLoading}
            >
              <IconDeviceFloppy className="h-4 w-4 sm:mr-2" />
              {isLoading
                ? "Saving..."
                : isEditing || caseStudy
                  ? "Update"
                  : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <form
        id="blog-form"
        onSubmit={handleSubmit}
        className="mx-auto box-border w-full max-w-5xl min-w-0 px-3 py-4 sm:px-6 sm:py-6"
      >
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Write your post content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title..."
                    className="text-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">
                    {contentKind === "case_study" ? "Summary" : "Excerpt"}
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt || ""}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder={
                      contentKind === "case_study"
                        ? "Short summary for listings and cards"
                        : "Brief summary of your post..."
                    }
                    rows={2}
                  />
                </div>

                {/* Markdown Editor with Write/Preview toggle */}
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Label className="shrink-0">Content * (Markdown)</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      {mdxView === "write" && (
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploadingImage}
                            id="content-image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            disabled={isUploadingImage}
                            asChild
                          >
                            <label htmlFor="content-image-upload" className="cursor-pointer">
                              <IconPhoto className="h-3 w-3 mr-1" />
                              {isUploadingImage ? "Uploading..." : "Upload Image"}
                            </label>
                          </Button>
                        </div>
                      )}
                      <div className="flex border rounded-md">
                        <Button
                          type="button"
                          variant={mdxView === "write" ? "secondary" : "ghost"}
                          size="sm"
                          className="rounded-r-none h-7 px-2 text-xs"
                          onClick={() => setMdxView("write")}
                        >
                          <IconCode className="h-3 w-3 mr-1" />
                          Write
                        </Button>
                        <Button
                          type="button"
                          variant={mdxView === "preview" ? "secondary" : "ghost"}
                          size="sm"
                          className="rounded-l-none h-7 px-2 text-xs"
                          onClick={() => setMdxView("preview")}
                        >
                          <IconEye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>

                  {mdxView === "write" ? (
                    <Textarea
                      ref={contentTextareaRef}
                      value={formData.mdxContent}
                      onChange={(e) => setFormData({ ...formData, mdxContent: e.target.value })}
                      placeholder="Write your post content in Markdown... Use the 'Upload Image' button to insert images, or use markdown syntax: ![alt text](image-url)"
                      rows={24}
                      className="min-h-[240px] w-full min-w-0 max-w-full font-mono text-sm break-words"
                      required
                    />
                  ) : (
                    <div className="max-w-full min-h-[min(600px,70vh)] overflow-x-auto rounded-md border p-4 prose prose-lg max-w-none dark:prose-invert prose-p:break-words prose-pre:max-w-full prose-pre:overflow-x-auto">
                      {formData.mdxContent.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.mdxContent}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">No content to preview</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>Search engine optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle || ""}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="Custom title for search engines"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription || ""}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="Meta description for search engines"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="min-w-0 space-y-6">
            {!kindLocked && !isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Content destination</CardTitle>
                  <CardDescription>
                    Same editor everywhere: MDX, inline images, SEO. Case studies save to Work; others save to The View list.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="content-kind">Publish as</Label>
                  <Select
                    value={contentKind}
                    onValueChange={(value: UnifiedContentKind) => {
                      setContentKind(value)
                      if (value !== "case_study") {
                        setCsExtra(defaultCaseStudyExtras())
                      }
                    }}
                  >
                    <SelectTrigger id="content-kind">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="the_view">{UNIFIED_KIND_LABELS.the_view}</SelectItem>
                      <SelectItem value="insight">{UNIFIED_KIND_LABELS.insight}</SelectItem>
                      <SelectItem value="project_writeup">{UNIFIED_KIND_LABELS.project_writeup}</SelectItem>
                      <SelectItem value="case_study">{UNIFIED_KIND_LABELS.case_study}</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {contentKind === "case_study" && (
              <Card>
                <CardHeader>
                  <CardTitle>Case study details</CardTitle>
                  <CardDescription>Structured fields for portfolio; narrative stays in the editor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={csExtra.type}
                      onValueChange={(value: CaseStudyType) =>
                        setCsExtra((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="problem-solving">Problem-solving</SelectItem>
                        <SelectItem value="descriptive">Descriptive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cs-subject">Subject / client</Label>
                    <Input
                      id="cs-subject"
                      value={csExtra.subjectName}
                      onChange={(e) =>
                        setCsExtra((prev) => ({ ...prev, subjectName: e.target.value }))
                      }
                      placeholder="Company or product name"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cs-role">Your role</Label>
                      <Input
                        id="cs-role"
                        value={csExtra.role}
                        onChange={(e) =>
                          setCsExtra((prev) => ({ ...prev, role: e.target.value }))
                        }
                        placeholder="Lead engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cs-timeline">Timeline</Label>
                      <Input
                        id="cs-timeline"
                        value={csExtra.timeline}
                        onChange={(e) =>
                          setCsExtra((prev) => ({ ...prev, timeline: e.target.value }))
                        }
                        placeholder="3 months"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                      <Input
                        className="min-w-0 flex-1"
                        value={csTagInput}
                        onChange={(e) => setCsTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const t = csTagInput.trim()
                            if (t && !csExtra.tags.includes(t)) {
                              setCsExtra((prev) => ({ ...prev, tags: [...prev.tags, t] }))
                              setCsTagInput("")
                            }
                          }
                        }}
                        placeholder="Add tag, Enter"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 self-start sm:self-auto"
                        onClick={() => {
                          const t = csTagInput.trim()
                          if (t && !csExtra.tags.includes(t)) {
                            setCsExtra((prev) => ({ ...prev, tags: [...prev.tags, t] }))
                            setCsTagInput("")
                          }
                        }}
                      >
                        <IconPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {csExtra.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {csExtra.tags.map((tag, i) => (
                          <span
                            key={`${tag}-${i}`}
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                          >
                            {tag}
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setCsExtra((prev) => ({
                                  ...prev,
                                  tags: prev.tags.filter((_, j) => j !== i),
                                }))
                              }
                            >
                              <IconX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Stack</Label>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                      <Input
                        className="min-w-0 flex-1"
                        value={csStackInput}
                        onChange={(e) => setCsStackInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const t = csStackInput.trim()
                            if (t && !csExtra.stack.includes(t)) {
                              setCsExtra((prev) => ({ ...prev, stack: [...prev.stack, t] }))
                              setCsStackInput("")
                            }
                          }
                        }}
                        placeholder="Next.js, …"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 self-start sm:self-auto"
                        onClick={() => {
                          const t = csStackInput.trim()
                          if (t && !csExtra.stack.includes(t)) {
                            setCsExtra((prev) => ({ ...prev, stack: [...prev.stack, t] }))
                            setCsStackInput("")
                          }
                        }}
                      >
                        <IconPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {csExtra.stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {csExtra.stack.map((s, i) => (
                          <span
                            key={`${s}-${i}`}
                            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                          >
                            {s}
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                setCsExtra((prev) => ({
                                  ...prev,
                                  stack: prev.stack.filter((_, j) => j !== i),
                                }))
                              }
                            >
                              <IconX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <details className="rounded-md border text-sm">
                    <summary className="cursor-pointer px-3 py-2 font-medium">More context & highlights</summary>
                    <div className="space-y-3 border-t p-3">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Subject type</Label>
                          <Input
                            value={csExtra.subjectType}
                            onChange={(e) =>
                              setCsExtra((prev) => ({ ...prev, subjectType: e.target.value }))
                            }
                            placeholder="Web app"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Team size</Label>
                          <Input
                            value={csExtra.teamSize}
                            onChange={(e) =>
                              setCsExtra((prev) => ({ ...prev, teamSize: e.target.value }))
                            }
                            placeholder="5"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Industry</Label>
                          <Input
                            value={csExtra.industry}
                            onChange={(e) =>
                              setCsExtra((prev) => ({ ...prev, industry: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Audience</Label>
                          <Input
                            value={csExtra.audience}
                            onChange={(e) =>
                              setCsExtra((prev) => ({ ...prev, audience: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Skills</Label>
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                          <Input
                            className="min-w-0 flex-1"
                            value={csSkillInput}
                            onChange={(e) => setCsSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                const t = csSkillInput.trim()
                                if (t && !csExtra.skills.includes(t)) {
                                  setCsExtra((prev) => ({ ...prev, skills: [...prev.skills, t] }))
                                  setCsSkillInput("")
                                }
                              }
                            }}
                            placeholder="Skill, Enter"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 self-start sm:self-auto"
                            onClick={() => {
                              const t = csSkillInput.trim()
                              if (t && !csExtra.skills.includes(t)) {
                                setCsExtra((prev) => ({ ...prev, skills: [...prev.skills, t] }))
                                setCsSkillInput("")
                              }
                            }}
                          >
                            <IconPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        {csExtra.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {csExtra.skills.map((sk, i) => (
                              <span
                                key={`${sk}-${i}`}
                                className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                              >
                                {sk}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCsExtra((prev) => ({
                                      ...prev,
                                      skills: prev.skills.filter((_, j) => j !== i),
                                    }))
                                  }
                                >
                                  <IconX className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Links</Label>
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
                          <Input
                            className="min-w-0 sm:min-w-[100px] sm:flex-1"
                            value={linkLabelInput}
                            onChange={(e) => setLinkLabelInput(e.target.value)}
                            placeholder="Label"
                          />
                          <Input
                            className="min-w-0 sm:min-w-[140px] sm:flex-[2]"
                            value={linkUrlInput}
                            onChange={(e) => setLinkUrlInput(e.target.value)}
                            placeholder="https://"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                if (linkLabelInput.trim() && linkUrlInput.trim()) {
                                  setCsExtra((prev) => ({
                                    ...prev,
                                    links: [
                                      ...prev.links,
                                      { label: linkLabelInput.trim(), url: linkUrlInput.trim() },
                                    ],
                                  }))
                                  setLinkLabelInput("")
                                  setLinkUrlInput("")
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 self-start sm:self-auto"
                            onClick={() => {
                              if (linkLabelInput.trim() && linkUrlInput.trim()) {
                                setCsExtra((prev) => ({
                                  ...prev,
                                  links: [
                                    ...prev.links,
                                    { label: linkLabelInput.trim(), url: linkUrlInput.trim() },
                                  ],
                                }))
                                setLinkLabelInput("")
                                setLinkUrlInput("")
                              }
                            }}
                          >
                            <IconPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        {csExtra.links.map((link, i) => (
                          <div
                            key={`${link.url}-${i}`}
                            className="flex items-center justify-between rounded border px-2 py-1 text-xs"
                          >
                            <span className="truncate">
                              {link.label} — {link.url}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() =>
                                setCsExtra((prev) => ({
                                  ...prev,
                                  links: prev.links.filter((_, j) => j !== i),
                                }))
                              }
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Key results (one line each)</Label>
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                          <Input
                            className="min-w-0 flex-1"
                            value={resultInput}
                            onChange={(e) => setResultInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                if (resultInput.trim()) {
                                  setCsExtra((prev) => ({
                                    ...prev,
                                    results: [...prev.results, { text: resultInput.trim() }],
                                  }))
                                  setResultInput("")
                                }
                              }
                            }}
                            placeholder="−40% latency"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 self-start sm:self-auto"
                            onClick={() => {
                              if (resultInput.trim()) {
                                setCsExtra((prev) => ({
                                  ...prev,
                                  results: [...prev.results, { text: resultInput.trim() }],
                                }))
                                setResultInput("")
                              }
                            }}
                          >
                            <IconPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        {csExtra.results.map((r, i) => (
                          <div
                            key={`${r.text}-${i}`}
                            className="flex items-center justify-between rounded border px-2 py-1 text-xs"
                          >
                            <span className="truncate">{r.text}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                setCsExtra((prev) => ({
                                  ...prev,
                                  results: prev.results.filter((_, j) => j !== i),
                                }))
                              }
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Metrics</Label>
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                          <Input
                            className="min-w-0 flex-1"
                            value={metricLabelInput}
                            onChange={(e) => setMetricLabelInput(e.target.value)}
                            placeholder="Label"
                          />
                          <Input
                            className="min-w-0 flex-1"
                            value={metricValueInput}
                            onChange={(e) => setMetricValueInput(e.target.value)}
                            placeholder="Value"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                if (metricLabelInput.trim() && metricValueInput.trim()) {
                                  setCsExtra((prev) => ({
                                    ...prev,
                                    metrics: [
                                      ...prev.metrics,
                                      {
                                        label: metricLabelInput.trim(),
                                        value: metricValueInput.trim(),
                                      },
                                    ],
                                  }))
                                  setMetricLabelInput("")
                                  setMetricValueInput("")
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 self-start sm:self-auto"
                            onClick={() => {
                              if (metricLabelInput.trim() && metricValueInput.trim()) {
                                setCsExtra((prev) => ({
                                  ...prev,
                                  metrics: [
                                    ...prev.metrics,
                                    {
                                      label: metricLabelInput.trim(),
                                      value: metricValueInput.trim(),
                                    },
                                  ],
                                }))
                                setMetricLabelInput("")
                                setMetricValueInput("")
                              }
                            }}
                          >
                            <IconPlus className="h-4 w-4" />
                          </Button>
                        </div>
                        {csExtra.metrics.map((m, i) => (
                          <div
                            key={`${m.label}-${i}`}
                            className="flex items-center justify-between rounded border px-2 py-1 text-xs"
                          >
                            <span>
                              {m.label}: {m.value}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                setCsExtra((prev) => ({
                                  ...prev,
                                  metrics: prev.metrics.filter((_, j) => j !== i),
                                }))
                              }
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: BlogStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {contentKind === "case_study" && (
                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Published date</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={
                        formData.publishedAt
                          ? new Date(formData.publishedAt).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedAt: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : null,
                        })
                      }
                    />
                  </div>
                )}

                {contentKind !== "case_study" && (
                  <div className="space-y-2">
                    <Label htmlFor="targetApp">Publish To *</Label>
                    <Select
                      value={formData.targetApp}
                      onValueChange={(value: TargetApp) =>
                        setFormData({ ...formData, targetApp: value })
                      }
                    >
                      <SelectTrigger id="targetApp">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="photos">Photos</SelectItem>
                        <SelectItem value="both">Both Apps</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Choose which app(s) will display this post
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: !!checked })
                    }
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    {contentKind === "case_study" ? "Featured case study" : "Featured post"}
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>URL & Slug</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug">Slug</Label>
                    {!isEditing && !caseStudy && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="auto-slug"
                          checked={autoGenerateSlug}
                          onCheckedChange={(checked) => setAutoGenerateSlug(!!checked)}
                        />
                        <Label htmlFor="auto-slug" className="text-xs cursor-pointer">
                          Auto-generate
                        </Label>
                      </div>
                    )}
                  </div>
                  <Input
                    id="slug"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="url-friendly-slug"
                    disabled={autoGenerateSlug && !isEditing && !caseStudy}
                  />
                  <p className="text-xs text-muted-foreground">
                    {contentKind === "case_study"
                      ? `Portfolio: /work/${formData.slug || "slug"}`
                      : `/blog/${formData.slug || "your-post-slug"}`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {contentKind === "case_study" ? "Cover image" : "Featured image"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {(imagePreview || formData.featuredImageUrl) && (
                  <div className="relative aspect-video rounded-lg border overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageFile ? imagePreview : formData.featuredImageUrl || ""}
                      alt="Featured"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (imagePreview?.startsWith("blob:")) {
                          URL.revokeObjectURL(imagePreview)
                        }
                        setImageFile(null)
                        setImagePreview("")
                        setFormData((prev) => ({ ...prev, featuredImageUrl: "" }))
                      }}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {contentKind === "case_study" && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                  <CardDescription>Optional image and video URLs for the portfolio layout.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Image URLs</Label>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                      <Input
                        className="min-w-0 flex-1"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const u = galleryUrlInput.trim()
                            if (u) {
                              setGalleryUrls((prev) => [...prev, u])
                              setGalleryUrlInput("")
                            }
                          }
                        }}
                        placeholder="https://…"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 self-start sm:self-auto"
                        onClick={() => {
                          const u = galleryUrlInput.trim()
                          if (u) {
                            setGalleryUrls((prev) => [...prev, u])
                            setGalleryUrlInput("")
                          }
                        }}
                      >
                        <IconPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {galleryUrls.length > 0 && (
                      <ul className="space-y-1 text-xs">
                        {galleryUrls.map((url, i) => (
                          <li
                            key={`${url}-${i}`}
                            className="flex items-center justify-between gap-2 rounded border px-2 py-1"
                          >
                            <span className="min-w-0 truncate">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() =>
                                setGalleryUrls((prev) => prev.filter((_, j) => j !== i))
                              }
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Video URLs</Label>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                      <Input
                        className="min-w-0 flex-1"
                        value={galleryVideoUrlInput}
                        onChange={(e) => setGalleryVideoUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const u = galleryVideoUrlInput.trim()
                            if (u) {
                              setGalleryVideoUrls((prev) => [...prev, u])
                              setGalleryVideoUrlInput("")
                            }
                          }
                        }}
                        placeholder="https://…"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0 self-start sm:self-auto"
                        onClick={() => {
                          const u = galleryVideoUrlInput.trim()
                          if (u) {
                            setGalleryVideoUrls((prev) => [...prev, u])
                            setGalleryVideoUrlInput("")
                          }
                        }}
                      >
                        <IconPlus className="h-4 w-4" />
                      </Button>
                    </div>
                    {galleryVideoUrls.length > 0 && (
                      <ul className="space-y-1 text-xs">
                        {galleryVideoUrls.map((url, i) => (
                          <li
                            key={`${url}-${i}`}
                            className="flex items-center justify-between gap-2 rounded border px-2 py-1"
                          >
                            <span className="min-w-0 truncate">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() =>
                                setGalleryVideoUrls((prev) => prev.filter((_, j) => j !== i))
                              }
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {contentKind !== "case_study" && (
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contentKind === "the_view" ? (
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category || ""}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Technology, Design"
                      />
                    </div>
                  ) : (
                    <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                      Category is set to{" "}
                      <span className="font-medium text-foreground">
                        {contentKind === "insight" ? "insight" : "project"}
                      </span>{" "}
                      for filtering in The View.
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="authorName">Author Name</Label>
                    <Input
                      id="authorName"
                      value={formData.authorName || ""}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
                      <Input
                        id="tags"
                        className="min-w-0 flex-1"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                        placeholder="Add a tag..."
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        size="sm"
                        className="shrink-0 self-start sm:self-auto"
                      >
                        Add
                      </Button>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-1 text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}