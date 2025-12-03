"use client"

import { useState, useMemo } from "react"
import { 
  Grid, Filter, Search, Sliders, X, Globe, Package, 
  Truck, Star, ChevronDown, ChevronUp 
} from "lucide-react"
import ProductCard from "./ProductCard"
import type { Product, Category } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type ProductCatalogProps = {
  initialProducts: Product[]
  initialCategories: Category[]
  priceRange: { min: number; max: number }
  moqRange: { min: number; max: number }
  originCountries: string[]
}

type FiltersState = {
  categoryId: string | null
  originCountry: string | null
  minPrice: number
  maxPrice: number
  minMOQ: number
  maxMOQ: number
  inStockOnly: boolean
  featuredOnly: boolean
  wholesaleOnly: boolean
  hasImagesOnly: boolean
}

export default function ProductCatalog({ 
  initialProducts, 
  initialCategories,
  priceRange,
  moqRange,
  originCountries 
}: ProductCatalogProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter state - everything in one place
  const [filters, setFilters] = useState<FiltersState>({
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

  // Sort state
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "stock">("newest")

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.categoryId) count++
    if (filters.originCountry) count++
    if (filters.minPrice !== priceRange.min) count++
    if (filters.maxPrice !== priceRange.max) count++
    if (filters.minMOQ !== moqRange.min) count++
    if (filters.maxMOQ !== moqRange.max) count++
    if (filters.inStockOnly) count++
    if (filters.featuredOnly) count++
    if (filters.wholesaleOnly) count++
    if (filters.hasImagesOnly) count++
    return count
  }, [filters, priceRange, moqRange])

  // Apply filters to products
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
          typeof product.category === 'object' ? product.category?.name : ""
        ].filter(Boolean).join(" ").toLowerCase()
        
        if (!searchableText.includes(query)) return false
      }

      // 3. Category filter
      if (filters.categoryId && product.category_id !== filters.categoryId) return false

      // 4. Price range
      const price = Number(product.price ?? 0)
      if (price < filters.minPrice || price > filters.maxPrice) return false

      // 5. Origin country
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

  // Sort products
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

  // Update filter helper
  const updateFilter = (key: keyof FiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Reset all filters
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
    setSortBy("newest")
  }

  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products, SKU, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Toggle
              pressed={viewMode === "grid"}
              onPressedChange={() => setViewMode("grid")}
              aria-label="Grid view"
              size="sm"
            >
              <Grid className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={viewMode === "list"}
              onPressedChange={() => setViewMode("list")}
              aria-label="List view"
              size="sm"
            >
              <Filter className="h-4 w-4" />
            </Toggle>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg border bg-transparent text-sm min-w-[140px]"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock">Stock: High to Low</option>
          </select>

          {/* Filter Toggle Button (Mobile) */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFilters}
            className="md:hidden"
          >
            <Sliders className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Quick Filter Badges */}
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
          
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="ml-auto"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FiltersPanel 
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
              initialCategories={initialCategories}
              originCountries={originCountries}
              priceRange={priceRange}
              moqRange={moqRange}
            />
          </div>
        </aside>

        {/* Products Grid Area */}
        <section className="lg:col-span-3">
          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="mb-6 lg:hidden">
              <FiltersPanel 
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                activeFilterCount={activeFilterCount}
                initialCategories={initialCategories}
                originCountries={originCountries}
                priceRange={priceRange}
                moqRange={moqRange}
              />
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
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

          {/* Pagination Summary */}
          {sortedProducts.length > 0 && (
            <div className="text-center text-sm text-gray-500 pt-8 border-t mt-8">
              {sortedProducts.length} products match your criteria
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// Filters Panel Component (Internal)
interface FiltersPanelProps {
  filters: FiltersState
  updateFilter: (key: keyof FiltersState, value: any) => void
  resetFilters: () => void
  activeFilterCount: number
  initialCategories: Category[]
  originCountries: string[]
  priceRange: { min: number; max: number }
  moqRange: { min: number; max: number }
}

function FiltersPanel({
  filters,
  updateFilter,
  resetFilters,
  activeFilterCount,
  initialCategories,
  originCountries,
  priceRange,
  moqRange
}: FiltersPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    origin: true,
    moq: true,
    options: true
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Badge */}
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="w-full justify-center">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </Badge>
        )}

        {/* Category Filter */}
        <Collapsible
          open={expandedSections.category}
          onOpenChange={() => toggleSection('category')}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium cursor-pointer">Category</Label>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {expandedSections.category ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant={filters.categoryId === null ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => updateFilter("categoryId", null)}
              >
                All Categories
              </Button>
              {initialCategories.map(category => (
                <Button
                  key={category.id}
                  variant={filters.categoryId === category.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => updateFilter("categoryId", 
                    filters.categoryId === category.id ? null : category.id
                  )}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range Filter */}
        <Collapsible
          open={expandedSections.price}
          onOpenChange={() => toggleSection('price')}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium cursor-pointer">Price Range</Label>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {expandedSections.price ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
          <CollapsibleContent>
            <div className="space-y-4 pt-2">
              <Slider
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={([min, max]) => {
                  updateFilter("minPrice", min)
                  updateFilter("maxPrice", max)
                }}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <div className="glass px-3 py-1 rounded">
                  ${filters.minPrice.toFixed(2)}
                </div>
                <div className="text-gray-400">to</div>
                <div className="glass px-3 py-1 rounded">
                  ${filters.maxPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Country of Origin Filter */}
        {originCountries.length > 0 && (
          <Collapsible
            open={expandedSections.origin}
            onOpenChange={() => toggleSection('origin')}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Country of Origin
              </Label>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {expandedSections.origin ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </Button>
            </div>
            <CollapsibleContent>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant={filters.originCountry === null ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => updateFilter("originCountry", null)}
                >
                  All Countries
                </Button>
                {originCountries.map(country => (
                  <Button
                    key={country}
                    variant={filters.originCountry === country ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => updateFilter("originCountry", 
                      filters.originCountry === country ? null : country
                    )}
                  >
                    {country}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* MOQ Filter */}
        <Collapsible
          open={expandedSections.moq}
          onOpenChange={() => toggleSection('moq')}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium cursor-pointer flex items-center gap-2">
              <Package className="h-4 w-4" />
              Minimum Order Quantity (MOQ)
            </Label>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {expandedSections.moq ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
          <CollapsibleContent>
            <div className="space-y-4 pt-2">
              <Slider
                min={moqRange.min}
                max={moqRange.max}
                step={1}
                value={[filters.minMOQ, filters.maxMOQ]}
                onValueChange={([min, max]) => {
                  updateFilter("minMOQ", min)
                  updateFilter("maxMOQ", max)
                }}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <div className="glass px-3 py-1 rounded">
                  {filters.minMOQ} units
                </div>
                <div className="text-gray-400">to</div>
                <div className="glass px-3 py-1 rounded">
                  {filters.maxMOQ} units
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Checkbox Filters */}
        <Collapsible
          open={expandedSections.options}
          onOpenChange={() => toggleSection('options')}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium cursor-pointer">Options</Label>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {expandedSections.options ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
          <CollapsibleContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStockOnly"
                  checked={filters.inStockOnly}
                  onCheckedChange={(checked) => 
                    updateFilter("inStockOnly", checked)
                  }
                />
                <Label htmlFor="inStockOnly" className="text-sm cursor-pointer">
                  In Stock Only
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featuredOnly"
                  checked={filters.featuredOnly}
                  onCheckedChange={(checked) => 
                    updateFilter("featuredOnly", checked)
                  }
                />
                <Label htmlFor="featuredOnly" className="text-sm cursor-pointer">
                  Featured Products Only
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wholesaleOnly"
                  checked={filters.wholesaleOnly}
                  onCheckedChange={(checked) => 
                    updateFilter("wholesaleOnly", checked)
                  }
                />
                <Label htmlFor="wholesaleOnly" className="text-sm cursor-pointer">
                  Wholesale Available
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasImagesOnly"
                  checked={filters.hasImagesOnly}
                  onCheckedChange={(checked) => 
                    updateFilter("hasImagesOnly", checked)
                  }
                />
                <Label htmlFor="hasImagesOnly" className="text-sm cursor-pointer">
                  With Images Only
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Filter Summary */}
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">Active Filters:</p>
          <div className="space-y-1">
            <p>Price: ${filters.minPrice} - ${filters.maxPrice}</p>
            <p>MOQ: {filters.minMOQ} - {filters.maxMOQ} units</p>
            {filters.categoryId && (
              <p>Category: {initialCategories.find(c => c.id === filters.categoryId)?.name}</p>
            )}
            {filters.originCountry && (
              <p>Origin: {filters.originCountry}</p>
            )}
            {filters.inStockOnly && <p>✓ In Stock Only</p>}
            {filters.featuredOnly && <p>✓ Featured Only</p>}
            {filters.wholesaleOnly && <p>✓ Wholesale Available</p>}
            {filters.hasImagesOnly && <p>✓ With Images Only</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}