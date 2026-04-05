import type { AnalyticsSummary } from "@/lib/types/analytics"
import {
  formatTimestampForHogQL,
  posthogHogQL,
} from "@/lib/posthog/hogql-client"

function num(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v
  if (typeof v === "string") {
    const n = Number(v)
    return Number.isNaN(n) ? 0 : n
  }
  return 0
}

function str(v: unknown): string {
  if (v == null) return ""
  return String(v)
}

function formatDayLabel(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  const s = str(v)
  if (s.length >= 10) return s.slice(0, 10)
  return s
}

export async function fetchPostHogAnalyticsSummary(
  start: Date,
  end: Date
): Promise<AnalyticsSummary> {
  const t0 = formatTimestampForHogQL(start)
  const t1 = formatTimestampForHogQL(end)

  const [
    summaryRows,
    dailyRows,
    pageRows,
    domainRows,
    deviceRows,
    domainDailyRows,
  ] = await Promise.all([
    posthogHogQL(
      `
SELECT
  count() AS total_pageviews,
  uniq(distinct_id) AS unique_visitors,
  uniq(
    if(
      empty(properties.$session_id),
      distinct_id,
      properties.$session_id
    )
  ) AS unique_sessions
FROM events
WHERE event = '$pageview'
  AND timestamp >= toDateTime('${t0}')
  AND timestamp <= toDateTime('${t1}')
`.trim(),
      "cms_dashboard_summary"
    ),
    posthogHogQL(
      `
SELECT
  toDate(timestamp) AS day,
  count() AS views
FROM events
WHERE event = '$pageview'
  AND timestamp >= toDateTime('${t0}')
  AND timestamp <= toDateTime('${t1}')
GROUP BY day
ORDER BY day ASC
`.trim(),
      "cms_dashboard_daily_views"
    ),
    posthogHogQL(
      `
SELECT
  multiIf(
    notEmpty(properties.$pathname), properties.$pathname,
    notEmpty(
      regexpExtract(properties.$current_url, '^https?://[^/]+(/[^?#]*)', 1)
    ),
      regexpExtract(properties.$current_url, '^https?://[^/]+(/[^?#]*)', 1),
    '/'
  ) AS path,
  count() AS views
FROM events
WHERE event = '$pageview'
  AND timestamp >= toDateTime('${t0}')
  AND timestamp <= toDateTime('${t1}')
GROUP BY path
ORDER BY views DESC
LIMIT 15
`.trim(),
      "cms_dashboard_top_pages"
    ),
    posthogHogQL(
      `
SELECT
  domain(properties.$current_url) AS domain,
  count() AS views
FROM events
WHERE event = '$pageview'
  AND notEmpty(properties.$current_url)
  AND timestamp >= toDateTime('${t0}')
  AND timestamp <= toDateTime('${t1}')
GROUP BY domain
HAVING domain != ''
ORDER BY views DESC
LIMIT 15
`.trim(),
      "cms_dashboard_top_domains"
    ),
    posthogHogQL(
      `
SELECT
  if(empty(properties.$device_type), 'unknown', properties.$device_type) AS device,
  count() AS cnt
FROM events
WHERE event = '$pageview'
  AND timestamp >= toDateTime('${t0}')
  AND timestamp <= toDateTime('${t1}')
GROUP BY device
ORDER BY cnt DESC
LIMIT 20
`.trim(),
      "cms_dashboard_device_breakdown"
    ),
    posthogHogQL(
      `
SELECT
  domain(properties.$current_url) AS domain,
  toDate(timestamp) AS day,
  count() AS views
FROM events
WHERE event = '$pageview'
  AND timestamp >= toDateTime('${t0}')
  AND timestamp <= toDateTime('${t1}')
  AND domain(properties.$current_url) IN ('www.rashodkorala.com', 'photos.rashodkorala.com')
GROUP BY domain, day
ORDER BY day ASC
`.trim(),
      "cms_dashboard_domain_daily_views"
    ),
  ])

  const s0 = summaryRows[0] ?? []
  const totalPageviews = num(s0[0])
  const uniqueVisitors = num(s0[1])
  const uniqueSessions = num(s0[2])

  const dailyViews = dailyRows.map((row) => ({
    date: formatDayLabel(row[0]),
    views: num(row[1]),
  }))

  const topPages = pageRows.map((row) => ({
    path: str(row[0]) || "/",
    views: num(row[1]),
  }))

  const topDomains = domainRows.map((row) => ({
    domain: str(row[0]),
    views: num(row[1]),
  }))

  const deviceBreakdown = deviceRows.map((row) => ({
    device: str(row[0]),
    count: num(row[1]),
  }))

  const domainDailyViews = domainDailyRows.map((row) => ({
    domain: str(row[0]),
    date: formatDayLabel(row[1]),
    views: num(row[2]),
  }))

  return {
    totalPageviews,
    uniqueVisitors,
    uniqueSessions,
    topPages,
    topDomains,
    deviceBreakdown,
    dailyViews,
    domainDailyViews,
  }
}
