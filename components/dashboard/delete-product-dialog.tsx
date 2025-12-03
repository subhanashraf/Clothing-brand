"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, AlertTriangle, ImageOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { deleteProductStripe } from "@/app/api/action"
import { Card } from "@/components/ui/card"

interface DeleteProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProductDialog({ product, open, onOpenChange }: DeleteProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // 🗑️ Delete image from Supabase Storage
  const deleteProductImages = async () => {
    if (!product) return

    try {
      // Delete main image if exists
      if (product.image_url) {
        const fileName = product.image_url.split('/').pop()
        if (fileName) {
          await supabase.storage
            .from("product-images")
            .remove([fileName])
        }
      }

      // Delete additional images from array
      if (product.images && Array.isArray(product.images)) {
        const imageFiles = product.images
          .map(url => url.split('/').pop())
          .filter((fileName): fileName is string => !!fileName)
        
        if (imageFiles.length > 0) {
          await supabase.storage
            .from("product-images")
            .remove(imageFiles)
        }
      }
    } catch (error) {
      console.warn("Failed to delete images:", error)
      // Continue with product deletion even if image deletion fails
    }
  }

  // 🔥 Main delete handler
  const handleDelete = async () => {
    if (!product) return

    setIsLoading(true)

    try {
      // 1️⃣ Delete images from storage
      await deleteProductImages()

      // 2️⃣ Delete from Stripe
      if (product.stripe_product_id) {
        await deleteProductStripe({
          stripe_product_id: product.stripe_product_id,
          stripe_price_id: product.stripe_price_id || undefined,
        })
      }

      // 3️⃣ Delete from database
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id)

      if (error) throw error

      toast.success(`✅ "${product.title}" deleted successfully`)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete product")
    } finally {
      setIsLoading(false)
    }
  }

  // Show warning if product has orders
  const hasDependencies = () => {
    // You can check for order dependencies here if needed
    return false
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
          </div>
          
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete:
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* 📋 Deletion Details */}
        <Card className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            {/* 🖼️ Product Image */}
            <div className="w-16 h-16 rounded-lg border overflow-hidden bg-muted flex-shrink-0">
              {product?.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* 📝 Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{product?.title || "Product"}</h4>
              <div className="text-sm text-muted-foreground space-y-1 mt-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">SKU:</span>
                  <code className="bg-muted px-1 rounded text-xs">
                    {product?.sku || "No SKU"}
                  </code>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium">Stripe:</span>
                  <code className="bg-muted px-1 rounded text-xs">
                    {product?.stripe_product_id ? "✅ Connected" : "❌ Not connected"}
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Images:</span>
                  <span className="text-xs">
                    {product?.image_url ? "1 main" : "No main image"}
                    {product?.images && product.images.length > 1 && 
                      ` + ${product.images.length - 1} more`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ⚠️ Warning List */}
          <div className="border-t pt-3 space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                This will delete all product images from storage
              </span>
            </div>
            
            {product?.stripe_product_id && (
              <div className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Product will be removed from Stripe
                </span>
              </div>
            )}

            {hasDependencies() && (
              <div className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-amber-600 font-medium">
                  Warning: This product has existing orders
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* 🚀 Footer Actions */}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Product
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}