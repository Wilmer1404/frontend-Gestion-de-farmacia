"use client"

import { API_URL } from "@/types/api"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Loader2 } from "lucide-react"

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalAmount: number
  onConfirmSale: (clientData: { dni: string, name: string }) => void
  isProcessing: boolean
}

export function CheckoutDialog({ open, onOpenChange, totalAmount, onConfirmSale, isProcessing }: CheckoutDialogProps) {
  const [clientDni, setClientDni] = useState("")
  const [clientName, setClientName] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Buscar Cliente (Simulado o API)
  const handleSearchClient = async () => {
    if (!clientDni) return
    setIsSearching(true)
    try {
        const res = await fetch(`${API_URL}/customers/${clientDni}`)
        if (res.ok) {
            const data = await res.json()
            setClientName(data.nombre)
        } else {
            alert("Cliente no encontrado (Usar 8 dígitos DNI o 11 RUC)")
            setClientName("")
        }
    } catch (e) {
        console.error(e)
        setClientName("")
    } finally {
        setIsSearching(false)
    }
  }

  const handleSubmit = () => {
    // Validar que haya cliente (o permitir público general con DNI genérico)
    if (!clientName && !confirm("¿Continuar sin nombre de cliente?")) return;
    
    onConfirmSale({
        dni: clientDni || "00000000",
        name: clientName || "PÚBLICO GENERAL"
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Confirmar Venta</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            
            {/* Total Grande */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Monto a Cobrar</p>
                <p className="text-4xl font-bold text-green-700 dark:text-green-300">${totalAmount.toFixed(2)}</p>
            </div>

            {/* Formulario Cliente */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Documento Cliente (DNI/RUC)</Label>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Ingrese documento..." 
                            value={clientDni}
                            onChange={(e) => setClientDni(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClient()}
                        />
                        <Button variant="outline" size="icon" onClick={handleSearchClient} disabled={isSearching}>
                            {isSearching ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Razón Social / Nombre</Label>
                    <Input 
                        placeholder="Nombre del cliente..." 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
                Cancelar
            </Button>
            <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
                CONFIRMAR PAGO
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}