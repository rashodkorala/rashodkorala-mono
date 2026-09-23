import { hashText, translateEntries, translateMarkdown } from "@rashodkorala/translate"
import type { SupabaseClient } from "@supabase/supabase-js"
import { after } from "next/server"
import { requestPortfolioRevalidation } from "@/lib/revalidate-portfolio"
import type { SinhalaValues, TranslationStatus } from "@/lib/types/translation"

/**
 * Auto-translation of CMS content into Sinhala.
 *
 * Each translatable English column `x` has a Sinhala sibling `x_si`. `translation_hashes[x]`
 * stores the hash of the English text that `x_si` was produced from, so on every save we only
 * re-translate fields whose English actually changed — and never overwrite a Sinhala value the
 * editor changed by hand in the same save.
 */

export type TranslatableTable = "projects" | "case_studies"

type FieldFormat = "text" | "markdown"

export const TRANSLATABLE_FIELDS: Record<TranslatableTable, Record<string, FieldFormat>> = {
  projects: {
    title: "text",
    subtitle: "text",
    short_description: "text",
    role: "text",
    timeline: "text",
  },
  case_studies: {
    title: "text",
    summary: "text",
    content_md: "markdown",
    role: "text",
    timeline: "text",
  },
}

/** Columns to select when planning a translation (existing Sinhala + bookkeeping). */
export function translationColumns(table: TranslatableTable): string {
  const fields = Object.keys(TRANSLATABLE_FIELDS[table])
  return [...fields, ...fields.map((f) => `${f}_si`), "translation_hashes", "translation_status"].join(", ")
}

type Row = Record<string, unknown>

const str = (v: unknown): string => (typeof v === "string" ? v : "")

/** Pulls the `<field>_si` columns off a DB row into a SinhalaValues map. */
export function readSinhala(row: Row, table: TranslatableTable): SinhalaValues {
  const out: SinhalaValues = {}
  for (const field of Object.keys(TRANSLATABLE_FIELDS[table])) out[field] = str(row[`${field}_si`])
  return out
}

export interface TranslationPlan {
  /** Columns to write together with the English save. */
  update: Row
  /** English columns that still need a machine translation. */
  pending: string[]
}

/**
 * Decides, per field, whether to keep, take the editor's manual Sinhala, clear, or re-translate.
 *
 * @param english     English values being saved, keyed by column
 * @param existing    current DB row (null on create) — needs translationColumns()
 * @param submitted   Sinhala values from the form, keyed by column (undefined = form didn't send any)
 */
export function planTranslation({
  table,
  english,
  existing,
  submitted,
  markReviewed,
  force = false,
}: {
  table: TranslatableTable
  english: Row
  existing: Row | null
  submitted?: SinhalaValues
  /** true/false from the editor's "reviewed" checkbox; undefined = leave as is. */
  markReviewed?: boolean
  force?: boolean
}): TranslationPlan {
  const update: Row = {}
  const hashes: Record<string, string> = { ...((existing?.translation_hashes as Record<string, string>) ?? {}) }
  const pending: string[] = []

  for (const field of Object.keys(TRANSLATABLE_FIELDS[table])) {
    const source = str(english[field])
    const previousSi = str(existing?.[`${field}_si`])
    const submittedSi = submitted?.[field]
    const sourceHash = hashText(source)

    if (!source.trim()) {
      update[`${field}_si`] = null
      delete hashes[field]
      continue
    }

    const editedByHand =
      submittedSi !== undefined && submittedSi.trim() !== "" && submittedSi.trim() !== previousSi.trim()

    if (editedByHand && !force) {
      update[`${field}_si`] = submittedSi
      hashes[field] = sourceHash
    } else if (
      !force &&
      previousSi.trim() &&
      hashes[field] === sourceHash &&
      // Editor blanked the field → treat as "please re-translate".
      !(submittedSi !== undefined && !submittedSi.trim())
    ) {
      // Up to date — leave it alone.
    } else {
      pending.push(field)
    }
  }

  update.translation_hashes = hashes

  const hasSinhala = Object.keys(TRANSLATABLE_FIELDS[table]).some(
    (f) => (update[`${f}_si`] !== undefined ? str(update[`${f}_si`]) : str(existing?.[`${f}_si`])).trim()
  )
  let status: TranslationStatus | null = (existing?.translation_status as TranslationStatus | null) ?? null
  if (pending.length) status = process.env.OPENAI_API_KEY ? "pending" : "stale"
  else if (!hasSinhala) status = null
  else if (markReviewed === true) status = "reviewed"
  else if (markReviewed === false && status === "reviewed") status = "auto"
  else if (!status) status = "auto"
  update.translation_status = status

  return { update, pending }
}

