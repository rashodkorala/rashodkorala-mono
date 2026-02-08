import { BlogPostContent as SharedBlogPostContent, photosTheme } from "@rashodkorala/theView"
import type { BlogPost } from "@rashodkorala/theView"

export default function BlogPostContent({ blog }: { blog: BlogPost }) {
  return <SharedBlogPostContent blog={blog} theme={photosTheme} />
}