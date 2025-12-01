import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import Link from "next/link"

interface CheckoutPageProps {
  params: Promise<{ productId: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { productId } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get the product
  const { data: product, error } = await supabase.from("products").select("*").eq("id", productId).single()

  if (error || !product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div className="glass rounded-xl p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">Order Summary</h1>

            <div className="flex gap-4 mb-6">
              <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{product.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description || "No description"}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(product.price)}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">$0.00</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">{formatPrice(product.price)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Payment</h2>
            <CheckoutForm productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
