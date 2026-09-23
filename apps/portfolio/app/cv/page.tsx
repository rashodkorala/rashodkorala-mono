import type { Metadata } from "next";
import PageShell from "@/src/components/page-shell";
import CVContent from "@/src/components/cv/CVContent";

export const metadata: Metadata = {
  title: "CV",
  description: "CV of Rashod Korala — full-stack engineer across firmware, iOS, and cloud.",
};

export default function CVPage() {
  return (
    <PageShell>
      <CVContent />
    </PageShell>
  );
}
