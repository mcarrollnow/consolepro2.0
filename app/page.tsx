"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { InventorySection } from "@/components/inventory-section"
import { OrdersSection } from "@/components/orders-section"
import { CustomersSection } from "@/components/customers-section"
import { AnalyticsSection } from "@/components/analytics-section"
import { MessagingSection } from "@/components/messaging-section"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("inventory")

  const renderSection = () => {
    switch (activeSection) {
      case "inventory":
        return <InventorySection />
      case "orders":
        return <OrdersSection />
      case "customers":
        return <CustomersSection />
      case "analytics":
        return <AnalyticsSection />
      case "messaging":
        return <MessagingSection />
      case "invoices":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Invoices & Purchase Orders</h2>
            <p className="text-slate-400">Google Sheets integration for invoice management</p>
            <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-400">Invoice management interface - Google Sheets integration needed</p>
            </div>
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
      default:
        return <InventorySection />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/20 to-purple-900/20 pointer-events-none" />

      <div className="flex relative z-10">
        <SidebarNav activeSection={activeSection} onSectionChange={setActiveSection} />

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">{renderSection()}</div>
        </main>
      </div>
    </div>
  )
}
