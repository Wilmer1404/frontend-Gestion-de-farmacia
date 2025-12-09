"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { KpiCards } from "@/components/reports/kpi-cards"
import { SalesChart } from "@/components/reports/sales-chart"
import { API_URL } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  const [kpiData, setKpiData] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      const headers = { "Authorization": `Bearer ${token}` }

      try {
        const [resKpi, resChart, resTop] = await Promise.all([
            fetch(`${API_URL}/reports/kpi`, { headers }),
            fetch(`${API_URL}/reports/chart`, { headers }),
            fetch(`${API_URL}/reports/top-products`, { headers })
        ])

        if (resKpi.ok) setKpiData(await resKpi.json())
        if (resChart.ok) setChartData(await resChart.json())
        if (resTop.ok) setTopProducts(await resTop.json())

      } catch (error) {
        console.error("Error cargando reportes", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Reportes y Estadísticas</h1>
        
        {loading ? (
            <div className="text-center p-10">Cargando datos...</div>
        ) : (
            <>
                {/* 1. KPIs */}
                {kpiData && <KpiCards data={kpiData} />}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* 2. Gráfico Principal (Ocupa 4 columnas) */}
                    <div className="col-span-4">
                        <SalesChart data={chartData} />
                    </div>

                    {/* 3. Top Productos (Ocupa 3 columnas) */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Top 5 Productos Vendidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.map((product, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{product.productName}</p>
                                            <p className="text-xs text-muted-foreground">{product.quantitySold} unidades vendidas</p>
                                        </div>
                                        <div className="font-bold text-sm">
                                            ${product.totalRevenue?.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                {topProducts.length === 0 && <p className="text-sm text-slate-500">No hay datos de ventas aún.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        )}
      </div>
    </div>
  )
}