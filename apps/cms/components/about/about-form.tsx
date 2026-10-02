"use client"

import { useState } from "react"
import { toast } from "sonner"
import { IconPlus, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveAboutProfile } from "@/lib/actions/about"
import type { AboutProfile, AboutSocialLink } from "@/lib/types/about"

const DEFAULT_BIO = `I am a software engineer and entrepreneur based in St. John\u2019s, Newfoundland, recently graduated and actively building experience across product, design, and technology. I am drawn to the craft of building, where I take an idea and shape it through code and design into something that solves a real problem. I am looking for roles where I can contribute meaningfully from day one, keep learning, and build things that matter.

I [work](/work) across the full arc from discovery to delivery, covering product design (UI/UX) and full-stack engineering, with a focus on translating complex technical ideas into outcomes that matter.

[Photography](https://photos.rashodkorala.com) runs alongside all of it, shaping how I see and communicate.`

const DEFAULT_LINKS: AboutSocialLink[] = [
  { label: "GitHub", url: "https://github.com/rashodkorala" },
  { label: "LinkedIn", url: "https://linkedin.com/in/rashodk" },
  { label: "Instagram", url: "https://instagram.com/rashodkorala" },
  { label: "CV", url: "/cv" },
]

export function AboutForm({ profile }: { profile: AboutProfile | null }) {
  const [displayName, setDisplayName] = useState(profile?.displayName || "Rashod Korala")
  const [bioMd, setBioMd] = useState(profile?.bioMd?.trim() ? profile.bioMd : DEFAULT_BIO)
  const [links, setLinks] = useState<AboutSocialLink[]>(
    profile?.socialLinks?.length ? profile.socialLinks : DEFAULT_LINKS
  )
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatarUrl || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [clearAvatar, setClearAvatar] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatarUrl || null)
  const [saving, setSaving] = useState(false)

  const updateLink = (index: number, key: keyof AboutSocialLink, value: string) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, [key]: value } : link)))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const saved = await saveAboutProfile({
        displayName,
        bioMd,
        avatarUrl,
        avatarFile,
        clearAvatar,
        socialLinks: links,
      })
      setAvatarUrl(saved.avatarUrl)
      setAvatarFile(null)
      setClearAvatar(false)
      setPreviewUrl(saved.avatarUrl)
      toast.success("About section saved")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save about section")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">About</h1>
          <p className="text-sm text-muted-foreground">
            This is the home page intro. It loads fresh on every visit.
          </p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about-name">Name</Label>
        <Input
          id="about-name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Rashod Korala"
        />
        <p className="text-xs text-muted-foreground">First word on one line, the rest on the next.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about-bio">Bio</Label>
        <Textarea
          id="about-bio"
          value={bioMd}
          onChange={(e) => setBioMd(e.target.value)}
          rows={14}
          className="min-h-64 leading-6"
        />
        <p className="text-xs text-muted-foreground">
          A blank line starts a new paragraph. Links look like [work](/work).
        </p>
      </div>

      <div className="space-y-3">
        <Label>Photo</Label>
        {previewUrl && (
          <div className="relative inline-block">
            <img src={previewUrl} alt="" className="h-40 w-32 rounded object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              className="absolute right-1 top-1 rounded bg-black/60 p-1"
              onClick={() => {
                setAvatarFile(null)
                setPreviewUrl(null)
                setClearAvatar(true)
              }}
            >
              <IconX className="h-3 w-3 text-white" />
            </button>
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setAvatarFile(file)
            setClearAvatar(false)
            const reader = new FileReader()
            reader.onloadend = () => setPreviewUrl(reader.result as string)
            reader.readAsDataURL(file)
          }}
        />
        <p className="text-xs text-muted-foreground">Leave this empty to keep the current portrait.</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Links</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLinks((prev) => [...prev, { label: "", url: "" }])}
          >
            <IconPlus className="h-4 w-4" />
            Add link
          </Button>
        </div>
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                aria-label={`Link ${index + 1} label`}
                value={link.label}
                placeholder="Label"
                onChange={(e) => updateLink(index, "label", e.target.value)}
              />
              <Input
                aria-label={`Link ${index + 1} URL`}
                value={link.url}
                placeholder="https:// or /cv"
                onChange={(e) => updateLink(index, "url", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove link ${index + 1}`}
                onClick={() => setLinks((prev) => prev.filter((_, i) => i !== index))}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </form>
  )
}
