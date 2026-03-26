import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CaseStudy } from "@/lib/types";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asObjectArray<T extends Record<string, unknown>>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is T => typeof item === "object" && item !== null);
}

function parseSection(markdown: string, title: string): string {
  const rx = new RegExp(`##\\s+${title}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, "i");
  const match = markdown.match(rx);
  return match?.[1]?.trim() || "";
}

function parseBullets(section: string): string[] {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^- /, "").trim());
}

function parseProcessSteps(section: string): Array<{ title: string; description: string }> {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+\*\*.+\*\*\s+—\s+.+$/.test(line))
    .map((line) => {
      const cleaned = line.replace(/^\d+\.\s+/, "");
      const [titlePart, descriptionPart] = cleaned.split("—");
      return {
        title: titlePart.replace(/\*\*/g, "").trim(),
        description: (descriptionPart || "").trim(),
      };
    });
}

export default function CaseStudyPage({
  caseStudy,
  mdxContent,
}: {
  caseStudy: CaseStudy;
  mdxContent: string;
}) {
  const tags = asStringArray(caseStudy.tags);
  const stack = asStringArray(caseStudy.stack);
  const gallery = asStringArray(caseStudy.gallery_urls);
  const links = asObjectArray<{ label?: string; url?: string; type?: string }>(caseStudy.links);
  const results = asObjectArray<{ title?: string; value?: string; description?: string }>(caseStudy.results);
  const metrics = asObjectArray<{ label?: string; value?: string }>(caseStudy.metrics);

  const challenge = parseSection(mdxContent, "Challenge");
  const approach = parseSection(mdxContent, "Approach");
  const process = parseSection(mdxContent, "Process");
  const learned = parseSection(mdxContent, "What I learned");
  const processSteps = parseProcessSteps(process);
  const learnings = parseBullets(learned);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          Back to work
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-white/10 text-white/40">
              {tag}
            </span>
          ))}
          {caseStudy.category && (
            <span className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full border border-white/10 text-white/60">
              {caseStudy.category}
            </span>
          )}
        </div>

        <h1 className="mt-6 text-3xl md:text-5xl font-light tracking-tight">{caseStudy.title}</h1>
        {caseStudy.summary && <p className="mt-3 text-lg text-white/40 font-light">{caseStudy.summary}</p>}

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/40 border-y border-white/10 py-4">
          <span>Role: {caseStudy.role || "N/A"}</span>
          <span className="w-px h-4 bg-white/10" />
          <span>Timeline: {caseStudy.timeline || "N/A"}</span>
          {links.map((link) =>
            link.url ? (
              <span key={`${link.label}-${link.url}`} className="flex items-center gap-2">
                <span className="w-px h-4 bg-white/10" />
                <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  {link.label || link.type || "Link"}
                </a>
              </span>
            ) : null
          )}
        </div>

        {caseStudy.cover_url && (
          <div className="mt-8 relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
            <Image src={caseStudy.cover_url} alt={caseStudy.title} fill className="object-cover" priority />
          </div>
        )}

        {caseStudy.lede && (
          <p className="mt-8 text-[17px] leading-[1.8] text-white/50 max-w-3xl">{caseStudy.lede}</p>
        )}

        <section className="mt-14 space-y-10">
          {challenge && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">Challenge</p>
              <p className="mt-3 leading-8 text-white/70">{challenge}</p>
            </div>
          )}
          {approach && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">Approach</p>
              <p className="mt-3 leading-8 text-white/70">{approach}</p>
            </div>
          )}
          {processSteps.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">Process</p>
              <ol className="mt-4 grid gap-3">
                {processSteps.map((step, idx) => (
                  <li key={`${step.title}-${idx}`} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <p className="font-medium">{idx + 1}. {step.title}</p>
                    <p className="text-white/40 mt-2">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {learnings.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">What I learned</p>
              <ul className="mt-3 space-y-2 text-white/70">
                {learnings.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {results.length > 0 && (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">Outcome</p>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {results.slice(0, 3).map((item, idx) => (
                <div key={idx} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                  <p className="text-lg">{item.title || item.value || "Outcome"}</p>
                  {item.description && <p className="text-white/40 mt-2">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {metrics.length > 0 && (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">Metrics</p>
            <div className="mt-3 grid md:grid-cols-4 gap-4">
              {metrics.map((metric, idx) => (
                <div key={idx} className="border border-white/10 rounded-xl p-4">
                  <p className="text-3xl">{metric.value || "-"}</p>
                  <p className="text-white/40 text-sm mt-1">{metric.label || ""}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">Gallery</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.map((url, idx) => (
                <div key={`${url}-${idx}`} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10">
                  <Image src={url} alt={`${caseStudy.title} gallery ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        <hr className="border-white/10 my-12" />

        {stack.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-10">
            {stack.map((tech) => (
              <span key={tech} className="px-3 py-1 text-xs rounded-full border border-white/10 text-white/40">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
