"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from "@/types/api"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productToEdit?: Product | null
  onSave: (product: any) => void
}

export function ProductDialog({ open, onOpenChange, productToEdit, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    salePrice: "",
    minStock: "10",
    provider: "",
  })

  // Cargar datos si es edición
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        sku: productToEdit.sku,
        barcode: productToEdit.barcode || "",
        salePrice: productToEdit.salePrice.toString(),
        minStock: productToEdit.minStock.toString(),
        provider: productToEdit.provider || "" 
      })
    } else {
      // Reseteamos el formulario al abrir para crear nuevo
      setFormData({ name: "", sku: "", barcode: "", salePrice: "", minStock: "10", provider: "" }) 
    }
  }, [productToEdit, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      salePrice: parseFloat(formData.salePrice),
      minStock: parseInt(formData.minStock)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* Nombre */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nombre</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="col-span-3" 
              required 
            />
          </div>

          {/* SKU */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">SKU</Label>
            <Input 
              id="sku" 
              value={formData.sku} 
              onChange={(e) => setFormData({...formData, sku: e.target.value})} 
              className="col-span-3" 
              required 
            />
          </div>

          {/* Código de Barras (Nuevo) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="barcode" className="text-right">Cód. Barras</Label>
            <Input 
              id="barcode" 
              value={formData.barcode} 
              onChange={(e) => setFormData({...formData, barcode: e.target.value})} 
              className="col-span-3" 
              placeholder="Opcional"
            />
          </div>

          {/* Precio */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Precio</Label>
            <Input 
              id="price" 
              type="number" 
              step="0.01" 
              value={formData.salePrice} 
              onChange={(e) => setFormData({...formData, salePrice: e.target.value})} 
              className="col-span-3" 
              required 
            />
          </div>

          {/* Stock Mínimo */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Min. Stock</Label>
            <Input 
              id="stock" 
              type="number" 
              value={formData.minStock} 
              onChange={(e) => setFormData({...formData, minStock: e.target.value})} 
              className="col-span-3" 
            />
          </div>

          {/* Proveedor (Nuevo) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">Proveedor</Label>
            <Input 
              id="provider" 
              value={formData.provider} 
              onChange={(e) => setFormData({...formData, provider: e.target.value})} 
              className="col-span-3" 
              placeholder="Laboratorio / Distribuidor"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}