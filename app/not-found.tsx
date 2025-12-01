"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
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
        className="text-center relative"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[150px] sm:text-[200px] font-bold text-foreground/5 select-none"
        >
          404
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Page not found</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
            <Link href="/">
              <Button className="rounded-full gap-2">
                <Home className="h-4 w-4" />
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
