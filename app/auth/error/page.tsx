"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, Home } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-destructive/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-chart-2/5 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="font-semibold text-foreground text-xl">Premium</span>
        </Link>

        <Card className="glass border-[var(--color-glass-border)]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>Something went wrong during authentication. Please try again.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/auth/login">
                <Button className="w-full rounded-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full gap-2">
                  <Home className="h-4 w-4" />
                  Go to home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
