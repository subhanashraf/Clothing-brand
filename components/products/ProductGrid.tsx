"use client"

import { useState, useMemo } from "react"
import { Grid, Filter, Search } from "lucide-react"
import ProductCard from "./ProductCard"
import type { Product, Category } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

type ProductGridProps = {
  initialProducts: Product[]
  initialCategories: Category[]
  originCountries: string[]
}

export default function ProductGrid({ 
  initialProducts, 
  initialCategories,
  originCountries 
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Filters state (moved from separate component for simplicity)
  const [filters, setFilters] = useState({
    categoryId: null as string | null,
    originCountry: null as string | null,
    minPrice: 0,
    maxPrice: 9999,
    minMOQ: 1,
    maxMOQ: 100,
    inStockOnly: false,
    featuredOnly: false,
    wholesaleOnly: false,
    hasImagesOnly: false,
  })

  // Calculate min/max from products
  const priceRange = useMemo(() => {
    const prices = initialProducts.map(p => Number(p.price ?? 0))
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 1000
    }
  }, [initialProducts])

  const moqRange = useMemo(() => {
    const moqs = initialProducts.map(p => Number(p.moq ?? 1))
    return {
      min: moqs.length ? Math.min(...moqs) : 1,
      max: moqs.length ? Math.max(...moqs) : 100
    }
  }, [initialProducts])

  // Apply all filters
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // 1. Active status
      if (product.is_active === false) return false

      // 2. Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = [
          product.title,
          product.description,
          product.sku,
          product.seo_title,
          product.seo_description,
          product.origin_country,
          product.category?.name
        ].filter(Boolean).join(" ").toLowerCase()
        
        if (!searchableText.includes(query)) return false
      }

      // 3. Category filter
      if (filters.categoryId && product.category_id !== filters.categoryId) return false

      // 4. Price range filter
      const price = Number(product.price ?? 0)
      if (price < filters.minPrice || price > filters.maxPrice) return false

      // 5. Origin country filter
      if (filters.originCountry && product.origin_country !== filters.originCountry) return false

      // 6. MOQ filter
      const moq = Number(product.moq ?? 1)
      if (moq < filters.minMOQ || moq > filters.maxMOQ) return false

      // 7. Stock filter
      if (filters.inStockOnly && (typeof product.stock !== "number" || product.stock <= 0)) return false

      // 8. Featured filter
      if (filters.featuredOnly && !product.is_featured) return false

      // 9. Wholesale filter
      if (filters.wholesaleOnly && (!product.wholesale_price || Number(product.wholesale_price) <= 0)) return false

      // 10. Images filter
      if (filters.hasImagesOnly && !product.image_url && (!product.images || product.images.length === 0)) return false

      return true
    })
  }, [initialProducts, searchQuery, filters])

  // Sort options
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "stock">("newest")
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      case "price-low":
        return sorted.sort((a, b) => Number(a.price) - Number(b.price))
      case "price-high":
        return sorted.sort((a, b) => Number(b.price) - Number(a.price))
      case "stock":
        return sorted.sort((a, b) => (b.stock || 0) - (a.stock || 0))
      default:
        return sorted
    }
  }, [filteredProducts, sortBy])

  // Update filters when ranges change
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      categoryId: null,
      originCountry: null,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minMOQ: moqRange.min,
      maxMOQ: moqRange.max,
      inStockOnly: false,
      featuredOnly: false,
      wholesaleOnly: false,
      hasImagesOnly: false,
    })
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls Bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, SKU, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Toggle
              pressed={viewMode === "grid"}
              onPressedChange={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => setViewMode("list")}
              aria-label="List view"
            >
              <Filter className="h-4 w-4" />
            </Toggle>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg border bg-transparent text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Stock: High to Low</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge 
            variant={filters.inStockOnly ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter("inStockOnly", !filters.inStockOnly)}
          >
            In Stock
          </Badge>
          <Badge 
            variant={filters.featuredOnly ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter("featuredOnly", !filters.featuredOnly)}
          >
            Featured
          </Badge>
          <Badge 
            variant={filters.wholesaleOnly ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter("wholesaleOnly", !filters.wholesaleOnly)}
          >
            Wholesale
          </Badge>
          <Badge 
            variant={filters.hasImagesOnly ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => updateFilter("hasImagesOnly", !filters.hasImagesOnly)}
          >
            With Images
          </Badge>
          
          {(searchQuery || Object.values(filters).some(f => 
            f !== null && f !== false && 
            (typeof f === 'number' ? (
              (filters.minPrice !== priceRange.min) ||
              (filters.maxPrice !== priceRange.max) ||
              (filters.minMOQ !== moqRange.min) ||
              (filters.maxMOQ !== moqRange.max)
            ) : true)
          )) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="ml-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{sortedProducts.length}</span> of{" "}
          <span className="font-semibold">{initialProducts.length}</span> products
        </div>
        {searchQuery && (
          <div className="text-sm text-gray-600">
            Search results for: <span className="font-semibold">"{searchQuery}"</span>
          </div>
        )}
      </div>

  {/* ... other code ... */}

{/* Products Grid/List */}
{sortedProducts.length === 0 ? (
  <div className="glass rounded-xl p-12 text-center">
    <div className="max-w-md mx-auto">
      <Filter className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">No products found</h3>
      <p className="text-gray-600 mb-6">
        Try adjusting your filters or search term
      </p>
      <Button onClick={resetFilters}>
        Reset All Filters
      </Button>
    </div>
  </div>
) : (
  <div className={cn(
    "gap-6",
    viewMode === "grid" 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
      : "space-y-4"
  )}>
    {sortedProducts.map(product => (
      <ProductCard 
        key={product.id} 
        product={product} 
        viewMode={viewMode}
      />
    ))}
  </div>
)}

{/* ... rest of the code ... */}

      {/* Pagination Summary */}
      {sortedProducts.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          {sortedProducts.length} products match your criteria
        </div>
      )}
    </div>
  )
}