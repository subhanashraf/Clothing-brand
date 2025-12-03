"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // client-side supabase
import { toast } from "sonner"

export default function CheckoutPage() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const supabase = createClient();

  // Fetch product details from DB
  useEffect(() => {
    async function fetchProducts() {
      if (!items || items.length === 0) return;

      const productIds = items.map((item) => item.product_id);
      const { data } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      // Merge quantity from cart with product details
      const merged = items.map((item) => {
        const product = data?.find((p) => p.id === item.product_id);
        return {
          ...item,
          product: product || { title: "Product not found", price: 0, image_url: "/placeholder.svg" },
        };
      });

      setCartProducts(merged);
    }

    fetchProducts();
  }, [items]);

  // Handle Stripe Checkout
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartProducts.map(item => ({
            priceId: item.product.stripe_price_id, // Stripe price ID
            quantity: item.quantity,               // quantity from cart
          })),
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        toast.error(`Stripe Checkout failed ${data.error}`);
        
      }
    } catch (err) {
       toast.error(`Checkout error:, ${err}`)
     
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          &larr; Back to products
        </Link>

        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {cartProducts.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartProducts.map((item) => (
                <div key={item.id} className="glass p-4 rounded-xl flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg overflow-hidden">
                    <img src={item.product.image_url} alt={item.product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.title}</p>
                    <p className="text-sm text-muted-foreground">${item.product.price} × {item.quantity}</p>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                      className="border p-1 w-16 rounded mt-1"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-500 font-semibold"
                  >
                    Remove
                  </button>
                  <p className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="glass p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Compute subtotal from cartProducts */}
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${cartProducts.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Tax</span>
                <span>$0.00</span>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${cartProducts.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0).toFixed(2)}</span>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="mt-4 w-full px-5 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-95"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
