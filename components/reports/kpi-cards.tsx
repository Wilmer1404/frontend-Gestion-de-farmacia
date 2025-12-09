import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react"

interface KpiData {
  totalSalesToday: number
  totalSalesMonth: number
  salesCountToday: number
  lowStockCount: number
}

export function KpiCards({ data }: { data: KpiData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalSalesToday?.toFixed(2) || "0.00"}</div>
          <p className="text-xs text-muted-foreground">Ingresos del día</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transacciones Hoy</CardTitle>
          <ShoppingBag className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.salesCountToday || 0}</div>
          <p className="text-xs text-muted-foreground">Boletas generadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalSalesMonth?.toFixed(2) || "0.00"}</div>
          <p className="text-xs text-muted-foreground">Acumulado mensual</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.lowStockCount || 0}</div>
          <p className="text-xs text-muted-foreground">Productos en alerta</p>
        </CardContent>
      </Card>
    </div>
  )
}