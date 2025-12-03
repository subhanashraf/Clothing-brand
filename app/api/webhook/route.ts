// import { NextResponse } from 'next/server';
// import { stripe } from '../../../lib/stripe';
// import { supabaseServer } from '../../../lib/supabaseServer';

// export const runtime = 'edge'; // optional: remove if causing issues; edge still supports arrayBuffer

// export async function POST(request: Request) {
//   const sig = request.headers.get('stripe-signature')!;
//   const buf = Buffer.from(await request.arrayBuffer());
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
//   } catch (err: any) {
//     return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object as any;
//     const metadata = session.metadata || {};
//     await supabaseServer.from('orders').insert([{
//       user_id: metadata.userId ?? null,
//       user_email: metadata.userEmail ?? session.customer_details?.email ?? null,
//       product_id: metadata.productId ?? null,
//       stripe_session_id: session.id,
//       amount: (session.amount_total ?? 0) / 100,
//       currency: session.currency,
//       payment_status: 'paid',
//     }]);
//   }

//   return NextResponse.json({ received: true });
// }