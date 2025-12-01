"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import Link from "next/link"
import type { PricingPlan } from "@/lib/types"

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals and small projects",
    priceMonthly: 9,
    priceYearly: 90,
    features: ["Up to 5 projects", "Basic analytics", "48-hour support response", "1GB storage"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "24-hour support response",
      "10GB storage",
      "Custom integrations",
      "Team collaboration",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    priceMonthly: 99,
    priceYearly: 990,
    features: [
      "Everything in Professional",
      "Dedicated support",
      "Custom contracts",
      "Unlimited storage",
      "SSO & SAML",
      "SLA guarantee",
      "Priority features",
    ],
  },
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm ${!isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Yearly
              <span className="ml-1.5 text-xs text-primary font-medium">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <div
                className={`h-full glass rounded-2xl p-8 ${
                  plan.highlighted ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"
                } transition-shadow`}
              >
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${isYearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  <span className="text-muted-foreground">/{isYearly ? "year" : "month"}</span>
                </div>

                <Link href="/auth/sign-up" className="block mt-6">
                  <Button className="w-full rounded-full" variant={plan.highlighted ? "default" : "outline"}>
                    Get Started
                  </Button>
                </Link>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
