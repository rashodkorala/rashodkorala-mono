import { getBlogs } from "@/lib/actions/blogs"
import { BlogsList } from "@/components/blogs/blogs-list"

export default async function BlogsPage() {
  const blogs = await getBlogs()

  return <BlogsList blogs={blogs} />
}
