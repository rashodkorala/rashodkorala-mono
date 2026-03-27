import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsCta() {
  return (
    <section className="border-t border-black/10 bg-black py-16 text-white dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Projects</p>
          <h2 className="mt-2 text-2xl font-light md:text-3xl">Product & engineering work</h2>
          <p className="mt-2 max-w-lg text-sm text-white/50">
            Shipped apps, sites, and experiments — separate from long-form case studies.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm uppercase tracking-[0.12em] text-white hover:bg-white hover:text-black"
        >
          Browse projects
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
