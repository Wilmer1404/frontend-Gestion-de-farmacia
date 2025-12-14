"use client"

import { API_URL } from "@/types/api"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProductGrid } from "@/components/pos/product-grid"
import { Cart } from "@/components/pos/cart"
import { Header } from "@/components/pos/header"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { CheckoutDialog } from "@/components/pos/checkout-dialog" 
import { useAuth } from "@/context/auth-context" // Opcional: Para obtener el ID real del vendedor

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])
  
  // Estados para el Modal de Pago
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Obtener usuario del contexto para enviar el ID correcto (opcional, si el backend lo requiere)
  const { user } = useAuth() 

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

    // 1. OBTENER TOKEN DEL STORAGE
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No hay sesión activa. Por favor inicie sesión nuevamente.");
        setIsProcessing(false);
        return;
    }

    const salePayload = {
        clientDni: clientData.dni,
        clientName: clientData.name,
        sellerId: user?.id || 1, // Usar ID real del usuario o 1 por defecto
        items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch(`${API_URL}/sales`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <--- ¡ESTO FALTABA!
            },
            body: JSON.stringify(salePayload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al procesar venta (Posiblemente sesión expirada)");
        }

        const sale = await response.json();
        alert(`¡Venta #${sale.id} Exitosa!`);
        
        // Limpieza
        setCartItems([]);
        setIsCheckoutOpen(false); 
        window.location.reload(); 

    } catch (error: any) {
        console.error(error);
        alert(`Error: ${error.message}`);
    } finally {
        setIsProcessing(false);
    }
  }

  // Calcular total con IGV (18%)
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.salePrice || 0) * item.quantity), 0);
  const totalAmount = subtotal * 1.18;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title="Punto de Venta" />

        <div className="flex-1 flex gap-4 overflow-hidden p-4 h-full">
          
          {/* IZQUIERDA: PRODUCTOS */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
            <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
               <Input 
                 placeholder="Buscar por nombre o código..." 
                 value={searchQuery} 
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-10 bg-white dark:bg-slate-800"
               />
            </div>
            
            <ProductGrid searchQuery={searchQuery} onAddToCart={addToCart} />
          </div>

          {/* DERECHA: CARRITO */}
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