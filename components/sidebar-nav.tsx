"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Package,
  ShoppingCart,
  Clock,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Percent,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navItems = [
  { id: "daily-overview", label: "Daily Overview", icon: BarChart3, path: "/" },
  { id: "latest-updates", label: "Latest Updates", icon: Sparkles, path: "/?section=latest-updates" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/?section=inventory" },
  { id: "active-orders", label: "Active Orders", icon: Clock, path: "/?section=active-orders" },
  { id: "order-archive", label: "Order Archive", icon: FileText, path: "/?section=order-archive" },
  { id: "customers", label: "Customers", icon: Users, path: "/?section=customers" },
  { id: "discount-codes", label: "Discount Codes", icon: Percent, path: "/?section=discount-codes" },
  { id: "invoices", label: "Invoices", icon: FileText, path: "/?section=invoices" },
  { id: "messaging", label: "Messaging", icon: MessageSquare, path: "/?section=messaging" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/?section=analytics" },
  { id: "emails", label: "Email Center", icon: Mail, path: "/?section=emails" },
  { id: "settings", label: "Settings", icon: Settings, path: "/?section=settings" },
]

export function SidebarNav({ activeSection, onSectionChange }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  const handleSectionClick = (sectionId: string, path: string) => {
    if (pathname !== "/" && !pathname.startsWith("/?")) {
      // If we're on a specific page, navigate to the main dashboard with the section
      router.push(path)
    } else {
      // If we're already on the main dashboard, just update the section
      onSectionChange(sectionId)
      router.push(path)
    }
    
    // Auto-collapse on mobile after selection
    if (isMobile) {
      setCollapsed(true)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Floating Mobile Toggle Button */}
      {isMobile && collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-50 bg-slate-800/90 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/90 shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      <div
        className={cn(
          "relative h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 z-50",
          collapsed ? (isMobile ? "w-0" : "w-12") : "w-64",
          isMobile && collapsed && "overflow-hidden",
          isMobile && !collapsed && "fixed left-0 top-0 w-64 z-50"
        )}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-slate-700/50",
          isMobile && collapsed && "p-2"
        )}>
          {!collapsed && (
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-purple-300 transition-colors">
              Dashboard
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "text-slate-400 hover:text-white hover:bg-slate-800/50",
              isMobile && collapsed && "ml-0"
            )}
          >
            {isMobile && !collapsed ? (
              <X className="h-4 w-4" />
            ) : collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "p-2 space-y-1",
          isMobile && collapsed && "hidden"
        )}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleSectionClick(item.id, item.path)}
                className={cn(
                  "w-full justify-start text-left transition-all duration-200",
                  collapsed ? "px-2" : "px-3",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                )}
                title={collapsed ? item.label : undefined}
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
    </>
  )
}
