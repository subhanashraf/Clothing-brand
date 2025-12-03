"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, Eye, Star, TrendingUp, Zap, Award } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useCart } from "@/lib/cart/context"
import type { Product, Category } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ProductsSectionProps {
  products: Product[]
  categories: Category[]
}

export function ProductsSection({ products, categories }: ProductsSectionProps) {
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  // Filter only featured and active products
  const featuredProducts = products.filter(p => 
    p.is_featured === true && 
    p.is_active === true
  )

  // Filter featured products by category if selected
  const filteredProducts = selectedCategory 
    ? featuredProducts.filter(p => p.category_id === selectedCategory)
    : featuredProducts

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
  }

  // Calculate discount percentage
  const calculateDiscount = (price: number, comparePrice?: number) => {
    if (!comparePrice || comparePrice <= price) return 0
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  // Handle add to cart
  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id)
      toast.success("Added to cart successfully!")
    } catch (error) {
      toast.error("Failed to add to cart")
    }
  }

  // Get category name
  const getCategoryName = (product: Product) => {
    if (typeof product.category === 'object' && product.category !== null) {
      return product.category.name || "Uncategorized"
    }
    return "Uncategorized"
  }

  // Show empty state if no featured products
  if (featuredProducts.length === 0) {
    return (
      <section className="py-24 gradient-bg-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Featured Products</h3>
            <p className="text-muted-foreground mb-6">
              Add products and mark them as featured to display here
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 gradient-bg overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">Premium Collection</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium items
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(null)}
            >
              <Star className="h-3 w-3 mr-2" />
              All Featured
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => {
              const discount = calculateDiscount(product.price, product.compare_price? product.compare_price: 0)
              
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Card className={cn(
                    "group relative overflow-hidden border-0 bg-gradient-to-b from-card to-card/50 backdrop-blur-sm",
                    "transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
                  )}>
                    {/* Product Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white border-0">
                          -{discount}%
                        </Badge>
                      )}
                      
                      {/* Stock Status */}
                      <Badge className={cn(
                        "absolute top-3 right-3 z-10",
                        product.stock > 10 
                          ? "bg-green-500 hover:bg-green-600" 
                          : product.stock > 0 
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-red-500 hover:bg-red-600"
                      )}>
                        {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </Badge>

                      {/* Product Image */}
                      <div className="relative w-full h-full bg-gradient-to-br from-secondary to-muted">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">No Image</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-3"
                      >
                        <Button
                          size="icon"
                          className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90"
                          onClick={() => handleAddToCart(product)}
                          title="Add to cart"
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </Button>
                        
                        <Link href={`/detail/${product.id}`}>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full h-12 w-12"
                            title="View details"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-5">
                      {/* Category */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryName(product)}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">4.8</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description?.substring(0, 80)}...
                      </p>

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between">
                        {/* Price */}
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                            
                            {product.compare_price && product.compare_price > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.compare_price)}
                              </span>
                            )}
                          </div>
                          
                          {/* Wholesale Price */}
                          {product.wholesale_price && (
                            <p className="text-xs text-blue-600 mt-1">
                              Wholesale: {formatPrice(product.wholesale_price)}
                            </p>
                          )}
                        </div>

                        {/* Quick Stats */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            <span>MOQ: {product.moq || 1}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Zap className="h-3 w-3" />
                            <span>Stock: {product.stock || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Country of Origin */}
                      {product.origin_country && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs text-muted-foreground">
                            Made in {product.origin_country}
                          </p>
                        </div>
                      )}
                    </CardContent>

                    {/* Featured Badge */}
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                          FEATURED
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/products">
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Eye className="mr-2 h-4 w-4" />
                View All Products
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {featuredProducts.length}
                </div>
                <p className="text-sm text-muted-foreground">Featured Products</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {categories.length}
                </div>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {featuredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
                </div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}