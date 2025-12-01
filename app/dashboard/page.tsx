import { createClient } from "@/lib/supabase/server"
import { StatsCard } from "@/components/dashboard/stats-card"
import { EarningsChart } from "@/components/dashboard/earnings-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch stats
  const [{ count: totalUsers }, { count: totalProducts }, { data: orders }, { data: recentOrders }] = await Promise.all(
    [
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("amount, status"),
      supabase.from("orders").select("*, product:products(*)").order("created_at", { ascending: false }).limit(5),
    ],
  )

  // Calculate total sales
  const totalSales = orders?.filter((o) => o.status === "paid").reduce((sum, o) => sum + Number(o.amount), 0) || 0

  const totalOrders = orders?.length || 0

  // Generate mock chart data (in production, aggregate from orders)
  const chartData = [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1900 },
    { name: "Mar", value: 1500 },
    { name: "Apr", value: 2400 },
    { name: "May", value: 2100 },
    { name: "Jun", value: 2800 },
    { name: "Jul", value: totalSales || 3200 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your business metrics</p>
      </div>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value={formatCurrency(totalSales)} change={12.5} icon={DollarSign} />
        <StatsCard title="Total Users" value={totalUsers || 0} change={8.2} icon={Users} />
        <StatsCard title="Products" value={totalProducts || 0} change={4.1} icon={Package} />
        <StatsCard title="Orders" value={totalOrders} change={-2.3} icon={ShoppingCart} />
      </div> */}

      {/* Charts and Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EarningsChart data={chartData} />
        <RecentOrders orders={recentOrders || []} />
      </div>
    </div>
  )
}
