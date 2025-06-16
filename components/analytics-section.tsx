"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
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
                <p className="text-2xl font-bold text-white">$89,234</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+12.5%</span>
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
                <p className="text-2xl font-bold text-white">1,456</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+8.2%</span>
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
                <p className="text-2xl font-bold text-white">89</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  <span className="text-red-400 text-sm">-3.1%</span>
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
                <p className="text-2xl font-bold text-white">$187.50</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+5.7%</span>
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
              {[
                { name: "Wireless Headphones", sales: 245, revenue: "$24,500" },
                { name: "Gaming Mouse", sales: 189, revenue: "$11,340" },
                { name: "Mechanical Keyboard", sales: 156, revenue: "$20,280" },
                { name: "USB-C Cable", sales: 134, revenue: "$2,680" },
              ].map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-slate-400 text-sm">{product.sales} units sold</p>
                    </div>
                  </div>
                  <p className="text-green-400 font-semibold">{product.revenue}</p>
                </div>
              ))}
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
