"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, BarChart3, Users, Home, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    label: "Inicio",
    icon: Home,
    href: "/",
  },
  {
    label: "Punto de Venta",
    icon: ShoppingCart,
    href: "/pos",
  },
  {
    label: "Inventario",
    icon: Package,
    href: "/inventory",
  },
  {
    label: "Reportes",
    icon: BarChart3,
    href: "/reports",
  },
  {
    label: "Clientes",
    icon: Users,
    href: "/customers",
  },
]

const bottomItems = [
  {
    label: "Configuración",
    icon: Settings,
    href: "/settings",
  },
  {
    label: "Cerrar Sesión",
    icon: LogOut,
    href: "#",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg">PharmaCare</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sistema POS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Items */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
