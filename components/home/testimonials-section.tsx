"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    content:
      "This platform has completely transformed how we manage our business. The interface is beautiful and intuitive.",
    author: "Sarah Johnson",
    role: "CEO, TechStart",
    avatar: "/professional-woman-headshot.png",
    rating: 5,
  },
  {
    content: "The best investment we've made this year. Our productivity has increased by 40% since switching.",
    author: "Michael Chen",
    role: "CTO, InnovateCo",
    avatar: "/professional-man-headshot.png",
    rating: 5,
  },
  {
    content: "Outstanding support team and incredible features. Highly recommend to any growing business.",
    author: "Emily Rodriguez",
    role: "Founder, DesignLab",
    avatar: "/professional-woman-creative-headshot.jpg",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 gradient-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Loved by thousands</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about their experience with Premium SaaS.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full glass rounded-xl p-6 hover:shadow-lg transition-shadow">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground leading-relaxed mb-6">&ldquo;{testimonial.content}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
