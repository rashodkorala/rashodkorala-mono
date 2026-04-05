"use client"

import { Cell, Pie, PieChart } from "recharts"

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

const DEVICE_COLORS: Record<string, string> = {
  desktop: "var(--primary)",
  mobile: "hsl(var(--chart-2, 220 70% 50%))",
  tablet: "hsl(var(--chart-3, 160 60% 45%))",
  unknown: "hsl(var(--muted-foreground))",
}

const FALLBACK_COLORS = [
  "var(--primary)",
  "hsl(220 70% 50%)",
  "hsl(160 60% 45%)",
  "hsl(40 80% 55%)",
]

const chartConfig = {
  count: { label: "Visitors" },
} satisfies ChartConfig

interface ChartDeviceBreakdownProps {
  analytics: AnalyticsSummary | null
}

export function ChartDeviceBreakdown({ analytics }: ChartDeviceBreakdownProps) {
  const raw = analytics?.deviceBreakdown ?? []
  const total = raw.reduce((s, d) => s + d.count, 0)

  const chartData = raw.map((d, i) => ({
    name: d.device.charAt(0).toUpperCase() + d.device.slice(1),
    count: d.count,
    fill: DEVICE_COLORS[d.device.toLowerCase()] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Visitor breakdown by device type</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            No device data yet
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="mx-auto h-[160px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="mt-4 space-y-2">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: d.fill }}
                    />
                    <span>{d.name}</span>
                  </div>
                  <span className="tabular-nums text-muted-foreground">
                    {total > 0 ? `${Math.round((d.count / total) * 100)}%` : "—"}
                    <span className="ml-2 text-foreground font-medium">
                      {d.count.toLocaleString()}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
