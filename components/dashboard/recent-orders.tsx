"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"
      case "pending":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {order.product?.title || "Unknown Product"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">{formatPrice(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
