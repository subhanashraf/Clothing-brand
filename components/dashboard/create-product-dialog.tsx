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
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addProductStripe } from "@/app/api/action"

type FormData = {
  // Required fields
  title: string
  description: string
  price: string
  
  // Optional fields
  compare_price: string
  currency: string
  category_id: string
  sku: string
  stock: string
  moq: string
  wholesale_price: string
  carton_qty: string
  carton_weight: string
  carton_dimensions: string
  origin_country: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  
  // Boolean fields
  is_featured: boolean
  is_active: boolean
  
  // File/image fields
  imageFile: File | null
  additionalImages: FileList | null
  
  // Stripe fields (will be populated by API)
  stripe_price_id: string
  stripe_product_id: string
}

export function CreateProductDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState("")

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    compare_price: "",
    currency: "USD",
    category_id: "",
    sku: "",
    stock: "10",
    moq: "1",
    wholesale_price: "",
    carton_qty: "",
    carton_weight: "",
    carton_dimensions: "",
    origin_country: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    is_featured: false,
    is_active: true,
    imageFile: null,
    additionalImages: null,
    stripe_price_id: "",
    stripe_product_id: "",
  })

  const router = useRouter()
  const supabase = createClient()

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

  const updateForm = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleNumberInput = (key: keyof FormData, value: string) => {
    // Allow empty string or valid numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      updateForm(key, value)
    }
  }

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      const newKeywords = [...keywords, currentKeyword.trim()]
      setKeywords(newKeywords)
      updateForm("seo_keywords", JSON.stringify(newKeywords))
      setCurrentKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const newKeywords = keywords.filter(k => k !== keywordToRemove)
    setKeywords(newKeywords)
    updateForm("seo_keywords", JSON.stringify(newKeywords))
  }

  // ---------------------------
  // Image Upload
  // ---------------------------
  const uploadImages = async () => {
    const uploadedUrls: string[] = []
    
    // Upload main image
    if (form.imageFile) {
      const mainImageUrl = await uploadSingleImage(form.imageFile)
      if (mainImageUrl) uploadedUrls.push(mainImageUrl)
    }

    // Upload additional images
    if (form.additionalImages) {
      for (let i = 0; i < form.additionalImages.length; i++) {
        const file = form.additionalImages[i]
        const url = await uploadSingleImage(file)
        if (url) uploadedUrls.push(url)
      }
    }

    return uploadedUrls
  }

  const uploadSingleImage = async (file: File) => {
    const fileName = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file)

    if (error) {
      toast.error(`Image upload failed: ${error.message}`)
      return null
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName)

    return urlData?.publicUrl || null
  }

  // ---------------------------
  // Handle Submit
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Upload all images
      const imageUrls = await uploadImages()
      if (imageUrls.length === 0) {
        toast.warning("No images were uploaded. Please add at least one product image.")
      }

      // Call Stripe API
      const stripeData = await addProductStripe({
        name: form.title,
        description: form.description,
        price: form.price,
        image: imageUrls[0] || null
      })

      if (!stripeData) {
        throw new Error("Stripe product creation failed")
      }

      // Prepare database payload
      const productData = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        currency: form.currency || null,
        category_id: form.category_id || null,
        image_url: imageUrls[0] || null,
        images: imageUrls,
        sku: form.sku || null,
        stock: form.stock ? Number(form.stock) : null,
        moq: form.moq ? Number(form.moq) : null,
        wholesale_price: form.wholesale_price ? Number(form.wholesale_price) : null,
        carton_qty: form.carton_qty ? Number(form.carton_qty) : null,
        carton_weight: form.carton_weight ? Number(form.carton_weight) : null,
        carton_dimensions: form.carton_dimensions || null,
        origin_country: form.origin_country || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        seo_keywords: keywords.length > 0 ? keywords : null,
        is_featured: form.is_featured,
        is_active: form.is_active,
        stripe_price_id: stripeData.stripe_price_id || null,
        stripe_product_id: stripeData.stripe_product_id || null,
        created_by: user.id,
      }

      // Insert into database
      const { error } = await supabase.from("products").insert(productData)

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
      compare_price: "",
      currency: "USD",
      category_id: "",
      sku: "",
      stock: "10",
      moq: "1",
      wholesale_price: "",
      carton_qty: "",
      carton_weight: "",
      carton_dimensions: "",
      origin_country: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      is_featured: false,
      is_active: true,
      imageFile: null,
      additionalImages: null,
      stripe_price_id: "",
      stripe_product_id: "",
    })
    setKeywords([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Add a new product to your catalog.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Basic Information Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  required
                  placeholder="Product name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={3}
                  required
                  placeholder="Product description"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => updateForm("sku", e.target.value)}
                  placeholder="Product SKU"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Pricing</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => updateForm("price", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="compare_price">Compare Price</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.compare_price}
                    onChange={(e) => updateForm("compare_price", e.target.value)}
                    placeholder="Original price"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="wholesale_price">Wholesale Price</Label>
                <Input
                  id="wholesale_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.wholesale_price}
                  onChange={(e) => updateForm("wholesale_price", e.target.value)}
                  placeholder="Bulk price"
                />
              </div>
            </div>

            {/* Inventory Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Inventory</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => updateForm("stock", e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
                  <Input
                    id="moq"
                    type="number"
                    min="1"
                    value={form.moq}
                    onChange={(e) => updateForm("moq", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Shipping & Packaging */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Shipping & Packaging</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="carton_qty">Carton Quantity</Label>
                  <Input
                    id="carton_qty"
                    type="number"
                    min="1"
                    value={form.carton_qty}
                    onChange={(e) => updateForm("carton_qty", e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="carton_weight">Carton Weight (kg)</Label>
                  <Input
                    id="carton_weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.carton_weight}
                    onChange={(e) => updateForm("carton_weight", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="carton_dimensions">Carton Dimensions (LxWxH)</Label>
                <Input
                  id="carton_dimensions"
                  value={form.carton_dimensions}
                  onChange={(e) => updateForm("carton_dimensions", e.target.value)}
                  placeholder="e.g., 30x20x15"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="origin_country">Country of Origin</Label>
                <Input
                  id="origin_country"
                  value={form.origin_country}
                  onChange={(e) => updateForm("origin_country", e.target.value)}
                  placeholder="e.g., China, USA"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Category</h3>
              
              <div className="grid gap-2">
                <Label>Parent Category</Label>
                <Select
                  options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                  value={
                    form.category_id
                      ? categories
                          .filter((cat) => cat.id === form.category_id)
                          .map((cat) => ({ value: cat.id, label: cat.name }))[0]
                      : null
                  }
                  onChange={(selected) =>
                    updateForm("category_id", selected ? selected.value : "")
                  }
                  placeholder="Select a category (optional)"
                  className="basic-single"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Product Images</h3>
              
              <div className="grid gap-2">
                <Label>Main Image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateForm("imageFile", e.target.files?.[0] || null)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Additional Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => updateForm("additionalImages", e.target.files)}
                />
                <p className="text-xs text-gray-500">You can select multiple images</p>
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={form.seo_title}
                  onChange={(e) => updateForm("seo_title", e.target.value)}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="seo_description">SEO Description</Label>
                <Textarea
                  id="seo_description"
                  value={form.seo_description}
                  onChange={(e) => updateForm("seo_description", e.target.value)}
                  rows={2}
                  placeholder="SEO description for search engines"
                />
              </div>

              <div className="grid gap-2">
                <Label>SEO Keywords</Label>
                <div className="flex gap-2">
                  <Input
                    value={currentKeyword}
                    onChange={(e) => setCurrentKeyword(e.target.value)}
                    placeholder="Add a keyword"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    Add
                  </Button>
                </div>
                
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keywords.map((keyword) => (
                      <div
                        key={keyword}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status & Features */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Status & Features</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active" className="cursor-pointer">Product Active</Label>
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => updateForm("is_active", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured" className="cursor-pointer">Featured Product</Label>
                <Switch
                  id="is_featured"
                  checked={form.is_featured}
                  onCheckedChange={(checked) => updateForm("is_featured", checked)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
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