

export async function addProductStripe(productData: any) {
  const res = await fetch("/api/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
 
  
  if (!res.ok) throw new Error("Stripe product creation failed");

  return await res.json(); // return { stripe_product_id, stripe_price_id }
}




export async function deleteProductStripe(productData: any) {
  const res = await fetch("/api/product-delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  
  if (!res.ok) throw new Error("Stripe product delete failed");

  return await res.json(); // return { stripe_product_id, stripe_price_id }
}



export async function updateProductStripe(productData: {
  stripe_product_id: string;
  title: string;
  description?: string;
  image?: string;
  price?: number | string;
  old_stripe_price_id?: string;
}) {
  
  
  const res = await fetch("/api/product-edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  const data = await res.json();
 
  if (!res.ok) {
    throw new Error(data.error || "Stripe product update failed");
  }

  return data; // { stripe_product_id, stripe_price_id, ok: true }
}


