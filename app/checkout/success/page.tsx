"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Package } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-chart-4/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <Card className="glass border-[var(--color-glass-border)]">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="mx-auto mb-4 h-20 w-20 rounded-full bg-chart-4/10 flex items-center justify-center"
            >
              <CheckCircle className="h-10 w-10 text-chart-4" />
            </motion.div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Thank you for your purchase. Your order has been confirmed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                You will receive an email confirmation shortly with your order details.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard/orders">
                <Button className="w-full rounded-full gap-2">
                  View Your Orders
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
