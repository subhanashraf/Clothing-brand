import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/dashboard/orders-table"

export default async function OrdersPage() {
  const supabase = await createClient()

  // 1. Get the currently logged-in user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    console.error("User not found:", userError);
    return <div>User not authenticated</div>;
  }

  const userEmail = userData.user.email;

  // 2. Get the user profile to check role
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", userEmail)
    .single();

  if (profileError || !profileData) {
    console.error("Profile not found:", profileError);
    return <div>Profile not found</div>;
  }

  const role = profileData.role;

  // 3. Fetch orders based on role
  let { data: orders, error: ordersError }: { data: any[]; error: any } = { data: [], error: null };

  if (role === "admin") {
    orders = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(res => res.data || []);
  } else {
    orders = await supabase
      .from("orders")
      .select("*")
      .eq("customer_email", userEmail)
      .order("created_at", { ascending: false })
      .then(res => res.data || []);
  }
 
  
  if (ordersError) console.error("Error fetching orders:", ordersError);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
        <p className="text-muted-foreground">View and manage all orders</p>
      </div>

      <OrdersTable orders={orders || []}  role={role}/>
    </div>
  )
}
