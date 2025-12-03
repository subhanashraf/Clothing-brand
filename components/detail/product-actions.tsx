"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Plus, Minus, Truck, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { ButtonDetialsthree } from "@/app/detail/detail-page"
import { useCart } from "@/lib/cart/context"
import { useI18n } from "@/lib/i18n/context"
import { t } from "@/lib/i18n/translations"
interface ProductActionsProps {
  product: any
  userId?: string
  stock?: number
}

export function ProductActions({ product, userId, stock = 0 }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { locale, dir } = useI18n()
  const { itemCount,addItem } = useCart()


  const handleAddToCart = async () => {
    await addItem(product.id)
    toast.success(t("products.addToCart", locale))
  }


 

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push("/checkout")
  }

  const handleWishlist = async () => {
    if (!userId) {
      router.push("/auth/login")
      return
    }

    try {
      if (isWishlisted) {
        await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", product.id)
        toast.success("Removed from wishlist")
      } else {
        await supabase.from("wishlist").insert({
          user_id: userId,
          product_id: product.id
        })
        toast.success("Added to wishlist")
      }
      setIsWishlisted(!isWishlisted)
    } catch (error) {
      toast.error("Failed to update wishlist")
    }
  }

  return (
    <div className="space-y-6 ">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4 ">
        <span className="font-medium">Quantity:</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-bold text-lg">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-500">
          {stock > 0 ? `${stock} available` : "Out of stock"}
        </span>
      </div>

      {/* Price Summary */}
      <div className="p-4 bg-muted rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-foreground">Total Price</p>
            <p className="text-3xl font-bold text-primary">
              ${(product.price * quantity).toFixed(2)}
            </p>
          </div>
          {stock > 0 && (
            <Badge className="bg-green-500 hover:bg-green-600">
              In Stock • Ships in 24h
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ButtonDetialsthree  quantitys={quantity} product={product}  stock={stock}  isAddingToCart={isAddingToCart}/>
       

        <Button
          size="lg"
          variant="outline"
          className="h-14"
          onClick={handleAddToCart}
          disabled={stock === 0 || isAddingToCart}
        >
          {isAddingToCart ? (
            "Adding..."
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-14"
          onClick={handleWishlist}
        >
          <Heart
            className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
          />
          {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t">
        <div className="text-center p-3 bg-background rounded-lg">
          <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-xs font-medium">Free Shipping</p>
        </div>
        <div className="text-center p-3 bg-background rounded-lg">
          <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-xs font-medium">2-Year Warranty</p>
        </div>
        <div className="text-center p-3 bg-background rounded-lg">
          <RefreshCw className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-xs font-medium">30-Day Returns</p>
        </div>
      </div>
    </div>
  )
}