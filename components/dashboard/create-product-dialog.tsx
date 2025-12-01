"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Select from "react-select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addProduectstripe } from "@/lib/stripe"
// ---------------------------------------------------
// Professional Component — Written Like Senior Engineer
// ---------------------------------------------------
export function CreateProductDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "10",
    stripePriceId: "",
    imageFile: null as File | null,
    category_id: "" ,
  })
 
  const router = useRouter()
  const supabase = createClient();

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

  // Smart state updater
  const update = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // ---------------------------
  // Image Upload to Supabase
  // ---------------------------
const uploadImage = async () => {
  if (!form.imageFile) return null;


  const fileName = `product-${Date.now()}-${form.imageFile.name}`;

  // Upload to the correct bucket
  const { data, error } = await supabase.storage
    .from("product-images") // Correct bucket name
    .upload(fileName, form.imageFile);

  if (error) {
    toast.error("Image upload failed: " + error.message);
    return null;
  }

  // Get public URL of uploaded image
  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  if (!urlData || !urlData.publicUrl) {
    toast.error("Failed to get public URL");
    return null;
  }

  return urlData.publicUrl;
};


  // ---------------------------
  // Handle Submit
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
     
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
        
      // Upload image first
      // const uploadedImageUrl = await uploadImage()
      const uploadedImageUrl = "https://placehold.co/600x400/png"
      const { imageFile, ...formData } = form; // remove imageFile
       const stripeData =  addProduectstripe(formData);
      // const stripePriceId = await addProduectstripe(form)
      console.log(stripeData);
      
  if(!uploadedImageUrl) throw new Error("Image upload failed");
      // const { error } = await supabase.from("products").insert({
      //   title: form.title,
      //   description: form.description,
      //   price: Number(form.price),
      //   stock: Number(form.stock),
      //   stripe_price_id: stripePriceId || null,
      //   image_url: uploadedImageUrl,
      //   images: uploadedImageUrl ? [uploadedImageUrl] : [],
      //   created_by: user.id,
      //   category_id: form.category_id || null,
      // })
      const error = "some test error";

      if (error) throw error

      toast.success("Product created successfully")
      resetForm()
      setOpen(false)
      router.refresh()

    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------------------
  // Reset Form
  // ---------------------------
  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      stock: "10",
      stripePriceId: "",
      imageFile: null,
      category_id: "" ,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Add a new product to your catalog.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* Title */}
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => update("stock", e.target.value)}
                />
              </div>
            </div>

            {/* Stripe Price ID */}
            <div className="grid gap-2">
              <Label>Stripe Price ID</Label>
              <Input
                value={form.stripePriceId}
                onChange={(e) => update("stripePriceId", e.target.value)}
                placeholder="price_XXXX"
              />
            </div>
<div className="grid gap-2">
  <Label>Parent Category</Label>
  <Select
    options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
    value={
      form.category_id
        ? categories
            .filter((cat) => cat.id === form.category_id)
            .map((cat) => ({ value: cat.id, label: cat.name }))[0]
        : null // default empty selection
    }
    onChange={(selected) =>
      update("category_id", selected ? selected.value : "")
    }
    placeholder="Select a parent category (optional)"
    className="basic-single"
  />
</div>

            {/* File Upload */}
            <div className="grid gap-2">
              <Label>Product Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => update("imageFile", e.target.files?.[0] || null)}
                required
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
                "Create Product"
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
