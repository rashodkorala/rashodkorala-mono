export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  published_at: string | null
  author_name: string | null
  category: string | null
  tags: string[] | null
  seo_title: string | null
  seo_description: string | null
}

export interface MarkdownParserConfig {
  h1: string
  h2: string
  h3: string
  p: string
  strong: string
  em: string
  code: string
  pre: string
  a: string
  img: string
  imgBorder: string
}

export interface ThemeConfig {
  container: {
    bg: string
    text: string
  }
  navigation: {
    link: string
    linkHover: string
  }
  header: {
    badge: string
    title: string
    excerpt: string
    author: string
  }
  heroImage: {
    border: string
    bg: string
  }
  tags: {
    bg: string
    text: string
  }
  content: {
    prose: string
  }
  footer: {
    border: string
    text: string
    button: string
    buttonHover: string
  }
  markdown: MarkdownParserConfig
}
