"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { translateItem, type TranslatableKind } from "@/lib/actions/translations"
import type { SinhalaValues, TranslationStatus } from "@/lib/types/translation"
import { TranslationStatusBadge } from "./translation-status-badge"

export interface SinhalaField {
  /** English DB column, e.g. "short_description". */
  column: string
  label: string
  /** Current English value in the form — shown as a hint. */
  english: string
  rows?: number
  markdown?: boolean
}

interface SinhalaFieldsCardProps {
  kind: TranslatableKind
  /** Undefined while creating (nothing saved to translate yet). */
  itemId?: string
  fields: SinhalaField[]
  values: SinhalaValues
  onChange: (values: SinhalaValues) => void
  status: TranslationStatus | null
  translatedAt: string | null
  reviewed: boolean
  onReviewedChange: (reviewed: boolean) => void
  /** Called after "Re-translate" with the server's fresh values. */
  onTranslated: (result: { sinhala: SinhalaValues; status: TranslationStatus | null; translatedAt: string | null }) => void
}

export function SinhalaFieldsCard({
  kind,
  itemId,
  fields,
  values,
  onChange,
  status,
  translatedAt,
  reviewed,
  onReviewedChange,
  onTranslated,
}: SinhalaFieldsCardProps) {
  const [isTranslating, setIsTranslating] = useState(false)

  const retranslate = async () => {
    if (!itemId) return
    if (
      !confirm(
        "Re-translate every Sinhala field from the saved English? Any hand edits here will be replaced. (Save first if you changed the English.)"
      )
    ) {
      return
    }
    setIsTranslating(true)
    try {
      const result = await translateItem(kind, itemId, true)
      onTranslated({ sinhala: result.sinhala, status: result.translationStatus, translatedAt: result.translatedAt })
      if (result.ok) toast.success("Sinhala translation updated")
      else toast.error(result.error ?? "Some fields could not be translated")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Translation failed")
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <Card className="p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">
              Sinhala <span lang="si">(සිංහල)</span>
            </h3>
            <TranslationStatusBadge status={isTranslating ? "pending" : status} />
          </div>
          <p className="text-sm text-muted-foreground max-w-prose">
            Translated automatically when you save; only fields whose English changed are re-translated.
            Edit anything below and it will be kept. Empty fields fall back to English on the site.
          </p>
          {translatedAt && (
            <p className="text-xs text-muted-foreground">
              Last machine translation: {new Date(translatedAt).toLocaleString()}
            </p>
          )}
        </div>
        {itemId && (
          <Button type="button" variant="outline" size="sm" onClick={retranslate} disabled={isTranslating}>
            {isTranslating ? "Translating…" : "Re-translate"}
          </Button>
        )}
      </div>

      {fields.map((field) => {
        const id = `si-${field.column}`
        const value = values[field.column] ?? ""
        const placeholder = field.english.trim()
          ? "Will be translated automatically on save"
          : "Add the English first"
        return (
          <div key={field.column} className="space-y-2">
            <Label htmlFor={id}>{field.label}</Label>
            {field.rows ? (
              <Textarea
                id={id}
                lang="si"
                rows={field.rows}
                value={value}
                placeholder={placeholder}
                className={field.markdown ? "font-mono text-sm" : undefined}
                onChange={(e) => onChange({ ...values, [field.column]: e.target.value })}
              />
            ) : (
              <Input
                id={id}
                lang="si"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange({ ...values, [field.column]: e.target.value })}
              />
            )}
          </div>
        )
      })}

      <div className="flex items-center gap-2">
        <Checkbox
          id={`${kind}-si-reviewed`}
          checked={reviewed}
          onCheckedChange={(c) => onReviewedChange(Boolean(c))}
        />
        <Label htmlFor={`${kind}-si-reviewed`}>I&apos;ve reviewed the Sinhala translation</Label>
      </div>
    </Card>
  )
}
