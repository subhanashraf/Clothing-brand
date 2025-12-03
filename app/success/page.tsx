import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = await createClient();
  
  const params = await searchParams;
  const sessionId = params.session_id;

 

  let session: Stripe.Checkout.Session | null = null;
  let lineItems: Array<any> = [];
  let orderSaved = false;
  let orderError: string | null = null;

  // 1. Retrieve Stripe session
  if (sessionId) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items.data.price.product", "customer"],
      });

    

      // 2. Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      // 3. Prepare line items
      lineItems = session?.line_items?.data.map((item: any) => ({
        name: item.description,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
        total: (item.amount_total || 0) / 100,
        image: item.price.product.images?.[0] || "/placeholder.png",
        product_id: item.price.product.metadata?.product_id || null,
        stripe_price_id: item.price.id,
        stripe_product_id: item.price.product.id,
      })) || [];

      // 4. Prepare order data for database
      const orderData = {
        user_id: user?.id || null,
        product_id: lineItems[0]?.product_id || null, // First product if single, or null if multiple
        items: lineItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.total,
          product_id: item.product_id,
          stripe_price_id: item.stripe_price_id,
          stripe_product_id: item.stripe_product_id,
          image: item.image,
        })),
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase() || "USD",
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        // status: "completed",
        shipping_address: session.shipping_details ? {
          name: session.shipping_details.name,
          address: {
            line1: session.shipping_details.address?.line1,
            line2: session.shipping_details.address?.line2,
            city: session.shipping_details.address?.city,
            state: session.shipping_details.address?.state,
            postal_code: session.shipping_details.address?.postal_code,
            country: session.shipping_details.address?.country,
          },
          phone: session.shipping_details.phone,
        } : null,
        customer_email: session.customer_details?.email,
        customer_name: session.customer_details?.name,
        customer_phone: session.customer_details?.phone,
        invoice_url: session.invoice_url,
        tax_amount: session.total_details?.amount_tax ? session.total_details.amount_tax / 100 : 0,
        shipping_amount: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0,
        payment_method: session.payment_method_types?.[0] || "card",
      };

   

      // 5. Check if order already exists
      const { data: existingOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single();



        
      // 6. Save to database if not exists
      if (!existingOrder) {
      
  const { data, error } = await supabase
          .from("orders")
          .insert([orderData]);
        if (error) {
          console.error("Error saving order to database:", error);
          orderError = error.message;
        } else {
          orderSaved = true;
          console.log("Order saved successfully:", data);

          // 7. Update product stock if product_id exists
          if (orderData.product_id) {
            const item = lineItems[0]; // Get first item for stock update
            if (item && item.product_id) {
              // Get current stock
              const { data: product } = await supabase
                .from("products")
                .select("stock")
                .eq("id", item.product_id)
                .single();

              if (product) {
                const newStock = (product.stock || 0) - item.quantity;
                await supabase
                  .from("products")
                  .update({ stock: Math.max(0, newStock) })
                  .eq("id", item.product_id);
                console.log(`Updated stock for product ${item.product_id}: ${newStock}`);
              }
            }
          }

         
        }
      } else {
        console.log("Order already exists in database");
        orderSaved = true;
      }

    } catch (error) {
      console.error("Error processing success page:", error);
      orderError = error instanceof Error ? error.message : "Unknown error";
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-green-600">
                Payment Successful!
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-left">
              {/* Order Status Messages */}
              <div className="space-y-3">
                {orderSaved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 font-medium">
                      ✅ Order saved to database successfully!
                    </p>
                    <p className="text-green-600 text-sm">
                      Your order details have been recorded.
                    </p>
                  </div>
                )}

                {orderError && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700 font-medium">
                      ⚠️ Order saved but with note:
                    </p>
                    <p className="text-yellow-600 text-sm">{orderError}</p>
                  </div>
                )}

                {!sessionId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 font-medium">
                      ℹ️ No session ID provided
                    </p>
                    <p className="text-blue-600 text-sm">
                      This might be a direct visit to the success page.
                    </p>
                  </div>
                )}
              </div>

              <p className="text-lg text-muted-foreground">
                Thank you for your purchase! Your order has been confirmed and
                will be processed shortly.
              </p>

              {session && (
                <>
                  {/* Session Details */}
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <strong>Order ID:</strong> {session.id}
                    </p>
                    <p className="text-sm">
                      <strong>Payment Intent:</strong> {session.payment_intent}
                    </p>
                    <p className="text-sm">
                      <strong>Customer:</strong> {session.customer_details?.name || "Guest"} | {session.customer_details?.email || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> {session.customer_details?.phone || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Amount:</strong> ${(session.amount_total || 0) / 100} {session.currency?.toUpperCase()}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong> {session.payment_status}
                    </p>
                    <p className="text-sm">
                      <strong>Date:</strong> {new Date(session.created * 1000).toLocaleString()}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Order Items:</h2>
                    {lineItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 border-b border-muted pb-2">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded" 
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × ${item.price.toFixed(2)} = ${item.total.toFixed(2)}
                          </p>
                          {item.product_id && (
                            <p className="text-xs text-blue-600">
                              Product ID: {item.product_id}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    <p className="text-right font-semibold">
                      <strong>Total: </strong>${(session.amount_total || 0) / 100}
                    </p>
                  </div>

                  {/* Shipping Address */}
                  {session.shipping_details && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p>{session.shipping_details.name}</p>
                      <p>{session.shipping_details.address?.line1} {session.shipping_details.address?.line2}</p>
                      <p>{session.shipping_details.address?.city}, {session.shipping_details.address?.state} {session.shipping_details.address?.postal_code}</p>
                      <p>{session.shipping_details.address?.country}</p>
                      {session.shipping_details.phone && (
                        <p className="mt-2">
                          <strong>Phone:</strong> {session.shipping_details.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tax & Shipping Breakdown */}
                  {(session.total_details?.amount_tax || session.total_details?.amount_shipping) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Breakdown</h3>
                      <div className="space-y-1 text-sm">
                        <p>Subtotal: ${(session.amount_subtotal || 0) / 100}</p>
                        {session.total_details?.amount_tax > 0 && (
                          <p>Tax: ${(session.total_details.amount_tax || 0) / 100}</p>
                        )}
                        {session.total_details?.amount_shipping > 0 && (
                          <p>Shipping: ${(session.total_details.amount_shipping || 0) / 100}</p>
                        )}
                        <p className="font-medium pt-1 border-t">
                          Total: ${(session.amount_total || 0) / 100}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Account Creation Prompt */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-center">
                  Please create an account to see details about your purchased products in the future.
                </p>
                <div className="flex justify-center mt-2">
                  <Link href="/auth/register">
                    <Button className="px-5 py-3 bg-primary text-white font-semibold rounded hover:opacity-95">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link href="/shop">
                  <Button className="w-full sm:w-auto hover:scale-105 transition-transform">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
                  </Button>
                </Link>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto hover:scale-105 transition-transform bg-transparent"
                  >
                    <Home className="mr-2 h-4 w-4" /> Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}