// app/product/page.tsx
import React from "react";
import { createClient } from "@/lib/supabase/server";
import Filters from "@/components/products/Filters";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product, Category } from "@/lib/types";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type Props = {};

export default async function Page(props: Props) {
  const supabase = await createClient();

  // fetch products and categories server-side
  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  // normalize to arrays (avoid undefined)
  const products = (productsData ?? []) as Product[];
  const categories = (categoriesData ?? []) as Category[];

  // compute min/max price for slider defaults
  const prices = products.map((p) => Number(p.price ?? 0));
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 100;

  // pass data to client components as props
  return (
    <>
    <Navbar/>
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters column */}
        <aside className="lg:col-span-1">
          <Filters
            categories={categories}
            defaultMin={minPrice}
            defaultMax={maxPrice}
          />
        </aside>

        {/* Product grid */}
        <section className="lg:col-span-3">
          <ProductGrid initialProducts={products} initialCategories={categories} />
        </section>
      </div>
    </main>
    <Footer/>
            </>
  );
}
