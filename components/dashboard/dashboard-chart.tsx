"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"
import { TrendingUp, Users, Package, ShoppingBag } from "lucide-react"

interface DashboardChartProps {
  monthlyRevenue: Array<{ month: string; revenue: number }>
  monthlyUsers: Array<{ month: string; users: number }>
  productStats: {
    active: number
    inactive: number
    lowStock: number
    outOfStock: number
  }
  orderStatusDistribution: Record<string, number>
  totalRevenue: number
  totalUsers: number
  totalOrders: number
  totalItemsSold: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export function DashboardChart({
  monthlyRevenue,
  monthlyUsers,
  productStats,
  orderStatusDistribution,
  totalRevenue,
  totalUsers,
  totalOrders,
  totalItemsSold
}: DashboardChartProps) {
  // Format revenue data for chart
  const revenueData = monthlyRevenue.map(item => ({
    name: item.month,
    revenue: item.revenue
  }))

  // Format user growth data
  const userGrowthData = monthlyUsers.map(item => ({
    name: item.month,
    users: item.users
  }))

  // Product status data for pie chart
  const productStatusData = [
    { name: 'Active', value: productStats.active },
    { name: 'Inactive', value: productStats.inactive },
    { name: 'Low Stock', value: productStats.lowStock },
    { name: 'Out of Stock', value: productStats.outOfStock }
  ].filter(item => item.value > 0)

  // Order status data for pie chart
  const orderStatusData = Object.entries(orderStatusDistribution).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }))

  // KPI Cards Data
  const kpiData = [
    {
      title: "Monthly Revenue",
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0
      ),
      change: monthlyRevenue.length > 1 
        ? ((monthlyRevenue[monthlyRevenue.length - 1]?.revenue - monthlyRevenue[monthlyRevenue.length - 2]?.revenue) / monthlyRevenue[monthlyRevenue.length - 2]?.revenue * 100).toFixed(1)
        : "0",
      icon: TrendingUp,
      trend: monthlyRevenue.length > 1 && monthlyRevenue[monthlyRevenue.length - 1]?.revenue > monthlyRevenue[monthlyRevenue.length - 2]?.revenue ? "up" : "down"
    },
    {
      title: "User Growth",
      value: monthlyUsers[monthlyUsers.length - 1]?.users || 0,
      change: monthlyUsers.length > 1
        ? ((monthlyUsers[monthlyUsers.length - 1]?.users - monthlyUsers[monthlyUsers.length - 2]?.users) / monthlyUsers[monthlyUsers.length - 2]?.users * 100).toFixed(1)
        : "0",
      icon: Users,
      trend: monthlyUsers.length > 1 && monthlyUsers[monthlyUsers.length - 1]?.users > monthlyUsers[monthlyUsers.length - 2]?.users ? "up" : "down"
    },
    {
      title: "Product Health",
      value: `${Math.round((productStats.active / (productStats.active + productStats.inactive)) * 100)}%`,
      change: "Active rate",
      icon: Package,
      trend: "stable"
    },
    {
      title: "Order Volume",
      value: totalOrders,
      change: "Total orders",
      icon: ShoppingBag,
      trend: "up"
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {kpi.change}%
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <kpi.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
          <CardDescription>Track your business performance across different metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">User Growth</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            {/* Revenue Chart */}
            <TabsContent value="revenue" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      labelStyle={{ color: '#666' }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      name="Monthly Revenue" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* User Growth Chart */}
            <TabsContent value="users" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      name="New Users" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            {/* Products Chart */}
            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Products']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Active Products</p>
                        <p className="text-2xl font-bold text-green-600">{productStats.active}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Low Stock</p>
                        <p className="text-2xl font-bold text-amber-600">{productStats.lowStock}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-600">{productStats.outOfStock}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Inactive</p>
                        <p className="text-2xl font-bold text-gray-600">{productStats.inactive}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Orders Chart */}
            <TabsContent value="orders" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Orders']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Order Distribution</h4>
                  <div className="space-y-2">
                    {orderStatusData.map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{status.name}</span>
                        </div>
                        <span className="font-medium">{status.value} orders</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}