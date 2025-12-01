"use client"

import { motion } from "framer-motion"
import { Award, Truck, Shield, Users } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Export-grade garments crafted with precision and care for global markets.",
  },
  {
    icon: Truck,
    title: "Global Shipping",
    description: "Fast and reliable shipping to over 50 countries worldwide.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Rigorous quality control ensuring every piece meets international standards.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "24/7 customer support in multiple languages for all your needs.",
  },
]

export function AboutSection() {
  return (
    <section className="py-24 sm:py-32 gradient-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image grid */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <div className="glass rounded-2xl overflow-hidden aspect-[4/5]">
                <img src="/textile-factory-modern-machinery.jpg" alt="Modern Factory" className="w-full h-full object-cover" />
              </div>
              <div className="glass rounded-2xl overflow-hidden aspect-square">
                <img src="/clothing-quality-inspection.jpg" alt="Quality Inspection" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="glass rounded-2xl overflow-hidden aspect-square">
                <img src="/premium-fabric-rolls-textile.jpg" alt="Premium Fabrics" className="w-full h-full object-cover" />
              </div>
              <div className="glass rounded-2xl overflow-hidden aspect-[4/5]">
                <img src="/clothing-warehouse-shipping-export.jpg" alt="Global Shipping" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium">About ClothEx</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Your Trusted Partner in Premium Clothing Export
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              With over a decade of experience in the textile industry, ClothEx has established itself as a leading
              clothing export brand. We specialize in manufacturing and exporting high-quality garments that meet
              international standards.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our state-of-the-art facilities, combined with skilled craftsmanship, ensure that every piece we produce
              reflects excellence and attention to detail. From casual wear to formal attire, we cater to diverse
              fashion needs across the globe.
            </p>

            {/* Features */}
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
