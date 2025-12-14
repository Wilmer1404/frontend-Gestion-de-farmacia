"use client"

import { API_URL } from "@/types/api"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2, CreditCard, User, Building2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalAmount: number
  onConfirmSale: (clientData: { dni: string, name: string }) => void
  isProcessing: boolean
}

export function CheckoutDialog({ open, onOpenChange, totalAmount, onConfirmSale, isProcessing }: CheckoutDialogProps) {
  const [docType, setDocType] = useState<"DNI" | "RUC">("DNI")
  const [clientDoc, setClientDoc] = useState("")
  const [clientName, setClientName] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Resetear formulario al abrir
  useEffect(() => {
    if(open) {
        setClientDoc("")
        setClientName("")
        setDocType("DNI")
    }
  }, [open])

  // Buscar Cliente en API
  const handleSearchClient = async () => {
    if (!clientDoc) return
    
    // Validar longitud antes de buscar
    if ((docType === "DNI" && clientDoc.length !== 8) || (docType === "RUC" && clientDoc.length !== 11)) {
        alert(`El ${docType} debe tener ${docType === "DNI" ? 8 : 11} dígitos.`);
        return;
    }

    setIsSearching(true)
    setClientName("") // Limpiar nombre previo

    try {
        const res = await fetch(`${API_URL}/customers/${clientDoc}`)
        if (res.ok) {
            const data = await res.json()
            setClientName(data.nombre)
        } else {
            alert("No se encontraron datos. Por favor ingrese el nombre manualmente.")
        }
    } catch (e) {
        console.error(e)
        alert("Error de conexión al buscar cliente.")
    } finally {
        setIsSearching(false)
    }
  }

  const handleSubmit = () => {
    if (!clientName.trim()) {
        if (!confirm("¿Desea continuar sin nombre de cliente? (Venta Anónima)")) return;
        onConfirmSale({ dni: "00000000", name: "PÚBLICO GENERAL" })
        return;
    }
    
    onConfirmSale({
        dni: clientDoc || "00000000",
        name: clientName
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden">
        
        {/* ENCABEZADO */}
        <div className="bg-slate-50 dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-700">
            <DialogHeader>
                <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Confirmar Venta
                </DialogTitle>
            </DialogHeader>
        </div>
        
        <div className="p-6 space-y-6">
            
            {/* Total Grande */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 border-dashed">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1 font-medium uppercase tracking-wider">Total a Pagar</p>
                <p className="text-4xl font-extrabold text-green-700 dark:text-green-300 tracking-tight">
                    ${totalAmount.toFixed(2)}
                </p>
            </div>

            {/* Selector Tipo Documento */}
            <div className="space-y-3">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Tipo de Comprobante</Label>
                <RadioGroup defaultValue="DNI" onValueChange={(v) => setDocType(v as "DNI"|"RUC")} className="flex gap-4">
                    <div className={`flex items-center space-x-2 border rounded-md p-3 w-full cursor-pointer transition-colors ${docType === 'DNI' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200'}`}>
                        <RadioGroupItem value="DNI" id="r1" />
                        <Label htmlFor="r1" className="cursor-pointer flex items-center gap-2 font-medium">
                            <User size={16}/> Boleta (DNI)
                        </Label>
                    </div>
                    <div className={`flex items-center space-x-2 border rounded-md p-3 w-full cursor-pointer transition-colors ${docType === 'RUC' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200'}`}>
                        <RadioGroupItem value="RUC" id="r2" />
                        <Label htmlFor="r2" className="cursor-pointer flex items-center gap-2 font-medium">
                            <Building2 size={16}/> Factura (RUC)
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Buscador de Documento */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Número de Documento</Label>
                <div className="flex gap-2">
                    <Input 
                        placeholder={docType === "DNI" ? "8 dígitos" : "11 dígitos"} 
                        value={clientDoc}
                        maxLength={docType === "DNI" ? 8 : 11}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ''); // Solo números
                            setClientDoc(val);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchClient()}
                        className="font-mono text-lg tracking-wide"
                        autoFocus
                    />
                    <Button onClick={handleSearchClient} disabled={isSearching || !clientDoc} className="bg-blue-600 hover:bg-blue-700 w-12 shrink-0">
                        {isSearching ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                    </Button>
                </div>
            </div>

            {/* Resultado Nombre */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Cliente / Razón Social</Label>
                <Input 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`bg-slate-50 dark:bg-slate-900 font-medium ${clientName ? 'border-green-500 ring-1 ring-green-500/20' : ''}`}
                    placeholder="Nombre del cliente..."
                />
            </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="bg-slate-50 dark:bg-slate-800 p-6 border-t border-slate-100 dark:border-slate-700 sm:justify-between gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto font-medium">
                Cancelar
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 font-bold shadow-md shadow-green-200 dark:shadow-none h-11 px-8" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                EMITIR {docType === 'DNI' ? 'BOLETA' : 'FACTURA'}
            </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}