"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react"

interface CartProps {
  items: any[]
  onRemoveItem: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onCheckoutClick: () => void // Nueva prop para abrir el modal
}

export function Cart({ items, onRemoveItem, onUpdateQuantity, onCheckoutClick }: CartProps) {
  
  const subtotal = items.reduce((sum, item) => sum + (item.salePrice || 0) * item.quantity, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col overflow-hidden">
      
      {/* 1. Header Fijo */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <h2 className="font-bold text-slate-900 dark:text-white">Carrito</h2>
        </div>
        <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full font-mono">
            {items.length} items
        </span>
      </div>

      {/* 2. Lista Scrollable (flex-1 ocupa el espacio sobrante) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <ShoppingCart size={48} className="opacity-20" />
            <p className="text-sm">No hay productos seleccionados</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-100 dark:border-slate-700 p-2 flex flex-col gap-2">
              
              {/* Fila superior: Nombre y Precio unitario */}
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm text-slate-800 dark:text-white line-clamp-1 w-full mr-2">
                    {item.name}
                </p>
                <button onClick={() => onRemoveItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Fila inferior: Controles y Subtotal */}
              <div className="flex justify-between items-center">
                 <div className="flex items-center bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-600 h-7">
                    <button 
                        className="px-2 hover:bg-slate-100 h-full"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                        <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                    <button 
                        className="px-2 hover:bg-slate-100 h-full"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                        <Plus size={12} />
                    </button>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-400">${item.salePrice.toFixed(2)} x {item.quantity}</p>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                        ${(item.salePrice * item.quantity).toFixed(2)}
                    </p>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Footer Fijo (Totales y Botón) */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 shrink-0 space-y-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="space-y-1 text-sm">
            <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
                <span>IGV (18%)</span>
                <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>

        <Button 
            className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700" 
            onClick={onCheckoutClick}
            disabled={items.length === 0}
        >
            PAGAR AHORA
        </Button>
      </div>
    </div>
  )
}