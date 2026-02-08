import type { ThemeConfig } from "../types"

export const photosTheme: ThemeConfig = {
  container: {
    bg: "bg-background",
    text: "text-foreground",
  },
  navigation: {
    link: "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white",
    linkHover: "transition-colors group",
  },
  header: {
    badge: "text-xs sm:text-sm px-2 sm:px-3 py-1 border border-black/10 dark:border-white/10 rounded-full text-black/40 dark:text-white/40 whitespace-nowrap",
    title: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 sm:mb-6 text-black dark:text-white break-words",
    excerpt: "text-base sm:text-lg text-black/60 dark:text-white/60 font-light leading-relaxed max-w-3xl break-words",
    author: "text-xl text-black/50 dark:text-white/50 font-light mt-4",
  },
  heroImage: {
    border: "border-black/10 dark:border-white/10",
    bg: "bg-black/5 dark:bg-white/5",
  },
  tags: {
    bg: "bg-black dark:bg-white",
    text: "text-white dark:text-black",
  },
  content: {
    prose: `prose prose-lg dark:prose-invert max-w-none
      prose-headings:font-light prose-headings:tracking-tight
      prose-h1:text-4xl prose-h1:mb-6 prose-h1:text-black dark:prose-h1:text-white
      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-black dark:prose-h2:text-white
      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-black dark:prose-h3:text-white
      prose-p:text-black/70 dark:prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-4
      prose-a:text-black dark:prose-a:text-white prose-a:underline prose-a:decoration-black/20 dark:prose-a:decoration-white/20
      hover:prose-a:decoration-black/60 dark:hover:prose-a:decoration-white/60
      prose-strong:text-black dark:prose-strong:text-white prose-strong:font-medium
      prose-code:text-black/80 dark:prose-code:text-white/80 prose-code:bg-black/5 dark:prose-code:bg-white/5
      prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
      prose-pre:bg-black/5 dark:prose-pre:bg-white/5 prose-pre:border prose-pre:border-black/10 dark:prose-pre:border-white/10
      prose-pre:rounded-lg prose-pre:p-4
      prose-ul:list-disc prose-ul:my-6 prose-ul:pl-6
      prose-ol:list-decimal prose-ol:my-6 prose-ol:pl-6
      prose-li:text-black/70 dark:prose-li:text-white/70 prose-li:my-2
      prose-blockquote:border-l-4 prose-blockquote:border-black/20 dark:prose-blockquote:border-white/20
      prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-black/60 dark:prose-blockquote:text-white/60
      prose-img:rounded-lg prose-img:my-8
      [&_table]:border-collapse [&_table]:w-full
      [&_th]:text-left [&_th]:font-medium [&_th]:text-black dark:[&_th]:text-white
      [&_td]:text-black/70 dark:[&_td]:text-white/70`,
  },
  footer: {
    border: "border-black/10 dark:border-white/10",
    text: "text-lg text-black/50 dark:text-white/50 font-light mb-6",
    button: "inline-flex items-center gap-2 px-6 py-3 border border-black/20 dark:border-white/20 rounded-full text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors",
    buttonHover: "",
  },
  markdown: {
    h1: "text-4xl font-light tracking-tight mb-6 text-black dark:text-white",
    h2: "text-3xl font-light tracking-tight mt-12 mb-6 text-black dark:text-white",
    h3: "text-2xl font-light tracking-tight mt-8 mb-4 text-black dark:text-white",
    p: "text-black/70 dark:text-white/70 leading-relaxed mb-4",
    strong: "font-medium text-black dark:text-white",
    em: "italic",
    code: "text-black/80 dark:text-white/80 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded text-sm font-mono",
    pre: "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-4 overflow-x-auto my-6",
    a: "text-black dark:text-white underline decoration-black/20 dark:decoration-white/20 hover:decoration-black/60 dark:hover:decoration-white/60 transition-colors",
    img: "w-full h-auto rounded-lg object-cover",
    imgBorder: "border-black/10 dark:border-white/10",
  },
}
