"use client"

import { API_URL } from "@/types/api"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, RefreshCw } from "lucide-react"
import { Product } from "@/types/api"

interface ProductGridProps {
  searchQuery: string
  onAddToCart: (product: any) => void
}

export function ProductGrid({ searchQuery, onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/products`)
      if (response.ok) {
        const data = await response.json()
        const processed = data.map((p: Product) => ({
          ...p,
          // CORRECCIÓN: Usamos 'totalStock' para coincidir con la interfaz Product
          totalStock: p.batches?.reduce((sum, b) => sum + b.stock, 0) || 0
        }))
        setProducts(processed)
      }
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <div className="p-10 text-center">Cargando inventario...</div>

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 h-full shadow-sm">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {filteredProducts.length} Resultados encontrados
        </span>
        <Button variant="ghost" size="sm" onClick={fetchProducts} className="h-7 text-xs">
            <RefreshCw size={12} className="mr-2" /> Actualizar
        </Button>
      </div>
      
      {/* Tabla */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 sticky top-0 z-10 shadow-sm border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th className="px-4 py-3 font-medium w-[50%]">Producto</th>
                    <th className="px-4 py-3 font-medium text-center">Stock</th>
                    <th className="px-4 py-3 font-medium text-right">Precio</th>
                    <th className="px-4 py-3 font-medium text-right w-[100px]">Agregar</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredProducts.map((product) => {
                    // CORRECCIÓN: Leemos totalStock de forma segura
                    const currentStock = product.totalStock || 0;

                    return (
                    <tr key={product.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
                        
                        <td className="px-4 py-3 align-middle">
                            <p className="font-bold text-slate-800 dark:text-white text-base leading-snug">
                                {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 rounded border border-slate-200 dark:border-slate-700">
                                    {product.sku}
                                </span>
                                {product.provider && (
                                    <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                                        {product.provider}
                                    </span>
                                )}
                            </div>
                        </td>

                        <td className="px-4 py-3 text-center align-middle">
                            <Badge 
                                variant={currentStock > 10 ? "outline" : currentStock > 0 ? "secondary" : "destructive"} 
                                className="font-mono text-xs whitespace-nowrap"
                            >
                                {currentStock} unid.
                            </Badge>
                        </td>

                        <td className="px-4 py-3 text-right align-middle">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400 block">
                                ${product.salePrice.toFixed(2)}
                            </span>
                        </td>

                        <td className="px-4 py-3 text-right align-middle">
                            <Button 
                                size="sm" 
                                className="h-9 w-9 p-0 rounded-full shadow-sm bg-slate-900 hover:bg-blue-600 dark:bg-slate-700 dark:hover:bg-blue-500 transition-all" 
                                // CORRECCIÓN: Enviamos 'stock' explícitamente al carrito para que lo valide
                                onClick={() => onAddToCart({ ...product, stock: currentStock })} 
                                disabled={currentStock <= 0}
                            >
                                <Plus size={20} className="text-white" />
                            </Button>
                        </td>
                    </tr>
                )})}
                
                {filteredProducts.length === 0 && (
                    <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-400">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-4xl">🔍</span>
                                <p>No se encontraron productos.</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  )
}