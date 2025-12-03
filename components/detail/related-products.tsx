import Image from "next/image"
import Link from "next/link"
import { Star,Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface RelatedProductsProps {
  products: Array<{
    id: string
    title: string
    price: number
    image_url?: string
    category_id?: string
    is_featured?: boolean
    compare_price?: number
  }>
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No related products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const discountPercent = product.compare_price && product.price < product.compare_price
          ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
          : 0

        return (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group relative"
          >
            {/* Product Card */}
            <div className="bg-background rounded-xl overflow-hidden border border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400">No Image</div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {discountPercent > 0 && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">
                      -{discountPercent}%
                    </Badge>
                  )}
                  {product.is_featured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button variant="secondary" className="scale-90 group-hover:scale-100 transition-transform">
                    Quick View
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium  line-clamp-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(24)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                </div>

                {/* View Details Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View Details
                </Button>
              </div>
            </div>

            {/* Floating Action Button */}
            <Button
              size="icon"
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </Link>
        )
      })}
    </div>
  )
}