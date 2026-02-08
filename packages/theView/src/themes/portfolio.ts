import type { ThemeConfig } from "../types"

export const portfolioTheme: ThemeConfig = {
  container: {
    bg: "bg-white",
    text: "text-black",
  },
  navigation: {
    link: "text-black/50 hover:text-black",
    linkHover: "transition-colors group",
  },
  header: {
    badge: "text-xs sm:text-sm px-2 sm:px-3 py-1 border border-black/10 rounded-full text-black/40 whitespace-nowrap",
    title: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 sm:mb-6 text-black break-words",
    excerpt: "text-base sm:text-lg text-black/60 font-light leading-relaxed max-w-3xl break-words",
    author: "text-xl text-black/50 font-light mt-4",
  },
  heroImage: {
    border: "border-black/10",
    bg: "bg-black/5",
  },
  tags: {
    bg: "bg-black",
    text: "text-white",
  },
  content: {
    prose: `prose prose-lg max-w-none
      prose-headings:font-light prose-headings:tracking-tight
      prose-h1:text-4xl prose-h1:mb-6 prose-h1:text-black
      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-black
      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-black
      prose-p:text-black/70 prose-p:leading-relaxed prose-p:mb-4
      prose-a:text-black prose-a:underline prose-a:decoration-black/20
      hover:prose-a:decoration-black/60
      prose-strong:text-black prose-strong:font-medium
      prose-code:text-black/80 prose-code:bg-black/5
      prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
      prose-pre:bg-black/5 prose-pre:border prose-pre:border-black/10
      prose-pre:rounded-lg prose-pre:p-4
      prose-ul:list-disc prose-ul:my-6 prose-ul:pl-6
      prose-ol:list-decimal prose-ol:my-6 prose-ol:pl-6
      prose-li:text-black/70 prose-li:my-2
      prose-blockquote:border-l-4 prose-blockquote:border-black/20
      prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-black/60
      prose-img:rounded-lg prose-img:my-8
      [&_table]:border-collapse [&_table]:w-full
      [&_th]:text-left [&_th]:font-medium [&_th]:text-black
      [&_td]:text-black/70`,
  },
  footer: {
    border: "border-black/10",
    text: "text-lg text-black/50 font-light mb-6",
    button: "inline-flex items-center gap-2 px-6 py-3 border border-black/20 rounded-full text-sm hover:bg-black hover:text-white transition-colors",
    buttonHover: "",
  },
  markdown: {
    h1: "text-4xl font-light tracking-tight mb-6 text-black",
    h2: "text-3xl font-light tracking-tight mt-12 mb-6 text-black",
    h3: "text-2xl font-light tracking-tight mt-8 mb-4 text-black",
    p: "text-black/70 leading-relaxed mb-4",
    strong: "font-medium text-black",
    em: "italic",
    code: "text-black/80 bg-black/5 px-2 py-0.5 rounded text-sm font-mono",
    pre: "bg-black/5 border border-black/10 rounded-lg p-4 overflow-x-auto my-6",
    a: "text-black underline decoration-black/20 hover:decoration-black/60 transition-colors",
    img: "w-full h-auto rounded-lg object-cover",
    imgBorder: "border-black/10",
  },
}
