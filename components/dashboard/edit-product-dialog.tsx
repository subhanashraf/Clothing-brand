"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Select from "react-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Upload, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Product, Category } from "@/lib/types"
import { updateProductStripe } from "@/app/api/action"
import { Badge } from "@/components/ui/badge"

interface EditProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
}

export function EditProductDialog({ product, open, onOpenChange, categories }: EditProductDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // 🎯 Form state - matches your database schema
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    compare_price: "",
    sku: "",
    stock: "",
    moq: "",
    wholesale_price: "",
    category_id: "",
    is_active: true,
    is_featured: false,
    seo_title: "",
    seo_description: "",
    stripe_price_id: "",
    stripe_product_id: "",
    image_url: "",
    origin_country: "",
    carton_qty: "",
    carton_weight: "",
    carton_dimensions: ""
  })

  // 📤 Update single field
  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // 🔄 Reset form when product changes
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        compare_price: product.compare_price?.toString() || "",
        sku: product.sku || "",
        stock: product.stock?.toString() || "10",
        moq: product.moq?.toString() || "1",
        wholesale_price: product.wholesale_price?.toString() || "",
        category_id: product.category_id || "",
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        seo_title: product.seo_title || "",
        seo_description: product.seo_description || "",
        stripe_price_id: product.stripe_price_id || "",
        stripe_product_id: product.stripe_product_id || "",
        image_url: product.image_url || "",
        origin_country: product.origin_country || "",
        carton_qty: product.carton_qty?.toString() || "",
        carton_weight: product.carton_weight?.toString() || "",
        carton_dimensions: product.carton_dimensions || ""
      })

      setImagePreview(product.image_url || "")
      setNewImageFile(null)
    }
  }, [product])

  // 📸 Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setNewImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // ☁️ Upload new image to Supabase
  const uploadImage = async () => {
    if (!newImageFile || !product) return null

    setUploadingImage(true)

    try {
      const fileName = `product-${Date.now()}-${newImageFile.name}`

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, newImageFile)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName)

      return urlData?.publicUrl || null
    } catch (error) {
      toast.error("Image upload failed")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // 💾 Save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsLoading(true)

    try {
      let finalImageUrl = form.image_url

      // Upload new image if selected
      if (newImageFile) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl
        }
      }

      // Update Stripe if price changed or image updated
      const priceChanged = Number(form.price) !== product.price
      const imageChanged = newImageFile !== null

      if (priceChanged || imageChanged) {
        const stripeData = await updateProductStripe({
          stripe_product_id: product.stripe_product_id!,
          title: form.title,
          description: form.description,
          image: finalImageUrl,
          price: form.price,
          old_stripe_price_id: product.stripe_price_id ?? undefined,
        })

        if (stripeData?.stripe_price_id) {
          updateField("stripe_price_id", stripeData.stripe_price_id)
        }
      }

      // 🗄️ Update database
      const { error } = await supabase
        .from("products")
        .update({
          title: form.title,
          description: form.description,
          price: Number(form.price),
          compare_price: form.compare_price ? Number(form.compare_price) : null,
          sku: form.sku || null,
          stock: form.stock ? Number(form.stock) : null,
          moq: form.moq ? Number(form.moq) : null,
          wholesale_price: form.wholesale_price ? Number(form.wholesale_price) : null,
          category_id: form.category_id || null,
          is_active: form.is_active,
          is_featured: form.is_featured,
          seo_title: form.seo_title || null,
          seo_description: form.seo_description || null,
          stripe_price_id: form.stripe_price_id || null,
          image_url: finalImageUrl || null,
          origin_country: form.origin_country || null,
          carton_qty: form.carton_qty ? Number(form.carton_qty) : null,
          carton_weight: form.carton_weight ? Number(form.carton_weight) : null,
          carton_dimensions: form.carton_dimensions || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", product.id)

      if (error) throw error

      toast.success("✅ Product updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update product")
    } finally {
      setIsLoading(false)
    }
  }

  // 🎨 Format currency for display
  const formatCurrency = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return "$0.00"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(num)
  }

  // Show loading state if no product
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Product
            <Badge variant={form.is_active ? "default" : "secondary"}>
              {form.is_active ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Update product details and inventory information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🏷️ Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="PROD-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* 💰 Pricing */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Current: {formatCurrency(form.price)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Compare Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.compare_price}
                  onChange={(e) => updateField("compare_price", e.target.value)}
                  placeholder="Original price"
                />
              </div>

              <div className="space-y-2">
                <Label>Wholesale Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.wholesale_price}
                  onChange={(e) => updateField("wholesale_price", e.target.value)}
                  placeholder="Bulk price"
                />
              </div>
            </div>
          </div>

          {/* 📦 Inventory */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Inventory</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => updateField("stock", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>MOQ</Label>
                <Input
                  type="number"
                  value={form.moq}
                  onChange={(e) => updateField("moq", e.target.value)}
                  placeholder="Minimum order quantity"
                />
              </div>

              <div className="space-y-2">
                <Label>Origin Country</Label>
                <Input
                  value={form.origin_country}
                  onChange={(e) => updateField("origin_country", e.target.value)}
                  placeholder="e.g., China, USA"
                />
              </div>
            </div>
          </div>

          {/* 📦 Packaging */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Packaging</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Carton Qty</Label>
                <Input
                  type="number"
                  value={form.carton_qty}
                  onChange={(e) => updateField("carton_qty", e.target.value)}
                  placeholder="Units per carton"
                />
              </div>

              <div className="space-y-2">
                <Label>Carton Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.carton_weight}
                  onChange={(e) => updateField("carton_weight", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Dimensions</Label>
                <Input
                  value={form.carton_dimensions}
                  onChange={(e) => updateField("carton_dimensions", e.target.value)}
                  placeholder="LxWxH"
                />
              </div>
            </div>
          </div>

          {/* 📸 Image Upload */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Product Image</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border overflow-hidden bg-muted">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>


              <div className="flex-2 space-y-2">
                <Label>Upload New Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={uploadingImage}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(form.image_url || "");
                    toast.success("Copied to clipboard");
                  }}
                >
                  Copy Image URL
                </Button>

                <p className="text-xs text-muted-foreground">
                  Leave empty to keep current image
                </p>
                {uploadingImage && (
                  <p className="text-xs text-blue-500 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Uploading image...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 🏷️ Category */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Category</h3>
            <div className="space-y-2">
              <Label>Product Category</Label>
              <Select
                options={categories.map(cat => ({
                  value: cat.id,
                  label: cat.name
                }))}
                value={categories
                  .filter(cat => cat.id === form.category_id)
                  .map(cat => ({ value: cat.id, label: cat.name }))[0]
                }
                onChange={(selected) =>
                  updateField("category_id", selected?.value || "")
                }
                isClearable
                placeholder="Select category"
              />
            </div>
          </div>

          {/* 🔧 Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Active Status</Label>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) => updateField("is_active", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Featured Product</Label>
                <Switch
                  checked={form.is_featured}
                  onCheckedChange={(checked) => updateField("is_featured", checked)}
                />
              </div>

            </div>
          </div>

          {/* 🚀 Footer Actions */}
          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}