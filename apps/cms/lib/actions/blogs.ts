"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Blog, BlogDB, BlogInsert, BlogUpdate, TargetApp } from "@/lib/types/blog"

function transformBlog(blog: BlogDB): Blog {
  return {
    id: blog.id,
    userId: blog.user_id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    mdxPath: blog.mdx_path,
    featuredImageUrl: blog.featured_image_url,
    status: blog.status,
    targetApp: blog.target_app || "portfolio",
    publishedAt: blog.published_at,
    authorName: blog.author_name,
    category: blog.category,
    tags: blog.tags || [],
    seoTitle: blog.seo_title,
    seoDescription: blog.seo_description,
    featured: blog.featured,
    views: blog.views,
    createdAt: blog.created_at,
    updatedAt: blog.updated_at,
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Upload markdown content to storage
export async function uploadMarkdownToStorage(slug: string, content: string): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const fileName = `${slug}.md`
  const filePath = `${user.id}/${fileName}`

  // Upload or update the file
  const { error } = await supabase.storage
    .from("blogs-mdx")
    .upload(filePath, content, {
      contentType: "text/markdown",
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload markdown: ${error.message}`)
  }

  return filePath
}

// Fetch markdown content from storage
export async function fetchMarkdownFromStorage(mdxPath: string): Promise<string> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from("blogs-mdx")
    .download(mdxPath)

  if (error) {
    throw new Error(`Failed to fetch markdown: ${error.message}`)
  }

  return await data.text()
}

// Upload media (images) to storage for blog posts
export async function uploadBlogMedia(file: File): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${user.id}/${fileName}`

  const { error } = await supabase.storage
    .from("blogs-media")
    .upload(filePath, file)

  if (error) {
    throw new Error(`Failed to upload media: ${error.message}`)
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("blogs-media").getPublicUrl(filePath)

  return publicUrl
}

export async function getBlogs(status?: string, targetApp?: TargetApp): Promise<Blog[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  let query = supabase
    .from("blogs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  if (targetApp) {
    query = query.or(`target_app.eq.${targetApp},target_app.eq.both`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch blogs: ${error.message}`)
  }

  return (data || []).map(transformBlog)
}

export async function getBlog(id: string): Promise<Blog | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch blog: ${error.message}`)
  }

  return data ? transformBlog(data) : null
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(`Failed to fetch blog: ${error.message}`)
  }

  return data ? transformBlog(data) : null
}

export async function createBlog(blog: BlogInsert): Promise<Blog> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const slug = blog.slug || slugify(blog.title)

  // Upload markdown to storage
  const mdxPath = await uploadMarkdownToStorage(slug, blog.mdxContent)

  const { data, error } = await supabase
    .from("blogs")
    .insert({
      user_id: user.id,
      title: blog.title,
      slug: slug,
      excerpt: blog.excerpt || null,
      content: null, // Content is now stored in markdown files (mdx_path)
      mdx_path: mdxPath,
      featured_image_url: blog.featuredImageUrl || null,
      status: blog.status || "draft",
      target_app: blog.targetApp || "portfolio",
      published_at: blog.publishedAt || (blog.status === "published" ? new Date().toISOString() : null),
      author_name: blog.authorName || null,
      category: blog.category || null,
      tags: blog.tags || [],
      seo_title: blog.seoTitle || null,
      seo_description: blog.seoDescription || null,
      featured: blog.featured || false,
      views: 0,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create blog: ${error.message}`)
  }

  revalidatePath("/protected/blogs")
  revalidatePath("/protected/content")
  return transformBlog(data)
}

export async function updateBlog(blog: BlogUpdate): Promise<Blog> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get existing blog to find mdx_path if updating content
  let existingBlog: Blog | null = null
  if (blog.mdxContent) {
    existingBlog = await getBlog(blog.id)
  }

  // Upload markdown to storage if content is being updated
  let mdxPath: string | undefined = undefined
  if (blog.mdxContent !== undefined) {
    const slug = blog.slug || existingBlog?.slug || slugify(blog.title || existingBlog?.title || "")
    mdxPath = await uploadMarkdownToStorage(slug, blog.mdxContent)
  }

  const updateData: Partial<{
    title: string
    slug: string
    excerpt: string | null
    mdx_path: string | null
    featured_image_url: string | null
    status: string
    target_app: string
    published_at: string | null
    author_name: string | null
    category: string | null
    tags: string[] | null
    seo_title: string | null
    seo_description: string | null
    featured: boolean
  }> = {}

  if (blog.title !== undefined) updateData.title = blog.title
  if (blog.slug !== undefined) updateData.slug = blog.slug
  if (blog.excerpt !== undefined) updateData.excerpt = blog.excerpt
  if (mdxPath !== undefined) updateData.mdx_path = mdxPath
  if (blog.featuredImageUrl !== undefined) updateData.featured_image_url = blog.featuredImageUrl
  if (blog.status !== undefined) {
    updateData.status = blog.status
    if (blog.status === "published" && !blog.publishedAt) {
      updateData.published_at = new Date().toISOString()
    }
  }
  if (blog.targetApp !== undefined) updateData.target_app = blog.targetApp
  if (blog.publishedAt !== undefined) updateData.published_at = blog.publishedAt
  if (blog.authorName !== undefined) updateData.author_name = blog.authorName
  if (blog.category !== undefined) updateData.category = blog.category
  if (blog.tags !== undefined) updateData.tags = blog.tags
  if (blog.seoTitle !== undefined) updateData.seo_title = blog.seoTitle
  if (blog.seoDescription !== undefined) updateData.seo_description = blog.seoDescription
  if (blog.featured !== undefined) updateData.featured = blog.featured

  const { data, error } = await supabase
    .from("blogs")
    .update(updateData)
    .eq("id", blog.id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update blog: ${error.message}`)
  }

  revalidatePath("/protected/blogs")
  revalidatePath("/protected/content")
  revalidatePath(`/protected/blogs/${blog.id}`)
  return transformBlog(data)
}

export async function deleteBlog(id: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get the blog to find the mdx_path
  const blog = await getBlog(id)

  if (blog && blog.mdxPath) {
    // Delete markdown file from storage
    await supabase.storage
      .from("blogs-mdx")
      .remove([blog.mdxPath])
  }

  // Delete from database
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to delete blog: ${error.message}`)
  }

  revalidatePath("/protected/blogs")
  revalidatePath("/protected/content")
}
