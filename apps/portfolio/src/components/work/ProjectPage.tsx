import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import { renderMarkdown, type MarkdownParserConfig } from "@rashodkorala/theView";

const projectMarkdownConfig: MarkdownParserConfig = {
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

export default function ProjectPage({ project }: { project: Project }) {
  const tech = project.tech_stack ?? project.tech ?? [];
  const roles = project.role ? [project.role] : (project.roles ?? []);
  const features = project.features ?? [];
  const media = project.project_media ?? [];
  const galleryUrls = media.filter((m) => m.type === "image").map((m) => m.url).concat(project.gallery_image_urls ?? []);
  const galleryVideos = media.filter((m) => m.type === "video").map((m) => m.url).concat(project.gallery_video_urls ?? []);

  const mdHtml = project.content_md
    ? renderMarkdown(project.content_md, projectMarkdownConfig)
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
        {project.category && (
          <span className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-ink/10 text-ink/45 dark:border-[#33302d] dark:text-[#b1aaa3]">
            {project.category}
          </span>
        )}
        {tech.slice(0, 3).map((t) => (
          <span key={t} className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-ink/8 text-ink/35 dark:border-[#34312e] dark:text-[#9f9791]">
            {t}
          </span>
        ))}
      </div>

      <h1 className="mt-5 font-['Times_New_Roman','Times',serif] text-3xl md:text-5xl tracking-tight text-ink dark:text-[#f0ebe4]">
        {project.title}
      </h1>
      {(project.short_description || project.subtitle) && (
        <p className="mt-3 text-lg text-muted_ink font-light dark:text-[#b8afa8]">{project.short_description || project.subtitle}</p>
      )}

      {(project.live_url || project.github_url) && (
        <div className="mt-6 flex items-center gap-4">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-ink transition-colors dark:text-[#a8a29d] dark:hover:text-[#e0dbd5]"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
              Live
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-ink transition-colors dark:text-[#a8a29d] dark:hover:text-[#e0dbd5]"
            >
              <Github className="w-3.5 h-3.5" strokeWidth={1.5} />
              GitHub
            </a>
          )}
        </div>
      )}

      {(project.cover_image || project.cover_image_url) && (
        <div className="mt-8 relative w-full aspect-video rounded-2xl overflow-hidden border border-ink/10 dark:border-[#2f2c2a]">
          <Image
            src={project.cover_image || project.cover_image_url!}
            alt={project.title}
            fill
            className="object-cover saturate-95 dark:brightness-[0.86] dark:saturate-90"
            priority
          />
        </div>
      )}

      {(project.problem || project.solution) && (
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {project.problem && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f] mb-3">Problem</p>
              <p className="text-[15px] leading-[1.8] text-ink/70 dark:text-[#c2bab3]">{project.problem}</p>
            </div>
          )}
          {project.solution && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f] mb-3">Solution</p>
              <p className="text-[15px] leading-[1.8] text-ink/70 dark:text-[#c2bab3]">{project.solution}</p>
            </div>
          )}
        </div>
      )}

      {mdHtml && (
        <section
          className="mt-14"
          dangerouslySetInnerHTML={{ __html: mdHtml }}
        />
      )}

      {features.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Features</p>
          <ul className="mt-4 space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-[15px] text-ink/70 dark:text-[#c2bab3]">
                <span className="mt-1 text-ink/25">–</span>
                {f}
              </li>
            ))}
          </ul>
        </section>
      )}

      {galleryUrls.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Gallery</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {galleryUrls.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-ink/8 dark:border-[#2f2c2a]">
                <Image src={url} alt={`${project.title} ${i + 1}`} fill className="object-cover dark:brightness-[0.88]" />
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="border-ink/10 my-12 dark:border-[#2e2b29]" />

      {(tech.length > 0 || roles.length > 0 || project.timeline) && (
        <div className="pb-10 space-y-4">
          {project.timeline && (
            <p className="text-sm text-ink/55 dark:text-[#b5ada6]">Timeline: {project.timeline}</p>
          )}
          {tech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tech.map((t) => (
                <span key={t} className="px-3 py-1 text-xs rounded-full border border-ink/10 text-ink/45 dark:border-[#33302d] dark:text-[#afa7a0]">
                  {t}
                </span>
              ))}
            </div>
          )}
          {roles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <span key={r} className="px-3 py-1 text-xs rounded-full border border-ink/8 text-ink/35 dark:border-[#34312e] dark:text-[#9f9791]">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {galleryVideos.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink/35 dark:text-[#8b847f]">Videos</p>
          <div className="mt-4 grid gap-3">
            {galleryVideos.map((url, i) => (
              <video key={i} src={url} controls className="w-full rounded-xl border border-ink/8 dark:border-[#2f2c2a]" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
