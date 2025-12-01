"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { createCheckoutSession } from "@/app/actions/stripe"
import { Loader2 } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  productId: string
}

export function CheckoutForm({ productId }: CheckoutFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await createCheckoutSession(productId)
      setIsLoading(false)
      return clientSecret
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load checkout")
      setIsLoading(false)
      throw err
    }
  }, [productId])

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setIsLoading(true)
          }}
          className="text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div id="checkout" className="min-h-[400px]">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
