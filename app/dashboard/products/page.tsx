import { createClient } from "@/lib/supabase/server"
import { ProductsTable } from "@/components/dashboard/products-table"
import { CategoriesTable } from "@/components/dashboard/CategoriesTable"
import { CreateProductDialog } from "@/components/dashboard/create-product-dialog"
import { CreateCategoriesDialog } from "@/components/dashboard/CreateCategoriesDialog"

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  const products = productsData || []
  const categories = categoriesData || []

  // 🔥 Merge category name into product object
  const productsWithCategoryName = products.map((product) => {
    const category = categories.find((c) => c.id === product.category_id)
    return {
      ...product,
      category_name: category ? category.name : "No Category",
    }
  })


  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
    <CreateProductDialog />
        <CreateCategoriesDialog />
        </div>
        
      </div>

      <ProductsTable products={productsWithCategoryName || []} categories={categories || []}  />
      <CategoriesTable categories={categories || []} />
    </div>
  )
}
