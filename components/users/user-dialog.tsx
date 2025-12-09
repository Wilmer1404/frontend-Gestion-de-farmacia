"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "@/types/api"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (user: Partial<User>) => void
}

export function UserDialog({ open, onOpenChange, onSave }: UserDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    role: "SELLER"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Partial<User>)
    setFormData({ fullName: "", username: "", password: "", role: "SELLER" }) // Reset
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">Nombre</Label>
            <Input 
                id="fullName" 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                className="col-span-3" required 
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">Usuario</Label>
            <Input 
                id="username" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                className="col-span-3" required 
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">Contraseña</Label>
            <Input 
                id="password" type="password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="col-span-3" required 
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Rol</Label>
            <Select 
                onValueChange={(val) => setFormData({...formData, role: val})} 
                defaultValue={formData.role}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SELLER">Vendedor</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Crear Usuario</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}