"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { AnalyticsSummary } from "@/lib/types/analytics"

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ChartTopPagesProps {
  analytics: AnalyticsSummary | null
}

export function ChartTopPages({ analytics }: ChartTopPagesProps) {
  const pages = analytics?.topPages?.slice(0, 8) ?? []

  const chartData = pages.map((p) => ({
    path: p.path.length > 32 ? "…" + p.path.slice(-30) : p.path,
    views: p.views,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most visited in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No page data yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="path"
                width={170}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="views"
                fill="var(--color-views)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
