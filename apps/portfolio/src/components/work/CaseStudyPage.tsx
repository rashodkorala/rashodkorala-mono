import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CaseStudy } from "@/lib/types";
import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asObjectArray<T extends Record<string, unknown>>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is T => typeof item === "object" && item !== null);
}

function sanitizeMdxForFullRender(content: string): string {
  if (!content) return "";

  return content
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "\n") // Remove JSX comments like {/* ... */}
    .replace(/<[^>\n]+\/>/g, "\n") // Remove self-closing JSX tags
    .replace(/<\/?[A-Za-z][^>\n]*>/g, "\n") // Remove remaining JSX/HTML tags
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

const caseStudyMarkdownConfig: MarkdownParserConfig = {
  h1: "font-['Times_New_Roman','Times',serif] text-3xl md:text-4xl font-light tracking-tight mt-12 mb-5 text-ink dark:text-[#efe9e2]",
  h2: "font-['Times_New_Roman','Times',serif] text-2xl md:text-3xl font-light tracking-tight mt-12 mb-5 text-ink dark:text-[#e6dfd8]",
  h3: "font-['Times_New_Roman','Times',serif] text-xl md:text-2xl font-light tracking-tight mt-8 mb-4 text-ink dark:text-[#ddd6cf]",
  p: "font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-[16px] leading-[1.9] text-ink/75 dark:text-[#c2bab3] mb-4",
  strong: "font-medium text-ink dark:text-[#f0ebe4]",
  em: "italic",
  code: "font-mono text-ink/85 dark:text-[#d7cfc8] bg-ink/5 dark:bg-[#1a1817] px-2 py-0.5 rounded text-sm",
  pre: "bg-ink/[0.04] dark:bg-[#171514] border border-ink/10 dark:border-[#2f2c2a] rounded-lg p-4 overflow-x-auto my-6",
  a: "text-ink dark:text-[#ece7df] underline decoration-ink/20 dark:decoration-[#7a736d] hover:decoration-ink/60 dark:hover:decoration-[#b1aaa3] transition-colors",
  img: "w-full h-auto rounded-lg object-cover",
  imgBorder: "border-ink/10 dark:border-[#2f2c2a]",
};

export default function CaseStudyPage({ caseStudy, mdxContent }: { caseStudy: CaseStudy; mdxContent: string }) {
  const tags = asStringArray(caseStudy.tags);
  const stack = asStringArray(caseStudy.stack);
  const gallery = asStringArray(caseStudy.gallery_urls);
  const links = asObjectArray<{ label?: string; url?: string; type?: string }>(caseStudy.links);
  const results = asObjectArray<{ title?: string; value?: string; description?: string }>(caseStudy.results);
  const metrics = asObjectArray<{ label?: string; value?: string }>(caseStudy.metrics);
  const mdxHtml = mdxContent
    ? renderMarkdown(sanitizeMdxForFullRender(mdxContent), caseStudyMarkdownConfig)
    : "";

  return (
    <div className="max-w-4xl py-12 md:py-16 font-['Helvetica_Neue','Helvetica','Arial',sans-serif]">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 text-sm text-ink/45 hover:text-ink transition-colors group dark:text-[#a8a29d] dark:hover:text-[#e0dbd5]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
        Back to work
      </Link>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-ink/10 text-ink/45 dark:border-[#33302d] dark:text-[#b1aaa3]">
            {tag}
          </span>
        ))}
        {caseStudy.category && (
          <span className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-ink/10 text-ink/50 dark:border-[#33302d] dark:text-[#b9b2ac]">
            {caseStudy.category}
          </span>
        )}
      </div>

      <h1 className="mt-5 font-['Times_New_Roman','Times',serif] text-3xl md:text-5xl tracking-tight text-ink dark:text-[#f0ebe4]">{caseStudy.title}</h1>
      {caseStudy.summary && <p className="mt-3 text-lg text-muted_ink font-light dark:text-[#b8afa8]">{caseStudy.summary}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-ink/40 border-y border-ink/10 py-4 dark:text-[#a9a29b] dark:border-[#2e2b29]">
        <span>Role: {caseStudy.role || "N/A"}</span>
        <span className="w-px h-4 bg-ink/10 dark:bg-[#34312e]" />
        <span>Timeline: {caseStudy.timeline || "N/A"}</span>
        {links.map((link) =>
          link.url ? (
            <span key={`${link.label}-${link.url}`} className="flex items-center gap-2">
              <span className="w-px h-4 bg-ink/10 dark:bg-[#34312e]" />
              <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-ink transition-colors dark:hover:text-[#f0ebe4]">
                {link.label || link.type || "Link"}
              </a>
            </span>
          ) : null
        )}
      </div>

      {caseStudy.cover_url && (
        <div className="mt-8 relative w-full aspect-video rounded-2xl overflow-hidden border border-ink/10 dark:border-[#2f2c2a]">
          <Image src={caseStudy.cover_url} alt={caseStudy.title} fill className="object-cover saturate-95 dark:brightness-[0.86] dark:saturate-90" priority />
        </div>
      )}

      {caseStudy.lede && (
        <p className="mt-8 text-[16px] leading-[1.9] text-muted_ink max-w-2xl dark:text-[#b8afa8]">{caseStudy.lede}</p>
      )}

      {mdxHtml && (
        <section
          className="mt-14"
          dangerouslySetInnerHTML={{ __html: mdxHtml }}
        />
      )}

      {results.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Outcome</p>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {results.slice(0, 3).map((item, idx) => (
              <div key={idx} className="bg-ink/[0.03] border border-ink/8 rounded-2xl p-5 dark:bg-[#181615] dark:border-[#2f2c2a]">
                <p className="text-lg text-ink/85 dark:text-[#e0dbd5]">{item.title || item.value || "Outcome"}</p>
                {item.description && <p className="text-ink/45 mt-2 dark:text-[#aba39c]">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {metrics.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Metrics</p>
          <div className="mt-3 grid md:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="border border-ink/8 rounded-2xl p-4 dark:border-[#2f2c2a] dark:bg-[#171514]">
                <p className="text-3xl text-ink/90 dark:text-[#f0ebe4]">{metric.value || "-"}</p>
                <p className="text-ink/45 text-sm mt-1 dark:text-[#aaa29b]">{metric.label || ""}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Gallery</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((url, idx) => (
              <div key={`${url}-${idx}`} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-ink/8 dark:border-[#2f2c2a]">
                <Image src={url} alt={`${caseStudy.title} gallery ${idx + 1}`} fill className="object-cover dark:brightness-[0.88]" />
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="border-ink/10 my-12 dark:border-[#2e2b29]" />

      {stack.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-10">
          {stack.map((tech) => (
            <span key={tech} className="px-3 py-1 text-xs rounded-full border border-ink/10 text-ink/45 dark:border-[#33302d] dark:text-[#afa7a0]">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
