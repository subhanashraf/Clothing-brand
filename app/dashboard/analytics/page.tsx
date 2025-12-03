import { createClient } from "@/lib/supabase/server"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Fetch data in parallel
  const [analyticsRes, ordersRes] = await Promise.all([
    supabase.from("analytics").select("*").limit(100),
    supabase.from("checkout_sessions").select("amount, status, created_at")
  ])

  const analytics = analyticsRes.data || []
  const orders = ordersRes.data || []

  // Process data efficiently
  const pageViews = analytics.filter(a => a.event_name === "page_view")
  const conversions = analytics.filter(a => a.event_name === "conversion")

  const pageViewsByPage = pageViews.reduce((acc, view) => {
    const page = view.page || "Unknown"
    acc[page] = (acc[page] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const deviceData = analytics.reduce((acc, item) => {
    const device = item.device || "Unknown"
    acc[device] = (acc[device] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Format data for charts
  const pageViewData = Object.entries(pageViewsByPage).map(([page, views]) => ({ page, views }))
  const deviceChartData = Object.entries(deviceData).map(([device, count]) => ({ device, count }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Real-time business insights and performance metrics</p>
      </div>

      <AnalyticsCharts
        pageViews={pageViewData}
        deviceData={deviceChartData}
        orders={orders}
        recentEvents={analytics}
      />
    </div>
  )
}