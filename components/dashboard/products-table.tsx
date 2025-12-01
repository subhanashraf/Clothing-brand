"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Product,Category  } from "@/lib/types"
import { EditProductDialog } from "./edit-product-dialog"
import { DeleteProductDialog } from "./delete-product-dialog"

interface ProductsTableProps {
  products: Product[]
  categories: Category[]
}

export function  ProductsTable({ products, categories }: ProductsTableProps) {
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <Card className="glass overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No products yet. Create your first product to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Stripe Price ID</TableHead>
                <TableHead className="hidden md:table-cell">categories</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        {product.image_url ? (
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{product.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {product.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{product.stripe_price_id || "Not set"}</code>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{product.category_name || "Not Category"}</code>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(product.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditProduct(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteProduct(product)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <EditProductDialog
      categories={categories || []}
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
      />

      <DeleteProductDialog
        product={deleteProduct}
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
      />
    </>
  )
}
