"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/translations"

export function HeroSection() {
  const { locale, dir } = useI18n()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg" dir={dir}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-chart-2/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium text-foreground mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Premium Export Quality</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-balance"
          >
            {t("hero.title", locale)}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            {t("hero.subtitle", locale)}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8 gap-2 group">
                {t("hero.cta", locale)}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-full px-8 glass bg-transparent">
                {t("hero.secondary", locale)}
              </Button>
            </Link>
          </motion.div>

          {/* Hero image grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
          >
            {[
              { query: "premium cotton shirts fashion", alt: "Premium Shirts" },
              { query: "luxury denim jeans clothing", alt: "Luxury Denim" },
              { query: "elegant dress fashion export", alt: "Elegant Dresses" },
              { query: "premium jacket outerwear clothing", alt: "Premium Jackets" },
            ].map((item, index) => (
              <motion.div
                key={item.alt}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="glass rounded-2xl p-1 shadow-xl overflow-hidden group"
              >
                <div className="rounded-xl overflow-hidden aspect-[3/4] bg-muted">
                  <img
                    src={`/.jpg?height=400&width=300&query=${encodeURIComponent(item.query)}`}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-foreground">50+</span>
              <span className="text-sm">Countries</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-foreground">10K+</span>
              <span className="text-sm">Products</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-foreground">5K+</span>
              <span className="text-sm">Happy Clients</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
