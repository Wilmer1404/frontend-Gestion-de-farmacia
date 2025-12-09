"use client"

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
      const response = await fetch("http://localhost:8080/api/products")
      if (response.ok) {
        const data = await response.json()
        // Calculamos stock total al vuelo
        const processed = data.map((p: Product) => ({
          ...p,
          stock: p.batches?.reduce((sum, b) => sum + b.stock, 0) || 0
        }))
        setProducts(processed)
      }
    } catch (error) {
      console.error("Error cargando productos", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filtrado
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) return <div className="p-10 text-center">Cargando catálogo...</div>

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex justify-end mb-2">
        <Button variant="ghost" size="sm" onClick={fetchProducts}>
            <RefreshCw size={16} className="mr-2" /> Actualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
        {filteredProducts.map((product: any) => (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
                <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 flex items-center justify-center overflow-hidden">
                {/* Usamos placeholder porque la BD aun no tiene campo de imagen */}
                <span className="text-4xl">💊</span>
                </div>

                <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">{product.sku}</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-primary">${product.salePrice.toFixed(2)}</span>
                <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                    {product.stock} unid.
                </Badge>
                </div>

                <Button className="w-full" onClick={() => onAddToCart(product)} disabled={product.stock <= 0}>
                <Plus size={16} className="mr-2" />
                Agregar
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}