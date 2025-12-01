// components/product/ProductGrid.tsx
"use client";
import React, { useMemo, useState } from "react";
import type { Product, Category } from "@/lib/types";
import ProductCard from "./ProductCard";
import Filters, { FiltersState } from "./Filters";

type Props = {
  initialProducts: Product[];
  initialCategories: Category[];
};

export default function ProductGrid({ initialProducts, initialCategories }: Props) {
  const [filters, setFilters] = useState<FiltersState>({
    categoryId: null,
    minPrice: 0,
    maxPrice: 999999,
    inStockOnly: false,
    featuredOnly: false,
  });

  // set price bounds once initialCategories provided (we'll derive from products)
  React.useEffect(() => {
    const prices = initialProducts.map((p) => Number(p.price ?? 0));
    const minP = prices.length ? Math.min(...prices) : 0;
    const maxP = prices.length ? Math.max(...prices) : 999999;
    setFilters((f) => ({ ...f, minPrice: minP, maxPrice: maxP }));
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // active
      if (p.is_active === false) return false;

      // category
      if (filters.categoryId && p.category_id !== filters.categoryId) return false;

      // price range
      const price = Number(p.price ?? 0);
      if (price < filters.minPrice || price > filters.maxPrice) return false;

      // stock
      if (filters.inStockOnly && (typeof p.stock !== "number" || p.stock <= 0)) return false;

      // featured
      if (filters.featuredOnly && !p.is_featured) return false;

      return true;
    });
  }, [initialProducts, filters]);

  return (
    <div className="space-y-6">
      {/* Re-render Filters here so it's in sync with grid (keeps flexible) */}
      <div className="block lg:hidden">
        <Filters
          categories={initialCategories}
          defaultMin={Math.min(...initialProducts.map((p) => Number(p.price ?? 0), 0) || [0])}
          defaultMax={Math.max(...initialProducts.map((p) => Number(p.price ?? 0), 1) || [100])}
          onChange={(f) => setFilters(f)}
        />
      </div>

      <div>
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products available yet.</p>
            <p className="text-sm text-muted-foreground">Products will appear here once added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {initialProducts.length} products
      </div>
    </div>
  );
}
