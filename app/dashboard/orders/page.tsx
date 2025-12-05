import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/dashboard/orders-table"

export default async function OrdersPage() {
  const supabase = await createClient()

// 1. Get logged-in user
const { data: userData, error: userError } = await supabase.auth.getUser();

if (userError || !userData?.user) {
  console.error("User not authenticated:", userError);
  return <div>User not authenticated</div>;
}

const userEmail = userData.user.email;


// 2. Get profile role
const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role")
  .eq("email", userEmail)
  .single();


if (profileError || !profile) {
  console.error("Profile not found:", profileError);
  return <div>Profile not found</div>;
}

const role = profile.role;

// 3. Fetch orders based on role
let orders = [];

if (role === "admin") {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error(error);
  orders = data || [];
} else {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    // .eq("customer_email", userEmail)
    .order("created_at", { ascending: false });

  
  if (error) console.error(error);
  orders = data || [];
}
  


  // if (ordersError) console.error("Error fetching orders:", ordersError);

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
