"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Minus, Plus, User } from "lucide-react"

interface CartProps {
  items: any[]
  onRemoveItem: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
}

export function Cart({ items, onRemoveItem, onUpdateQuantity }: CartProps) {
  const [clientDNI, setClientDNI] = useState("")

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Carrito de Compras</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{items.length} artículos</p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Carrito vacío</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Agrega productos para comenzar</p>
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">${item.price.toFixed(2)} c/u</p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-slate-400 hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-bold text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Client Data */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-4 bg-slate-50 dark:bg-slate-700">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
          <User size={14} />
          DNI/RUC del Cliente
        </label>
        <Input
          type="text"
          placeholder="12345678 o 20123456789"
          value={clientDNI}
          onChange={(e) => setClientDNI(e.target.value)}
          className="text-sm"
        />
      </div>

      {/* Totals */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
          <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">IGV (18%):</span>
          <span className="font-semibold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between">
          <span className="font-bold text-slate-900 dark:text-white">Total:</span>
          <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-4">
        <Button className="w-full text-lg h-12 font-bold" disabled={items.length === 0}>
          Procesar Pago
        </Button>
      </div>
    </div>
  )
}
