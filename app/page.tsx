"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Package, BarChart3, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const modules = [
    {
      id: "pos",
      title: "Punto de Venta",
      description: "Gestiona ventas, procesa pagos y administra clientes",
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      href: "/pos",
    },
    {
      id: "inventory",
      title: "Inventario",
      description: "Controla stock, lotes y fechas de vencimiento",
      icon: Package,
      color: "from-teal-500 to-teal-600",
      href: "/inventory",
    },
    {
      id: "reports",
      title: "Reportes",
      description: "Análisis de ventas y movimiento de inventario",
      icon: BarChart3,
      color: "from-amber-500 to-amber-600",
      href: "/reports",
    },
    {
      id: "customers",
      title: "Clientes",
      description: "Gestiona información de clientes y preferencias",
      icon: Users,
      color: "from-green-500 to-green-600",
      href: "/customers",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                PharmaCare
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Sistema de Gestión Integral de Farmacia</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Bienvenido</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.id} href={module.href}>
                <div
                  className="group relative h-full cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onMouseEnter={() => setSelectedModule(module.id)}
                  onMouseLeave={() => setSelectedModule(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-lg blur transition-opacity" />
                  <div className="relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div
                      className={`w-14 h-14 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="text-white" size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{module.title}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow">{module.description}</p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full group-hover:border-primary group-hover:text-primary transition-colors bg-transparent"
                      >
                        Acceder
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
