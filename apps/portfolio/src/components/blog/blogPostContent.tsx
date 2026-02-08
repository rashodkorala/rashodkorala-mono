import { BlogPostContent as SharedBlogPostContent, portfolioTheme } from "@rashodkorala/theView"
import type { BlogPost } from "@rashodkorala/theView"

export default function BlogPostContent({ blog }: { blog: BlogPost }) {
  return <SharedBlogPostContent blog={blog} theme={portfolioTheme} />
}