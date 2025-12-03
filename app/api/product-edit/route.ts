import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stripe_product_id, title, description, image, price, old_stripe_price_id } = body;

    if (!stripe_product_id || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1️⃣ Update Stripe product metadata
    const updatedProduct = await stripe.products.update(stripe_product_id, {
      name: title,
      description: description || undefined,
      images: image ? [image] : undefined,
    });

    let newPriceId = null;

    // 2️⃣ Update Stripe price if price is provided
    if (price) {
      // Deactivate old price
      if (old_stripe_price_id) {
        await stripe.prices.update(old_stripe_price_id, { active: false });
      }

      // Create new price
      const newPrice = await stripe.prices.create({
        product: stripe_product_id,
        unit_amount: Math.round(Number(price) * 100), // convert to cents
        currency: "usd",
      });

      newPriceId = newPrice.id;
    }

    return NextResponse.json({
      stripe_product_id: updatedProduct.id,
      stripe_price_id: newPriceId || old_stripe_price_id || null,
      ok: true,
    });
  } catch (err: any) {
    console.error("Stripe Update Error:", err);
    return NextResponse.json({ error: err.message || "Failed to update Stripe product" }, { status: 500 });
  }
}
