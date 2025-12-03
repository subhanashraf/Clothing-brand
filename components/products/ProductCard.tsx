"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye, Heart, Star, Package, Globe, Zap, TrendingUp, Truck, Badge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge as UiBadge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Format price
  const formatPrice = (price?: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || "USD",
      minimumFractionDigits: 0
    }).format(Number(price || 0))
  }

  // Calculate discount
  const discountPercent = product.compare_price && product.price < product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  // Get primary image
  const mainImage = product.image_url || 
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null)

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      // TODO: Implement cart logic
      toast.success("Added to cart successfully!")
    } catch (error) {
      toast.error("Failed to add to cart")
    }
  }

  // Handle wishlist
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  // Grid View (Default)
  if (viewMode === "grid") {
    return (
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-b from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <UiBadge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white border-0">
            -{discountPercent}% OFF
          </UiBadge>
        )}

        {/* Stock Status */}
        <UiBadge className={cn(
          "absolute top-3 right-3 z-10",
          product.stock > 10 
            ? "bg-green-500 hover:bg-green-600" 
            : product.stock > 0 
            ? "bg-amber-500 hover:bg-amber-600"
            : "bg-red-500 hover:bg-red-600"
        )}>
          {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
        </UiBadge>

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="relative">
              <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                FEATURED
              </span>
            </div>
          </div>
        )}

        {/* Image Container */}
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-secondary to-muted">
            {mainImage && !imageError ? (
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
                priority={product.is_featured}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No Image</p>
                </div>
              </div>
            )}

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/80 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                size="icon"
                className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 translate-y-4 group-hover:translate-y-0 transition-transform"
                onClick={(e) => {
                  e.preventDefault()
                  handleAddToCart()
                }}
                title="Add to cart"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
              
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-12 w-12 translate-y-4 group-hover:translate-y-0 transition-transform delay-75"
                onClick={(e) => {
                  e.preventDefault()
                  handleWishlist()
                }}
                title="Add to wishlist"
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
              </Button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <CardContent className="p-5">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <UiBadge variant="outline" className="text-xs">
              {typeof product.category === 'object' && product.category ? product.category.name : "Uncategorized"}
            </UiBadge>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-muted-foreground">4.8</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>

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
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Wholesale: {formatPrice(product.wholesale_price)}
                </p>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>MOQ: {product.moq || 1}</span>
            </div>
            
            {product.origin_country && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                <span>{product.origin_country}</span>
              </div>
            )}
          </div>

          {/* SKU */}
          {product.sku && (
            <div className="mt-2 text-xs text-gray-500">
              SKU: <code className="bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // List View
  return (
    <Card className="group overflow-hidden border-0 bg-gradient-to-r from-card to-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-xl">
      <div className="flex">
        {/* Image Column */}
        <Link href={`/product/${product.id}`} className="flex-shrink-0">
          <div className="relative w-48 h-48 overflow-hidden bg-gradient-to-br from-secondary to-muted">
            {mainImage && !imageError ? (
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="200px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercent > 0 && (
                <UiBadge className="bg-red-500 hover:bg-red-600 text-white border-0 text-xs">
                  -{discountPercent}%
                </UiBadge>
              )}
              {product.is_featured && (
                <UiBadge className="bg-amber-500 hover:bg-amber-600 text-white border-0 text-xs">
                  Featured
                </UiBadge>
              )}
            </div>
          </div>
        </Link>

        {/* Info Column */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Title and Category */}
              <div className="flex items-center gap-3 mb-2">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <UiBadge variant="outline">
                  {typeof product.category === 'object' && product.category ? product.category.name : "Uncategorized"}
                </UiBadge>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.compare_price)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <UiBadge className={cn(
                    "mt-1",
                    product.stock > 10 
                      ? "bg-green-100 text-green-800" 
                      : product.stock > 0 
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  )}>
                    {product.stock || 0} units
                  </UiBadge>
                </div>

                <div>
                  <p className="text-sm text-gray-500">MOQ</p>
                  <p className="font-medium">{product.moq || 1} units</p>
                </div>

                {product.origin_country && (
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="font-medium flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {product.origin_country}
                    </p>
                  </div>
                )}
              </div>

              {/* SKU and Wholesale */}
              <div className="flex items-center gap-4 text-sm">
                {product.sku && (
                  <div>
                    <span className="text-gray-500">SKU: </span>
                    <code className="bg-gray-100 px-2 py-1 rounded">{product.sku}</code>
                  </div>
                )}
                {product.wholesale_price && (
                  <div>
                    <span className="text-gray-500">Wholesale: </span>
                    <span className="font-medium text-blue-600">
                      {formatPrice(product.wholesale_price)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleWishlist}
              >
                <Heart className={cn("mr-2 h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
              
              <Link href={`/product/${product.id}`}>
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}