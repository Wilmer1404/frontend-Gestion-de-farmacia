"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator" // Asegúrate de tener este componente o usa <hr />
import { Product } from "@/types/api"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productToEdit?: Product | null
  onSave: (product: any) => void
}

export function ProductDialog({ open, onOpenChange, productToEdit, onSave }: ProductDialogProps) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Datos del Producto
    name: "",
    sku: "",
    barcode: "",
    salePrice: "",
    minStock: "10",
    provider: "",
    
    // Datos del Lote Inicial (Solo para nuevos)
    initialStock: "0",
    batchCode: "",
    expirationDate: "",
    purchasePrice: ""
  })

  useEffect(() => {
    if (productToEdit) {
      // Si editamos, cargamos solo datos del producto (no tocamos stock aquí)
      setFormData(prev => ({
        ...prev,
        name: productToEdit.name,
        sku: productToEdit.sku,
        barcode: productToEdit.barcode || "",
        salePrice: productToEdit.salePrice.toString(),
        minStock: productToEdit.minStock.toString(),
        provider: productToEdit.provider || "",
        // Limpiamos los campos de lote porque no se editan aquí
        initialStock: "0",
        batchCode: "",
        expirationDate: "",
        purchasePrice: ""
      }))
    } else {
      // Reset para nuevo producto
      const today = new Date().toISOString().split('T')[0] // Fecha de hoy por defecto
      setFormData({
        name: "", sku: "", barcode: "", salePrice: "", minStock: "10", provider: "",
        initialStock: "0", batchCode: "", expirationDate: "", purchasePrice: ""
      })
    }
  }, [productToEdit, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construimos el objeto base del producto
    const payload: any = {
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode,
      salePrice: parseFloat(formData.salePrice),
      minStock: parseInt(formData.minStock),
      provider: formData.provider
    }

    // Si es NUEVO y el usuario puso stock, agregamos el 'initialBatch'
    // El Backend (ProductController) ya está programado para recibir esto
    if (!productToEdit && parseInt(formData.initialStock) > 0) {
      payload.initialBatch = {
        stock: parseInt(formData.initialStock),
        batchCode: formData.batchCode || "LOTE-INI",
        expirationDate: formData.expirationDate || new Date().toISOString().split('T')[0], // Fecha obligatoria
        purchasePrice: parseFloat(formData.purchasePrice) || 0
      }
    }

    onSave(payload)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Editar Producto" : "Registrar Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* --- DATOS GENERALES --- */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Información General</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Producto *</Label>
                <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Código Interno) *</Label>
                <Input id="sku" value={formData.sku} onChange={e => handleChange("sku", e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice">Precio Venta (S/) *</Label>
                <Input id="salePrice" type="number" step="0.01" value={formData.salePrice} onChange={e => handleChange("salePrice", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo</Label>
                <Input id="minStock" type="number" value={formData.minStock} onChange={e => handleChange("minStock", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor</Label>
                <Input id="provider" value={formData.provider} onChange={e => handleChange("provider", e.target.value)} placeholder="Laboratorio X" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input id="barcode" value={formData.barcode} onChange={e => handleChange("barcode", e.target.value)} placeholder="Escáner..." />
              </div>
            </div>
          </div>

          {/* --- SECCIÓN DE LOTE INICIAL (Solo si es nuevo) --- */}
          {!productToEdit && (
            <>
              <Separator className="my-2" />
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-md border">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">Ingreso Inicial de Stock</h4>
                  <span className="text-xs text-muted-foreground">(Opcional)</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialStock">Cantidad (Unidades)</Label>
                    <Input id="initialStock" type="number" value={formData.initialStock} onChange={e => handleChange("initialStock", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Costo de Compra (S/)</Label>
                    <Input id="purchasePrice" type="number" step="0.01" value={formData.purchasePrice} onChange={e => handleChange("purchasePrice", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchCode">Código de Lote</Label>
                    <Input id="batchCode" value={formData.batchCode} onChange={e => handleChange("batchCode", e.target.value)} placeholder="Ej: L-2024-A" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Fecha Vencimiento</Label>
                    <Input id="expirationDate" type="date" value={formData.expirationDate} onChange={e => handleChange("expirationDate", e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="submit">
              {productToEdit ? "Guardar Cambios" : "Registrar Producto e Ingreso"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}