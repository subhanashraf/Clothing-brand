import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/dashboard/orders-table"

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, product:products(*), user:users(*)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
        <p className="text-muted-foreground">View and manage all orders</p>
      </div>

      <OrdersTable orders={orders || []} />
    </div>
  )
}
