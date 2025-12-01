"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { CartItem, Product } from "@/lib/types"

interface CartContextType {
  items: (CartItem & { product: Product })[]
  itemCount: number
  total: number
  addItem: (productId: string, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let sessionId = localStorage.getItem("cart_session_id")
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem("cart_session_id", sessionId)
  }
  return sessionId
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<(CartItem & { product: Product })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchCart = async () => {
    setIsLoading(true)
    const sessionId = getSessionId()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    let query = supabase.from("cart_items").select("*, product:products(*)")

    if (user) {
      query = query.eq("user_id", user.id)
    } else {
      query = query.eq("session_id", sessionId)
    }

    const { data } = await query
    setItems((data as (CartItem & { product: Product })[]) || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const addItem = async (productId: string, quantity = 1) => {
    const sessionId = getSessionId()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Check if item exists
    const existingItem = items.find((item) => item.product_id === productId)

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + quantity)
    } else {
      const insertData: Record<string, unknown> = {
        product_id: productId,
        quantity,
      }

      if (user) {
        insertData.user_id = user.id
      } else {
        insertData.session_id = sessionId
      }

      await supabase.from("cart_items").insert(insertData)
      await fetchCart()
    }
  }

  const removeItem = async (itemId: string) => {
    await supabase.from("cart_items").delete().eq("id", itemId)
    setItems(items.filter((item) => item.id !== itemId))
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    await supabase.from("cart_items").update({ quantity }).eq("id", itemId)
    setItems(items.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = async () => {
    const sessionId = getSessionId()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id)
    } else {
      await supabase.from("cart_items").delete().eq("session_id", sessionId)
    }

    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
