"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
    name: "",
    sku: "",
    barcode: "",
    salePrice: "",
    minStock: "10",
    provider: "",
    initialStock: "0",
    batchCode: "",
    expirationDate: "",
    purchasePrice: ""
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    setErrors({}) // Limpiar errores al abrir

    if (productToEdit) {
      setFormData(prev => ({
        ...prev,
        name: productToEdit.name,
        sku: productToEdit.sku,
        barcode: productToEdit.barcode || "",
        salePrice: productToEdit.salePrice.toString(),
        minStock: productToEdit.minStock.toString(),
        provider: productToEdit.provider || "",
        initialStock: "0",
        batchCode: "",
        expirationDate: "",
        purchasePrice: ""
      }))
    } else {
      setFormData({
        name: "", sku: "", barcode: "", salePrice: "", minStock: "10", provider: "",
        initialStock: "0", batchCode: "", expirationDate: "", purchasePrice: ""
      })
    }
  }, [productToEdit, open])

  // --- VALIDACIONES ---
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    const today = new Date().toISOString().split('T')[0]

    // 1. Datos Generales
    if (!formData.name.trim()) newErrors.name = "Obligatorio"
    if (!formData.sku.trim()) newErrors.sku = "Obligatorio"
    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
        newErrors.salePrice = "Mayor a 0"
    }

    // 2. Validaciones de Lote (Solo si hay stock inicial > 0)
    if (!productToEdit && parseInt(formData.initialStock) > 0) {
        if (!formData.batchCode) newErrors.batchCode = "Falta código"
        if (!formData.expirationDate) newErrors.expirationDate = "Falta fecha"
        if (!formData.purchasePrice) newErrors.purchasePrice = "Falta costo"

        // Lógica de Negocio
        const compra = parseFloat(formData.purchasePrice)
        const venta = parseFloat(formData.salePrice)

        if (compra >= venta) {
            newErrors.purchasePrice = "¡Ojo! Costo mayor al precio venta"
        }

        if (formData.expirationDate && formData.expirationDate <= today) {
            newErrors.expirationDate = "Producto vencido"
        }
    }

    setErrors(newErrors)
    // Bloqueamos si hay errores, excepto la advertencia de precio (purchasePrice) que es solo visual
    const blockingErrors = Object.keys(newErrors).filter(k => k !== 'purchasePrice')
    return blockingErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const payload: any = {
      name: formData.name,
      sku: formData.sku,
      barcode: formData.barcode,
      salePrice: parseFloat(formData.salePrice),
      minStock: parseInt(formData.minStock) || 0,
      provider: formData.provider
    }

    // Solo enviamos lote si hay stock
    if (!productToEdit && parseInt(formData.initialStock) > 0) {
      payload.initialBatch = {
        stock: parseInt(formData.initialStock),
        batchCode: formData.batchCode || "LOTE-INI",
        expirationDate: formData.expirationDate,
        purchasePrice: parseFloat(formData.purchasePrice) || 0
      }
    }

    onSave(payload)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
        setErrors(prev => {
            const newErr = {...prev}
            delete newErr[field]
            return newErr
        })
    }
  }

  const getErrorStyle = (field: string) => errors[field] ? "border-red-500 focus-visible:ring-red-500" : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Editar Producto" : "Registrar Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* --- DATOS GENERALES --- */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">Detalles del Producto</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>Nombre Comercial </Label>
                <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => handleChange("name", e.target.value)} 
                    className={getErrorStyle("name")}
                    placeholder="Ej: Paracetamol 500mg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku" className={errors.sku ? "text-red-500" : ""}>SKU / Código Interno </Label>
                <Input 
                    id="sku" 
                    value={formData.sku} 
                    onChange={e => handleChange("sku", e.target.value)} 
                    className={getErrorStyle("sku")}
                    placeholder="Ej: GEN-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salePrice" className={errors.salePrice ? "text-red-500" : ""}>Precio Venta (S/) </Label>
                <Input 
                    id="salePrice" type="number" step="0.01" 
                    value={formData.salePrice} 
                    onChange={e => handleChange("salePrice", e.target.value)} 
                    className={getErrorStyle("salePrice")}
                    placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo (Alerta)</Label>
                <Input 
                    id="minStock" type="number" 
                    value={formData.minStock} 
                    onChange={e => handleChange("minStock", e.target.value)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Laboratorio / Proveedor</Label>
                <Input 
                    id="provider" 
                    value={formData.provider} 
                    onChange={e => handleChange("provider", e.target.value)} 
                    placeholder="Ej: Portugal, Genfar..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input 
                    id="barcode" 
                    value={formData.barcode} 
                    onChange={e => handleChange("barcode", e.target.value)} 
                    placeholder="Escáner..." 
                />
              </div>
            </div>
          </div>

          {/* --- SECCIÓN DE LOTE INICIAL (Siempre visible si es nuevo) --- */}
          {!productToEdit && (
            <>
              <Separator className="my-2" />
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                     Ingreso Inicial de Stock
                  </h4>
                  <span className="text-xs text-muted-foreground bg-white dark:bg-slate-800 px-2 py-1 rounded border">Opcional</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialStock">Cantidad (Unidades)</Label>
                    <Input 
                        id="initialStock" type="number" 
                        value={formData.initialStock} 
                        onChange={e => handleChange("initialStock", e.target.value)} 
                        className="bg-white dark:bg-slate-950"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice" className={errors.purchasePrice ? "text-amber-600" : ""}>
                        Costo de Compra (S/)
                        {errors.purchasePrice && <span className="ml-2 text-xs text-amber-600 font-bold">⚠ {errors.purchasePrice}</span>}
                    </Label>
                    <Input 
                        id="purchasePrice" type="number" step="0.01" 
                        value={formData.purchasePrice} 
                        onChange={e => handleChange("purchasePrice", e.target.value)} 
                        className={`${errors.purchasePrice ? "border-amber-500 focus-visible:ring-amber-500" : ""} bg-white dark:bg-slate-950`}
                        placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchCode" className={errors.batchCode ? "text-red-500" : ""}>Código de Lote</Label>
                    <Input 
                        id="batchCode" 
                        value={formData.batchCode} 
                        onChange={e => handleChange("batchCode", e.target.value)} 
                        placeholder="Ej: L-2024-A"
                        className={`${getErrorStyle("batchCode")} bg-white dark:bg-slate-950`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirationDate" className={errors.expirationDate ? "text-red-500" : ""}>
                        Fecha Vencimiento
                        {errors.expirationDate && <span className="ml-2 text-xs text-red-500 font-bold">{errors.expirationDate}</span>}
                    </Label>
                    <Input 
                        id="expirationDate" type="date" 
                        value={formData.expirationDate} 
                        onChange={e => handleChange("expirationDate", e.target.value)} 
                        className={`${getErrorStyle("expirationDate")} bg-white dark:bg-slate-950`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">
              {productToEdit ? "Guardar Cambios" : "Registrar Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}