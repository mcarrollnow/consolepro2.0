"use client"

import { useState } from "react"
import { SidebarNav } from "./sidebar-nav"
import { cn } from "@/lib/utils"
import { MainDashboard } from "./main-dashboard"
import { InventorySection } from "./inventory-section"
import { ActiveOrdersSection } from "./active-orders-section"
import { OrderArchiveSection } from "./order-archive-section"
import { CustomersSection } from "./customers-section"
import { AnalyticsSection } from "./analytics-section"
import { MessagingSection } from "./messaging-section"
import { DiscountCodesSection } from "./discount-codes-section"
import InvoicesSection from "./invoices-section"
import { LatestUpdatesSection } from "./latest-updates-section"
import { ProductInformationSection } from "./product-information-section"

interface DashboardLayoutProps {
  children?: React.ReactNode
  defaultSection?: string
}

export function DashboardLayout({ children, defaultSection }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState(defaultSection || "daily-overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSectionChange = (section: string) => {
    console.log("Changing section to:", section)
    setActiveSection(section)
  }

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }

  const renderSection = () => {
    // If children are provided, render them directly (for product/customer pages)
    if (children) {
      return children
    }
    
    // Otherwise, render based on active section
    switch (activeSection) {
      case "daily-overview":
        return <MainDashboard />
      case "latest-updates":
        return <LatestUpdatesSection />
      case "inventory":
        return <InventorySection />
      case "active-orders":
        return <ActiveOrdersSection />
      case "customers":
        return <CustomersSection />
      case "discount-codes":
        return <DiscountCodesSection />
      case "playground":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Pricing Playground</h2>
            <p className="text-slate-400">Test product pricing with different quantities, discount codes, and custom adjustments</p>
            <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-400">Navigate to /playground to access the pricing playground</p>
            </div>
          </div>
        )
      case "analytics":
        return <AnalyticsSection />
      case "messaging":
        return <MessagingSection />
      case "product-information":
        return <ProductInformationSection />
      case "invoices":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Stripe Invoices</h2>
            <p className="text-slate-400">View and manage Stripe invoices with read-only access</p>
            <InvoicesSection />
          </div>
        )
      case "emails":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Email Center</h2>
            <p className="text-slate-400">Manage incoming and outgoing emails</p>
            <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-400">Email management interface - Email service integration needed</p>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Settings</h2>
            <p className="text-slate-400">Configure dashboard settings and integrations</p>
            <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-400">Settings interface - Configuration options</p>
            </div>
          </div>
        )
      case "order-archive":
        return <OrderArchiveSection />
      default:
        return <MainDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/20 to-purple-900/20 pointer-events-none" />

      <div className="flex relative z-10 h-screen">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-full z-50">
          <SidebarNav 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange}
            onSidebarToggle={handleSidebarToggle}
          />
        </div>

        {/* Scrollable Main Content */}
        <main className={cn(
          "flex-1 p-4 md:p-8 overflow-y-auto h-screen transition-all duration-300",
          sidebarCollapsed ? "ml-0 md:ml-12" : "ml-0 md:ml-64"
        )}>
          <div className="max-w-7xl mx-auto">{renderSection()}</div>
        </main>
      </div>
    </div>
  )
} 