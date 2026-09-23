import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TranslationStatus } from "@/lib/types/translation"

const STATUS: Record<TranslationStatus | "none", { label: string; className: string; hint: string }> = {
  none: {
    label: "Not translated",
    className: "text-muted-foreground",
    hint: "No Sinhala yet — the English version is shown on /si.",
  },
  pending: {
    label: "Translating…",
    className: "border-blue-500/40 text-blue-600 dark:text-blue-400",
    hint: "Machine translation is running in the background.",
  },
  auto: {
    label: "Auto-translated",
    className: "border-amber-500/40 text-amber-700 dark:text-amber-400",
    hint: "Machine-translated and live on /si. Not yet reviewed.",
  },
  reviewed: {
    label: "Reviewed",
    className: "border-emerald-500/40 text-emerald-700 dark:text-emerald-400",
    hint: "A person has checked the Sinhala.",
  },
  stale: {
    label: "Needs update",
    className: "border-red-500/40 text-red-600 dark:text-red-400",
    hint: "The English changed but re-translation failed; /si shows the older Sinhala.",
  },
}

export function TranslationStatusBadge({
  status,
  className,
}: {
  status: TranslationStatus | null
  className?: string
}) {
  const s = STATUS[status ?? "none"]
  return (
    <Badge variant="outline" title={s.hint} className={cn("text-xs", s.className, className)}>
      {s.label}
    </Badge>
  )
}
