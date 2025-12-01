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
  const [parentIds, setParentIds] = useState<string[]>([])
  const router = useRouter()
  

  useEffect(() => {
    if (category) {
      setName(category.name)
      setSlug(category.slug)
      setParentIds(category.parent_ids || [])
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
          name,
          slug,
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
  .filter((c) => c.id !== category?.id) // prevent self-selection
  .map((c) => ({ value: c.id, label: c.name }))

// Map selected IDs to react-select format
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
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>

            {/* Slug */}
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="category-slug"
                required
              />
            </div>

            {/* Parent Categories Multi-Select */}
           <div className="grid gap-2">
  <Label htmlFor="edit-parent-ids">Parent Categories</Label>
  <Select
    id="edit-parent-ids"
    isMulti
    options={parentOptions}
    value={selectedParents}
    onChange={(selected) => {
      setParentIds(selected.map((s) => s.value))
    }}
    placeholder="Select parent categories..."
  />
  <p className="text-xs text-muted-foreground">
    Select one or more parent categories.
  </p>
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
