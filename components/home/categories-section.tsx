"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { getLocalizedField } from "@/lib/i18n/config"
import type { Category } from "@/lib/types"

interface CategoriesSectionProps {
  categories: Category[]
}

const defaultCategories = [
  { name: "Men's Wear", slug: "mens-wear", image: "mens formal casual clothing collection" },
  { name: "Women's Wear", slug: "womens-wear", image: "womens elegant fashion collection" },
  { name: "Children's Wear", slug: "childrens-wear", image: "kids colorful clothing collection" },
  { name: "Accessories", slug: "accessories", image: "fashion accessories scarves belts" },
]

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const { locale, dir } = useI18n()

  const displayCategories =
    categories.length > 0 ? categories.slice(0, 4) : defaultCategories.map((c, i) => ({ ...c, id: String(i) }))

  return (
    <section className="py-24 sm:py-32 bg-background" dir={dir}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Shop by Category</h2>
          <p className="mt-4 text-lg text-muted-foreground">Explore our diverse range of clothing categories</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id || category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products?category=${category.slug}`}>
                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden glass">
                  {/* <img
                    src={
                      (category as Category).image_url ||
                      `/placeholder.svg?height=500&width=400&query=${encodeURIComponent((category as { image?: string  || "/placeholder.svg"}).image || category.name)}`
                    }
                    alt={getLocalizedField(category as Category, "name", locale) || category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      {getLocalizedField(category as Category, "name", locale) || category.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
