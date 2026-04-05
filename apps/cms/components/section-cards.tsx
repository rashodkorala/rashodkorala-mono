import { IconCamera, IconClick, IconPhoto, IconUsers, IconWorld } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AnalyticsSummary } from "@/lib/types/analytics"

interface SectionCardsProps {
  photosCount: number
  analytics: AnalyticsSummary | null
}

export function SectionCards({
  photosCount,
  analytics,
}: SectionCardsProps) {
  const uniqueVisitors = analytics?.uniqueVisitors || 0
  const uniqueSessions = analytics?.uniqueSessions || 0

  const portfolioViews = analytics?.topDomains.find(d => d.domain === "www.rashodkorala.com")?.views ?? 0
  const photosViews = analytics?.topDomains.find(d => d.domain === "photos.rashodkorala.com")?.views ?? 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Portfolio Views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {portfolioViews.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconWorld className="size-4" />
              Last 30 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            www.rashodkorala.com <IconWorld className="size-4" />
          </div>
          <div className="text-muted-foreground">Portfolio site pageviews</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Photos Views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {photosViews.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCamera className="size-4" />
              Last 30 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            photos.rashodkorala.com <IconCamera className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {photosCount} photo{photosCount !== 1 ? "s" : ""} in collection
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unique Visitors</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {uniqueVisitors.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers className="size-4" />
              Last 30 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Distinct users <IconUsers className="size-4" />
          </div>
          <div className="text-muted-foreground">Across both sites</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unique Sessions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {uniqueSessions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconClick className="size-4" />
              Last 30 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sessions tracked <IconClick className="size-4" />
          </div>
          <div className="text-muted-foreground">Avg {uniqueVisitors > 0 ? (uniqueSessions / uniqueVisitors).toFixed(1) : "—"} per visitor</div>
        </CardFooter>
      </Card>
    </div>
  )
}
