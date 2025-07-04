"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Loader2, Sparkles, ChevronDown, ChevronRight, Zap, Tag, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  action?: {
    type: string
    data?: any
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning, Sir!"
  if (hour < 18) return "Good afternoon, Sir!"
  return "Good evening, Sir!"
}

function GeoffreyAvatar({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/geoffrey.png"
      alt="Geoffrey the AI"
      width={size}
      height={size}
      className="rounded-full border-2 border-cyan-400 bg-slate-800"
      style={{ objectFit: 'cover' }}
      priority
    />
  )
}

function DailyOverviewWidget() {
  const [overview, setOverview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch("/api/daily-overview")
        if (!response.ok) throw new Error("Failed to fetch daily overview")
        const data = await response.json()
        setOverview(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchOverview()
  }, [])

  const greeting = getGreeting()
  const intro = "I hope all is well with you. I've been busy here maintaining your orders and inventory. Here's a quick update to catch you up:"

  return (
    <div className="mb-6">
      <div className="rounded-xl shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-700/30">
        <button
          className="w-full flex items-center justify-between px-4 py-2 focus:outline-none hover:bg-slate-800/40 rounded-t-xl"
          onClick={() => setCollapsed((c) => !c)}
        >
          <span className="text-cyan-400 font-bold text-base md:text-lg">Daily Overview</span>
          {collapsed ? <ChevronRight className="h-5 w-5 text-cyan-400" /> : <ChevronDown className="h-5 w-5 text-cyan-400" />}
        </button>
        {!collapsed && (
          <div className="p-4 pt-0">
            <div className="flex items-center mb-2">
              <span className="text-xs text-slate-400">(AI-powered by Geoffrey)</span>
            </div>
            {loading ? (
              <div className="text-slate-400 text-sm">Loading daily overview...</div>
            ) : error ? (
              <div className="text-red-400 text-sm">{error}</div>
            ) : overview ? (
              <div className="text-slate-200 text-sm md:text-base space-y-2">
                <div className="font-semibold">{greeting}</div>
                <div>{intro}</div>
                <ul className="list-disc ml-6">
                  <li>You have <span className="text-cyan-300 font-bold">{overview.summary.pendingOrders}</span> pending orders and <span className="text-orange-300 font-bold">{overview.summary.ordersNeedingInvoices}</span> invoices to send.</li>
                  <li>In the last 30 days, you've made <span className="text-green-300 font-bold">${overview.summary.thirtyDayRevenue.toFixed(2)}</span> in revenue.</li>
                </ul>
                <div className="mt-2 text-cyan-300 font-semibold">AI Insight:</div>
                <div className="italic text-slate-300 whitespace-pre-line text-sm">
                  {overview.aiInsights}
                </div>
                <div className="text-xs text-slate-500 mt-2">{overview.date}</div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [contextData, setContextData] = useState<any>(null)
  const [discountCodes, setDiscountCodes] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load context data (inventory, orders, customers) when component mounts
  useEffect(() => {
    loadContextData()
  }, [])

  const loadContextData = async () => {
    try {
      const [inventoryRes, ordersRes, customersRes, discountCodesRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/orders"),
        fetch("/api/customers"),
        fetch("/api/console-discount-codes")
      ])

      const inventory = await inventoryRes.json()
      const orders = await ordersRes.json()
      const customers = await customersRes.json()
      const discountCodesData = await discountCodesRes.json()

      setContextData({
        inventory,
        orders,
        customers,
        timestamp: new Date().toISOString()
      })
      setDiscountCodes(discountCodesData)
    } catch (error) {
      console.error("Error loading context data:", error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Check if this is a special command
      const lowerMessage = inputValue.toLowerCase()
      
      if (lowerMessage.includes('discount code') || lowerMessage.includes('promo code')) {
        await handleDiscountCodeRequest(inputValue)
      } else if (lowerMessage.includes('generate invoice') || lowerMessage.includes('create invoice')) {
        await handleInvoiceGeneration(inputValue)
      } else if (lowerMessage.includes('execute') || lowerMessage.includes('run action')) {
        await handleActionExecution(inputValue)
      } else {
        // Regular chat message
        await handleRegularChat(inputValue)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      
      toast({
        title: "AI Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegularChat = async (message: string) => {
    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        context: contextData
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to get AI response")
    }

    const data = await response.json()
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: data.response,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
  }

  const handleDiscountCodeRequest = async (message: string) => {
    const isCreateRequest = message.toLowerCase().includes('create') || message.toLowerCase().includes('suggest')
    const action = isCreateRequest ? 'create' : 'analyze'

    const response = await fetch("/api/ai-discount-codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        discountCodes,
        orders: contextData?.orders,
        customers: contextData?.customers,
        context: contextData
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to process discount code request")
    }

    const data = await response.json()
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: data.result,
      timestamp: new Date(),
      action: {
        type: 'discount_codes',
        data: { action: data.action }
      }
    }

    setMessages(prev => [...prev, assistantMessage])
  }

  const handleInvoiceGeneration = async (message: string) => {
    // Extract order ID from message (simple regex for now)
    const orderIdMatch = message.match(/order[:\s]*([A-Z0-9-]+)/i)
    const orderId = orderIdMatch ? orderIdMatch[1] : null

    if (!orderId) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'd be happy to help generate an invoice, sir. Could you please specify which order you'd like me to create an invoice for? For example: 'Generate invoice for order ABC123'",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      return
    }

    const response = await fetch("/api/ai-execute-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "generate_stripe_invoice",
        orderId,
        orders: contextData?.orders,
        customers: contextData?.customers,
        context: contextData
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to execute invoice generation")
    }

    const data = await response.json()
    
    let content = data.analysis
    if (data.executeAction && data.actionData.success) {
      content += `\n\n✅ **Invoice Generated Successfully!**\nInvoice Link: ${data.actionData.invoice.invoiceUrl || 'Available in orders section'}`
    } else if (data.actionData.error) {
      content += `\n\n❌ **Error**: ${data.actionData.error}`
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content,
      timestamp: new Date(),
      action: {
        type: 'invoice_generation',
        data: { orderId, success: data.executeAction }
      }
    }

    setMessages(prev => [...prev, assistantMessage])
  }

  const handleActionExecution = async (message: string) => {
    // This is a placeholder for future action execution
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "I understand you'd like me to execute an action, sir. I'm currently learning to handle various console operations. Could you please be more specific about what action you'd like me to perform? For example: 'Generate invoice for order ABC123' or 'Analyze discount codes'",
      timestamp: new Date()
    }
    setMessages(prev => [...prev, assistantMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <>
      <DailyOverviewWidget />
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        {/* Geoffrey Header */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-2">
          <GeoffreyAvatar size={64} />
          <div className="flex-1">
            <span className="text-2xl font-bold text-white">Geoffrey</span>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-500/30">
                <Zap className="h-3 w-3 mr-1" />
                AI Assistant
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 border-green-500/30">
                <Tag className="h-3 w-3 mr-1" />
                Discount Codes
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30">
                <Settings className="h-3 w-3 mr-1" />
                Actions
              </Badge>
            </div>
          </div>
        </div>
        <CardHeader className="pt-2 pb-0">
          <CardTitle className="text-white flex items-center hidden">
            {/* Hide old header */}
            <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
            AI Assistant
            <Badge className="ml-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-500/30">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Messages */}
          <div className="h-48 md:h-64 border border-slate-700/50 rounded-lg bg-slate-900/50">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                  <p className="text-slate-200 text-lg font-semibold">How may I be of service today, sir?</p>
                  <p className="text-slate-400 text-sm">I can help with inventory, orders, customers, discount codes, and even execute actions like generating invoices. For example:</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>• "Analyze my discount codes"</p>
                    <p>• "Create new discount codes for VIP customers"</p>
                    <p>• "Generate invoice for order ABC123"</p>
                    <p>• "Which items need restocking?"</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30"
                            : "bg-slate-700/50 text-slate-200 border border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-start space-x-2 min-w-0">
                          {message.role === "assistant" && (
                            <GeoffreyAvatar size={20} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm whitespace-pre-wrap break-words overflow-hidden">{message.content}</p>
                            {message.action && (
                              <div className="mt-2 p-2 bg-slate-800/50 rounded border border-slate-600/50">
                                <p className="text-xs text-cyan-400 font-semibold">
                                  Action: {message.action.type.replace('_', ' ').toUpperCase()}
                                </p>
                                {message.action.data && (
                                  <p className="text-xs text-slate-400 break-words">
                                    {JSON.stringify(message.action.data, null, 2)}
                                  </p>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          {message.role === "user" && (
                            <User className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700/50 text-slate-200 border border-slate-600/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about inventory, orders, customers, discount codes, or execute actions..."
              className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>
              {contextData ? "Connected to data sources" : "Loading data sources..."}
            </span>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-slate-400 hover:text-white hover:bg-slate-700/50 h-6 px-2"
              >
                Clear Chat
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
} 