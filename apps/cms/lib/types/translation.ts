/**
 * Sinhala translation bookkeeping shared by projects and case studies.
 * See lib/translation/content.ts for how these are produced.
 */
export type TranslationStatus = "pending" | "auto" | "reviewed" | "stale"

/**
 * Sinhala values keyed by the *English DB column* they translate
 * (e.g. { title: "…", short_description: "…" }), mirroring the `<column>_si` columns.
 */
export type SinhalaValues = Record<string, string>

export interface TranslationInfo {
  sinhala: SinhalaValues
  translationStatus: TranslationStatus | null
  translatedAt: string | null
}

