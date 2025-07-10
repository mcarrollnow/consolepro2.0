"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Calendar, 
  DollarSign, 
  Package, 
  FileText, 
  TrendingUp, 
  RefreshCw, 
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DailyOverview {
  date: string
  summary: {
    pendingOrders: number
    ordersNeedingInvoices: number
    thirtyDayRevenue: number
    totalOrders: number
    totalCustomers: number
  }
  details: {
    pendingOrders: any[]
    ordersNeedingInvoices: any[]
    recentOrders: any[]
  }
  aiInsights: string
}

export function DailyOverview() {
  console.log("DailyOverview component rendered")
  const [overview, setOverview] = useState<DailyOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchDailyOverview = async () => {
    console.log("Fetching daily overview...")
    try {
      setLoading(true)
      const response = await fetch("/api/daily-overview")
      console.log("Daily overview response status:", response.status)
      if (response.ok) {
        const data = await response.json()
        console.log("Daily overview data received:", data)
        setOverview(data)
      } else {
        console.error("Daily overview response not ok:", response.status, response.statusText)
        toast({
          title: "Error",
          description: "Failed to fetch daily overview",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching daily overview:", error)
      toast({
        title: "Error",
        description: "Failed to load daily overview",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshOverview = async () => {
    setRefreshing(true)
    await fetchDailyOverview()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchDailyOverview()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-2 text-white">Generating daily overview...</span>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <span className="ml-2 text-white">Failed to load daily overview</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Daily Business Overview</h2>
          <p className="text-slate-400">Your daily business intelligence report</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
            <Calendar className="h-4 w-4 mr-1" />
            {overview.date}
          </Badge>
          <Button
            onClick={refreshOverview}
            disabled={refreshing}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Pending Orders</p>
                <p className="text-xl font-bold text-white">{overview.summary.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-slate-400">Need Invoices</p>
                <p className="text-xl font-bold text-white">{overview.summary.ordersNeedingInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">30-Day Revenue</p>
                <p className="text-xl font-bold text-white">${overview.summary.thirtyDayRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Total Orders</p>
                <p className="text-xl font-bold text-white">{overview.summary.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 text-cyan-400 mr-2" />
            AI Business Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
                {overview.aiInsights}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      {overview.details.pendingOrders.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 text-yellow-400 mr-2" />
              Pending Orders ({overview.details.pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.details.pendingOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{order.Order_Code || order.orderId}</p>
                    <p className="text-slate-400 text-sm">{order.Customer_Name || order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${parseFloat(order.Total_Amount || order.total || 0).toFixed(2)}</p>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {order.Fulfillment_Status || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Needing Invoices */}
      {overview.details.ordersNeedingInvoices.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 text-orange-400 mr-2" />
              Orders Needing Invoices ({overview.details.ordersNeedingInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.details.ordersNeedingInvoices.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{order.Order_Code || order.orderId}</p>
                    <p className="text-slate-400 text-sm">{order.Customer_Name || order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${parseFloat(order.Total_Amount || order.total || 0).toFixed(2)}</p>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      Invoice Needed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 