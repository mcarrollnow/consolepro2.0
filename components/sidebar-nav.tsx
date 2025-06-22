"use client"

import { useState } from "react"
import {
  Package,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navItems = [
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "orders", label: "Orders & Tracking", icon: ShoppingCart },
  { id: "customers", label: "Customers", icon: Users },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "messaging", label: "Messaging", icon: MessageSquare },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "emails", label: "Email Center", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
]

export function SidebarNav({ activeSection, onSectionChange }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "relative h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!collapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800/50"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full justify-start text-left transition-all duration-200",
                collapsed ? "px-2" : "px-3",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50",
              )}
            >
              <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-l" />
              )}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
