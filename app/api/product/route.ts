import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { toast } from "sonner"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, image } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Stripe Product
    const stripeProduct = await stripe.products.create({
      name,
      description,
      images: image ? [image] : [],
    });

    // Create Stripe Price
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(Number(price) * 100), // convert to cents
      currency: "usd",
      product: stripeProduct.id,
    });

    return NextResponse.json({
      stripe_product_id: stripeProduct.id,
      stripe_price_id: stripePrice.id,
      ok:true
    });
  } catch (error: any) {
    toast.error(`Failed to Create  product: ${error}`)
   
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
