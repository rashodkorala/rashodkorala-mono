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
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconArrowLeft, IconDeviceFloppy, IconEye, IconTrash, IconCode, IconPhoto } from "@tabler/icons-react"
import type { Blog, BlogInsert, BlogUpdate, BlogStatus, TargetApp } from "@/lib/types/blog"
import { createBlog, updateBlog, deleteBlog, uploadBlogMedia } from "@/lib/actions/blogs"
import { generateSlug } from "@/lib/utils/slug"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface BlogEditorProps {
  blog?: Blog | null
  markdownContent?: string
}

export function BlogEditor({ blog, markdownContent = "" }: BlogEditorProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!blog

  const [formData, setFormData] = useState<Omit<BlogInsert, "mdxContent"> & { mdxContent: string }>({
    title: "",
    slug: "",
    excerpt: "",
    mdxContent: "",
    featuredImageUrl: "",
    status: "draft",
    targetApp: "portfolio",
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

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || "",
        mdxContent: markdownContent || "",
        featuredImageUrl: blog.featuredImageUrl || "",
        status: blog.status,
        targetApp: blog.targetApp || "portfolio",
        authorName: blog.authorName || "",
        category: blog.category || "",
        tags: blog.tags || [],
        seoTitle: blog.seoTitle || "",
        seoDescription: blog.seoDescription || "",
        featured: blog.featured,
      })
      setAutoGenerateSlug(false)
      setImagePreview(blog.featuredImageUrl || "")
    }
  }, [blog, markdownContent])

  // Auto-generate slug from title
  useEffect(() => {
    if (autoGenerateSlug && formData.title && !isEditing) {
      const newSlug = generateSlug(formData.title)
      setFormData((prev) => ({ ...prev, slug: newSlug }))
    }
  }, [formData.title, autoGenerateSlug, isEditing])

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
      const imageUrl = await uploadBlogMedia(file)

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

      // Upload image if selected
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

      const blogData: BlogInsert = {
        ...formData,
        featuredImageUrl,
        slug: formData.slug || generateSlug(formData.title),
      }

      if (isEditing && blog) {
        const updateData: BlogUpdate = {
          id: blog.id,
          ...blogData,
        }
        await updateBlog(updateData)
        toast.success("The View post updated successfully")
      } else {
        await createBlog(blogData)
        toast.success("The View post created successfully")
      }

      router.push("/protected/blogs")
      router.refresh()
    } catch (error) {
      console.error("Error saving blog:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save post")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/protected/blogs">
              <Button variant="ghost" size="icon">
                <IconArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">
                {isEditing ? "Edit The View Post" : "New The View Post"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing ? "Update your post" : "Create a new post"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <IconTrash className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button
              type="submit"
              form="blog-form"
              disabled={isLoading}
            >
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : isEditing ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <form id="blog-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt || ""}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary of your post..."
                    rows={2}
                  />
                </div>

                {/* Markdown Editor with Write/Preview toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Content * (Markdown)</Label>
                    <div className="flex items-center gap-2">
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
                      className="font-mono text-sm"
                      required
                    />
                  ) : (
                    <div className="border rounded-md p-4 min-h-[600px] prose prose-lg dark:prose-invert max-w-none">
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
          <div className="space-y-6">
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

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: !!checked })
                    }
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured post
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
                    {!isEditing && (
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
                    disabled={autoGenerateSlug && !isEditing}
                  />
                  <p className="text-xs text-muted-foreground">
                    /blog/{formData.slug || "your-post-slug"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category || ""}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Technology, Design"
                  />
                </div>

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
                  <div className="flex gap-2">
                    <Input
                      id="tags"
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
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
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
          </div>
        </div>
      </form>
    </div>
  )
}