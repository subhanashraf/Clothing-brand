// components/product/ProductCard.tsx
"use client";
import React from "react";
import type { Product } from "@/lib/types";
// optional: if you have a cart context, import it
// import { useCart } from "@/lib/cart/context";

type Props = {
  product: Product;
};

function formatPrice(price?: number, currency?: string) {
  try {
    const locale = "en-US";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(Number(price ?? 0));
  } catch {
    return `${currency ?? "$"}${price}`;
  }
}

export default function ProductCard({ product }: Props) {
  // const { addItem } = useCart() // uncomment if you have this hook on client
  const image =
    product.image_url ||
    (product.images && product.images.length ? product.images[0] : null) ||
    `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(product.title)}`;

  const handleAddToCart = async () => {
    try {
      // if you have useCart, call addItem(product.id)
      // await addItem(product.id);
      // fallback UX:
      alert("Added to cart: " + (product.title || product.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group glass rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Product image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-2">
          {product.is_featured && (
            <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md">
              Featured
            </span>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <span className="px-2 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-md">
              {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Quick actions (simple) */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddToCart}
            className="rounded-full h-10 w-10 flex items-center justify-center bg-secondary text-secondary-foreground"
            title="Add to cart"
          >
            🛍
          </button>
          <a
            href={`/detail/${product.id}`}
            className="rounded-full h-10 w-10 flex items-center justify-center bg-secondary text-secondary-foreground"
            title="View"
          >
            👁
          </a>
          <button className="rounded-full h-10 w-10 flex items-center justify-center bg-secondary text-secondary-foreground" title="Wishlist">
            ❤️
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">
          {product.category?.name ?? "Uncategorized"}
        </p>
        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price, product.currency)}</span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_price, product.currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
