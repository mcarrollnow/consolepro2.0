"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { useState, useEffect } from "react"

export function AnalyticsSection() {
  const [orders, setOrders] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [ordersRes, customersRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/customers"),
        ])
        const ordersData = await ordersRes.json()
        const customersData = await customersRes.json()
        setOrders(ordersData)
        setCustomers(customersData)
      } catch (e) {
        setOrders([])
        setCustomers([])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Calculate metrics
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const ordersThisMonth = orders.filter((order) => {
    const d = new Date(order.orderDate)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })
  const monthlyRevenue = ordersThisMonth.reduce((sum, order) => sum + (order.total || 0), 0)
  const avgOrderValue = ordersThisMonth.length > 0 ? (monthlyRevenue / ordersThisMonth.length) : 0

  const newCustomers = customers.filter((customer) => {
    const d = new Date(customer.created_date)
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  })

  return (
    <div className="space-y-6" data-section="analytics">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Analytics & Trends</h2>
        <p className="text-slate-400 mt-1">Sales performance and business insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : `$${monthlyRevenue.toLocaleString(undefined, {maximumFractionDigits: 2})}`}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  {/* Placeholder for growth % */}
                  <span className="text-green-400 text-sm">&nbsp;</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Orders This Month</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : ordersThisMonth.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  {/* Placeholder for growth % */}
                  <span className="text-green-400 text-sm">&nbsp;</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">New Customers</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : newCustomers.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  {/* Placeholder for growth % */}
                  <span className="text-red-400 text-sm">&nbsp;</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Order Value</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : `$${avgOrderValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  {/* Placeholder for growth % */}
                  <span className="text-green-400 text-sm">&nbsp;</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Package className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <p className="text-slate-400">Sales chart visualization</p>
                <p className="text-slate-500 text-sm">Chart component integration needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for top products */}
              <div className="text-slate-400">Top products analytics coming soon...</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projections */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Sales Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-slate-900/30 rounded-lg">
              <p className="text-slate-400 text-sm">Next Month Projection</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">$95,000</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+6.5% growth</span>
              </div>
            </div>
            <div className="text-center p-6 bg-slate-900/30 rounded-lg">
              <p className="text-slate-400 text-sm">Quarter Projection</p>
              <p className="text-3xl font-bold text-purple-400 mt-2">$285,000</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+8.2% growth</span>
              </div>
            </div>
            <div className="text-center p-6 bg-slate-900/30 rounded-lg">
              <p className="text-slate-400 text-sm">Year Projection</p>
              <p className="text-3xl font-bold text-green-400 mt-2">$1.2M</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+15.3% growth</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
