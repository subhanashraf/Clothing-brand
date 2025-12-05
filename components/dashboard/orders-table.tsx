"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Eye, 
  Download, 
  Filter, 
  MoreVertical, 
  Package, 
  User, 
  CreditCard, 
  Calendar,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  Shield,
  ExternalLink,
  Copy
} from "lucide-react"
import Image from "next/image"
import type { Order } from "@/lib/types"
import { formatDistanceToNow, format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
interface OrdersTableProps {
  orders: Order[]
  role?: "admin" | "user"
  currentUserId?: string
}

export async function OrdersTable({ orders, role = "user", currentUserId }: OrdersTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "name">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Filter orders based on role
  const userOrders = role === "user" && currentUserId 
    ? orders.filter(order => order.user_id === currentUserId)
    : orders

  // Filter and sort orders
  const filteredOrders = userOrders
    .filter((order) => {
      // Search filter
      const matchesSearch =
        search === "" ||
        order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
        order.stripe_session_id?.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "name":
          aValue = a.customer_name?.toLowerCase() || ""
          bValue = b.customer_name?.toLowerCase() || ""
          break
        default:
          return 0
      }
      
      return sortOrder === "asc" 
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1
    })

  // Format helpers
  const formatPrice = (price: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: currency || "USD" 
    }).format(price)

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
      paid: { label: "Paid", variant: "default", color: "bg-green-500" },
      pending: { label: "Pending", variant: "secondary", color: "bg-yellow-500" },
      failed: { label: "Failed", variant: "destructive", color: "bg-red-500" },
      refunded: { label: "Refunded", variant: "outline", color: "bg-gray-500" },
      processing: { label: "Processing", variant: "secondary", color: "bg-blue-500" },
      cancelled: { label: "Cancelled", variant: "destructive", color: "bg-red-400" },
      completed: { label: "Completed", variant: "default", color: "bg-emerald-600" },
    }

    const config = statusConfig[status] || { label: status, variant: "outline", color: "bg-gray-500" }
    
    return (
      <Badge variant={config.variant} className={`${config.color} text-white border-0`}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentMethodIcon = (method?: string) => {
    switch (method?.toLowerCase()) {
      case "card":
        return <CreditCard className="h-3 w-3" />
      case "paypal":
        return "PP"
      case "apple_pay":
        return "AP"
      case "google_pay":
        return "GP"
      default:
        return <CreditCard className="h-3 w-3" />
    }
  }

  // Handle sort
  const toggleSort = (column: "date" | "amount" | "name") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }
  const supabase = await createClient()
 

