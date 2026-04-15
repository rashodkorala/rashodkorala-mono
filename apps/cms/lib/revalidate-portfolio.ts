/**
 * Triggers on-demand ISR for the public portfolio app after CMS content changes.
 * Non-blocking: failures are logged and do not throw (CMS saves should still succeed).
 */
export async function requestPortfolioRevalidation(): Promise<void> {
  const url = process.env.PORTFOLIO_REVALIDATE_URL?.trim()
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET?.trim()
  if (!url || !secret) return

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.warn(
        `[revalidate-portfolio] ${res.status} ${res.statusText}${body ? `: ${body.slice(0, 200)}` : ""}`
      )
    }
  } catch (e) {
    console.warn("[revalidate-portfolio] request failed:", e)
  }
}
