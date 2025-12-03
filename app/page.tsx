import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

import { ProductsSection } from "@/components/home/products-section"
import { AboutSection } from "@/components/home/about-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { createClient } from "@/lib/supabase/server"
// Create separate async components for better streaming
async function ProductsData() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(8)
  return products || []
}

async function CategoriesData() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("name")
  return categories || []
}

export default async function HomePage() {
  // Fetch critical data first
  const [products, categories] = await Promise.allSettled([
    ProductsData(),
    CategoriesData()
  ])

  const productsData = products.status === 'fulfilled' ? products.value : []
  const categoriesData = categories.status === 'fulfilled' ? categories.value : []

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Priority 1: Above the fold - Hero (immediate) */}
      <section className="priority-1">
        <Suspense fallback={<div className="h-[650px] bg-muted animate-pulse" />}>
          {/* <ClientSections componenet={"Hero"} /> */}
         {await HeroSection()}
        </Suspense>
      </section>

      {/* Priority 2: Categories (delayed by 300ms) */}
      <section className="priority-2 mt-8">
        <Suspense fallback={<CategoriesSkeleton />}>
          <DelayedRender delay={500}>
           
            <CategoriesSection categories={categoriesData} />
          </DelayedRender>
        </Suspense>
      </section>

      {/* Priority 3: Products (delayed by 600ms) */}
      <section className="priority-3 mt-12">
        <Suspense fallback={<ProductsSkeleton />}>
          <DelayedRender delay={800}>
           
            <ProductsSection 
              products={productsData} 
              categories={categoriesData} 
            />
          </DelayedRender>
        </Suspense>
      </section>

      {/* Priority 4: FAQ (delayed by 900ms) */}
      <section className="priority-4 mt-12">
        <Suspense fallback={<div className="h-64 bg-muted animate-pulse" />}>
          <DelayedRender delay={1000}>
          
        {await FaqSection() }
          </DelayedRender>
        </Suspense>
      </section>

      {/* Priority 5: About (delayed by 1200ms) */}
      <section className="priority-5 mt-12">
        <Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
          <DelayedRender delay={1400}>
        
            <AboutSection />
          </DelayedRender>
        </Suspense>
      </section>

      <Footer />
    </main>
  )
}

// ================== HELPER COMPONENTS ==================

// Delayed Render Wrapper
function DelayedRender({ 
  children, 
  delay = 0 
}: { 
  children: React.ReactNode
  delay?: number 
}) {
  if (typeof window === 'undefined') {
    return <>{children}</>
  }
  
  return (
    <div className="delayed-content" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// Skeleton Components
function CategoriesSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="h-8 w-48 bg-muted rounded mb-6 animate-pulse"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 bg-muted rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}

function ProductsSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="h-8 w-48 bg-muted rounded mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Create separate component files for each section
async function HeroSection() {
  const Hero = (await import("@/components/home/hero-section")).default
  return <Hero />
}

async function FaqSection() {
  const FAQSection = (await import("@/components/home/FAQSection")).default
  return <FAQSection />
  
}