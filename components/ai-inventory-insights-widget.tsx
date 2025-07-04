"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, Brain, TrendingUp, AlertTriangle, Package, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InventoryInsightsWidgetProps {
  inventory: any[]
  orders: any[]
  purchases: any[]
  sales: any[]
}

export function AIInventoryInsightsWidget({ inventory, orders, purchases, sales }: InventoryInsightsWidgetProps) {
  const [insights, setInsights] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { toast } = useToast()

  const generateInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-inventory-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory,
          orders,
          purchases,
          sales
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate insights")
      }

      const data = await response.json()
      setInsights(data.insights)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error generating insights:", error)
      toast({
        title: "AI Insights Error",
        description: "Failed to generate inventory insights",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!collapsed && !insights) {
      generateInsights()
    }
  }, [collapsed])

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between w-full text-left focus:outline-none hover:bg-slate-700/30 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-white text-xl">AI Inventory Insights</CardTitle>
            <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-purple-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-purple-400" />
          )}
        </button>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-purple-400 animate-spin mr-3" />
                <span className="text-slate-300">Generating AI insights...</span>
              </div>
            ) : insights ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm text-slate-400">AI Analysis</span>
                  </div>
                  {lastUpdated && (
                    <span className="text-xs text-slate-500">
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                <ScrollArea className="h-64 border border-slate-700/50 rounded-lg bg-slate-900/50 p-4">
                  <div className="text-slate-200 text-sm whitespace-pre-line">
                    {insights}
                  </div>
                </ScrollArea>
                
                <div className="flex justify-end">
                  <Button
                    onClick={generateInsights}
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Refresh Insights
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No insights generated yet</p>
                <Button
                  onClick={generateInsights}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 