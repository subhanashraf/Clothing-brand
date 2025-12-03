"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { XCircle, Home, ShoppingCart } from "lucide-react"

export default function CancelPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/"
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-2">
          Your transaction was not completed.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          No money has been deducted from your account.
        </p>

        <div className="space-y-4">
          <Link href="/cart" className="block">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-300 hover:border-red-300 hover:bg-red-50 gap-3"
            >
              <ShoppingCart className="h-5 w-5" />
              Back to Cart
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 gap-3"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-gray-400 text-sm">
          You'll be redirected home in 5 seconds...
        </p>
      </div>
    </main>
  )
}