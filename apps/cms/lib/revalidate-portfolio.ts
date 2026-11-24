/**
 * Triggers on-demand ISR for the public portfolio app after CMS content changes.
 * Non-blocking: failures are logged and do not throw (CMS saves should still succeed).
 */
export async function requestPortfolioRevalidation(): Promise<void> {
  const url = process.env.PORTFOLIO_REVALIDATE_URL?.trim()
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET?.trim()
  if (!url || !secret) return

  try {
    // A redirect (http -> https, apex -> www) is a different origin, so fetch would drop the
    // Authorization header and the portfolio would answer 401. Never follow one with the secret.
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      redirect: "manual",
    })
    if (res.status >= 300 && res.status < 400) {
      console.warn(
        `[revalidate-portfolio] PORTFOLIO_REVALIDATE_URL redirects (${res.status}) to ${res.headers.get("location") ?? "an unknown location"}; set it to that URL`
      )
      return
    }
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
