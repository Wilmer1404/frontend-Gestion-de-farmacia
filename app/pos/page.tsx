"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProductGrid } from "@/components/pos/product-grid"
import { Cart } from "@/components/pos/cart"
import { SearchBar } from "@/components/pos/search-bar"
import { Header } from "@/components/pos/header"

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])

  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Punto de Venta" />

        <div className="flex-1 flex gap-6 overflow-hidden p-6">
          {/* Left: Products */}
          <div className="flex-1 flex flex-col">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ProductGrid searchQuery={searchQuery} onAddToCart={addToCart} />
          </div>

          {/* Right: Cart */}
          <div className="w-96">
            <Cart items={cartItems} onRemoveItem={removeFromCart} onUpdateQuantity={updateQuantity} />
          </div>
        </div>
      </div>
    </div>
  )
}
