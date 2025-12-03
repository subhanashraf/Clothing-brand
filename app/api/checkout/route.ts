// import { NextResponse } from 'next/server';
// import { stripe } from '../../../lib/stripe';
// import { supabaseServer } from '../../../lib/supabaseServer';

// export async function POST(request: Request) {
//   const { productId, quantity = 1, userId, userEmail } = await request.json();

//   const { data: product } = await supabaseServer.from('products').select('*').eq('id', productId).single();
//   if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [{ price: product.stripe_price_id, quantity }],
//     mode: 'payment',
//     success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/cancel`,
//     metadata: { productId: product.id, userId, userEmail },
//     customer_email: userEmail,
//   });

//   return NextResponse.json({ url: session.url, sessionId: session.id });
// }