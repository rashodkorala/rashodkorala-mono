import type { Metadata } from "next";
import PageShell from "@/src/components/page-shell";
import CVContent from "@/src/components/cv/CVContent";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum vitae of Rashod Korala — Full Stack Developer & Entrepreneur.",
};

export default function CVPage() {
  return (
    <PageShell>
      <CVContent />
    </PageShell>
  );
}
