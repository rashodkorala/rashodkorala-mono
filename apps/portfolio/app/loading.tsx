import PageShell from "@/src/components/page-shell"

export default function Loading() {
  return (
    <PageShell>
      <div className="min-h-full flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-line rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-nav-indicator rounded-full animate-spin" />
          </div>
          <span className="font-sans text-[13px] tracking-[0.06em] font-light text-label">
            Loading
          </span>
        </div>
      </div>
    </PageShell>
  )
}
