"use client"

import { useState, useCallback } from "react"
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
import { IconX, IconPlus, IconSparkles, IconEye, IconCode, IconLoader2 } from "@tabler/icons-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { CaseStudy, CaseStudyFormData } from "@/lib/types/case-study"
import { createOrUpdateCaseStudy, uploadMedia } from "@/lib/actions/case-studies"
import { CASE_STUDY_MDX_TEMPLATE } from "@/lib/constants/case-study-template"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
  const [mdxView, setMdxView] = useState<"write" | "preview">("write")
  const [showTemplateConfirm, setShowTemplateConfirm] = useState(false)
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({})

  // Array field inputs
  const [stackInput, setStackInput] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [linkLabelInput, setLinkLabelInput] = useState("")
  const [linkUrlInput, setLinkUrlInput] = useState("")
  const [resultInput, setResultInput] = useState("")
  const [metricLabelInput, setMetricLabelInput] = useState("")
  const [metricValueInput, setMetricValueInput] = useState("")

  const updateField = useCallback(<K extends keyof CaseStudyFormData>(key: K, value: CaseStudyFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : slugify(title),
    }))
  }

  // ── Image handlers ──
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => updateField("coverUrl", reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setGalleryImageFiles(prev => [...prev, ...files])
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
    setFormData(prev => ({ ...prev, galleryUrls: [...prev.galleryUrls, ...previews] }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({ ...prev, galleryUrls: prev.galleryUrls.filter((_, i) => i !== index) }))
    setGalleryImageFiles(prev => prev.filter((_, i) => i !== index))
  }

  // ── Template insert with confirmation ──
  const insertTemplate = () => {
    if (formData.mdxContent.trim()) {
      setShowTemplateConfirm(true)
    } else {
      updateField("mdxContent", CASE_STUDY_MDX_TEMPLATE)
      toast.success("Template inserted")
    }
  }

  const confirmInsertTemplate = () => {
    updateField("mdxContent", CASE_STUDY_MDX_TEMPLATE)
    setShowTemplateConfirm(false)
    toast.success("Template inserted")
  }

  // ── Array field helpers ──
  const addToArray = (key: "stack" | "tags" | "skills", value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [key]: [...prev[key], value.trim()] }))
      setter("")
    }
  }

  const removeFromArray = (key: "stack" | "tags" | "skills", index: number) => {
    setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }))
  }

  const addLink = () => {
    if (linkLabelInput.trim() && linkUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, { label: linkLabelInput.trim(), url: linkUrlInput.trim() }],
      }))
      setLinkLabelInput("")
      setLinkUrlInput("")
    }
  }

  const removeLink = (index: number) => {
    setFormData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }))
  }

  const addResult = () => {
    if (resultInput.trim()) {
      setFormData(prev => ({
        ...prev,
        results: [...prev.results, { text: resultInput.trim() }],
      }))
      setResultInput("")
    }
  }

  const removeResult = (index: number) => {
    setFormData(prev => ({ ...prev, results: prev.results.filter((_, i) => i !== index) }))
  }

  const addMetric = () => {
    if (metricLabelInput.trim() && metricValueInput.trim()) {
      setFormData(prev => ({
        ...prev,
        metrics: [...prev.metrics, { label: metricLabelInput.trim(), value: metricValueInput.trim() }],
      }))
      setMetricLabelInput("")
      setMetricValueInput("")
    }
  }

  const removeMetric = (index: number) => {
    setFormData(prev => ({ ...prev, metrics: prev.metrics.filter((_, i) => i !== index) }))
  }

  // ── AI Generation ──
  const generateAI = async (field: string) => {
    if (!formData.title) {
      toast.error("Please add a title first")
      return
    }

    setAiLoading(prev => ({ ...prev, [field]: true }))

    try {
      const context = [
        formData.summary && `Summary: ${formData.summary}`,
        formData.subjectName && `Subject: ${formData.subjectName}`,
        formData.industry && `Industry: ${formData.industry}`,
        formData.role && `Role: ${formData.role}`,
        formData.stack.length > 0 && `Tech: ${formData.stack.join(", ")}`,
      ].filter(Boolean).join(". ")

      if (field === "mdxContent") {
        const response = await fetch("/api/generate-project-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "problem",
            title: formData.title,
            subtitle: formData.summary,
            context: `Generate a full case study in markdown format for: ${formData.title}. ${context}.
Include these sections: Overview, Context, Problem & Goals, Approach, Challenges & Tradeoffs, Results, Key Takeaways, Next Steps.
Write 2-3 paragraphs per section. Use markdown headers (##), bullet points, and numbered lists. Be specific and engaging.`,
          }),
        })

        if (!response.ok) throw new Error("Failed to generate content")
        const data = await response.json()
        updateField("mdxContent", data.content)
        toast.success("Case study content generated")
      } else if (field === "summary") {
        const response = await fetch("/api/generate-project-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subtitle",
            title: formData.title,
            context: `Write a compelling 1-2 sentence summary for this case study. ${context}`,
          }),
        })

        if (!response.ok) throw new Error("Failed to generate summary")
        const data = await response.json()
        updateField("summary", data.content)
        toast.success("Summary generated")
      } else if (field === "seo") {
        const response = await fetch("/api/generate-project-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "subtitle",
            title: formData.title,
            context: `Write an SEO-optimized meta description (max 160 chars) for a case study about: ${formData.title}. ${context}`,
          }),
        })

        if (!response.ok) throw new Error("Failed to generate SEO")
        const data = await response.json()
        updateField("seoTitle", formData.title)
        updateField("seoDescription", data.content)
        toast.success("SEO fields generated")
      }
    } catch {
      toast.error("AI generation failed. Make sure OPENAI_API_KEY is configured.")
    } finally {
      setAiLoading(prev => ({ ...prev, [field]: false }))
    }
  }

  // ── Submit ──
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
      let coverUrl = formData.coverUrl
      if (coverImageFile) {
        coverUrl = await uploadMedia(coverImageFile)
      }

      const galleryUrls = formData.galleryUrls.filter((url) => url.startsWith("http"))
      for (const file of galleryImageFiles) {
        const url = await uploadMedia(file)
        galleryUrls.push(url)
      }

      await createOrUpdateCaseStudy({ ...formData, coverUrl, galleryUrls }, caseStudy?.id)

      toast.success(isEditing ? "Case study updated" : "Case study created")
      router.push("/protected/case-studies")
      router.refresh()
    } catch (error) {
      console.error("Error saving case study:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save case study")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Chip input component ──
  const ChipInput = ({
    label,
    items,
    inputValue,
    onInputChange,
    onAdd,
    onRemove,
    placeholder,
  }: {
    label: string
    items: string[]
    inputValue: string
    onInputChange: (v: string) => void
    onAdd: () => void
    onRemove: (i: number) => void
    placeholder: string
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onAdd()
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" onClick={onAdd} size="icon" variant="outline">
          <IconPlus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm"
            >
              {item}
              <button type="button" onClick={() => onRemove(index)} className="hover:text-destructive">
                <IconX className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── AI button helper ──
  const AiButton = ({ field, label }: { field: string; label: string }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="text-xs h-6 px-2 text-muted-foreground hover:text-primary"
      onClick={() => generateAI(field)}
      disabled={aiLoading[field]}
    >
      {aiLoading[field] ? (
        <IconLoader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <IconSparkles className="h-3 w-3 mr-1" />
      )}
      {label}
    </Button>
  )

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="links">Links & Results</TabsTrigger>
          </TabsList>

          {/* ── Content Tab ── */}
          <TabsContent value="content" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="my-amazing-project"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="summary">Summary</Label>
                  <AiButton field="summary" label="AI Generate" />
                </div>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  placeholder="Brief overview used for listings and SEO"
                  rows={2}
                />
              </div>

              {/* MDX Editor with Write/Preview toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>MDX Content *</Label>
                  <div className="flex items-center gap-2">
                    <AiButton field="mdxContent" label="AI Generate" />
                    <Button type="button" variant="outline" size="sm" onClick={insertTemplate}>
                      Insert Template
                    </Button>
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
                    value={formData.mdxContent}
                    onChange={(e) => updateField("mdxContent", e.target.value)}
                    placeholder="Write your case study content in Markdown..."
                    rows={24}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="min-h-[400px] max-h-[600px] overflow-y-auto rounded-md border p-6 prose prose-invert prose-sm max-w-none">
                    {formData.mdxContent.trim() ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formData.mdxContent}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground italic">Nothing to preview yet. Switch to Write and add content.</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* ── Details Tab ── */}
          <TabsContent value="details" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Case Study Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "problem-solving" | "descriptive") => updateField("type", value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="problem-solving">Problem-Solving</SelectItem>
                      <SelectItem value="descriptive">Descriptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "draft" | "published" | "archived") => updateField("status", value)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publishedAt">Published Date</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""}
                    onChange={(e) =>
                      updateField("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : null)
                    }
                  />
                </div>
                <div className="flex items-end pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => updateField("featured", checked as boolean)}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">Featured case study</Label>
                  </div>
                </div>
              </div>

              <ChipInput
                label="Tags"
                items={formData.tags}
                inputValue={tagInput}
                onInputChange={setTagInput}
                onAdd={() => addToArray("tags", tagInput, setTagInput)}
                onRemove={(i) => removeFromArray("tags", i)}
                placeholder="Add a tag and press Enter"
              />

              <ChipInput
                label="Skills"
                items={formData.skills}
                inputValue={skillInput}
                onInputChange={setSkillInput}
                onAdd={() => addToArray("skills", skillInput, setSkillInput)}
                onRemove={(i) => removeFromArray("skills", i)}
                placeholder="Add a skill and press Enter"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>SEO Title</Label>
                  <AiButton field="seo" label="AI Generate SEO" />
                </div>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder="SEO optimized title"
                />
              </div>

              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea
                  value={formData.seoDescription}
                  onChange={(e) => updateField("seoDescription", e.target.value)}
                  placeholder="SEO meta description (max 160 characters)"
                  rows={2}
                />
              </div>
            </Card>
          </TabsContent>

          {/* ── Context Tab ── */}
          <TabsContent value="context" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject Name</Label>
                  <Input
                    value={formData.subjectName}
                    onChange={(e) => updateField("subjectName", e.target.value)}
                    placeholder="Project or company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject Type</Label>
                  <Input
                    value={formData.subjectType}
                    onChange={(e) => updateField("subjectType", e.target.value)}
                    placeholder="e.g., Web App, Mobile App"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    placeholder="e.g., B2B SaaS, E-commerce"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Input
                    value={formData.audience}
                    onChange={(e) => updateField("audience", e.target.value)}
                    placeholder="Target audience"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <Input
                    value={formData.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    placeholder="e.g., Lead Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Team Size</Label>
                  <Input
                    value={formData.teamSize}
                    onChange={(e) => updateField("teamSize", e.target.value)}
                    placeholder="e.g., 5 people"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <Input
                    value={formData.timeline}
                    onChange={(e) => updateField("timeline", e.target.value)}
                    placeholder="e.g., 3 months"
                  />
                </div>
              </div>

              <ChipInput
                label="Tech Stack"
                items={formData.stack}
                inputValue={stackInput}
                onInputChange={setStackInput}
                onAdd={() => addToArray("stack", stackInput, setStackInput)}
                onRemove={(i) => removeFromArray("stack", i)}
                placeholder="Add a technology and press Enter"
              />
            </Card>
          </TabsContent>

          {/* ── Media Tab ── */}
          <TabsContent value="media" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Input type="file" accept="image/*" onChange={handleCoverImageUpload} />
                {formData.coverUrl && (
                  <div className="mt-2">
                    <img src={formData.coverUrl} alt="Cover preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <Input type="file" accept="image/*" multiple onChange={handleGalleryImageUpload} />
                {formData.galleryUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.galleryUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
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
            </Card>
          </TabsContent>

          {/* ── Links & Results Tab ── */}
          <TabsContent value="links" className="space-y-6">
            <Card className="p-6 space-y-6">
              {/* Links */}
              <div className="space-y-2">
                <Label>Links</Label>
                <div className="flex gap-2">
                  <Input
                    value={linkLabelInput}
                    onChange={(e) => setLinkLabelInput(e.target.value)}
                    placeholder="Link label"
                  />
                  <Input
                    value={linkUrlInput}
                    onChange={(e) => setLinkUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink() } }}
                  />
                  <Button type="button" onClick={addLink} size="icon" variant="outline">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.links.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                        <div>
                          <span className="font-medium">{link.label}</span>
                          <span className="text-sm text-muted-foreground ml-2">{link.url}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)}>
                          <IconX className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="space-y-2">
                <Label>Key Results</Label>
                <div className="flex gap-2">
                  <Input
                    value={resultInput}
                    onChange={(e) => setResultInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addResult() } }}
                    placeholder="e.g., Reduced load time by 60%"
                  />
                  <Button type="button" onClick={addResult} size="icon" variant="outline">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.results.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                        <span className="text-sm">{result.text}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeResult(index)}>
                          <IconX className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <Label>Metrics</Label>
                <div className="flex gap-2">
                  <Input
                    value={metricLabelInput}
                    onChange={(e) => setMetricLabelInput(e.target.value)}
                    placeholder="Metric label (e.g., Load Time)"
                  />
                  <Input
                    value={metricValueInput}
                    onChange={(e) => setMetricValueInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMetric() } }}
                    placeholder="Value (e.g., -60%)"
                  />
                  <Button type="button" onClick={addMetric} size="icon" variant="outline">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {formData.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                        <div>
                          <span className="text-sm font-medium">{metric.label}</span>
                          <span className="text-sm text-muted-foreground ml-2">{metric.value}</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeMetric(index)}>
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

      {/* Template overwrite confirmation */}
      <AlertDialog open={showTemplateConfirm} onOpenChange={setShowTemplateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace existing content?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current MDX content with the template. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmInsertTemplate}>Replace</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
