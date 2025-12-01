import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Create admin client for webhook (bypasses RLS)
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // For development without webhook signing secret, parse event directly
    event = JSON.parse(body) as Stripe.Event
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Update order status to paid
        const { error: orderError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
            payment_metadata: {
              payment_status: session.payment_status,
              amount_total: session.amount_total,
              currency: session.currency,
            },
          })
          .eq("stripe_session_id", session.id)

        if (orderError) {
          console.error("Error updating order:", orderError)
        }

        // Track analytics event
        if (session.metadata?.user_id) {
          await supabaseAdmin.from("analytics").insert({
            user_id: session.metadata.user_id,
            event_name: "purchase_completed",
            event_value: session.amount_total?.toString(),
            page: "/checkout",
          })
        }

        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update any orders with this payment intent
        await supabaseAdmin
          .from("orders")
          .update({
            status: "paid",
            payment_metadata: {
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              payment_method: paymentIntent.payment_method,
            },
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update order status to failed
        await supabaseAdmin
          .from("orders")
          .update({
            status: "failed",
            payment_metadata: {
              error: paymentIntent.last_payment_error?.message,
            },
          })
          .eq("stripe_payment_intent_id", paymentIntent.id)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
