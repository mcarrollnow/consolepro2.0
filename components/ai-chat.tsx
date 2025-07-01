"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
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
      
      // Provide a helpful fallback response
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      const fallbackResponse = errorMessage.includes("Claude API key not configured") 
        ? "I'm not configured yet! Please add your Claude API key to the Vercel environment variables to enable AI chat."
        : `Sorry, I encountered an error: ${errorMessage}. Please try again or check the console for more details.`
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      toast({
        title: "AI Error",
        description: errorMessage,
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
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
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
                          <Bot className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
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
  )
} 