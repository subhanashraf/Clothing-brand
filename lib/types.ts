export interface User {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  role: "user" | "admin"
  created_at: string
  name: string | null
}

export interface Category {
  id: string
  name: string

  slug: string
  image_url: string | null
  category_id: [] | null,
  parent_ids: string[] | null,
  created_at: string
  is_active: boolean
  is_featured: boolean
}

export interface Product {
  id: string
  title: string
  title_en: string | null
  title_ar: string | null
  title_cn: string | null
  title_ur: string | null
  title_es: string | null
  description: string | null
  description_en: string | null
  description_ar: string | null
  description_cn: string | null
  description_ur: string | null
  description_es: string | null
  price: number
  compare_price: number | null
  currency: string
  category_id: string | null
  image_url: string | null
  images: string[]
  sku: string | null
  stock: number
  is_featured: boolean
  is_active: boolean
  stripe_price_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  category?: Category
  stripe_product_id: string | null
  category_name:string | null
  moq:number | string | null
  
  carton_weight:string | null
  carton_dimensions:string | null
  dimension_unit:string | null
  seo_title:string | null
  seo_description:string | null
  wholesale_price:number | null
  wholesale_currency:string | null
  origin_country:string | null
  brand:string | null
  carton_qty:number | string | null
}

export interface Order {
  id: string
  user_id: string | null
  product_id: string | null
  items: CartItem[]
  amount: number
  currency: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "failed"
  shipping_address: ShippingAddress | null
  customer_email: string | null
  customer_name: string | null
  invoice_url: string | null
  payment_metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  product?: Product
  user?: User
}

export interface CartItem {
  id: string
  user_id: string | null
  session_id: string | null
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface ShippingAddress {
  name: string
  email: string
  phone?: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
}

export interface AIKnowledgeBase {
  id: string
  topic: string
  content: string
  content_en: string | null
  content_ar: string | null
  content_cn: string | null
  content_ur: string | null
  content_es: string | null
  category: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  user_id: string | null
  session_id: string | null
  event_name: string
  event_value: string | null
  page: string | null
  product_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

