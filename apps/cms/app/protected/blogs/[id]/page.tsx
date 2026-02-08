import { notFound } from "next/navigation"
import { getBlog, fetchMarkdownFromStorage } from "@/lib/actions/blogs"
import { BlogEditor } from "@/components/blogs/blog-editor"

interface EditBlogPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params
  const blog = await getBlog(id)

  if (!blog) {
    notFound()
  }

  // Fetch markdown content from storage
  let markdownContent = ""
  if (blog.mdxPath) {
    try {
      markdownContent = await fetchMarkdownFromStorage(blog.mdxPath)
    } catch (error) {
      console.error("Error fetching markdown:", error)
      // Continue with empty content if fetch fails
    }
  }

  return <BlogEditor blog={blog} markdownContent={markdownContent} />
}
