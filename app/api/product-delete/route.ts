import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stripe_product_id, stripe_price_id } = body;
    
    
    if (!stripe_product_id && !stripe_price_id) {
      return NextResponse.json(
        { error: "Missing stripe_product_id or stripe_price_id" },
        { status: 400 }
      );
    }

    // Deactivate Stripe Price
    if (stripe_price_id) {
      await stripe.prices.update(stripe_price_id, { active: false });
    }

    // Deactivate Stripe Product
    if (stripe_product_id) {
  await stripe.products.del(stripe_product_id);
}

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    
    console.log("Stripe Delete Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
