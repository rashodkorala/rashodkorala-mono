import { notFound } from "next/navigation"
import { getBlog } from "@/lib/actions/blogs"
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

  return <BlogEditor blog={blog} />
}
