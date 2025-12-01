import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import Image from "next/image";
import Link from "next/link"

interface CheckoutPageProps {
  params: Promise<{ productId: string }>
}

function pickLocalized(product: any, field = "title", langPref?: string) {
  // simple language fallback: try preferred, then generic field
  if (!product) return null;
  if (!langPref) return product[field] ?? null;
  const key = `${field}_${langPref}`;
  return product[key] ?? product[field] ?? null;
}



export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { productId } = await params
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get the product
  const { data: product, error } = await supabase.from("products").select("*").eq("id", productId).single()

  if (error || !product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

   // if you want to choose user's language dynamically, replace undefined with 'en' | 'ar' | 'cn' | 'ur' | 'es'
  const userLang = undefined;

  const title = pickLocalized(product, "title", userLang) ?? "Untitled Product";
  const description = pickLocalized(product, "description", userLang) ?? "";
  const images: string[] = Array.isArray(product.images) && product.images.length ? product.images : product.image_url ? [product.image_url] : [];

  // WhatsApp: if you have seller number supply here, otherwise open general share
  const sellerPhone = ""; // e.g. "923xxxxxxxxx" (without +)
  const waText = encodeURIComponent(`Hello, I want to know about: ${title} (ID: ${product.id})`);
  const waUrl = sellerPhone ? `https://wa.me/${sellerPhone}?text=${waText}` : `https://wa.me/?text=${waText}`;
  return (
      <div className="min-h-screen gradient-bg p-6 md:p-12">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to products
          </Link>
        </div>

        <div className="glass rounded-2xl p-6 md:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: images carousel / main image */}
            <div className="md:col-span-1">
              <div className="w-full h-80 md:h-[28rem] rounded-xl overflow-hidden bg-muted">
                <Image
                  src={images[0] ?? "/placeholder.png"}
                  alt={title}
                  width={1200}
                  height={1200}
                  className="object-cover w-full h-full"
                  // If using remote images, ensure next.config.js remotePatterns includes the host
                />
              </div>

              {/* small thumbnails (if images) */}
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
                      <Image src={src} alt={`${title} ${i + 1}`} width={200} height={200} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: details */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold animated-gradient bg-clip-text text-transparent">{title}</h1>
                <p className="mt-2 text-muted-foreground">{description}</p>
              </div>

              <div className="flex items-center gap-6">
                 <div>
                {/*
                  <div className="text-3xl font-extrabold text-primary">
                    {formatPrice(Number(product.price), product.currency ?? "USD")}
                  </div>
                  {product.compare_price && (
                    <div className="text-sm line-through text-muted-foreground">
                      {formatPrice(Number(product.compare_price), product.currency ?? "USD")}
                    </div>
                  )} */}
                </div>

                <div className="ml-auto flex gap-3">
                  {/* Buy button -> navigate to your checkout page which expects productId param */}
                  <Link href={`/checkout/${product.id}`}>
                    <button className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-95">
                      Buy Product
                    </button>
                  </Link>

                  <a href={waUrl} target="_blank" rel="noreferrer">
                    <button className="px-4 py-3 rounded-lg bg-[#25D366] text-white font-semibold hover:opacity-95">
                      WhatsApp
                    </button>
                  </a>

                  <a href={`mailto:?subject=Product%20Inquiry%20${encodeURIComponent(title)}&body=${encodeURIComponent(`I want info about ${title} (ID: ${product.id})`)}`}>
                    <button className="px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:opacity-95">
                      Email
                    </button>
                  </a>
                </div>
              </div>

              {/* SKU / Stock / Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                <div className="p-4 rounded-lg border border-border">
                  <div className="text-muted-foreground">SKU</div>
                  <div className="font-medium">{product.sku ?? "—"}</div>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <div className="text-muted-foreground">Stock</div>
                  <div className="font-medium">{product.stock ?? 0}</div>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <div className="text-muted-foreground">Category</div>
                  <div className="font-medium">{product.category_id ?? "—"}</div>
                </div>
              </div>

              {/* Full description area */}
              <div className="mt-4 p-4 rounded-lg border border-border bg-white/5">
                <h3 className="text-md font-semibold mb-2">Product Details</h3>
                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                  {/* If you store rich html in description, be careful with dangerouslySetInnerHTML */}
                  <p>{description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer back button row (mobile friendly) */}
          <div className="mt-8 flex justify-between items-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to all products
            </Link>
            <div className="text-xs text-muted-foreground">Created at: {new Date(product.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
