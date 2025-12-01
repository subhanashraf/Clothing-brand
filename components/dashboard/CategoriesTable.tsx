"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Category } from "@/lib/types"
import { EditCategoryDialog } from "./edit-category-dialog"
import { DeleteCategoryDialog } from "./delete-category-dialog"

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)

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
        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              No categories yet. Create your first category to get started.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent Categories</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <p className="font-medium text-foreground truncate">{cat.name}</p>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{cat.slug}</code>
                  </TableCell>
                 <TableCell>
  {cat.parent_ids && cat.parent_ids.length > 0 ? (
    cat.parent_ids.map((id) => {
      const parent = categories.find((c) => c.id === id)
      return (
        <span
          key={id}
          className="inline-block bg-muted px-2 py-1 rounded mr-1 text-xs"
        >
          {parent ? parent.name : "Unknown"}
        </span>
      )
    })
  ) : (
    "-"
  )}
</TableCell>

                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDate(cat.created_at)}
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
                        <DropdownMenuItem onClick={() => setEditCategory(cat)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteCategory(cat)}
                        >
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

       <EditCategoryDialog
  category={editCategory}
  categories={categories} // don't forget to pass all categories
  open={!!editCategory}
  onOpenChange={(open) => {
    if (!open) setEditCategory(null)
  }}
/>


      <DeleteCategoryDialog
        category={deleteCategory}
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
      /> 
    </>
  )
}
