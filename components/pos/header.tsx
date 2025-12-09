"use client"

import { Clock, User } from "lucide-react"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const currentTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Gestión de ventas en tiempo real</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Clock size={18} />
            <span className="text-sm font-medium">{currentTime}</span>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User size={18} className="text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900 dark:text-white">Vendedor</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Conectado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
