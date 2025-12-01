"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/translations"
import { getLocalizedField } from "@/lib/i18n/config"
import { useCart } from "@/lib/cart/context"
import type { Product, Category } from "@/lib/types"
import { toast } from "sonner"

interface ProductsSectionProps {
  products: Product[]
  categories: Category[]
}

export function ProductsSection({ products, categories }: ProductsSectionProps) {
  const { locale, dir } = useI18n()
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const filteredProducts = selectedCategory ? products.filter((p) => p.category_id === selectedCategory) : products

  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : locale === "cn" ? "zh-CN" : "en-US", {
      style: "currency",
      currency,
    }).format(price)
  }

  const handleAddToCart = async (productId: string) => {
    await addItem(productId)
    toast.success(t("products.addToCart", locale))
  }

  return (
    <section id="products" className="py-24 sm:py-32 bg-background" dir={dir}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">{t("products.title", locale)}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t("products.subtitle", locale)}</p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(null)}
          >
            {t("products.all", locale)}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(category.id)}
            >
              {getLocalizedField(category, "name", locale) || category.name}
            </Button>
          ))}
        </motion.div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products available yet.</p>
            <p className="text-sm text-muted-foreground">Products will appear here once added.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="group glass rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    {/* Product image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <img
                        src={
                          product.image_url ||
                          `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(product.title) || "/placeholder.svg"}`
                        }
                        alt={getLocalizedField(product, "title", locale) || product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 start-3 flex flex-col gap-2">
                        {product.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
                            {t("products.featured", locale)}
                          </span>
                        )}
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-md">
                            {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Quick actions */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                        className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center gap-3"
                      >
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full h-10 w-10"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingBag className="h-4 w-4" />
                        </Button>
                        <Link href={`/detail/${product.id}`}>
                          <Button size="icon" variant="secondary" className="rounded-full h-10 w-10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>

                    {/* Product info */}
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {product.category
                          ? getLocalizedField(product.category, "name", locale) || product.category.name
                          : "Uncategorized"}
                      </p>
                      <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">
                        {getLocalizedField(product, "title", locale) || product.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.compare_price, product.currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View all button */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button variant="outline" size="lg" className="rounded-full px-8 bg-transparent">
                View All Products
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
