"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/pos/header"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Download } from "lucide-react"

export default function InventoryPage() {
  const [showAddProduct, setShowAddProduct] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Gestión de Inventario" />

        <div className="flex-1 flex flex-col overflow-hidden p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Productos en Stock</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Gestiona lotes, vencimientos y niveles de stock
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <InventoryTable />
          </div>
        </div>
      </div>
    </div>
  )
}
