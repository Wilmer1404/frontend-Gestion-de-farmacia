"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProductGrid } from "@/components/pos/product-grid"
import { Cart } from "@/components/pos/cart"
import { SearchBar } from "@/components/pos/search-bar"
import { Header } from "@/components/pos/header"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast" // Asegúrate de tener shadcn toast o usa alert simple

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])
  const [clientDni, setClientDni] = useState("99999999") // DNI Público General por defecto
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id)
    // Validar stock antes de agregar
    if (existingItem && existingItem.quantity >= product.stock) {
        alert("¡No hay suficiente stock!")
        return
    }

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
      // Validar stock máximo
      const item = cartItems.find(i => i.id === productId);
      if(item && quantity > item.stock) {
          alert("Stock insuficiente")
          return;
      }
      setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  // --- LÓGICA DE PAGO CON BACKEND ---
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);

    const salePayload = {
        clientDni: clientDni,
        sellerId: 1, // Hardcodeado por ahora
        items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch("http://localhost:8080/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(salePayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al procesar venta");
        }

        // Éxito
        const sale = await response.json();
        alert(`¡Venta realizada con éxito! ID: ${sale.id} - Total: $${sale.total}`);
        setCartItems([]); // Limpiar carrito
        setClientDni(""); // Limpiar cliente
        
        // Aquí idealmente recargarías los productos para ver el stock actualizado
        window.location.reload(); 

    } catch (error: any) {
        alert(`Error: ${error.message}`);
    } finally {
        setIsProcessing(false);
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
          <div className="w-96 flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border h-full">
            <div className="flex gap-2 mb-2">
                <Input 
                    placeholder="DNI / RUC Cliente" 
                    value={clientDni} 
                    onChange={(e) => setClientDni(e.target.value)}
                />
            </div>
            
            <div className="flex-1 overflow-auto">
                <Cart items={cartItems} onRemoveItem={removeFromCart} onUpdateQuantity={updateQuantity} />
            </div>

            <Button 
                size="lg" 
                className="w-full text-lg py-6" 
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isProcessing}
            >
                {isProcessing ? "Procesando..." : "PAGAR AHORA"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}