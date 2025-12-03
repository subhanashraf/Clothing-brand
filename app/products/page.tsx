import React from "react"
import { createClient } from "@/lib/supabase/server"
import ProductCatalog from "@/components/products/Filters"
import type { Product, Category } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Grid } from "lucide-react"

export default async function ProductsPage() {
  const supabase = await createClient()

  // Fetch products with categories
  const { data: productsData } = await supabase
    .from("products")
    .select(`
      *,
      categories (*)
    `)
    .order("created_at", { ascending: false })

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })

  const products = (productsData ?? []) as Product[]
  const categories = (categoriesData ?? []) as Category[]

  // Calculate price range
  const prices = products.map(p => Number(p.price ?? 0)).filter(p => p > 0)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 1000

  // Get unique origin countries for filter
  const originCountries = Array.from(new Set(
    products
      .filter(p => p.origin_country)
      .map(p => p.origin_country)
      .filter(Boolean)
  )).sort()

  // Get MOQ range
  const moqValues = products.map(p => Number(p.moq ?? 0)).filter(m => m > 0)
  const minMOQ = moqValues.length ? Math.min(...moqValues) : 1
  const maxMOQ = moqValues.length ? Math.max(...moqValues) : 100

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-20">
          {/* Page Header */}
        

          {/* Single Combined Component */}
          <ProductCatalog
            initialProducts={products}
            initialCategories={categories}
            priceRange={{ min: minPrice, max: maxPrice }}
            moqRange={{ min: minMOQ, max: maxMOQ }}
            originCountries={originCountries}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}