"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import type { Analytics } from "@/lib/types"

interface AnalyticsChartsProps {
  pageViews: { page: string; views: number }[]
  deviceData: { device: string; count: number }[]
  orders: { amount: number; status: string; created_at: string }[]
  recentEvents: Analytics[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function AnalyticsCharts({ pageViews, deviceData, orders, recentEvents }: AnalyticsChartsProps) {
  // Process orders for conversion chart
  const ordersByMonth = orders.reduce(
    (acc, order) => {
      const date = new Date(order.created_at)
      const month = date.toLocaleString("default", { month: "short" })
      if (!acc[month]) {
        acc[month] = { total: 0, paid: 0 }
      }
      acc[month].total++
      if (order.status === "paid") {
        acc[month].paid++
      }
      return acc
    },
    {} as Record<string, { total: number; paid: number }>,
  )

  const conversionData = Object.entries(ordersByMonth).map(([month, data]) => ({
    month,
    rate: data.total > 0 ? Math.round((data.paid / data.total) * 100) : 0,
  }))

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {pageViews.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No page view data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViews}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="page"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {conversionData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No conversion data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Rate"]}
                    />
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {deviceData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">No device data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="device"
                      label={({ device }) => device}
                    >
                      {deviceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto">
              {recentEvents.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No events recorded yet
                </div>
              ) : (
                <div className="space-y-3">
                  {recentEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">{event.event_name}</p>
                        <p className="text-xs text-muted-foreground">{event.page || "Unknown page"}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(event.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
