"use client"

import { API_URL } from "@/types/api"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProductGrid } from "@/components/pos/product-grid"
import { Cart } from "@/components/pos/cart"
import { Header } from "@/components/pos/header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { CheckoutDialog } from "@/components/pos/checkout-dialog" // Importar el modal nuevo

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])
  
  // Estados para el Modal de Pago
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // --- LÓGICA CARRITO ---
  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id)
    if (existingItem && existingItem.quantity >= product.stock) {
        alert("Stock insuficiente")
        return
    }
    if (existingItem) {
      setCartItems(cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      const item = cartItems.find(i => i.id === productId);
      // Validar stock del item original (esto requeriría buscar en la lista de productos, 
      // pero por simplicidad validamos contra lo que ya tiene el item si trajimos el stock)
      if(item && quantity > item.stock) {
          alert("Stock máximo alcanzado")
          return;
      }
      setCartItems(cartItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  // --- LÓGICA DE PAGO (API) ---
  const handleConfirmSale = async (clientData: { dni: string, name: string }) => {
    setIsProcessing(true);

    const salePayload = {
        clientDni: clientData.dni,
        clientName: clientData.name,
        sellerId: 1, 
        items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch(`${API_URL}/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(salePayload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al procesar venta");
        }

        const sale = await response.json();
        alert(`¡Venta #${sale.id} Exitosa!`);
        
        // Limpieza
        setCartItems([]);
        setIsCheckoutOpen(false); // Cerrar modal
        window.location.reload(); // Recargar para actualizar stocks

    } catch (error: any) {
        alert(`Error: ${error.message}`);
    } finally {
        setIsProcessing(false);
    }
  }

  // Calcular total para pasarlo al modal
  const totalAmount = cartItems.reduce((acc, item) => acc + ((item.salePrice || 0) * item.quantity), 0) * 1.18;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title="Punto de Venta" />

        <div className="flex-1 flex gap-4 overflow-hidden p-4 h-full">
          
          {/* IZQUIERDA: PRODUCTOS (Ocupa el espacio restante) */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 rounded-lg p-2">
            {/* Barra de búsqueda integrada arriba */}
            <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
               <Input 
                 placeholder="Buscar por nombre o código (ESC para limpiar)..." 
                 value={searchQuery} 
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 bg-white"
               />
            </div>
            
            <ProductGrid searchQuery={searchQuery} onAddToCart={addToCart} />
          </div>

          {/* DERECHA: CARRITO (Ancho fijo, altura completa) */}
          <div className="w-[380px] shrink-0 h-full">
            <Cart 
                items={cartItems} 
                onRemoveItem={removeFromCart} 
                onUpdateQuantity={updateQuantity} 
                onCheckoutClick={() => setIsCheckoutOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* MODAL DE PAGO (Se renderiza encima de todo) */}
      <CheckoutDialog 
        open={isCheckoutOpen} 
        onOpenChange={setIsCheckoutOpen}
        totalAmount={totalAmount}
        onConfirmSale={handleConfirmSale}
        isProcessing={isProcessing}
      />
    </div>
  )
}