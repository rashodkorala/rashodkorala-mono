import PageShell from "@/src/components/page-shell"

export default function Loading() {
  return (
    <PageShell>
      <div className="min-h-full flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-ink/10 dark:border-[#2f2c2a] rounded-full" />
            <div className="absolute inset-0 border-2 border-transparent border-t-ink/40 dark:border-t-[#8f8780] rounded-full animate-spin" />
          </div>
          <span className="font-['Helvetica_Neue','Helvetica','Arial',sans-serif] text-[13px] tracking-[0.06em] font-light text-ink/35 dark:text-[#8f8780]">
            Loading
          </span>
        </div>
      </div>
    </PageShell>
  )
}
