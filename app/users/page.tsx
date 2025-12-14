"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context" 
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, UserPlus, Shield, User as UserIcon } from "lucide-react"
import { User, API_URL } from "@/types/api"
import { UserDialog } from "@/components/users/user-dialog"

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. PROTECCIÓN DE RUTA
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/pos")
    }
  }, [user, router])

  // 2. Cargar usuarios (Solo si es admin)
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        setUsers(await response.json())
      }
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  useEffect(() => { 
    if (user?.role === "ADMIN") fetchUsers() 
  }, [user])

  // ... (Tus funciones handleCreateUser y handleDelete igual que antes) ...
  const handleCreateUser = async (userData: Partial<User>) => {
    try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(userData)
        })

        if (response.ok) {
            setIsModalOpen(false)
            fetchUsers()
            alert("Usuario creado exitosamente")
        } else {
            alert("Error al crear usuario")
        }
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id: number) => {
    if(!confirm("¿Estás seguro?")) return;
    try {
        const token = localStorage.getItem("token")
        await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        })
        fetchUsers()
    } catch (e) { console.error(e) }
  }

  // Bloqueo visual
  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Usuarios</h1>
            <Button onClick={() => setIsModalOpen(true)}>
                <UserPlus className="mr-2" size={18}/> Nuevo Usuario
            </Button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-slate-500">Nombre</th>
                        <th className="px-6 py-4 font-semibold text-slate-500">Usuario</th>
                        <th className="px-6 py-4 font-semibold text-slate-500">Rol</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-500">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-6 py-4 font-medium flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <UserIcon size={16} />
                                </div>
                                {u.fullName}
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500">{u.username}</td>
                            <td className="px-6 py-4">
                                <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                                    {u.role === "ADMIN" ? <Shield size={12} className="mr-1"/> : null}
                                    {u.role}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash2 size={18} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <UserDialog 
            open={isModalOpen} 
            onOpenChange={setIsModalOpen} 
            onSave={handleCreateUser} 
        />
      </div>
    </div>
  )
}