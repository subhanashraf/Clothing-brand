"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createCheckoutSession(productId: string) {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to make a purchase")
  }

  // Get the product from database
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    throw new Error("Product not found")
  }

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
            description: product.description || undefined,
          },
          unit_amount: Math.round(product.price * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      product_id: product.id,
      user_id: user.id,
    },
  })

  // Create a pending order in the database
  await supabase.from("orders").insert({
    user_id: user.id,
    product_id: product.id,
    amount: product.price,
    stripe_session_id: session.id,
    status: "pending",
  })

  return session.client_secret
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    payment_status: session.payment_status,
  }
}
