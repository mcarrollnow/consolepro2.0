"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Brain, 
  Zap, 
  Tag, 
  Settings, 
  Users, 
  Package, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  BarChart3,
  Sparkles,
  ArrowRight,
  Star,
  Target,
  Lightbulb,
  Rocket
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UpdateItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
  action: () => void
  badge?: string
  color: string
}

export function LatestUpdatesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { toast } = useToast()

  const handleAIChat = () => {
    // Scroll to AI chat section
    const aiChatElement = document.querySelector('[data-section="ai-chat"]')
    if (aiChatElement) {
      aiChatElement.scrollIntoView({ behavior: "smooth" })
    }
    toast({
      title: "AI Chat Opened",
      description: "You can now interact with Geoffrey, your AI assistant!",
    })
  }

  const handleInventoryInsights = () => {
    // Navigate to inventory section and expand AI widget
    const inventorySection = document.querySelector('[data-section="inventory"]')
    if (inventorySection) {
      inventorySection.scrollIntoView({ behavior: "smooth" })
      // Trigger the AI widget to expand
      setTimeout(() => {
        const aiWidget = inventorySection.querySelector('[data-ai-widget="inventory"]')
        if (aiWidget) {
          const expandButton = aiWidget.querySelector('button')
          expandButton?.click()
        }
      }, 500)
    }
    toast({
      title: "Inventory AI Insights",
      description: "Opening AI-powered inventory analysis...",
    })
  }

  const handleCustomerIntelligence = () => {
    // Navigate to customers section and expand AI widget
    const customersSection = document.querySelector('[data-section="customers"]')
    if (customersSection) {
      customersSection.scrollIntoView({ behavior: "smooth" })
      // Trigger the AI widget to expand
      setTimeout(() => {
        const aiWidget = customersSection.querySelector('[data-ai-widget="customers"]')
        if (aiWidget) {
          const expandButton = aiWidget.querySelector('button')
          expandButton?.click()
        }
      }, 500)
    }
    toast({
      title: "Customer AI Intelligence",
      description: "Opening AI-powered customer analysis...",
    })
  }

  const handleDiscountCodes = () => {
    // Navigate to discount codes section
    const discountSection = document.querySelector('[data-section="discount-codes"]')
    if (discountSection) {
      discountSection.scrollIntoView({ behavior: "smooth" })
    }
    toast({
      title: "Discount Codes",
      description: "Navigate to the discount codes section to use AI analysis",
    })
  }

  const handleBusinessAnalytics = () => {
    // Navigate to analytics section
    const analyticsSection = document.querySelector('[data-section="analytics"]')
    if (analyticsSection) {
      analyticsSection.scrollIntoView({ behavior: "smooth" })
    }
    toast({
      title: "Business Analytics",
      description: "Opening AI-powered business analytics...",
    })
  }

  const handleActionExecution = () => {
    handleAIChat()
    toast({
      title: "Action Execution",
      description: "Use the AI chat to execute actions like 'Generate invoice for order ABC123'",
    })
  }

  const updates: UpdateItem[] = [
    {
      id: "ai-chat-enhanced",
      title: "Enhanced AI Assistant (Geoffrey)",
      description: "Your intelligent business butler with natural language processing and context-aware responses",
      icon: <Brain className="h-6 w-6" />,
      category: "ai-assistant",
      action: handleAIChat,
      badge: "NEW",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "discount-code-analysis",
      title: "AI Discount Code Analysis",
      description: "Analyze existing discount codes and get performance insights with optimization recommendations",
      icon: <Tag className="h-6 w-6" />,
      category: "discount-codes",
      action: handleDiscountCodes,
      badge: "FEATURE",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "discount-code-creation",
      title: "AI Discount Code Creation",
      description: "Generate strategic discount codes based on customer segments and business data",
      icon: <Target className="h-6 w-6" />,
      category: "discount-codes",
      action: handleDiscountCodes,
      badge: "FEATURE",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "inventory-insights",
      title: "AI Inventory Intelligence",
      description: "Get AI-powered insights on stock levels, demand forecasting, and optimization recommendations",
      icon: <Package className="h-6 w-6" />,
      category: "inventory",
      action: handleInventoryInsights,
      badge: "WIDGET",
      color: "from-orange-500 to-red-500"
    },
    {
      id: "customer-intelligence",
      title: "AI Customer Intelligence",
      description: "Customer segmentation, lifetime value analysis, and predictive churn detection",
      icon: <Users className="h-6 w-6" />,
      category: "customers",
      action: handleCustomerIntelligence,
      badge: "WIDGET",
      color: "from-indigo-500 to-purple-500"
    },
    {
      id: "action-execution",
      title: "AI Action Execution",
      description: "Execute console actions like generating Stripe invoices and updating order statuses",
      icon: <Settings className="h-6 w-6" />,
      category: "ai-assistant",
      action: handleActionExecution,
      badge: "POWER",
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "business-analytics",
      title: "AI Business Analytics",
      description: "Comprehensive business intelligence with revenue analysis and predictive insights",
      icon: <BarChart3 className="h-6 w-6" />,
      category: "analytics",
      action: handleBusinessAnalytics,
      badge: "INSIGHTS",
      color: "from-teal-500 to-green-500"
    },
    {
      id: "predictive-insights",
      title: "Predictive Analytics",
      description: "AI-powered forecasting for revenue, demand, and customer behavior trends",
      icon: <TrendingUp className="h-6 w-6" />,
      category: "analytics",
      action: handleBusinessAnalytics,
      badge: "AI",
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "context-aware",
      title: "Context-Aware Responses",
      description: "AI understands your business data and provides personalized, relevant insights",
      icon: <Lightbulb className="h-6 w-6" />,
      category: "ai-assistant",
      action: handleAIChat,
      badge: "SMART",
      color: "from-violet-500 to-purple-500"
    },
    {
      id: "multi-modal-analysis",
      title: "Multi-Modal Data Analysis",
      description: "Combines data from inventory, orders, customers, and sales for comprehensive insights",
      icon: <Sparkles className="h-6 w-6" />,
      category: "analytics",
      action: handleBusinessAnalytics,
      badge: "ADVANCED",
      color: "from-cyan-500 to-blue-500"
    }
  ]

  const categories = [
    { id: "all", name: "All Updates", icon: <Rocket className="h-4 w-4" /> },
    { id: "ai-assistant", name: "AI Assistant", icon: <Brain className="h-4 w-4" /> },
    { id: "discount-codes", name: "Discount Codes", icon: <Tag className="h-4 w-4" /> },
    { id: "inventory", name: "Inventory", icon: <Package className="h-4 w-4" /> },
    { id: "customers", name: "Customers", icon: <Users className="h-4 w-4" /> },
    { id: "analytics", name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> }
  ]

  const filteredUpdates = selectedCategory === "all" 
    ? updates 
    : updates.filter(update => update.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Latest Updates</h2>
          <p className="text-slate-400 mt-1">Explore the new AI-powered features in your console</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30">
          <Sparkles className="h-4 w-4 mr-1" />
          AI Enhanced
        </Badge>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0"
                : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Updates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUpdates.map((update) => (
          <Card 
            key={update.id}
            className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 cursor-pointer group"
            onClick={update.action}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${update.color}`}>
                  {update.icon}
                </div>
                {update.badge && (
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                    {update.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {update.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {update.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-wide">
                  {categories.find(c => c.id === update.category)?.name}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-cyan-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Star className="h-5 w-5 text-cyan-400 mr-2" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">Try these AI commands:</p>
              <ul className="text-slate-400 space-y-1">
                <li>• "Analyze my discount codes"</li>
                <li>• "Generate invoice for order ABC123"</li>
                <li>• "Which items need restocking?"</li>
                <li>• "Who are my VIP customers?"</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-semibold">Explore AI widgets:</p>
              <ul className="text-slate-400 space-y-1">
                <li>• Inventory section → AI Insights widget</li>
                <li>• Customers section → AI Intelligence widget</li>
                <li>• Main dashboard → Geoffrey AI chat</li>
                <li>• Analytics section → Business insights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 