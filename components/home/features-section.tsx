"use client"

import { motion } from "framer-motion"
import { Zap, Shield, BarChart3, Globe } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for performance. Experience blazing fast load times and smooth interactions.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security measures to keep your data safe and protected.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Gain deep insights with real-time analytics and comprehensive reporting tools.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Deploy worldwide with our global infrastructure and CDN for optimal performance.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Everything you need to succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help your business grow and scale efficiently.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
