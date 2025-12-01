"use client"

import { motion } from "framer-motion"
import { Target, Heart, Lightbulb, Users } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're committed to helping businesses succeed with tools that are powerful yet simple to use.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Every feature we build starts with understanding our customers' needs and challenges.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly push boundaries to deliver cutting-edge solutions that keep you ahead.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in building a community of successful businesses that grow together.",
  },
]

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50M+", label: "Transactions" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
]

export function AboutContent() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-16 sm:py-24 gradient-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Building the future of business software
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We started Premium SaaS with a simple belief: business software should be powerful, beautiful, and a joy
              to use. Today, we help thousands of companies transform their operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-24 gradient-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="mb-4">
                  Premium SaaS was founded in 2024 by a team of engineers and designers who were frustrated with the
                  state of business software. Too many tools were clunky, outdated, and difficult to use.
                </p>
                <p className="mb-4">
                  We set out to create something different—a platform that combines enterprise-grade power with
                  consumer-grade simplicity. Our goal was to build software that people actually enjoy using.
                </p>
                <p>
                  Today, Premium SaaS helps thousands of businesses streamline their operations, delight their
                  customers, and grow faster than ever before. And we&apos;re just getting started.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
