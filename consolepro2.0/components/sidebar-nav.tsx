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
  Pill,
  ChevronDown,
  ChevronUp,
  Info,
  Calculator,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarNavProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onSidebarToggle?: (collapsed: boolean) => void
}

const navItems = [
  { id: "daily-overview", label: "Daily Overview", icon: BarChart3, path: "/" },
  { id: "latest-updates", label: "Latest Updates", icon: Sparkles, path: "/?section=latest-updates" },
  { id: "inventory", label: "Inventory", icon: Package, path: "/?section=inventory" },
  { id: "active-orders", label: "Active Orders", icon: Clock, path: "/?section=active-orders" },
  { id: "order-archive", label: "Order Archive", icon: FileText, path: "/?section=order-archive" },
  { id: "customers", label: "Customers", icon: Users, path: "/?section=customers" },
  { id: "discount-codes", label: "Discount Codes", icon: Percent, path: "/?section=discount-codes" },
  { id: "playground", label: "Pricing Playground", icon: Calculator, path: "/playground" },
  { id: "invoices", label: "Invoices", icon: FileText, path: "/?section=invoices" },
  { id: "messaging", label: "Messaging", icon: MessageSquare, path: "/?section=messaging" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/?section=analytics" },
  { id: "product-information", label: "Product Info", icon: Info, path: "/?section=product-information",
    subItems: [
      { id: "aod-9604", label: "AOD-9604", path: "/aod-9604" },
      { id: "bpc-157", label: "BPC-157", path: "/bpc-157" },
      { id: "cagrilintide", label: "Cagrilintide", path: "/cagrilintide" },
      { id: "epithalon", label: "Epithalon", path: "/epithalon" },
      { id: "ghk-cu", label: "GHK-Cu", path: "/ghk-cu" },
      { id: "ghrp-2", label: "GHRP-2", path: "/ghrp-2" },
      { id: "hcg", label: "HCG", path: "/hcg" },
      { id: "hexarelin", label: "Hexarelin", path: "/hexarelin" },
      { id: "hgh", label: "HGH", path: "/hgh" },
      { id: "igf-1-lr3", label: "IGF-1 LR3", path: "/igf-1-lr3" },
      { id: "kisspeptin", label: "Kisspeptin", path: "/kisspeptin" },
      { id: "melanotan-2", label: "Melanotan II (MT-2)", path: "/melanotan-2" },
      { id: "mots-c", label: "MOTS-C", path: "/mots-c" },
      { id: "nad", label: "NAD+", path: "/nad" },
      { id: "peg-mgf", label: "PEG-MGF", path: "/peg-mgf" },
    ]
  },
  { id: "emails", label: "Email Center", icon: Mail, path: "/?section=emails" },
  { id: "settings", label: "Settings", icon: Settings, path: "/?section=settings" },
]

export function SidebarNav({ activeSection, onSectionChange, onSidebarToggle }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedDropdowns, setExpandedDropdowns] = useState<Set<string>>(new Set())
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  // Auto-expand Product Info dropdown if we're on a peptide page
  useEffect(() => {
    const isOnPeptidePage = navItems.find(item => 
      item.subItems?.some(sub => sub.path === pathname)
    )
    if (isOnPeptidePage) {
      setExpandedDropdowns(prev => new Set(prev).add("product-information"))
    }
  }, [pathname])

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

  const toggleDropdown = (sectionId: string) => {
    setExpandedDropdowns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
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
      
      {/* Floating Mobile Toggle Button - Top of screen */}
      {isMobile && collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(false)}
          className="fixed top-2 left-2 z-50 bg-slate-800/90 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/90 shadow-lg h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      <div
        className={cn(
          "h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 transition-all duration-300 flex flex-col",
          collapsed ? (isMobile ? "w-0 opacity-0 pointer-events-none" : "w-12") : "w-64",
          isMobile && collapsed && "hidden",
          isMobile && !collapsed && "fixed left-0 top-0 w-64 z-50"
        )}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

        {/* Header - Fixed at top */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-slate-700/50 flex-shrink-0",
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

        {/* Navigation - Scrollable */}
        <nav className={cn(
          "flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800",
          isMobile && collapsed && "hidden"
        )}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isDropdownExpanded = expandedDropdowns.has(item.id)

            return (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (hasSubItems) {
                      toggleDropdown(item.id)
                    } else {
                      handleSectionClick(item.id, item.path)
                    }
                  }}
                  className={cn(
                    "w-full justify-start text-left transition-all duration-200 relative",
                    collapsed ? "px-2" : "px-3",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                  {!collapsed && (
                    <>
                      <span>{item.label}</span>
                      {hasSubItems && (
                        <div className="ml-auto">
                          {isDropdownExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-l" />
                  )}
                </Button>
                
                {/* Render subItems if present, not collapsed, and dropdown is expanded */}
                {hasSubItems && !collapsed && isDropdownExpanded && (
                  <div className="ml-8 space-y-1 mt-1">
                    {item.subItems!.map((sub) => (
                      <Link key={sub.id} href={sub.path} legacyBehavior>
                        <a
                          className={cn(
                            "block px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800/50 text-sm transition-all duration-200",
                            usePathname() === sub.path && "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30"
                          )}
                        >
                          <span className="align-middle">{sub.label}</span>
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </>
  )
}
