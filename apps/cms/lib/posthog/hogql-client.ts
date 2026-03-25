function getPostHogApiBase(): string {
  const explicit = process.env.POSTHOG_API_HOST?.replace(/\/$/, "")
  if (explicit) return explicit

  const ingest = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? ""
  if (ingest.includes("eu.i.posthog.com")) return "https://eu.posthog.com"
  return "https://us.posthog.com"
}

export function isPostHogApiConfigured(): boolean {
  return Boolean(
    process.env.POSTHOG_PERSONAL_API_KEY && process.env.POSTHOG_PROJECT_ID
  )
}

type HogQLResponse = {
  results?: unknown[][]
}

export async function posthogHogQL(
  query: string,
  name: string
): Promise<unknown[][]> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID
  if (!key || !projectId) {
    throw new Error("PostHog API not configured")
  }

  const base = getPostHogApiBase()
  const res = await fetch(`${base}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      query: { kind: "HogQLQuery", query },
      name,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PostHog query failed (${res.status}): ${text}`)
  }

  const data = (await res.json()) as HogQLResponse
  return data.results ?? []
}

export function formatTimestampForHogQL(d: Date): string {
  return d.toISOString().slice(0, 19).replace("T", " ")
}
