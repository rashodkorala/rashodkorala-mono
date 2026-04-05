import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { ChartDeviceBreakdown } from "@/components/chart-device-breakdown"
import { ChartTopPages } from "@/components/chart-top-pages"
import { SectionCards } from "@/components/section-cards"
import type { AnalyticsSummary } from "@/lib/types/analytics"

interface DashboardProps {
    photosCount: number
    analytics: AnalyticsSummary | null
}

const Dashboard = ({ photosCount, analytics }: DashboardProps) => {
    return (
        <>
            <div className="flex flex-grow flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards
                            photosCount={photosCount}
                            analytics={analytics}
                        />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive analytics={analytics} />
                        </div>
                        <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
                            <ChartTopPages analytics={analytics} />
                            <ChartDeviceBreakdown analytics={analytics} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard


