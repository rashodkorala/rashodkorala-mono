import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedCaseStudies, getCachedCaseStudyBySlug } from "@/lib/supabase/cached-case-studies";
import { getCachedAllProjects } from "@/lib/supabase/cached-projects";
import { buildSatahanItems, caseStudyCover, formatEntryNumber, mediaUrl } from "@/lib/entries";
import { renderSatahan } from "@/lib/satahan-markdown";
import type { CaseStudy } from "@/lib/types";
import SatahanEntry from "@/src/components/satahan/SatahanEntry";
import PageShell from "@/src/components/page-shell";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function getEntry(slug: string): Promise<CaseStudy | null> {
  const entry = await getCachedCaseStudyBySlug(slug);
  if (!entry || (entry.status && entry.status !== "published")) return null;
  return entry;
}

/** The entry plus its place in the notebook (number, previous and next). */
async function getEntryInContext(slug: string) {
  const entry = await getEntry(slug);
  if (!entry) return null;
  const [caseStudies, projects] = await Promise.all([getCachedCaseStudies(), getCachedAllProjects()]);
  const items = buildSatahanItems(caseStudies, projects); // newest number first
  const index = items.findIndex((i) => i.slug === entry.slug);
  if (index === -1) return null;
  return {
    entry,
    item: items[index],
    previous: items[index + 1] ?? null,
    next: items[index - 1] ?? null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await getEntryInContext(slug);
  if (!found) return { title: "Not found" };
  const { entry, item } = found;

  const description = item.summary || undefined;
  const cover = caseStudyCover(entry);
  return {
    title: entry.title,
    description,
    alternates: { canonical: `/satahan/${entry.slug}` },
    openGraph: {
      title: `Satahan Nº ${formatEntryNumber(item.number)}: ${entry.title}`,
      description,
      type: "article",
      images: cover ? [{ url: cover.src }] : [],
    },
  };
}

export default async function SatahanEntryPage({ params }: Props) {
  const { slug } = await params;
  const found = await getEntryInContext(slug);
  if (!found) notFound();
  const { entry, item, previous, next } = found;

  const images = (entry.gallery ?? [])
    .filter((g): g is string => typeof g === "string" && !!g.trim())
    .map(mediaUrl)
    .slice(0, 4);

  return (
    <PageShell>
      <SatahanEntry
        item={item}
        html={renderSatahan(entry.content_md)}
        images={images}
        previous={previous}
        next={next}
      />
    </PageShell>
  );
}
