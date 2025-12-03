import { createClient } from "@/lib/supabase/server"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { DollarSign, Users, Package, ShoppingCart, TrendingUp, CreditCard, Globe, Calendar } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch all data in parallel
  const [
    profilesRes,
    productsRes,
    checkoutSessionsRes,
    recentCheckoutsRes
  ] = await Promise.all([
    supabase.from("profiles").select("id, created_at"),
    supabase.from("products").select("id, price, stock, created_at, is_active"),
    supabase.from("orders").select("amount, status, created_at, items, customer_email"),
    supabase.from("orders").select("*, profiles(full_name)").order("created_at", { ascending: false }).limit(5)
  ])

  // Extract data
  const profiles = profilesRes.data || []
  const products = productsRes.data || []
  const checkoutSessions = checkoutSessionsRes.data || []
  const recentCheckouts = recentCheckoutsRes.data || []

  // Calculate stats
  const totalRevenue = checkoutSessions
    .filter(o => o.status === "paid" || o.status === "completed")
    .reduce((sum, o) => sum + Number(o.amount || 0), 0)

  const totalUsers = profiles.length
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.is_active === true).length
  
  const totalOrders = checkoutSessions.length
  const successfulOrders = checkoutSessions.filter(o => o.status === "paid" || o.status === "completed").length
  const orderSuccessRate = totalOrders > 0 ? Math.round((successfulOrders / totalOrders) * 100) : 0

  // Total items sold
  const totalItemsSold = checkoutSessions.reduce((total, order) => {
    if (order.items && Array.isArray(order.items)) {
      return total + order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    }
    return total
  }, 0)

  // Calculate monthly revenue for chart
  const monthlyRevenue = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - index)
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' })
    
    const monthRevenue = checkoutSessions
      .filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear() &&
               (order.status === "paid" || order.status === "completed")
      })
      .reduce((sum, order) => sum + Number(order.amount || 0), 0)
    
    return { month: monthYear, revenue: monthRevenue }
  }).reverse()

  // Calculate user growth for chart
  const monthlyUsers = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - index)
    const monthYear = date.toLocaleString('default', { month: 'short' })
    
    const monthUsers = profiles.filter(user => {
      const userDate = new Date(user.created_at)
      return userDate.getMonth() === date.getMonth() && 
             userDate.getFullYear() === date.getFullYear()
    }).length
    
    return { month: monthYear, users: monthUsers }
  }).reverse()

  // Calculate product metrics for chart
  const productStats = {
    active: activeProducts,
    inactive: products.length - activeProducts,
    lowStock: products.filter(p => (p.stock || 0) < 10).length,
    outOfStock: products.filter(p => (p.stock || 0) === 0).length
  }

  // Calculate order status distribution
  const orderStatusDistribution = checkoutSessions.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Real-time business insights and performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          change={12.5} 
          icon={DollarSign}
          description="From all successful orders"
          trend="up"
        />
        <StatsCard 
          title="Active Users" 
          value={totalUsers.toString()} 
          change={8.2} 
          icon={Users}
          description="Registered customers"
          trend="up"
        />
        <StatsCard 
          title="Products" 
          value={totalProducts.toString()} 
          change={4.1} 
          icon={Package}
          description={`${activeProducts} active, ${productStats.lowStock} low stock`}
          trend="up"
        />
        <StatsCard 
          title="Orders" 
          value={totalOrders.toString()} 
          change={-2.3} 
          icon={ShoppingCart}
          description={`${successfulOrders} successful (${orderSuccessRate}% rate)`}
          trend="down"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Items Sold" 
          value={totalItemsSold.toString()} 
          change={15.7} 
          icon={TrendingUp}
          description="Total products purchased"
          trend="up"
        />
        <StatsCard 
          title="Avg. Order" 
          value={formatCurrency(totalOrders > 0 ? totalRevenue / totalOrders : 0)} 
          change={3.2} 
          icon={CreditCard}
          description="Average order value"
          trend="up"
        />
        <StatsCard 
          title="Order Success" 
          value={`${orderSuccessRate}%`} 
          change={2.1} 
          icon={Globe}
          description="Payment success rate"
          trend="up"
        />
        <StatsCard 
          title="Conversion" 
          value={`${Math.round((totalOrders / totalUsers) * 100)}%`} 
          change={1.5} 
          icon={Calendar}
          description="User to order ratio"
          trend="up"
        />
      </div>

      {/* Charts and Data Visualization */}
      <DashboardChart 
        monthlyRevenue={monthlyRevenue}
        monthlyUsers={monthlyUsers}
        productStats={productStats}
        orderStatusDistribution={orderStatusDistribution}
        totalRevenue={totalRevenue}
        totalUsers={totalUsers}
        totalOrders={totalOrders}
        totalItemsSold={totalItemsSold}
      />

      {/* Recent Orders Table */}
      <RecentOrders orders={recentCheckouts} />
    </div>
  )
}