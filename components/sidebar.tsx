"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, BarChart3, Users, Home, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context" // <--- IMPORTAR CONTEXTO

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth() // <--- USAR HOOK

  // Filtramos el menú según el rol
  const menuItems = [
    { label: "Inicio", icon: Home, href: "/" },
    { label: "Punto de Venta", icon: ShoppingCart, href: "/pos" },
    // SOLO ADMIN VE INVENTARIO Y REPORTES
    ...(user?.role === "ADMIN" ? [
      { label: "Inventario", icon: Package, href: "/inventory" },
      { label: "Usuarios", icon: Users, href: "/users" }, // <--- NUEVO ENLACE (Asegúrate de importar Users de lucide-react)
      { label: "Reportes", icon: BarChart3, href: "/reports" },
      // { label: "Clientes", icon: Users, href: "/customers" }, // (Puedes comentar este si no lo usas aún)
    ] : [])
  ]

  // Si estamos en login, no mostrar sidebar (opcional, o manejarlo en layout)
  if (pathname === "/login") return null;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen">
      
      {/* Logo y Usuario */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white text-lg leading-none">FarmaSystem</h1>
            <p className="text-xs text-slate-500 mt-1">v1.0 Pro</p>
          </div>
        </div>
        
        {/* Tarjeta de Usuario */}
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
            <Badge variant="outline" className="text-[10px] h-5 px-1 bg-white border-slate-300">
                {user?.role}
            </Badge>
        </div>
      </div>

      {/* Navegación Dinámica */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Botón Salir */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={logout} // <--- ACCIÓN LOGOUT
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

// Necesitas importar Badge al inicio si no lo tienes:
import { Badge } from "@/components/ui/badge"