import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"

import Link from "next/link"
import { 

  ShoppingBag, 
  Shield, 
  Truck, 
  RefreshCw, 
  Star,
  Package,
  Package2 ,
  Globe,

  Phone,
  MapPin,
  BadgePercent
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductGallery } from "@/components/detail/product-gallery"
import { ProductActions } from "@/components/detail/product-actions"
import { RelatedProducts } from "@/components/detail/related-products"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { EmailButton } from "@/components/email-button"
// import { ShareButton } from "@/components/ui/share-button"


import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface DetailPageProps {
  params: Promise<{ productId: string }>
}

export default async function Checkout({ params }: DetailPageProps) {
  const { productId } = await params
  const supabase = await createClient()

  // Get current user (optional)
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch product with category and seller info
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *
    `)
    .eq("id", productId)
    .single()

  if (error || !product) {
    notFound()
  }


  // Fetch related products (same category)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, title, price, image_url, category_id")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(4)

 

   
    
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: product.currency || "USD",
      minimumFractionDigits: 0
    }).format(price)
  }

  // Calculate discount percentage
  const discountPercent = product.compare_price && product.price < product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  // Get images array
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [product.image_url] 
    : []

  return (
    <div className="min-h-screen gradient-bg ">
      {/* Top Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-20 max-w-7xl ">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <span>/</span>
         
          <span className="font-medium text-primary truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Gallery */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {discountPercent > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  -{discountPercent}% OFF
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Star className="h-3 w-3 mr-1" /> Featured
                </Badge>
              )}
              {product.stock > 0 ? (
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-300">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Product Gallery */}
            <ProductGallery images={images} title={product.title} />

            {/* Share Options
            <div className="flex items-center gap-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Share:</span>
              {/* <ShareButton product={product} /> 
              <Button variant="ghost" size="icon">
                <Facebook className="h-4 w-4 text-blue-600" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4 text-blue-400" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-4 w-4 text-pink-500" />
              </Button>
            </div> */}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title & SKU */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>SKU: {product.sku || "N/A"}</span>
                <span>|</span>
                <span>Brand: {product.brand || "Premium Clothing"}</span>
                <span>|</span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 mr-1 fill-current" />
                  4.8 (124 reviews)
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                  <Badge variant="outline" className="text-red-500 border-red-300">
                    Save {formatPrice(product.compare_price - product.price)}
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold  mb-2">Description</h3>
              <p className="text-foreground: leading-relaxed">{product.description}</p>
            </div>

            {/* Quick Stats */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Feature Item */}
  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
    <Truck className="h-5 w-5 text-primary" />
    <div>
      <p className="text-sm font-medium">Free Shipping</p>
      <p className="text-xs text-muted-foreground">Over $100</p>
    </div>
  </div>

  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
    <Shield className="h-5 w-5 text-primary" />
    <div>
      <p className="text-sm font-medium">2-Year Warranty</p>
      <p className="text-xs text-muted-foreground">Full Coverage</p>
    </div>
  </div>

  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
    <RefreshCw className="h-5 w-5 text-primary" />
    <div>
      <p className="text-sm font-medium">30-Day Returns</p>
      <p className="text-xs text-muted-foreground">Easy Returns</p>
    </div>
  </div>

  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
    <Phone className="h-5 w-5 text-primary" />
    <div>
      <p className="text-sm font-medium">24/7 Support</p>
      <p className="text-xs text-muted-foreground">Dedicated Help</p>
    </div>
  </div>
</div>


            {/* Action Buttons */}
            <ProductActions 
              product={product} 
              userId={user?.id} 
              stock={product.stock} 
            />

            {/* Contact Options */}
            <div className="flex flex-wrap gap-3">
              <WhatsAppButton 
                phone="1234567890" 
                message={`Interested in: ${product.title}`}
                className="flex-1"
              />
              <EmailButton 
                email="sales@premiumclothing.com"
                subject={`Inquiry: ${product.title}`}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full my-10  w-full grid-cols-2 sm:grid-cols-4 ">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (124)</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            
            
            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p className="text-foreground">{product.description}</p>
                {product.seo_description && (
                  <p className="mt-4 text-foreground">{product.seo_description}</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="pt-6">
  <div className="space-y-6">
    {/* Mobile View - Cards */}
    <div className="md:hidden space-y-4">
      <div className="bg-card rounded-xl p-4 border">
        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Product Details
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">SKU</span>
            <span className="font-medium">{product.sku || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">MOQ</span>
            <span className="font-medium">{product.moq || 1} units</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Stock</span>
            <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Origin</span>
            <span className="font-medium">{product.origin_country || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 border">
        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          Shipping Details
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Carton Weight</span>
            <span className="font-medium">{product.carton_weight || 1} kg</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Carton Qty</span>
            <span className="font-medium">{product.carton_qty || 20} units</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Carton Dimensions</span>
            <span className="font-medium text-right">{product.carton_dimensions || "30*20*15"} cm</span>
          </div>
        </div>
      </div>
    </div>

    {/* Desktop View - Table */}
    <div className="hidden md:block overflow-hidden rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left p-4 font-semibold">Specification</th>
            <th className="text-left p-4 font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-muted/30 transition-colors">
            <td className="p-4 text-muted-foreground">SKU</td>
            <td className="p-4 font-medium">{product.sku || "N/A"}</td>
          </tr>
          <tr className="border-b hover:bg-muted/30 transition-colors">
            <td className="p-4 text-muted-foreground">Minimum Order Quantity</td>
            <td className="p-4 font-medium">{product.moq || 1} units</td>
          </tr>
          <tr className="border-b hover:bg-muted/30 transition-colors">
            <td className="p-4 text-muted-foreground">Stock Availability</td>
            <td className="p-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    {product.stock} units available
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-600"></div>
                    Out of stock
                  </>
                )}
              </span>
            </td>
          </tr>
          <tr className="border-b hover:bg-muted/30 transition-colors">
            <td className="p-4 text-muted-foreground">Origin Country</td>
            <td className="p-4 font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {product.origin_country || "N/A"}
            </td>
          </tr>
          <tr className="border-b hover:bg-muted/30 transition-colors">
            <td className="p-4 text-muted-foreground">Carton Weight</td>
            <td className="p-4 font-medium">{product.carton_weight || 1} kg</td>
          </tr>
          <tr className="border-b hover:bg-muted/30 transition-colors">
            <td className="p-4 text-muted-foreground">Units per Carton</td>
            <td className="p-4 font-medium">{product.carton_qty || 20} units</td>
          </tr>
          <tr className="hover:bg-muted/30 transition-colors">
            <td className="p-4 text-muted-foreground">Carton Dimensions</td>
            <td className="p-4 font-medium">{product.carton_dimensions || "30*20*15"} cm</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
     {/* Wholesale Notice */}
    {(product.wholesale_price && product.wholesale_price < product.price) && (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center gap-3">
          <BadgePercent className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">Wholesale Price Available!</p>
            <p className="text-sm text-blue-600">
              Order {product.moq || 98}+ units and get for <strong>${product.wholesale_price}</strong> each 
              (Save ${product.price - product.wholesale_price} per unit)
            </p>
          </div>
        </div>
      </div>
    )}
            </TabsContent>
           
            <TabsContent value="shipping" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Shipping Information</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Free shipping on orders over $100
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ships from {product.origin_country || "USA"}
                    </li>
                    <li className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      2-5 business days delivery
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-muted-foreground mb-3">Return Policy</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      30-day return policy
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Money-back guarantee
                    </li>
                    <li className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Free returns for defective items
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

      
        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                <p className="text-gray-600">You might also like these items</p>
              </div>
              <Link 
                href={`/category/${product.category_id}`}
                className="text-primary hover:underline"
              >
                View Category →
              </Link>
            </div>
            
            <RelatedProducts products={relatedProducts} />
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}