/**
 * Machine-translates `fields` of a saved row and writes the results.
 *
 * Re-reads the row first and only writes a field if its English is still the text we translated,
 * so an older job finishing after a newer save can't clobber anything.
 */
export async function runTranslation(
  supabase: SupabaseClient,
  table: TranslatableTable,
  id: string,
  fields: string[]
): Promise<{ ok: boolean; error?: string }> {
  if (!fields.length) return { ok: true }
  const formats = TRANSLATABLE_FIELDS[table]

  const { data: row, error: readError } = await supabase
    .from(table)
    .select(translationColumns(table))
    .eq("id", id)
    .single()
  if (readError || !row) return { ok: false, error: readError?.message ?? "Row not found" }
  const current = row as unknown as Row

  const sources: Record<string, string> = {}
  for (const f of fields) {
    const text = str(current[f])
    if (text.trim()) sources[f] = text
  }

  const context = `${table === "projects" ? "Portfolio project" : "Portfolio case study"}: ${str(current.title)}`
  try {
    const textFields = Object.fromEntries(Object.entries(sources).filter(([f]) => formats[f] === "text"))
    const translated: Record<string, string> = {}
    let failed: string[] = []

    if (Object.keys(textFields).length) {
      const result = await translateEntries(textFields, "text", { context })
      Object.assign(translated, result.translations)
      failed = result.failed
    }
    for (const [f, text] of Object.entries(sources)) {
      if (formats[f] === "markdown") translated[f] = await translateMarkdown(text, { context })
    }

    // Re-check the English hasn't moved on while we were translating.
    const { data: latestRow } = await supabase
      .from(table)
      .select(translationColumns(table))
      .eq("id", id)
      .single()
    const latest = (latestRow ?? current) as unknown as Row
    const hashes: Record<string, string> = { ...((latest.translation_hashes as Record<string, string>) ?? {}) }
    const update: Row = {}
    let skipped = false
    for (const [f, text] of Object.entries(translated)) {
      if (str(latest[f]) !== sources[f]) {
        skipped = true
        continue
      }
      update[`${f}_si`] = text
      hashes[f] = hashText(sources[f])
    }

    update.translation_hashes = hashes
    update.translated_at = new Date().toISOString()
    // If the English changed mid-flight, a newer save queued its own job — let that one own the status.
    if (!skipped) update.translation_status = failed.length ? "stale" : "auto"

    const { error: writeError } = await supabase.from(table).update(update).eq("id", id)
    if (writeError) throw new Error(writeError.message)

    await requestPortfolioRevalidation()
    return failed.length ? { ok: false, error: `Could not translate: ${failed.join(", ")}` } : { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[translation] ${table}/${id} failed:`, message)
    await supabase.from(table).update({ translation_status: "stale" }).eq("id", id)
    return { ok: false, error: message }
  }
}

/**
 * Runs `runTranslation` after the response is sent, so saving in the CMS doesn't wait on
 * OpenAI (a long case study can take a while). The row is left with status "pending" meanwhile.
 */
export function queueTranslation(
  supabase: SupabaseClient,
  table: TranslatableTable,
  id: string,
  fields: string[]
) {
  if (!fields.length || !process.env.OPENAI_API_KEY) return
  after(async () => {
    await runTranslation(supabase, table, id, fields)
  })
}
