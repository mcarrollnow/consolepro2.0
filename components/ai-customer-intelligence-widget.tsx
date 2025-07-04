"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, Users, TrendingUp, AlertTriangle, UserCheck, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CustomerIntelligenceWidgetProps {
  customers: any[]
  orders: any[]
  archivedOrders: any[]
}

export function AICustomerIntelligenceWidget({ customers, orders, archivedOrders }: CustomerIntelligenceWidgetProps) {
  const [intelligence, setIntelligence] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { toast } = useToast()

  const generateIntelligence = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-customer-intelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customers,
          orders,
          archivedOrders
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate customer intelligence")
      }

      const data = await response.json()
      setIntelligence(data.intelligence)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error generating customer intelligence:", error)
      toast({
        title: "AI Intelligence Error",
        description: "Failed to generate customer intelligence",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!collapsed && !intelligence) {
      generateIntelligence()
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
            <Users className="h-6 w-6 text-blue-400" />
            <CardTitle className="text-white text-xl">AI Customer Intelligence</CardTitle>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-blue-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-400" />
          )}
        </button>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin mr-3" />
                <span className="text-slate-300">Generating customer intelligence...</span>
              </div>
            ) : intelligence ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-cyan-400" />
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
                    {intelligence}
                  </div>
                </ScrollArea>
                
                <div className="flex justify-end">
                  <Button
                    onClick={generateIntelligence}
                    variant="outline"
                    size="sm"
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Refresh Intelligence
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                <p className="text-slate-400 mb-4">No customer intelligence generated yet</p>
                <Button
                  onClick={generateIntelligence}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Generate Intelligence
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 