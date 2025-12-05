"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Globe, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/contact"

export function ContactContent() {
  const { locale } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })

  const contactInfo = [
    { icon: Mail, label: "contact.email.label", value: "contact.email.value", href: "mailto:hello@premiumsaas.com" },
    { icon: Phone, label: "contact.phone.label", value: "contact.phone.value", href: "tel:+15551234567" },
    { icon: MapPin, label: "contact.office.label", value: "contact.office.value", href: "#" },
    { icon: Globe, label: "contact.support.label", value: "contact.support.value", href: "#" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsSubmitted(true)
    toast.success(t("form.success", locale))
  }

  return (
    <div className="pt-16">
    

      {/* Contact Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {t("contact.title", locale)}
              </h2>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 glass rounded-xl hover:shadow-lg transition-all"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t(item.label, locale)}
                      </p>
                      <p className="font-medium text-foreground">
                        {t(item.value, locale)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="glass p-6 rounded-xl">
                <h3 className="font-semibold text-foreground mb-3">
                  {t("support.hours.title", locale)}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("support.hours.weekdays", locale)}
                    </span>
                    <span className="font-medium text-foreground">
                      {t("support.hours.weekdaysTime", locale)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("support.hours.weekend", locale)}
                    </span>
                    <span className="font-medium text-primary">
                      {t("support.hours.weekendTime", locale)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="glass-ultra rounded-2xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-border/50">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t("form.title", locale)}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("form.subtitle", locale)}
                  </p>
                </div>
                
                <div className="p-6 sm:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-chart-4/10 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-chart-4" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">
                        {t("form.successTitle", locale)}
                      </h3>
                      <p className="text-muted-foreground mb-8">
                        {t("form.successMessage", locale)}
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="rounded-full px-8 py-6 font-medium bg-primary"
                      >
                        {t("form.sendAnother", locale)}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                          <Label htmlFor="name" className="font-medium">
                            {t("form.name", locale)}
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t("form.namePlaceholder", locale)}
                            className="rounded-lg py-6"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email" className="font-medium">
                            {t("form.email", locale)}
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t("form.emailPlaceholder", locale)}
                            className="rounded-lg py-6"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="subject" className="font-medium">
                          {t("form.subject", locale)}
                        </Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder={t("form.subjectPlaceholder", locale)}
                          className="rounded-lg py-6"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="message" className="font-medium">
                          {t("form.message", locale)}
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={t("form.messagePlaceholder", locale)}
                          rows={6}
                          className="rounded-lg"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full rounded-full py-6 font-medium bg-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t("form.sending", locale)}
                          </>
                        ) : (
                          t("form.submit", locale)
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Map Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-ultra rounded-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8 border-b border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t("map.title", locale)}
              </h2>
              <p className="text-muted-foreground">
                {t("map.subtitle", locale)}
              </p>
            </div>
            
            <div className="relative h-80 sm:h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110271.68878779262!2d-122.52000083990781!3d37.75780703726593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan+Francisco,+CA,+USA!5e1!3m2!1sen!2s!4v1764951541778!5m2!1sen!2s" 
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              <div className="absolute bottom-4 right-4 glass p-4 rounded-xl backdrop-blur-sm max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {t("map.location", locale)}
                  </span>
                </div>
                <p className="text-foreground font-medium">San Francisco, CA</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}