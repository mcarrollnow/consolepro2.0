"use client"

import { useState } from "react"
import { AIChat } from "./ai-chat"
import { DailyOverview } from "./daily-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, BarChart3 } from "lucide-react"

export function MainDashboard() {
  const [dailyOverviewCollapsed, setDailyOverviewCollapsed] = useState(true)

  return (
    <div className="space-y-6" data-section="ai-chat">
      {/* AI Chat with Geoffrey - Primary Focus */}
      <div className="mb-8">
        <AIChat />
      </div>

      {/* Collapsible Daily Overview */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <button
            onClick={() => setDailyOverviewCollapsed(!dailyOverviewCollapsed)}
            className="flex items-center justify-between w-full text-left focus:outline-none hover:bg-slate-700/30 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-cyan-400" />
              <CardTitle className="text-white text-xl">Daily Overview</CardTitle>
            </div>
            {dailyOverviewCollapsed ? (
              <ChevronRight className="h-5 w-5 text-cyan-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-cyan-400" />
            )}
          </button>
        </CardHeader>
        {!dailyOverviewCollapsed && (
          <CardContent className="pt-0">
            <DailyOverview />
          </CardContent>
        )}
      </Card>
    </div>
  )
} 