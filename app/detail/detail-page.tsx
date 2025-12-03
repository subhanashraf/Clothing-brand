"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react"
export  function ButtonDetialsthree({product, quantitys,isAddingToCart, stock}:any) {

  
    
     const handleBuy = async () => {
   
    try {
      if (!product) throw new Error("Product not found");

      // Ensure we have an items array to send to Stripe; fall back to single product with quantity 1
      const items = [{
      priceId: (product as any).stripe_price_id, // now directly on product
      quantity: quantitys || 1,
    }];

      // Create Stripe Checkout Session
      const res = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item: any) => ({
            priceId: item.priceId, // Stripe price ID
            quantity: item.quantity,               // quantity from cart
          })),
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`,
          // customer_email: optional
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // Redirect to Stripe Checkout
      window.location.href = `${data.url}`;
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      
    }
  };

 return(
    <Button
          size="lg"
          className="h-14 bg-primary hover:bg-primary/90 text-white"
          onClick={handleBuy} 
          disabled={stock === 0 || isAddingToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Buy Now
        </Button> 
 )   
}