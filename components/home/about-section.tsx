"use client"

import { motion } from "framer-motion"
import { Award, Truck, Shield, Users } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/about"

const features = [
  { icon: Award, titleKey: "features.quality.title", descKey: "features.quality.description" },
  { icon: Truck, titleKey: "features.shipping.title", descKey: "features.shipping.description" },
  { icon: Shield, titleKey: "features.assurance.title", descKey: "features.assurance.description" },
  { icon: Users, titleKey: "features.support.title", descKey: "features.support.description" }
]

export function AboutSection() {
  const { locale } = useI18n()
  
  return (
    <section className="w-full py-24 sm:py-32 gradient-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="glass rounded-2xl overflow-hidden aspect-[4/5] shadow-lg">
                <img 
                  src="/textile-factory-modern-machinery.jpg" 
                  alt={t("about.images.factory", locale)} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="glass rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img 
                  src="/clothing-quality-inspection.jpg" 
                  alt={t("about.images.inspection", locale)} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
              <div className="glass rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img 
                  src="/premium-fabric-rolls-textile.jpg" 
                  alt={t("about.images.fabrics", locale)} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="glass rounded-2xl overflow-hidden aspect-[4/5] shadow-lg">
                <img 
                  src="/clothing-warehouse-shipping-export.jpg" 
                  alt={t("about.images.shipping", locale)} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              {t("about.badge", locale)}
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-bold text-foreground leading-tight tracking-tight">
              {t("about.title", locale)}
            </h2>
            
            <div className="mt-6 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("about.description1", locale)}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.description2", locale)}
              </p>
            </div>

            {/* Features */}
            <div className="mt-12 grid sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleKey}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 120 
                  }}
                  className="group flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:bg-card transition-all duration-300"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                      {t(feature.titleKey, locale)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t(feature.descKey, locale)}
                    </p>
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