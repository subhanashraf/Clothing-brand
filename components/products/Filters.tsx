// components/product/Filters.tsx
"use client";
import React, { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  defaultMin: number;
  defaultMax: number;
  onChange?: (filters: FiltersState) => void;
};

export type FiltersState = {
  categoryId: string | null;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  featuredOnly: boolean;
};

export default function Filters({ categories, defaultMin, defaultMax, onChange }: Props) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number>(defaultMin);
  const [maxPrice, setMaxPrice] = useState<number>(defaultMax);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  // notify parent about filter changes
  useEffect(() => {
    const filters: FiltersState = { categoryId, minPrice, maxPrice, inStockOnly, featuredOnly };
    onChange?.(filters);
  }, [categoryId, minPrice, maxPrice, inStockOnly, featuredOnly, onChange]);

  // Dual-range slider helpers — we use two range inputs overlaid
  const handleMinRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setMinPrice(Math.min(v, maxPrice));
  };
  const handleMaxRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setMaxPrice(Math.max(v, minPrice));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 glass rounded-lg">
        <h3 className="text-sm font-medium mb-3">Category</h3>
        <select
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(e.target.value || null)}
          className="w-full rounded-md border px-3 py-2 bg-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 glass rounded-lg">
        <h3 className="text-sm font-medium mb-3">Price</h3>

        <div className="mb-2 text-xs text-muted-foreground">
          {minPrice} — {maxPrice}
        </div>

        {/* visual dual-range: two range inputs */}
        <div className="relative h-8 w-full">
          <input
            type="range"
            min={defaultMin}
            max={defaultMax}
            value={minPrice}
            onChange={handleMinRange}
            className="absolute inset-0 pointer-events-auto w-full h-2 appearance-none"
          />
          <input
            type="range"
            min={defaultMin}
            max={defaultMax}
            value={maxPrice}
            onChange={handleMaxRange}
            className="absolute inset-0 pointer-events-auto w-full h-2 appearance-none"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value || defaultMin))}
            className="w-1/2 rounded-md border px-2 py-1 bg-transparent"
            min={defaultMin}
            max={defaultMax}
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value || defaultMax))}
            className="w-1/2 rounded-md border px-2 py-1 bg-transparent"
            min={defaultMin}
            max={defaultMax}
          />
        </div>
      </div>

      <div className="p-4 glass rounded-lg space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-sm">In stock only</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => setFeaturedOnly(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
          <span className="text-sm">Featured only</span>
        </label>
      </div>
    </div>
  );
}
