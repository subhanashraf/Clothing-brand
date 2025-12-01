"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { locales, localeNames, localeFlags } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {localeFlags[locale]} {localeNames[locale]}
        </span>
        <span className="sm:hidden">{localeFlags[locale]}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute end-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border/50 bg-card/95 p-1 shadow-xl backdrop-blur-xl"
            >
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocale(loc)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    locale === loc && "bg-accent",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span>{localeFlags[loc]}</span>
                    <span>{localeNames[loc]}</span>
                  </span>
                  {locale === loc && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
