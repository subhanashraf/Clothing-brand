import { NextResponse } from 'next/server';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await request.json();
  const { name, description, price } = body;


  if (!prod) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // update stripe product
  await stripe.products.update(prod.stripe_product_id, { name, description });

  // if price changed, create new Price and update
  if (price !== undefined && Number(price) !== Number(prod.price)) {
    const newPrice = await stripe.prices.create({
      unit_amount: Math.round(Number(price) * 100),
      currency: 'usd',
      product: prod.stripe_product_id,
    });
    await supabaseServer.from('products').update({ price, stripe_price_id: newPrice.id }).eq('id', id);
  } else {
    await supabaseServer.from('products').update({ name, description }).eq('id', id);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!prod) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await stripe.products.update(prod.stripe_product_id, { active: false });
  await supabaseServer.from('products').update({ active: false }).eq('id', id);
  return NextResponse.json({ ok: true });
}