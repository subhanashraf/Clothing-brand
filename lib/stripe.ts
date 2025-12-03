"use server"
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)


// export async function addProduectstripe({form}){
//     const product = await stripe.products.create({
//         name: form.title,
//         description: form.description,
//         images: "https://placehold.co/600x400/png",
//         // images: uploadedImageUrl ? [uploadedImageUrl] : [],
//       });
    
//       const price = await stripe.prices.create({
//         unit_amount: Math.round(Number(form.price) * 100), // amount in cents
//         currency: "usd",
//         product: product.id,
//       });
    
//       return price.id;

// }