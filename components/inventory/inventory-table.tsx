"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, AlertCircle, Search } from "lucide-react"

// Mock inventory data
const MOCK_INVENTORY = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    category: "Analgésicos",
    sku: "PARA-500-001",
    stock: 145,
    minStock: 50,
    batchNumber: "BATCH-2024-001",
    expiryDate: "2026-12-31",
    unitPrice: 5.99,
    supplier: "LabFarma S.A.",
  },
  {
    id: "2",
    name: "Ibuprofeno 400mg",
    category: "Analgésicos",
    sku: "IBU-400-001",
    stock: 89,
    minStock: 40,
    batchNumber: "BATCH-2024-002",
    expiryDate: "2026-06-30",
    unitPrice: 7.49,
    supplier: "LabFarma S.A.",
  },
  {
    id: "3",
    name: "Amoxicilina 500mg",
    category: "Antibióticos",
    sku: "AMOX-500-001",
    stock: 32,
    minStock: 50,
    batchNumber: "BATCH-2024-003",
    expiryDate: "2025-03-15",
    unitPrice: 12.99,
    supplier: "Biopharma Ltd",
  },
  {
    id: "4",
    name: "Vitamina C 1000mg",
    category: "Suplementos",
    sku: "VIT-C-1000-001",
    stock: 205,
    minStock: 100,
    batchNumber: "BATCH-2024-004",
    expiryDate: "2025-09-20",
    unitPrice: 9.99,
    supplier: "Naturals Inc",
  },
  {
    id: "5",
    name: "Loratadina 10mg",
    category: "Antihistamínicos",
    sku: "LORA-10-001",
    stock: 156,
    minStock: 75,
    batchNumber: "BATCH-2024-005",
    expiryDate: "2026-11-01",
    unitPrice: 8.49,
    supplier: "LabFarma S.A.",
  },
  {
    id: "6",
    name: "Omeprazol 20mg",
    category: "Gastrointestinales",
    sku: "OMEPR-20-001",
    stock: 67,
    minStock: 50,
    batchNumber: "BATCH-2024-006",
    expiryDate: "2025-05-10",
    unitPrice: 11.99,
    supplier: "Biopharma Ltd",
  },
]

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "stock" | "expiry">("name")

  const filteredData = MOCK_INVENTORY.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return { status: "Agotado", color: "destructive" }
    if (stock < minStock) return { status: "Bajo Stock", color: "secondary" }
    return { status: "En Stock", color: "default" }
  }

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return { status: "Vencido", color: "destructive", warning: true }
    if (daysUntilExpiry < 90) return { status: "Próximo a vencer", color: "secondary", warning: true }
    return { status: "Válido", color: "default", warning: false }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Search Bar */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Lote
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Vencimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredData.map((item) => {
              const stockStatus = getStockStatus(item.stock, item.minStock)
              const expiryStatus = getExpiryStatus(item.expiryDate)

              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{item.sku}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={stockStatus.color as any}>{stockStatus.status}</Badge>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.batchNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {expiryStatus.warning && <AlertCircle size={16} className="text-amber-500" />}
                      <Badge variant={expiryStatus.color as any}>{expiryStatus.status}</Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{item.expiryDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{item.supplier}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-900">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-600 dark:text-slate-400">Total de Productos</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredData.length}</p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Stock Total</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {filteredData.reduce((sum, item) => sum + item.stock, 0)}
            </p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Bajo Stock</p>
            <p className="text-2xl font-bold text-amber-600">
              {filteredData.filter((item) => item.stock < item.minStock).length}
            </p>
          </div>
          <div>
            <p className="text-slate-600 dark:text-slate-400">Próximos a Vencer</p>
            <p className="text-2xl font-bold text-destructive">
              {
                filteredData.filter((item) => {
                  const expiry = new Date(item.expiryDate)
                  const today = new Date()
                  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  return daysUntilExpiry < 90 && daysUntilExpiry >= 0
                }).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
