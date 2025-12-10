"use client"

import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/about"
import { CheckCircle, Globe, Shield, Users, Target, Heart, Zap, Users as Community } from "lucide-react"

export function AboutPages() {
  const { locale } = useI18n()

  const features = [
    {
      icon: CheckCircle,
      titleKey: "features.quality.title",
      descriptionKey: "features.quality.description",
    },
    {
      icon: Globe,
      titleKey: "features.shipping.title",
      descriptionKey: "features.shipping.description",
    },
    {
      icon: Shield,
      titleKey: "features.assurance.title",
      descriptionKey: "features.assurance.description",
    },
    {
      icon: Users,
      titleKey: "features.support.title",
      descriptionKey: "features.support.description",
    },
  ]

  const values = [
    {
      icon: Target,
      titleKey: "values.mission.title",
      descriptionKey: "values.mission.description",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Heart,
      titleKey: "values.customer.title",
      descriptionKey: "values.customer.description",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: Zap,
      titleKey: "values.innovation.title",
      descriptionKey: "values.innovation.description",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Community,
      titleKey: "values.community.title",
      descriptionKey: "values.community.description",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
  ]

  const stats = [
    {
      valueKey: "stats.users.value",
      labelKey: "stats.users.label",
    },
    {
      valueKey: "stats.transactions.value",
      labelKey: "stats.transactions.label",
    },
    {
      valueKey: "stats.uptime.value",
      labelKey: "stats.uptime.label",
    },
    {
      valueKey: "stats.support.value",
      labelKey: "stats.support.label",
    },
  ]

  const journeySections = [
    {
      titleKey: "story.paragraph1",
    },
    {
      titleKey: "story.paragraph2",
    },
    {
      titleKey: "story.paragraph3",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Journey Section - At the top */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-2xl p-8 lg:p-12 mb-16"
            >
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="lg:w-1/3">
                  <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary mb-4">
                    {t("story.title", locale)}
                  </span>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    {t("hero.title", locale)}
                  </h2>
                  <div className="h-1 w-16 bg-primary rounded-full mb-6"></div>
                </div>
                
                <div className="lg:w-2/3 space-y-6">
                  {journeySections.map((section, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(section.titleKey, locale)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main About Content */}
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary mb-4">
                  {t("about.badge", locale)}
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {t("about.title", locale)}
                </h1>
                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t("about.description1", locale)}
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t("about.description2", locale)}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {t("values.title", locale)}
                </h3>
                <div className="space-y-6">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${value.bgColor} rounded-lg flex items-center justify-center`}>
                        <value.icon className={`w-6 h-6 ${value.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">
                          {t(value.titleKey, locale)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {t(value.descriptionKey, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t("features.quality.title", locale)} & {t("features.assurance.title", locale)}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("values.subtitle", locale)}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t(feature.titleKey, locale)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(feature.descriptionKey, locale)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-lg text-muted-foreground">
                Measurable results that speak for themselves
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">
                    {t(stat.valueKey, locale)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {t(stat.labelKey, locale)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-8 lg:p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Experience Excellence?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us for premium clothing exports.
              </p>
              <button className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started Today
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}