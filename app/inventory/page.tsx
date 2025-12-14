"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context" 
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/pos/header"
import { InventoryTable } from "@/components/inventory/inventory-table"

export default function InventoryPage() {
  const { user } = useAuth() 
  const router = useRouter()

  // PROTECCIÓN DE RUTA
  useEffect(() => {
    // Si ya cargó el usuario y NO es ADMIN, lo mandamos al POS
    if (user && user.role !== "ADMIN") {
      router.push("/pos")
    }
  }, [user, router])

  // Evitar parpadeo: Si no es admin, no mostramos nada mientras redirige
  if (!user || user.role !== "ADMIN") {
    return null 
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header title="Gestión de Inventario" />
        <main className="flex-1 overflow-auto p-4">
          <InventoryTable />
        </main>
      </div>
    </div>
  )
}