"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Phone, Send, Users } from "lucide-react"

export function MessagingSection() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const contacts = [
    {
      id: "1",
      name: "John Doe",
      phone: "+1-555-0123",
      status: "online",
      lastMessage: "Thanks for the quick delivery!",
    },
    { id: "2", name: "Jane Smith", phone: "+1-555-0124", status: "offline", lastMessage: "When will my order ship?" },
    {
      id: "3",
      name: "Mike Johnson",
      phone: "+1-555-0125",
      status: "online",
      lastMessage: "Perfect, exactly what I needed.",
    },
  ]

  const messages = [
    { id: "1", sender: "customer", content: "Hi, I have a question about my order", time: "10:30 AM" },
    { id: "2", sender: "agent", content: "Hello! I'd be happy to help. What's your order number?", time: "10:32 AM" },
    { id: "3", sender: "customer", content: "It's PO-2024-001", time: "10:33 AM" },
    {
      id: "4",
      sender: "agent",
      content: "I can see your order is currently being processed and will ship tomorrow.",
      time: "10:35 AM",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Messaging Center</h2>
        <p className="text-slate-400 mt-1">VOIP, SMS, and customer communication</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Conversations</p>
                <p className="text-2xl font-bold text-white">23</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Messages Today</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Send className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">VOIP Calls</p>
                <p className="text-2xl font-bold text-white">45</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Phone className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Response Time</p>
                <p className="text-2xl font-bold text-white">2.3m</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messaging Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedContact === contact.id
                      ? "bg-cyan-500/20 border border-cyan-500/30"
                      : "bg-slate-900/30 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{contact.name}</p>
                    <Badge
                      className={
                        contact.status === "online"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-500/20 text-slate-400"
                      }
                    >
                      {contact.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm">{contact.phone}</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">{contact.lastMessage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedContact ? contacts.find((c) => c.id === selectedContact)?.name : "Select a contact"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedContact ? (
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-64 overflow-y-auto space-y-3 p-4 bg-slate-900/30 rounded-lg">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          msg.sender === "agent"
                            ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-900/50 border-slate-600 text-white resize-none"
                    rows={2}
                  />
                  <div className="flex flex-col space-y-2">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a contact to start messaging</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
              <Phone className="h-4 w-4 mr-2" />
              Start VOIP Call
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Bulk SMS
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Users className="h-4 w-4 mr-2" />
              Create Group Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
