import Image from "next/image";
import Link from "next/link";
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
    <div className="min-h-screen bg-[#080808] text-[#e8e6e0]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link href="/work" className="text-sm text-[#6b6a65] hover:text-[#e8e6e0] transition-colors">
          Back to work
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-[11px] uppercase tracking-[0.08em] px-2 py-1 rounded-full border border-[#1f1f1c] text-[#6b6a65]">
              {tag}
            </span>
          ))}
          {caseStudy.category ? (
            <span className="text-[11px] uppercase tracking-[0.08em] px-2 py-1 rounded-full border border-[#1f1f1c] text-[#e8e6e0]">
              {caseStudy.category}
            </span>
          ) : null}
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl" style={{ fontFamily: "Playfair Display, serif" }}>
          {caseStudy.title}
        </h1>
        {caseStudy.summary ? <p className="mt-3 text-lg text-[#6b6a65]">{caseStudy.summary}</p> : null}

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#6b6a65] border-y border-[#1f1f1c] py-4">
          <span>Role: {caseStudy.role || "N/A"}</span>
          <span className="w-px h-4 bg-[#1f1f1c]" />
          <span>Timeline: {caseStudy.timeline || "N/A"}</span>
          <span className="w-px h-4 bg-[#1f1f1c]" />
          <span>Status: {caseStudy.status}</span>
          {links.map((link) =>
            link.url ? (
              <span key={`${link.label}-${link.url}`} className="flex items-center gap-2">
                <span className="w-px h-4 bg-[#1f1f1c]" />
                <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-[#e8e6e0] transition-colors">
                  {link.label || link.type || "Link"}
                </a>
              </span>
            ) : null
          )}
        </div>

        {caseStudy.cover_url ? (
          <div className="mt-8 relative w-full aspect-video rounded-[12px] overflow-hidden border border-[#1f1f1c]">
            <Image src={caseStudy.cover_url} alt={caseStudy.title} fill className="object-cover" priority />
          </div>
        ) : null}

        {caseStudy.lede ? (
          <p className="mt-8 text-[18px] leading-[1.8] text-[#6b6a65] max-w-4xl">{caseStudy.lede}</p>
        ) : null}

        <section className="mt-14 space-y-10">
          {challenge ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65]">Challenge</p>
              <p className="mt-3 leading-8 text-[#e8e6e0]">{challenge}</p>
            </div>
          ) : null}

          {approach ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65]">Approach</p>
              <p className="mt-3 leading-8 text-[#e8e6e0]">{approach}</p>
            </div>
          ) : null}

          {processSteps.length > 0 ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65]">Process</p>
              <ol className="mt-4 grid gap-3">
                {processSteps.map((step, idx) => (
                  <li key={`${step.title}-${idx}`} className="bg-[#141414] border border-[#1f1f1c] rounded-xl p-4">
                    <p className="font-medium">{idx + 1}. {step.title}</p>
                    <p className="text-[#6b6a65] mt-2">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {learnings.length > 0 ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65]">What I learned</p>
              <ul className="mt-3 space-y-2">
                {learnings.map((item) => (
                  <li key={item} className="text-[#e8e6e0]">- {item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {results.length > 0 ? (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65]">Outcome</p>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {results.slice(0, 3).map((item, idx) => (
                <div key={idx} className="bg-[#141414] border border-[#1f1f1c] rounded-xl p-5">
                  <p className="text-lg">{item.title || item.value || "Outcome"}</p>
                  {item.description ? <p className="text-[#6b6a65] mt-2">{item.description}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {metrics.length > 0 ? (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65]">Metrics</p>
            <div className="mt-3 grid md:grid-cols-4 gap-4">
              {metrics.map((metric, idx) => (
                <div key={idx} className="border border-[#1f1f1c] rounded-xl p-4">
                  <p className="text-3xl" style={{ fontFamily: "Playfair Display, serif" }}>{metric.value || "-"}</p>
                  <p className="text-[#6b6a65] text-sm mt-1">{metric.label || ""}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#6b6a65]">Gallery</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.map((url, idx) => (
                <div key={`${url}-${idx}`} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[#1f1f1c]">
                  <Image src={url} alt={`${caseStudy.title} gallery ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <hr className="border-[#1f1f1c] my-12" />

        {stack.length > 0 ? (
          <div className="flex flex-wrap gap-2 pb-10">
            {stack.map((tech) => (
              <span key={tech} className="px-3 py-1 text-xs rounded-full border border-[#1f1f1c] text-[#6b6a65]">
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
