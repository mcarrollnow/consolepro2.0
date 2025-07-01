"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Truck, Clock, CheckCircle, AlertCircle, RefreshCw, CreditCard, Package, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { OrderCustomer } from "@/lib/google-sheets"
import Link from "next/link"

export function ActiveOrdersSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ordersData, setOrdersData] = useState<OrderCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderCustomer | null>(null)
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)
  const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    items: "",
    total: 0,
    notes: "",
  })
  const [isInvoiceStatusDialogOpen, setIsInvoiceStatusDialogOpen] = useState(false)
  const [selectedOrderForInvoiceUpdate, setSelectedOrderForInvoiceUpdate] = useState<OrderCustomer | null>(null)
  const [newInvoiceStatus, setNewInvoiceStatus] = useState("")
  const [updatingInvoiceStatus, setUpdatingInvoiceStatus] = useState(false)
  const { toast } = useToast()

  const fetchActiveOrdersData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders?sheet=Orders")
      if (response.ok) {
        const data = await response.json()
        setOrdersData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch active orders data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching active orders:", error)
      toast({
        title: "Error",
        description: "Failed to connect to active orders system",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveOrdersData()
  }, [])

  const filteredOrders = ordersData.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Clock className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const openOrderDetails = (order: OrderCustomer) => {
    setSelectedOrder(order)
    setIsOrderDetailsDialogOpen(true)
  }

  const handleCreateOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: `Order ${result.orderId} created successfully`,
        })
        setIsNewOrderDialogOpen(false)
        setNewOrder({ customerName: "", customerEmail: "", items: "", total: 0, notes: "" })
        fetchActiveOrdersData() // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to create order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
    }
  }

  const handleUpdateInvoiceStatus = async () => {
    if (!selectedOrderForInvoiceUpdate || !newInvoiceStatus) return

    try {
      setUpdatingInvoiceStatus(true)
      const response = await fetch("/api/orders/update-invoice-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: selectedOrderForInvoiceUpdate.orderId,
          invoiceStatus: newInvoiceStatus,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: `Invoice status updated to ${result.invoiceStatus} for order ${result.orderCode}`,
        })
        setIsInvoiceStatusDialogOpen(false)
        setSelectedOrderForInvoiceUpdate(null)
        setNewInvoiceStatus("")
        fetchActiveOrdersData() // Refresh data to show updated status
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update invoice status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      })
    } finally {
      setUpdatingInvoiceStatus(false)
    }
  }

  const openInvoiceStatusDialog = (order: OrderCustomer) => {
    setSelectedOrderForInvoiceUpdate(order)
    setNewInvoiceStatus("")
    setIsInvoiceStatusDialogOpen(true)
  }

  const processingOrders = ordersData.filter((order) => order.status.toLowerCase() === "processing")
  const shippedOrders = ordersData.filter((order) => order.status.toLowerCase() === "shipped")
  const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0)

  const handleMarkAsShipped = async (orderId: string) => {
    try {
      const response = await fetch("/api/orders/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (response.ok) {
        toast({ title: "Order archived", description: `Order ${orderId} marked as shipped and archived.` });
        setOrdersData((prev) => prev.filter((o) => o.orderId !== orderId));
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.error || "Failed to archive order", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to archive order", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-2 text-white">Loading active orders data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Processing</p>
                <p className="text-xl font-bold text-white">{processingOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Shipped</p>
                <p className="text-xl font-bold text-white">{shippedOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Total Orders</p>
                <p className="text-xl font-bold text-white">{ordersData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Revenue</p>
                <p className="text-xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-white text-xl">Active Orders</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 w-full sm:w-64"
                />
              </div>
              <Button
                onClick={() => setIsNewOrderDialogOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
              <Button
                onClick={fetchActiveOrdersData}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300 font-medium">Order ID</TableHead>
                  <TableHead className="text-slate-300 font-medium">Customer</TableHead>
                  <TableHead className="text-slate-300 font-medium">Customer ID</TableHead>
                  <TableHead className="text-slate-300 font-medium">Items</TableHead>
                  <TableHead className="text-slate-300 font-medium">Total</TableHead>
                  <TableHead className="text-slate-300 font-medium">Status</TableHead>
                  <TableHead className="text-slate-300 font-medium">Invoice Status</TableHead>
                  <TableHead className="text-slate-300 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.orderId} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell className="text-white font-medium">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        {order.orderId}
                      </button>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {order.customer_id ? (
                        <Link 
                          href={`/customers/${order.customer_id}`}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          {order.customerName}
                        </Link>
                      ) : (
                        order.customerName
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono text-sm">
                      {order.customer_id ? (
                        <Link 
                          href={`/customers/${order.customer_id}`}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline"
                        >
                          {order.customer_id}
                        </Link>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-xs truncate">{order.items}</TableCell>
                    <TableCell className="text-slate-300">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} border`}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.invoiceStatus === "Paid" ? "default" : "secondary"}
                        className={order.invoiceStatus === "Paid" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"}
                      >
                        {order.invoiceStatus || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openOrderDetails(order)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8 px-2"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openInvoiceStatusDialog(order)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8 px-2"
                        >
                          Invoice
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleMarkAsShipped(order.orderId)}
                          className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                        >
                          Mark as Shipped
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No active orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Order Dialog */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={newOrder.customerEmail}
                onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="items">Items</Label>
              <Textarea
                id="items"
                value={newOrder.items}
                onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                value={newOrder.total}
                onChange={(e) => setNewOrder({ ...newOrder, total: parseFloat(e.target.value) || 0 })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newOrder.notes}
                onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsNewOrderDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateOrder} className="bg-cyan-600 hover:bg-cyan-700">
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsDialogOpen} onOpenChange={setIsOrderDetailsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-cyan-400" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Customer Name</Label>
                    <p className="text-white font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400">Customer Email</Label>
                    <p className="text-white">{selectedOrder.customerEmail}</p>
                  </div>
                  {selectedOrder.customer_id && (
                    <div>
                      <Label className="text-slate-400">Customer ID</Label>
                      <Link 
                        href={`/customers/${selectedOrder.customer_id}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        {selectedOrder.customer_id}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-cyan-400" />
                    Shipping Address
                  </h3>
                  <p className="text-white whitespace-pre-line">{selectedOrder.shippingAddress}</p>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.productDetails && selectedOrder.productDetails.length > 0 ? (
                    selectedOrder.productDetails.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-slate-600/50 rounded">
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-slate-400 text-sm">Qty: {product.quantity}</p>
                        </div>
                        <p className="text-white font-medium">${product.price.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">{selectedOrder.items}</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="text-white font-mono">{selectedOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <Badge className={`${getStatusColor(selectedOrder.status)} border`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(selectedOrder.status)}
                        <span>{selectedOrder.status}</span>
                      </span>
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Invoice Status:</span>
                    <Badge 
                      variant={selectedOrder.invoiceStatus === "Paid" ? "default" : "secondary"}
                      className={selectedOrder.invoiceStatus === "Paid" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"}
                    >
                      {selectedOrder.invoiceStatus || "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-white font-bold text-lg">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                  <p className="text-slate-300">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Links */}
              <div className="flex justify-end space-x-2">
                {selectedOrder.customer_id && (
                  <Button asChild variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Link href={`/customers/${selectedOrder.customer_id}`}>
                      View Customer Profile
                    </Link>
                  </Button>
                )}
                <Button
                  onClick={() => openInvoiceStatusDialog(selectedOrder)}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Update Invoice Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Status Update Dialog */}
      <Dialog open={isInvoiceStatusDialogOpen} onOpenChange={setIsInvoiceStatusDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Update Invoice Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoiceStatus">Invoice Status</Label>
              <Select value={newInvoiceStatus} onValueChange={setNewInvoiceStatus}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Pending" className="text-white">Pending</SelectItem>
                  <SelectItem value="Paid" className="text-white">Paid</SelectItem>
                  <SelectItem value="Overdue" className="text-white">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsInvoiceStatusDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateInvoiceStatus} 
                disabled={updatingInvoiceStatus}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {updatingInvoiceStatus ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 