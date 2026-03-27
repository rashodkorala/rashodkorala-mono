"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { IconX } from "@tabler/icons-react"
import type { Project, ProjectFormData } from "@/lib/types/project"
import { createProject, updateProject } from "@/lib/actions/projects"

interface ProjectFormProps {
  project?: Project
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const isEditing = !!project

  const [formData, setFormData] = useState<ProjectFormData>({
    title: project?.title || "",
    slug: project?.slug || "",
    subtitle: project?.subtitle || "",
    logoFile: null,
    shortDescription: project?.shortDescription || "",
    role: project?.role || "",
    timeline: project?.timeline || "",
    techStack: project?.techStack || [],
    liveUrl: project?.liveUrl || "",
    githubUrl: project?.githubUrl || "",
    coverImageFile: null,
    mediaFiles: [],
  })

  const [isLoading, setIsLoading] = useState(false)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [clearCoverImage, setClearCoverImage] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [clearLogo, setClearLogo] = useState(false)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(project?.logo || null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    project?.coverImage || null
  )
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [existingProjectMedia, setExistingProjectMedia] = useState(project?.projectMedia || [])
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([])
  const [techInput, setTechInput] = useState("")

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : slugify(title),
    }))
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setClearCoverImage(false)
    const reader = new FileReader()
    reader.onloadend = () => setCoverPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setClearLogo(false)
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreviewUrl(null)
    setClearLogo(true)
  }

  const removeCoverImage = () => {
    setCoverFile(null)
    setCoverPreviewUrl(null)
    setClearCoverImage(true)
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setMediaFiles((prev) => [...prev, ...files])
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
    setMediaPreviewUrls((prev) => [...prev, ...previews])
  }

  const removeMedia = (index: number) => {
    setMediaPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingMedia = (index: number) => {
    setExistingProjectMedia((prev) => prev.filter((_, i) => i !== index))
  }

  const addToArray = (value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({ ...prev, techStack: [...prev.techStack, value.trim()] }))
      setTechInput("")
    }
  }

  const removeFromArray = (index: number) => {
    setFormData((prev) => ({ ...prev, techStack: prev.techStack.filter((_, i) => i !== index) }))
  }

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required")
      return
    }

    setIsLoading(true)

    try {
      const submitData: ProjectFormData = {
        ...formData,
        logoFile,
        clearLogo,
        coverImageFile: coverFile,
        clearCoverImage,
        existingProjectMedia,
        mediaFiles,
      }

      if (isEditing && project) {
        await updateProject(project.id, submitData)
      } else {
        await createProject(submitData)
      }

      toast.success(isEditing ? "Project updated" : "Project created")
      router.push("/protected/work")
      router.refresh()
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Project</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={formData.subtitle}
            onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
            placeholder="Short hook line for the project"
          />
        </div>
        <div className="space-y-2">
          <Label>Short Description</Label>
          <Textarea
            rows={3}
            value={formData.shortDescription}
            onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
          />
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">Quick Info</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={formData.role} onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Timeline</Label>
            <Input value={formData.timeline} onChange={(e) => setFormData((p) => ({ ...p, timeline: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Tech Stack</Label>
          <div className="flex gap-2">
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addToArray(techInput)
                }
              }}
              placeholder="Add a tech and press Enter"
            />
            <Button type="button" variant="outline" onClick={() => addToArray(techInput)}>Add</Button>
          </div>
          {formData.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech, i) => (
                <div key={`${tech}-${i}`} className="text-sm rounded bg-secondary px-2 py-1 flex items-center gap-1">
                  {tech}
                  <button type="button" onClick={() => removeFromArray(i)}><IconX className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Live URL</Label>
            <Input value={formData.liveUrl} onChange={(e) => setFormData((p) => ({ ...p, liveUrl: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input value={formData.githubUrl} onChange={(e) => setFormData((p) => ({ ...p, githubUrl: e.target.value }))} />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Media</h2>
        <div className="space-y-2">
          <Label>Logo (optional)</Label>
          <Input type="file" accept="image/*" onChange={handleLogoUpload} />
          {logoPreviewUrl && (
            <div className="relative inline-block">
              <img src={logoPreviewUrl} alt="Logo preview" className="h-20 w-20 object-contain rounded border bg-background p-2" />
              <button type="button" onClick={removeLogo} className="absolute -top-2 -right-2 rounded-full bg-black/60 p-1">
                <IconX className="h-3 w-3 text-white" />
              </button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <Input type="file" accept="image/*" onChange={handleCoverImageUpload} />
          {coverPreviewUrl && (
            <div className="relative inline-block">
              <img src={coverPreviewUrl} alt="Cover preview" className="w-full max-w-md h-48 object-cover rounded-lg" />
              <button type="button" onClick={removeCoverImage} className="absolute top-1 right-1 rounded bg-black/60 p-1">
                <IconX className="h-3 w-3 text-white" />
              </button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Project Media (images/videos)</Label>
          <Input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} />
          {(existingProjectMedia.length > 0 || mediaPreviewUrls.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {existingProjectMedia.map((item, i) => (
                <div key={`existing-${i}`} className="relative">
                  {item.type === "video" ? (
                    <video src={item.url} className="w-full h-28 object-cover rounded" />
                  ) : (
                    <img src={item.url} alt={`Media ${i + 1}`} className="w-full h-28 object-cover rounded" />
                  )}
                  <button type="button" onClick={() => removeExistingMedia(i)} className="absolute top-1 right-1 rounded bg-black/60 p-1">
                    <IconX className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {mediaPreviewUrls.map((url, i) => (
                <div key={`new-${i}`} className="relative">
                  <img src={url} alt={`New media ${i + 1}`} className="w-full h-28 object-cover rounded" />
                  <button type="button" onClick={() => removeMedia(i)} className="absolute top-1 right-1 rounded bg-black/60 p-1">
                    <IconX className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.push("/protected/work")} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : isEditing ? "Update Project" : "Create Project"}</Button>
      </div>
    </form>
  )
}
