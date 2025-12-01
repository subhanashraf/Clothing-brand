"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { Order } from "@/lib/types"

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.product?.title?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.stripe_session_id?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="glass overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{order.product?.title || "Unknown Product"}</p>
                      <p className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 8)}...</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-muted-foreground">{order.user?.email || "Unknown"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(order.amount)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(order.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
