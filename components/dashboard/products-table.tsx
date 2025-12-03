"use client"

import { useState, useMemo } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  
  Package,
  Tag,
  
  Star
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product, Category } from "@/lib/types"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"
import { cn } from "@/lib/utils"

interface ProductsTableProps {
  products: Product[]
  categories: Category[]
}

// 🔧 Format currency - Don't repeat this in render
const formatCurrency = (amount: number, currency = "USD") => 
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(amount)

// 📅 Format date once
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric", 
    year: "numeric" 
  })
}

// 🏷️ Get category badge color
const getCategoryColor = (categoryName?: string) => {
  if (!categoryName) return "secondary"
  
  const colors: Record<string, string> = {
    electronics: "blue",
    clothing: "purple",
    furniture: "green",
    books: "orange",
    food: "red"
  }
  
  const key = categoryName.toLowerCase()
  return colors[key] || "secondary"
}

// 📦 Product status indicator
const StockIndicator = ({ stock }: { stock?: number }) => {
  if (stock === undefined || stock === null) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        No Stock
      </Badge>
    )
  }
  
  if (stock === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>
  }
  
  if (stock < 10) {
    return <Badge variant="secondary">Low Stock</Badge>
  }
  
  return <Badge variant="default">In Stock</Badge>
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
  // 🎯 State management
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // 🎨 Memoized calculations
  const hasProducts = useMemo(() => products.length > 0, [products])
  const activeProducts = useMemo(() => 
    products.filter(p => p.is_active !== false).length, 
    [products]
  )

  // 🖼️ Product image component
  const ProductImage = ({ product }: { product: Product }) => {
    if (!product.image_url) {
      return (
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
          <Package className="h-5 w-5 text-muted-foreground" />
        </div>
      )
    }

    return (
      <div className="h-10 w-10 rounded-lg overflow-hidden relative bg-muted">
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>
    )
  }

  // 🔗 Stripe ID display
  const StripeBadge = ({ id }: { id?: string }) => {
    if (!id) {
      return <Badge variant="outline" className="text-xs">Not Synced</Badge>
    }
    
    const shortId = id.substring(id.lastIndexOf('_') + 1, id.lastIndexOf('_') + 9)
    return (
      <Badge 
        variant="secondary" 
        className="font-mono text-xs cursor-help"
        title={id}
      >
        {shortId}...
      </Badge>
    )
  }

  // 🎪 Empty state
  if (!hasProducts) {
    return (
      <Card className="p-8 text-center border-dashed">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products yet</h3>
        <p className="text-muted-foreground mb-4">Create your first product to get started</p>
      </Card>
    )
  }

  return (
    <>
      {/* 📊 Stats header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {products.length} products • {activeProducts} active
          </span>
        </div>
      </div>

      {/* 📋 Main table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden lg:table-cell">Stock</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Stripe</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="group hover:bg-muted/50">
                {/* 🎯 Product Info */}
                <TableCell>
                  <div className="flex items-start gap-3">
                    <ProductImage product={product} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{product.title}</p>
                        {product.is_featured && (
                          <Badge variant="default"  className="bg-amber-500">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.description || "No description"}
                      </p>
                      {product.sku && (
                        <div className="flex items-center gap-1 mt-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <code className="text-xs text-muted-foreground">{product.sku}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* 💰 Price */}
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{formatCurrency(product.price)}</span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.compare_price)}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* 📦 Stock */}
                <TableCell className="hidden lg:table-cell">
                  <StockIndicator stock={product.stock} />
                  {product.stock !== undefined && product.stock !== null && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.stock} units
                    </span>
                  )}
                </TableCell>

                {/* 🏷️ Category */}
                <TableCell className="hidden md:table-cell">
                  {product.category_name ? (
                    <Badge variant="outline" className={cn(getCategoryColor(product.category_name))}>
                      {product.category_name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* 🔗 Stripe */}
                <TableCell className="hidden lg:table-cell">
                  <StripeBadge id={product.stripe_price_id ? product.stripe_price_id : " "} />
                </TableCell>

                {/* 📅 Date */}
                <TableCell className="hidden sm:table-cell">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(product.created_at)}
                  </div>
                </TableCell>

                {/* ⚡ Actions */}
                <TableCell>
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => setEditingProduct(product)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                     
                        
                        <DropdownMenuItem 
                          onClick={() => setDeletingProduct(product)}
                          className="text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* 🎭 Dialogs */}
      <EditProductDialog
        categories={categories}
        product={editingProduct}
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      />

      <DeleteProductDialog
        product={deletingProduct}
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      />
    </>
  )
}