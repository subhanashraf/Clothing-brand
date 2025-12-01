"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setIsSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
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
            {isSuccess ? (
              <>
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-chart-4/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-chart-4" />
                </div>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>We&apos;ve sent password reset instructions to {email}</CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl">Reset password</CardTitle>
                <CardDescription>
                  Enter your email address and we&apos;ll send you a link to reset your password
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsSuccess(false)}>
                  Try again
                </Button>
                <Link href="/auth/login">
                  <Button className="w-full rounded-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
                  <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/auth/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