// Admin-only actions

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (role !== "admin") {
      toast.error("Only admins can update order status")
      return
    }
    
    try {
      // 1. Update in Supabase database
      const { data, error } = await supabase
        .from("orders")  // Your table name
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId)
        .select()
        .single()

      if (error) {
       
        toast.error(`Failed to update status: ${error.message}`)
        return
      }

      window.location.reload();


      // 4. Show success message
      toast.success(`✅ Order status updated to ${newStatus}`)

     

    } catch (error) {
       toast.error(`"❌ Error updating order:", ${error}`);
      
      toast.error("Something went wrong. Please try again.")
    } finally {
      
    }
  }


  // Order Detail Dialog for Admin
  const OrderDetailDialog = () => {
    if (!selectedOrder) return null

    return (
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Order Details (Admin View)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{selectedOrder.id}</h3>
                    <p className="text-sm text-gray-500">Session: {selectedOrder.stripe_session_id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(selectedOrder.id, "Order ID")}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy ID
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Amount</Label>
                    <p className="font-semibold">{formatPrice(selectedOrder.amount, selectedOrder.currency)}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Date</Label>
                    <p className="font-medium">{format(new Date(selectedOrder.created_at), "PPP p")}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Payment</Label>
                    <p className="font-medium capitalize">{selectedOrder.payment_method || "Card"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Details (Admin Only) */}
            <Card>
              <div className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Full Name</Label>
                    <p className="font-medium">{selectedOrder.customer_name || "Guest"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{selectedOrder.customer_email || "N/A"}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedOrder.customer_email || "", "Email")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{selectedOrder.customer_phone || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">User ID</Label>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {selectedOrder.user_id || "Guest"}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedOrder.user_id || "", "User ID")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card>
              <div className="p-4">
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 border-b pb-3">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>Price: {formatPrice(item.unit_price)}</span>
                          <span>Total: {formatPrice(item.total_price)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 space-y-1">
                          {item.product_id && (
                            <div className="flex items-center gap-2">
                              <span>Product ID:</span>
                              <code className="bg-gray-100 px-1 rounded">{item.product_id}</code>
                            </div>
                          )}
                          {item.stripe_product_id && (
                            <div className="flex items-center gap-2">
                              <span>Stripe Product:</span>
                              <code className="bg-gray-100 px-1 rounded">{item.stripe_product_id}</code>
                            </div>
                          )}
                          {item.stripe_price_id && (
                            <div className="flex items-center gap-2">
                              <span>Stripe Price:</span>
                              <code className="bg-gray-100 px-1 rounded">{item.stripe_price_id}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Payment Details (Admin Only) */}
            <Card>
              <div className="p-4">
                <h4 className="font-semibold mb-3">Payment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Stripe Session ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {selectedOrder.stripe_session_id}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedOrder.stripe_session_id || "", "Session ID")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Payment Intent</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                        {selectedOrder.stripe_payment_intent}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(selectedOrder.stripe_payment_intent || "", "Payment Intent")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Invoice URL</Label>
                    {selectedOrder.invoice_url ? (
                      <a 
                        href={selectedOrder.invoice_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Invoice
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">Not available</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Currency</Label>
                    <p className="font-medium text-sm mt-1">{selectedOrder.currency}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Shipping & Billing (Admin Only) */}
            {selectedOrder.shipping_address && (
              <Card>
                <div className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h4>
                  <div className="text-sm">
                    {selectedOrder.shipping_address && typeof selectedOrder.shipping_address === 'object' ? (
                      <>
                        <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                        <p>{selectedOrder.shipping_address.address?.line1}</p>
                        {selectedOrder.shipping_address.address?.line2 && (
                          <p>{selectedOrder.shipping_address.address.line2}</p>
                        )}
                        <p>
                          {selectedOrder.shipping_address.address?.city}, 
                          {selectedOrder.shipping_address.address?.state} 
                          {selectedOrder.shipping_address.address?.postal_code}
                        </p>
                        <p>{selectedOrder.shipping_address.address?.country}</p>
                      </>
                    ) : (
                      <p>{selectedOrder.shipping_address}</p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Admin Actions */}
            <Card>
              <div className="p-4">
                <h4 className="font-semibold mb-3">Admin Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">Send Invoice</Button>
                  <Button variant="outline">Resend Confirmation</Button>
                  <Button variant="destructive">Refund Order</Button>
                </div>
                <div className="mt-4">
                  <Label className="text-xs text-gray-500">Admin Notes</Label>
                  <Textarea 
                    placeholder="Add internal notes about this order..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Orders
            {role === "admin" && (
              <Badge variant="outline" className="ml-2">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}
          </h2>
          <p className="text-foreground">
            {role === "admin" 
              ? `Total orders: ${orders.length}` 
              : `Your orders: ${userOrders.length}`
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Admin-only Export Button */}
          {role === "admin" && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader >
              <TableRow>
                {/* Order & Customer */}
                <TableHead className="w-[280px]">
                  <div className="flex items-center gap-2">
                    <span>Order & Customer</span>
              
                  </div>
                </TableHead>

                {/* Items (Admin sees more detail) */}
                <TableHead>Items</TableHead>

                {/* Status */}
                <TableHead className="w-[120px]">Status</TableHead>

                {/* Amount */}
                <TableHead className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <span>Amount</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => toggleSort("amount")}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </div>
                </TableHead>

                {/* Date */}
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <span>Date</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => toggleSort("date")}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </div>
                </TableHead>

                {/* Admin-only columns */}
                {role === "admin" && (
                  <>
                    <TableHead className="w-[100px]">User ID</TableHead>
                    <TableHead className="w-[120px]">Payment ID</TableHead>
                  </>
                )}

                {/* Actions */}
                <TableHead className="w-[60px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={role === "admin" ? 9 : 7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="h-12 w-12 text-foreground mb-3" />
                      <p className="text-muted-foreground font-medium">No orders found</p>
                      <p className="text-muted-foreground text-sm">
                        {search ? "Try different search terms" : "No orders to display"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:gradient-bg">
                    {/* Order ID & Customer */}
                    <TableCell>
                      <div className="space-y-2">
                        <div>
                          <p className="font-semibold text-foreground truncate">
                            {role === "admin" ? `Order #${order.id.slice(0, 8).toUpperCase()}` : `Order #${order.id.slice(0, 8).toUpperCase()}`}
                          </p>
                          {role === "admin" && (
                            <p className="text-xs text-foregroundfont-mono">
                              ID: {order.id}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <User className="h-3 w-3" />
                          <span className="truncate">{order.customer_name || "Guest"}</span>
                        </div>
                        {role === "admin" && (
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{order.customer_email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Items */}
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {order.items?.slice(0, role === "admin" ? 3 : 2).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 gradient-bg  rounded-lg p-2">
                            <div className="w-8 h-8 rounded overflow-hidden gradient-bg flex-shrink-0">
                              {item?.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={32}
                                  height={32}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-[120px]">
                                {item?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                              {role === "admin" && item.product_id && (
                                <p className="text-xs text-gray-400 truncate max-w-[100px]">
                                  ID: {item.product_id.slice(0, 8)}...
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.items && order.items.length > (role === "admin" ? 3 : 2) && (
                          <Badge variant="outline" className="text-xs">
                            +{order.items.length - (role === "admin" ? 3 : 2)} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(order.status)}
                        <div className="flex items-center gap-1 text-xs text-foreground">
                          {getPaymentMethodIcon(order.payment_method)}
                          <span className="capitalize">{order.payment_method || "Card"}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">
                          {formatPrice(order.amount, order.currency)}
                        </p>
                        {role === "admin" && (
                          <>
                            {order.tax_amount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Tax: {formatPrice(order.tax_amount, order.currency)}
                              </p>
                            )}
                            {order.shipping_amount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                Ship: {formatPrice(order.shipping_amount, order.currency)}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          {format(new Date(order.created_at), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-foreground">
                          {format(new Date(order.created_at), "h:mm a")}
                        </p>
                        <p className="text-xs text-foreground">
                          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </TableCell>

                    {/* Admin-only columns */}
                    {role === "admin" && (
                      <>
                        <TableCell>
                          <div className="text-xs">
                            {order.user_id ? (
                              <div className="flex items-center gap-1">
                                <code className="bg-background px-2 py-1 rounded truncate">
                                  {order.user_id.slice(0, 8)}...
                                </code>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-5 w-5"
                                  onClick={() => copyToClipboard(order.user_id, "User ID")}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-xs">Guest</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <code className="bg-background px-2 py-1 rounded truncate block">
                              {order.stripe_payment_intent?.slice(0, 12)}...
                            </code>
                          </div>
                        </TableCell>
                      </>
                    )}

                    {/* Actions */}
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </DropdownMenuItem>
                            {role === "admin" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <CreditCard className="h-4 w-4 mr-2" />
                                  Refund Payment
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Contact Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Package className="h-4 w-4 mr-2" />
                                  Cancel Order
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Footer */}
        {filteredOrders.length > 0 && (
          <div className="border-t bg-background px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-foreground">
              <div>
                Showing <span className="font-semibold">{filteredOrders.length}</span> of{" "}
                <span className="font-semibold">{userOrders.length}</span> orders
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                {role === "admin" && (
                  <div className="flex items-center text-foreground gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-foreground">Total Revenue: {formatPrice(
                      userOrders.reduce((sum, order) => sum + order.amount, 0),
                      "USD"
                    )}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Paid: {userOrders.filter(o => o.status === 'paid').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Pending: {userOrders.filter(o => o.status === 'pending').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Admin-only Quick Stats */}
      {role === "admin" && filteredOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(
                    userOrders.reduce((sum, order) => sum + order.amount, 0),
                    "USD"
                  )}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(
                    userOrders.length > 0 
                      ? userOrders.reduce((sum, order) => sum + order.amount, 0) / userOrders.length
                      : 0,
                    "USD"
                  )}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Guest Orders</p>
                <p className="text-2xl font-bold text-foreground">
                  {userOrders.filter(o => !o.user_id).length}
                </p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {userOrders.length > 0
                    ? `${Math.round((userOrders.filter(o => o.status === 'paid').length / userOrders.length) * 100)}%`
                    : "0%"}
                </p>
              </div>
              <Badge variant="default" className="bg-green-500 text-white">
                {userOrders.filter(o => o.status === 'paid').length} Paid
              </Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Order Detail Dialog */}
      {role === "admin" && <OrderDetailDialog />}
    </div>
  )
}