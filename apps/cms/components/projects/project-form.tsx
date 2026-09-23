"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconX } from "@tabler/icons-react"
import type { Project, ProjectFormData } from "@/lib/types/project"
import { createProject, updateProject } from "@/lib/actions/projects"
import {
  AutoGrowTextarea,
  EditorLayout,
  SaveBar,
  SidebarSection,
  useEditorShortcuts,
} from "@/components/work-editor/editor-layout"
import { TagInput } from "@/components/work-editor/tag-input"

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

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="absolute right-1 top-1 rounded bg-black/60 p-1">
      <IconX className="h-3 w-3 text-white" />
    </button>
  )
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const isEditing = !!project
  const formRef = useRef<HTMLFormElement>(null)

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
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(project?.coverImage || null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [existingProjectMedia, setExistingProjectMedia] = useState(project?.projectMedia || [])
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([])
  const [editSlug, setEditSlug] = useState(false)

  const { dirty, markSaved } = useEditorShortcuts(
    formRef,
    [formData, coverFile, clearCoverImage, logoFile, clearLogo, mediaFiles, existingProjectMedia],
    isLoading
  )

  const update = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }))

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : slugify(title),
    }))
  }

  const readPreview = (file: File, set: (url: string) => void) => {
    const reader = new FileReader()
    reader.onloadend = () => set(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setMediaFiles((prev) => [...prev, ...files])
    const previews = await Promise.all(files.map((file) => new Promise<string>((resolve) => readPreview(file, resolve))))
    setMediaPreviewUrls((prev) => [...prev, ...previews])
  }

  const removeMedia = (index: number) => {
    setMediaPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

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

      markSaved()
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

  const cancel = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return
    router.push("/protected/work")
  }

  const mediaCount = existingProjectMedia.length + mediaFiles.length
  const detailsHint = [formData.role, formData.timeline].filter(Boolean).join(" · ")

  const main = (
    <div className="space-y-4">
      <AutoGrowTextarea
        aria-label="Title"
        value={formData.title}
        onChange={handleTitleChange}
        placeholder="Untitled project"
        className="text-4xl font-bold leading-tight tracking-tight"
      />
      <AutoGrowTextarea
        aria-label="Subtitle"
        value={formData.subtitle}
        onChange={(v) => update("subtitle", v)}
        placeholder="Short hook line for the project"
        className="text-lg text-muted-foreground"
      />
      <div className="border-t pt-6">
        <AutoGrowTextarea
          aria-label="Description"
          value={formData.shortDescription}
          onChange={(v) => update("shortDescription", v)}
          placeholder="What is it, who is it for, and what did you build? This is the overview on the project page."
          className="min-h-[12rem] text-[1.0625rem] leading-7"
        />
      </div>
    </div>
  )

  const sidebar = (
    <>
      <SidebarSection title="Details" hint={detailsHint || undefined} defaultOpen>
        <div className="space-y-2">
          <Label htmlFor="pj-role">Role</Label>
          <Input id="pj-role" value={formData.role} onChange={(e) => update("role", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pj-timeline">Timeline</Label>
          <Input id="pj-timeline" value={formData.timeline} onChange={(e) => update("timeline", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pj-stack">Tech stack</Label>
          <TagInput
            id="pj-stack"
            value={formData.techStack}
            onChange={(v) => update("techStack", v)}
            placeholder="Next.js, Supabase…"
          />
        </div>
      </SidebarSection>

      <SidebarSection title="Links" hint={[formData.liveUrl && "Live", formData.githubUrl && "GitHub"].filter(Boolean).join(" · ") || undefined}>
        <div className="space-y-2">
          <Label htmlFor="pj-live">Live URL</Label>
          <Input id="pj-live" value={formData.liveUrl} onChange={(e) => update("liveUrl", e.target.value)} placeholder="https://…" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pj-github">GitHub URL</Label>
          <Input id="pj-github" value={formData.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} placeholder="https://github.com/…" />
        </div>
      </SidebarSection>

      <SidebarSection title="Cover image" hint={coverPreviewUrl ? "Set" : "None"} defaultOpen={!isEditing}>
        {coverPreviewUrl && (
          <div className="relative">
            <img src={coverPreviewUrl} alt="Cover preview" className="h-32 w-full rounded object-cover" />
            <RemoveButton
              label="Remove cover"
              onClick={() => {
                setCoverFile(null)
                setCoverPreviewUrl(null)
                setClearCoverImage(true)
              }}
            />
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setCoverFile(file)
            setClearCoverImage(false)
            readPreview(file, setCoverPreviewUrl)
          }}
        />
      </SidebarSection>

      <SidebarSection title="Logo" hint={logoPreviewUrl ? "Set" : "None"}>
        {logoPreviewUrl && (
          <div className="relative inline-block">
            <img src={logoPreviewUrl} alt="Logo preview" className="h-20 w-20 rounded border bg-background object-contain p-2" />
            <RemoveButton
              label="Remove logo"
              onClick={() => {
                setLogoFile(null)
                setLogoPreviewUrl(null)
                setClearLogo(true)
              }}
            />
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setLogoFile(file)
            setClearLogo(false)
            readPreview(file, setLogoPreviewUrl)
          }}
        />
      </SidebarSection>

      <SidebarSection title="Photos & videos" hint={mediaCount ? `${mediaCount} item${mediaCount === 1 ? "" : "s"}` : undefined}>
        {mediaCount > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {existingProjectMedia.map((item, i) => (
              <div key={`existing-${i}`} className="relative">
                {item.type === "video" ? (
                  <video src={item.url} className="h-20 w-full rounded object-cover" />
                ) : (
                  <img src={item.url} alt={`Media ${i + 1}`} className="h-20 w-full rounded object-cover" />
                )}
                <RemoveButton
                  label={`Remove media ${i + 1}`}
                  onClick={() => setExistingProjectMedia((prev) => prev.filter((_, idx) => idx !== i))}
                />
              </div>
            ))}
            {mediaPreviewUrls.map((url, i) => (
              <div key={`new-${i}`} className="relative">
                <img src={url} alt={`New media ${i + 1}`} className="h-20 w-full rounded object-cover" />
                <RemoveButton label={`Remove new media ${i + 1}`} onClick={() => removeMedia(i)} />
              </div>
            ))}
          </div>
        )}
        <Input type="file" accept="image/*,video/*" multiple onChange={handleMediaUpload} />
      </SidebarSection>

      <SidebarSection title="Advanced" hint={formData.slug ? `/${formData.slug}` : undefined}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pj-slug">URL slug</Label>
            {!editSlug && (
              <button type="button" className="text-xs text-muted-foreground underline" onClick={() => setEditSlug(true)}>
                Edit
              </button>
            )}
          </div>
          <Input
            id="pj-slug"
            value={formData.slug}
            readOnly={!editSlug}
            className={editSlug ? undefined : "text-muted-foreground"}
            onChange={(e) => update("slug", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {isEditing ? "Changing it breaks existing links to this project." : "Generated from the title."}
          </p>
        </div>
      </SidebarSection>
    </>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <EditorLayout main={main} sidebar={sidebar} />
      <SaveBar
        dirty={dirty}
        saving={isLoading}
        submitLabel={isEditing ? "Save changes" : "Create project"}
        onCancel={cancel}
      />
    </form>
  )
}
