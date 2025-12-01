"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Phone, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@premiumsaas.com",
    href: "mailto:hello@premiumsaas.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "San Francisco, CA",
    href: "#",
  },
]

export function ContactContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
    toast.success("Message sent successfully!")
  }

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
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">Get in Touch</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a question or want to learn more? We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 p-4 glass rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="glass">
                <CardContent className="p-6 sm:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-chart-4/10 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-chart-4" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Thank you!</h3>
                      <p className="text-muted-foreground mb-6">
                        We&apos;ve received your message and will get back to you soon.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          placeholder="Tell us more..."
                          rows={6}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full sm:w-auto rounded-full px-8" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
