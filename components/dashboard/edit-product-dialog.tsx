"use client"

import type React from "react"

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
import { Filter, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Product,Category } from "@/lib/types"

interface EditProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  
}

export function EditProductDialog({ product, open, onOpenChange,categories }: EditProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [stripePriceId, setStripePriceId] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (product) {
      setTitle(product.title)
      setDescription(product.description || "")
      setPrice(product.price.toString())
      setImageUrl(product.image_url || "")
      setStripePriceId(product.stripe_price_id || "")
      const matchedCategory = categories.find(
      (c) => c.id === product.category_id
    )

    // store { id, name } or null
    setSelectedCategory(
      matchedCategory
        ? { id: matchedCategory.id, name: matchedCategory.name }
        : null
    )
    }
  }, [product])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("products")
        .update({
          title,
          description,
          price: Number.parseFloat(price),
          image_url: imageUrl || null,
          stripe_price_id: stripePriceId || null,
          category_id: selectedCategory ? selectedCategory.id : null,
        })
        .eq("id", product.id)

      if (error) throw error

      toast.success("Product updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update your product information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
  <Label>Parent Category</Label>
  <Select
    options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
    value={
      selectedCategory
        ? { value: selectedCategory.id, label: selectedCategory.name }
        : null
    }
    onChange={(selected) => {
      if (selected) {
        setSelectedCategory({ id: selected.value, name: selected.label })
      } else {
        setSelectedCategory(null)
      }
    }}
    placeholder="Select a parent category (optional)"
    isClearable
  />
</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (USD)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  required
                />
              </div>
              

              <div className="grid gap-2">
                <Label htmlFor="edit-stripe-price-id">Stripe Price ID</Label>
                <Input
                  id="edit-stripe-price-id"
                  value={stripePriceId}
                  onChange={(e) => setStripePriceId(e.target.value)}
                  placeholder="price_xxx"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image-url">Image URL</Label>
              <Input
                id="edit-image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
