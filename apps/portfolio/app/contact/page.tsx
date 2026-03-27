import type { Metadata } from "next";
import PageShell from "@/src/components/page-shell";
import ContactContent from "@/src/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Rashod Korala.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <ContactContent />
    </PageShell>
  );
}
