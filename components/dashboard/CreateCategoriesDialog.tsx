"use client"

import { useState, useEffect } from "react"
import Select from "react-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
}

export function CreateCategoriesDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const [form, setForm] = useState({
    name: "",
    slug: "",
      parent_ids: [] as string[],
  })

  const router = useRouter()
  const supabase = createClient()

  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // ---------------------------
  // Fetch existing categories for multi-select
  // ---------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("id, name")
      if (error) {
        toast.error("Failed to load categories: " + error.message)
      } else {
        setCategories(data || [])
      }
    }
    fetchCategories()
  }, [])

  // ---------------------------
  // Image Upload
  // ---------------------------


  // ---------------------------
  // Handle Submit
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
     

      const { error } = await supabase.from("categories").insert({
        name: form.name,
  
        slug: form.slug,
   
      parent_ids: form.parent_ids.length > 0 ? form.parent_ids : null
      })

      if (error) throw error

      toast.success("Category created successfully")
      resetForm()
      setOpen(false)
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create category")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setForm({
      name: "",
     
      slug: "",
    
      parent_ids: [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new category to your catalog.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* Name */}
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

        

            {/* Slug */}
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                required
              />
            </div>

            {/* Parent Categories Multi-Select */}
<div className="grid gap-2">
  <Label>Parent Categories</Label>
  <Select
    isMulti
    options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
    value={
      form.parent_ids && form.parent_ids.length > 0
        ? categories
            .filter((cat) => form.parent_ids.includes(cat.id))
            .map((cat) => ({ value: cat.id, label: cat.name }))
        : [] // <-- default empty selection
    }
    onChange={(selected) =>
      update(
        "parent_ids",
        selected && selected.length > 0
          ? selected.map((s) => s.value)
          : [] // <-- if nothing selected, set empty array
      )
    }
    placeholder="Select parent categories (optional)"
    className="basic-multi-select"
  />
</div>

           
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
