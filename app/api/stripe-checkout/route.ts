// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, );

// export async function POST(request: Request) {
//   try {
//     const { priceId, successUrl, cancelUrl } = await request.json();
//     if (!priceId) return NextResponse.json({ error: "Missing priceId" }, { status: 400 });

//     const session = await stripe.checkout.sessions.create({
// //       payment_method_types: [
// //     "card",
// //     "ideal",
// //     "sepa_debit",
// //     "sofort",
// //     "bancontact",
// //     "giropay",
// //     "p24",
// //     "eps",
// //     "alipay",
// //     "wechat_pay",
   
// //   ],
//  payment_method_types: ["card"],
//       line_items: [{ price: priceId, quantity: 1 }],
      
//        payment_method_options: {
//         wechat_pay: {
//           client: "web",
//         },

//       },
//       mode: "payment",
//       success_url: successUrl,
//       cancel_url: cancelUrl,
    
//     });

//     return NextResponse.json({ sessionId: session.id });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ error: err.message || "Failed to create session" }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

// export async function POST(request: Request) {
//   try {
//     const { priceId, successUrl, cancelUrl } = await request.json();
//     if (!priceId) return NextResponse.json({ error: "Missing priceId" }, { status: 400 });

//     const session = await stripe.checkout.sessions.create({
//       line_items: [{ price: priceId, quantity: 1 }],
//       mode: "payment",
//       success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
//       cancel_url: cancelUrl,
//       // don't include unsupported payment methods unless enabled in dashboard
//       payment_method_types: ["card"],
//     });

//     // session.url is the canonical redirect URL (preferred)
//     return NextResponse.json({ sessionId: session.id, url: session.url });
//   } catch (err: any) {
//     console.error("Stripe Checkout Error:", err);
//     return NextResponse.json({ error: err.message || "Failed to create session" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

export async function POST(request: Request) {
  try {
    // Expect body: { items: [{ priceId: string, quantity: number }], successUrl, cancelUrl }
    const { items, successUrl, cancelUrl } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const lineItems = items.map((item: { priceId: string; quantity: number }) => ({
      price: item.priceId,
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
      payment_method_types: ["card"],
       // ⭐ Ask user for email automatically
      // customer_email: null,

      // ⭐ Enable phone field
      phone_number_collection: {
        enabled: true,
      },
      // shipping_address_collection: "required",
      // ⭐ Ask for billing address + country
      billing_address_collection: "required",
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message || "Failed to create session" }, { status: 500 });
  }
}
