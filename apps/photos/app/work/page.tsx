import type { Metadata } from "next";
import { getPublishedWorkProjects } from "@/app/actions/work";
import WorkIndex from "@/components/work/WorkIndex";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description:
    "Published projects from the CMS, including selected client and personal work by Rashod Korala.",
  openGraph: {
    title: "Work | Rashod Korala Photography",
    description:
      "Published projects from the CMS, including selected client and personal work.",
  },
};

export default async function WorkPage() {
  const projects = await getPublishedWorkProjects();
  return <WorkIndex projects={projects} />;
}
