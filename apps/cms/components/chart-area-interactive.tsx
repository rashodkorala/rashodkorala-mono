"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import type { AnalyticsSummary } from "@/lib/types/analytics"

export const description = "An interactive area chart"

const PORTFOLIO_DOMAIN = "www.rashodkorala.com"
const PHOTOS_DOMAIN = "photos.rashodkorala.com"

interface ChartAreaInteractiveProps {
  analytics: AnalyticsSummary | null
}

const chartConfig = {
  portfolio: {
    label: "Portfolio",
    color: "var(--primary)",
  },
  photos: {
    label: "Photos",
    color: "hsl(220 70% 50%)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ analytics }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const hasDomainData = (analytics?.domainDailyViews?.length ?? 0) > 0

  // Build per-domain daily chart data
  const chartData = React.useMemo(() => {
    if (hasDomainData) {
      // Merge portfolio + photos rows into one record per date
      const byDate = new Map<string, { date: string; portfolio: number; photos: number }>()
      for (const row of analytics!.domainDailyViews) {
        if (!byDate.has(row.date)) byDate.set(row.date, { date: row.date, portfolio: 0, photos: 0 })
        const entry = byDate.get(row.date)!
        if (row.domain === PORTFOLIO_DOMAIN) entry.portfolio += row.views
        if (row.domain === PHOTOS_DOMAIN) entry.photos += row.views
      }
      return Array.from(byDate.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    }

    // Fallback: total dailyViews mapped to portfolio key
    return (analytics?.dailyViews ?? [])
      .map((item) => ({ date: item.date, portfolio: item.views, photos: 0 }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [analytics, hasDomainData])

  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return []
    const daysToSubtract = timeRange === "90d" ? 90 : timeRange === "7d" ? 7 : 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [chartData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Pageviews Over Time</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Portfolio vs Photos — daily pageviews
          </span>
          <span className="@[540px]/card:hidden">Daily pageviews</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
            No pageview data in this range yet.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-portfolio)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-portfolio)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillPhotos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-photos)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-photos)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area dataKey="portfolio" type="natural" fill="url(#fillPortfolio)" stroke="var(--color-portfolio)" stackId="a" />
              <Area dataKey="photos" type="natural" fill="url(#fillPhotos)" stroke="var(--color-photos)" stackId="b" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
