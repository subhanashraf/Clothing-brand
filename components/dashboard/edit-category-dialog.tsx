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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Category } from "@/lib/types"
import Select from "react-select"
import { Switch } from "../ui/switch"

interface EditCategoryDialogProps {
  category: Category | null
  categories: Category[] // all categories for parent selection
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategoryDialog({
  category,
  categories,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [imageUrl, setImageUrl] = useState("")        // 👈 NEW
  const [parentIds, setParentIds] = useState<string[]>([])
  const router = useRouter()
  const [form,updateForm]=useState({
    is_active:true,
    is_featured:false,
  })

  useEffect(() => {
    if (category) {
      setName(category.name)
      setSlug(category.slug)
      setImageUrl(category.image_url || "")        // 👈 load existing image
      setParentIds(category.parent_ids || [])
      updateForm({
        is_active:category.is_active,
        is_featured:category.is_featured,
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("categories")
        .update({
            is_active:form.is_active,
          is_featured:form.is_featured, 
          name,
          slug,
          image_url: imageUrl,  
          parent_ids: parentIds.length > 0 ? parentIds : [],
        })
        .eq("id", category.id)

      if (error) throw error

      toast.success("Category updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update category")
    } finally {
      setIsLoading(false)
    }
  }

  const parentOptions = categories
    .filter((c) => c.id !== category?.id)
    .map((c) => ({ value: c.id, label: c.name }))

  const selectedParents = parentOptions.filter((opt) => parentIds.includes(opt.value))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update your category information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* Name */}
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Slug */}
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            {/* Image URL */}
            <div className="grid gap-2">
              <Label>Image URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/img.jpg"
              />
            </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active" className="cursor-pointer">Product Active</Label>
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => updateForm({ ...form, is_active: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured" className="cursor-pointer">Featured Product</Label>
                <Switch
                  id="is_featured"
                  checked={form.is_featured}
                  onCheckedChange={(checked) => updateForm({ ...form, is_featured: checked })}
                />
              </div>

            {/* Parent Categories */}
            <div className="grid gap-2">
              <Label>Parent Categories</Label>
              <Select
                isMulti
                options={parentOptions}
                value={selectedParents}
                onChange={(selected) => {
                  setParentIds(selected.map((s) => s.value))
                }}
                placeholder="Select parent categories..."
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
