"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Clock, CheckCircle, Package, MapPin, Calendar, DollarSign, User, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { OrderCustomer } from "@/lib/types"
import Link from "next/link"

export function OrderArchiveSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ordersData, setOrdersData] = useState<OrderCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderCustomer | null>(null)
  const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchArchivedOrdersData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders?sheet=Archived Orders")
      if (response.ok) {
        const data = await response.json()
        setOrdersData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch archived orders data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching archived orders:", error)
      toast({
        title: "Error",
        description: "Failed to connect to archived orders system",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArchivedOrdersData()
  }, [])

  const filteredOrders = ordersData.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (order.customer_id && order.customer_id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const openOrderDetails = (order: OrderCustomer) => {
    setSelectedOrder(order)
    setIsOrderDetailsDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const totalArchivedOrders = ordersData.length
  const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
  const deliveredOrders = ordersData.filter((order) => 
    order.status.toLowerCase() === "delivered" || order.status.toLowerCase() === "completed"
  ).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Clock className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-2 text-white">Loading archived orders...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Order Archive</h2>
          <p className="text-slate-400 mt-1">View completed and archived orders</p>
        </div>
        <Button 
          onClick={fetchArchivedOrdersData}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25"
        >
          <Clock className="h-4 w-4 mr-2" />
          Refresh Archive
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Archived</p>
                <p className="text-2xl font-bold text-white">{totalArchivedOrders}</p>
              </div>
              <div className="p-2 bg-slate-500/20 rounded-lg">
                <Package className="h-6 w-6 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Delivered</p>
                <p className="text-2xl font-bold text-green-400">{deliveredOrders}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg. Order Value</p>
                <p className="text-2xl font-bold text-purple-400">
                  {totalArchivedOrders > 0 ? formatCurrency(totalRevenue / totalArchivedOrders) : "$0.00"}
                </p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Archived Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search archived orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No archived orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Order ID</TableHead>
                  <TableHead className="text-slate-300">Customer</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-slate-300">Items</TableHead>
                  <TableHead className="text-slate-300">Total</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.orderId} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 font-mono">{order.orderId}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-white font-medium">
                          <Link 
                            href={`/customers/${order.customer_id}`}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            {order.customerName}
                          </Link>
                        </div>
                        <div className="text-xs text-slate-400">
                          ID: {order.customer_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{formatDate(order.orderDate)}</TableCell>
                    <TableCell className="text-slate-300 max-w-xs truncate">{order.items}</TableCell>
                    <TableCell className="text-slate-300">{formatCurrency(order.total || 0)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsDialogOpen} onOpenChange={setIsOrderDetailsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Order Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Order ID:</span>
                      <span className="text-white font-mono">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Date:</span>
                      <span className="text-white">{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Status:</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total:</span>
                      <span className="text-white font-bold">{formatCurrency(selectedOrder.total || 0)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Customer Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Name:</span>
                      <Link 
                        href={`/customers/${selectedOrder.customer_id}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        {selectedOrder.customerName}
                      </Link>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">ID:</span>
                      <span className="text-white font-mono">{selectedOrder.customer_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Email:</span>
                      <span className="text-white">{selectedOrder.customerEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Order Items</h4>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-white">{selectedOrder.items}</p>
                </div>
              </div>
              {selectedOrder.notes && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Notes</h4>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-white">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 