import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { ProductsSection } from "@/components/home/products-section"
import { AboutSection } from "@/components/home/about-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch products with categories
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategoriesSection categories={categories || []} />
      <ProductsSection products={products || []} categories={categories || []} />
      <AboutSection />
      <Footer />
    </main>
  )
}
