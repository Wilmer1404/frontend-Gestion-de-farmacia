"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

// Mock products - Replace with real data
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    genericName: "Paracetamol",
    price: 5.99,
    stock: 45,
    image: "/medicine-bottle-blue.jpg",
  },
  {
    id: "2",
    name: "Ibuprofeno 400mg",
    genericName: "Ibuprofeno",
    price: 7.49,
    stock: 32,
    image: "/medicine-tablet-orange.jpg",
  },
  {
    id: "3",
    name: "Amoxicilina 500mg",
    genericName: "Amoxicilina",
    price: 12.99,
    stock: 15,
    image: "/medicine-capsule-red.jpg",
  },
  {
    id: "4",
    name: "Vitamina C 1000mg",
    genericName: "Ácido Ascórbico",
    price: 9.99,
    stock: 60,
    image: "/medicine-vitamin-yellow.jpg",
  },
  {
    id: "5",
    name: "Loratadina 10mg",
    genericName: "Loratadina",
    price: 8.49,
    stock: 28,
    image: "/medicine-antihistamine-white.jpg",
  },
  {
    id: "6",
    name: "Omeprazol 20mg",
    genericName: "Omeprazol",
    price: 11.99,
    stock: 19,
    image: "/medicine-capsule-purple.jpg",
  },
]

interface ProductGridProps {
  searchQuery: string
  onAddToCart: (product: any) => void
}

export function ProductGrid({ searchQuery, onAddToCart }: ProductGridProps) {
  const filteredProducts = MOCK_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.genericName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-2 gap-4 pb-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 flex items-center justify-center overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{product.genericName}</p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
              <Badge variant={product.stock > 20 ? "default" : product.stock > 5 ? "secondary" : "destructive"}>
                {product.stock} unid.
              </Badge>
            </div>

            <Button className="w-full" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
              <Plus size={16} className="mr-2" />
              Agregar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
