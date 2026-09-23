"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  planTranslation,
  readSinhala,
  runTranslation,
  translationColumns,
  type TranslatableTable,
} from "@/lib/translation/content"
import type { SinhalaValues, TranslationStatus } from "@/lib/types/translation"

export type TranslatableKind = "project" | "case_study"

const TABLE: Record<TranslatableKind, TranslatableTable> = {
  project: "projects",
  case_study: "case_studies",
}

export interface TranslateResult {
  ok: boolean
  error?: string
  sinhala: SinhalaValues
  translationStatus: TranslationStatus | null
  translatedAt: string | null
}

/**
 * Translates a saved project / case study now and waits for the result.
 *
 * @param force  true  → re-translate every field from the saved English (the editor's
 *                       "Re-translate" button; discards hand edits)
 *               false → only fields that are missing or whose English changed (backfill)
 */
export async function translateItem(kind: TranslatableKind, id: string, force: boolean): Promise<TranslateResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const table = TABLE[kind]
  const { data: row, error } = await supabase
    .from(table)
    .select<string, Record<string, unknown>>(translationColumns(table))
    .eq("id", id)
    .eq("user_id", user.id)
    .single()
  if (error || !row) throw new Error(`Failed to load ${kind}: ${error?.message ?? "not found"}`)

  const plan = planTranslation({ table, english: row, existing: row, force })
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured, so content can't be translated.")
  }

  let result: { ok: boolean; error?: string } = { ok: true }
  if (plan.pending.length) {
    await supabase.from(table).update({ translation_status: "pending" }).eq("id", id).eq("user_id", user.id)
    result = await runTranslation(supabase, table, id, plan.pending)
  } else if (row.translation_status === "pending" || row.translation_status === "stale") {
    // Every field is already current — just clear a status left behind by an interrupted job.
    await supabase.from(table).update({ translation_status: "auto" }).eq("id", id).eq("user_id", user.id)
  }

  const { data: updated } = await supabase
    .from(table)
    .select<string, Record<string, unknown>>(`${translationColumns(table)}, translated_at`)
    .eq("id", id)
    .single()

  revalidatePath("/protected/work")
  return {
    ...result,
    sinhala: readSinhala(updated ?? row, table),
    translationStatus: ((updated ?? row).translation_status as TranslationStatus | null) ?? null,
    translatedAt: ((updated ?? row).translated_at as string | null) ?? null,
  }
}

export interface TranslationQueueItem {
  kind: TranslatableKind
  id: string
  title: string
  /** English fields with no up-to-date Sinhala. */
  fields: string[]
}

/** Everything that has English content without a current Sinhala translation. */
export async function getTranslationQueue(): Promise<TranslationQueueItem[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const queue: TranslationQueueItem[] = []
  for (const kind of Object.keys(TABLE) as TranslatableKind[]) {
    const table = TABLE[kind]
    const { data, error } = await supabase
      .from(table)
      .select<string, Record<string, unknown>>(`id, ${translationColumns(table)}`)
      .eq("user_id", user.id)
    if (error) throw new Error(`Failed to load ${table}: ${error.message}`)

    for (const row of data ?? []) {
      // A row stuck in "pending" (e.g. the background job was cut off) is re-queued too.
      const { pending } = planTranslation({ table, english: row, existing: row })
      const stuck = row.translation_status === "pending" || row.translation_status === "stale"
      if (pending.length || stuck) {
        queue.push({
          kind,
          id: String(row.id),
          title: typeof row.title === "string" ? row.title : "(untitled)",
          fields: pending,
        })
      }
    }
  }
  return queue
}
