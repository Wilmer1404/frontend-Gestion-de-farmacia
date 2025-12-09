"use client"
import { API_URL } from "@/types/api" 
import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2, Search, Download, Upload, Plus } from "lucide-react"
import { Product, Batch } from "@/types/api"
import { ProductDialog } from "./product-dialog"

export function InventoryTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)
  
  // Referencia para el input de archivo (Importar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- CARGAR DATOS ---
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/products`)
      if (response.ok) {
        const data = await response.json()
        
        // Procesar datos para la tabla
        const processed = data.map((p: Product) => {
          const total = p.batches?.reduce((sum, b) => sum + b.stock, 0) || 0;
          
          // Ordenar lotes por fecha para encontrar el más próximo
          const sortedBatches = p.batches ? [...p.batches].sort((a, b) => 
            new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
          ) : [];
          
          const nearest = sortedBatches.length > 0 ? sortedBatches[0] : undefined;

          return {
            ...p,
            totalStock: total,
            nearestBatch: nearest
          };
        })
        setProducts(processed)
      }
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  // --- LÓGICA EXPORTAR CSV (RESTAURADA) ---
  const handleExport = () => {
    // Definir cabeceras
    const headers = ["ID,Nombre,SKU,Precio,Stock Total,Stock Minimo,Proveedor"]
    
    // Mapear datos
    const rows = products.map(p => 
      `${p.id},"${p.name}",${p.sku},${p.salePrice},${p.totalStock},${p.minStock},"${p.provider || ''}"`
    )
    
    const csvContent = headers.concat(rows).join("\n")
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "inventario_farmacia.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- LÓGICA IMPORTAR ---
  const handleImportClick = () => fileInputRef.current?.click()
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const importedData = JSON.parse(evt.target?.result as string)
        const response = await fetch("http://localhost:8080/api/products/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(importedData)
        })
        
        if (response.ok) {
            alert("¡Productos importados con éxito!")
            fetchProducts()
        } else {
            alert("Error al importar. Formato incorrecto.")
        }
      } catch (error) {
        alert("Error leyendo el archivo JSON.")
      }
    }
    reader.readAsText(file)
  }

  // --- LÓGICA ELIMINAR ---
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return
    try {
        await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" })
        fetchProducts() // Recargar lista
    } catch (error) { alert("Error al eliminar") }
  }

  // --- LÓGICA GUARDAR ---
  const handleSaveProduct = async (productData: any) => {
    const method = productToEdit ? "PUT" : "POST"
    const url = productToEdit 
        ? `http://localhost:8080/api/products/${productToEdit.id}` 
        : "http://localhost:8080/api/products"

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData)
        })
        if (res.ok) {
            setIsModalOpen(false)
            fetchProducts()
        } else {
            alert("Error al guardar")
        }
    } catch (e) { console.error(e) }
  }

  const filteredData = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Helper para estado visual de vencimiento
  const getExpiryStatus = (dateString?: string) => {
      if (!dateString) return null;
      const expiry = new Date(dateString);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays < 0) return { label: "VENCIDO", color: "destructive" };
      if (diffDays < 90) return { label: "Por Vencer", color: "secondary" };
      return { label: dateString, color: "outline" };
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      
      {/* BARRA SUPERIOR DE ACCIONES */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Buscar producto..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
            {/* Input oculto para importar */}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".json" />
            
            <Button variant="outline" onClick={handleImportClick}>
                <Upload size={16} className="mr-2" /> Importar
            </Button>
            
            {/* BOTÓN EXPORTAR RESTAURADO */}
            <Button variant="outline" onClick={handleExport}>
                <Download size={16} className="mr-2" /> Exportar
            </Button>
            
            <Button onClick={() => { setProductToEdit(null); setIsModalOpen(true); }}>
                <Plus size={16} className="mr-2" /> Nuevo
            </Button>
        </div>
      </div>

      {/* TABLA DE DATOS */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">Producto</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">SKU</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">Stock</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">Lote (Prox)</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">Vencimiento</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">Proveedor</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-500">Precio</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredData.map((item) => {
                const expiryInfo = getExpiryStatus(item.nearestBatch?.expirationDate);
                
                return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{item.sku}</td>
                  
                  <td className="px-4 py-3">
                    <Badge variant={ (item.totalStock || 0) > item.minStock ? "default" : "destructive" }>
                        {item.totalStock}
                    </Badge>
                  </td>

                  {/* Lote y Vencimiento */}
                  <td className="px-4 py-3 text-slate-600">
                      {item.nearestBatch ? item.nearestBatch.batchCode : "-"}
                  </td>
                  <td className="px-4 py-3">
                      {expiryInfo ? (
                          <Badge variant={expiryInfo.color as any}>{expiryInfo.label}</Badge>
                      ) : "-"}
                  </td>

                  {/* Proveedor */}
                  <td className="px-4 py-3 text-slate-600">
                      {item.provider || "-"}
                  </td>

                  <td className="px-4 py-3 font-bold">${item.salePrice.toFixed(2)}</td>
                  
                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setProductToEdit(item); setIsModalOpen(true); }}>
                        <Edit2 size={16} className="text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </td>
                </tr>
            )})}
          </tbody>
        </table>
      </div>

      <ProductDialog 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        productToEdit={productToEdit} 
        onSave={handleSaveProduct} 
      />
    </div>
  )
}