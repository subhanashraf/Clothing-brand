import { createClient } from "@/lib/supabase/server"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [{ data: analytics }, { data: orders }] = await Promise.all([
    supabase.from("analytics").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("orders").select("amount, status, created_at"),
  ])

  // Process analytics data
  const pageViews = analytics?.filter((a) => a.event_name === "page_view") || []
  const conversions = analytics?.filter((a) => a.event_name === "conversion") || []

  // Calculate page view data
  const pageViewsByPage = pageViews.reduce(
    (acc, view) => {
      const page = view.page || "Unknown"
      acc[page] = (acc[page] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate device data
  const deviceData =
    analytics?.reduce(
      (acc, item) => {
        const device = item.device || "Unknown"
        acc[device] = (acc[device] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground">Track your business performance</p>
      </div>

      <AnalyticsCharts
        pageViews={Object.entries(pageViewsByPage).map(([page, count]) => ({
          page,
          views: count,
        }))}
        deviceData={Object.entries(deviceData).map(([device, count]) => ({
          device,
          count,
        }))}
        orders={orders || []}
        recentEvents={analytics || []}
      />
    </div>
  )
}
