"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Loader2, Sparkles, ChevronDown, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
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
          <span className="flex items-center gap-2">
            <GeoffreyAvatar size={28} />
            <span className="text-cyan-400 font-bold text-lg">Geoffrey</span>
          </span>
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
              <div className="text-slate-200 text-base space-y-2">
                <div className="font-semibold">{greeting}</div>
                <div>{intro}</div>
                <ul className="list-disc ml-6">
                  <li>You have <span className="text-cyan-300 font-bold">{overview.summary.pendingOrders}</span> pending orders and <span className="text-orange-300 font-bold">{overview.summary.ordersNeedingInvoices}</span> invoices to send.</li>
                  <li>In the last 30 days, you've made <span className="text-green-300 font-bold">${overview.summary.thirtyDayRevenue.toFixed(2)}</span> in revenue.</li>
                </ul>
                <div className="mt-2 text-cyan-300 font-semibold">AI Insight:</div>
                <div className="italic text-slate-300 whitespace-pre-line">
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
      const [inventoryRes, ordersRes, customersRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/orders"),
        fetch("/api/customers")
      ])

      const inventory = await inventoryRes.json()
      const orders = await ordersRes.json()
      const customers = await customersRes.json()

      setContextData({
        inventory,
        orders,
        customers,
        timestamp: new Date().toISOString()
      })
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
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
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
          <span className="text-2xl font-bold text-white">Geoffrey</span>
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
          <div className="h-64 border border-slate-700/50 rounded-lg bg-slate-900/50">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                  <Bot className="h-8 w-8 text-slate-500" />
                  <p className="text-slate-400 text-sm">Ask me anything about your inventory, orders, or customers!</p>
                  <p className="text-slate-500 text-xs">Examples: "Show me low stock items", "What are my recent orders?", "Find customer John Smith"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30"
                            : "bg-slate-700/50 text-slate-200 border border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === "assistant" && (
                            <GeoffreyAvatar size={20} />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
              placeholder="Ask about inventory, orders, customers..."
              className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
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