// components/ui/PageLoader.tsx
"use client"

import { motion } from "framer-motion"

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        className="w-16 h-16 border-4 border-t-primary border-r-primary/20 border-b-primary/20 border-l-primary/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  )
}
