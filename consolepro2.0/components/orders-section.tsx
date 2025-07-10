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
import type { OrderCustomer } from "@/lib/types"
import Link from "next/link"

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

export function OrdersSection() {
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
  const [wixDialogOpen, setWixDialogOpen] = useState(false)
  const [wixContactId, setWixContactId] = useState<string | null>(null)
  const [wixOrderId, setWixOrderId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrdersData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrdersData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to connect to orders system",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrdersData()
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
        fetchOrdersData() // Refresh data
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
        fetchOrdersData() // Refresh data to show updated status
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

  // Function to handle Wix Customer Info button click
  const handleWixCustomerInfo = async (order: any) => {
    setError(null)
    setWixOrderId(order.orderId)
    if (order.Wix_Contact_ID) {
      setWixContactId(order.Wix_Contact_ID)
      setWixDialogOpen(true)
    } else {
      setCreating(true)
      try {
        // Call your API or Apps Script function to create Wix customer
        // This is a placeholder; replace with your actual call
        const result = await fetch(`/api/wix/create-customer-from-order?orderId=${order.orderId}`)
        const data = await result.json()
        if (data.wixContactId) {
          setWixContactId(data.wixContactId)
        } else {
          setError(data.error || 'Failed to create Wix customer.')
        }
      } catch (e) {
        setError('Failed to create Wix customer.')
      }
      setCreating(false)
      setWixDialogOpen(true)
    }
  }

  const handleCreateWixCustomer = async (orderId: string) => {
    if (!APPS_SCRIPT_URL) {
      alert("Apps Script URL is not set.");
      return;
    }
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createWixCustomerFromOrder", orderId }),
      });
      const data = await res.json();
      alert(data.result || "Wix customer creation triggered.");
    } catch (error) {
      alert("Failed to create Wix customer: " + error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-2 text-white">Loading orders data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Orders & Tracking</h2>
          <p className="text-slate-400 mt-1">Real-time order management from Google Sheets</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchOrdersData}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25">
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300">Customer Name</Label>
                  <Input
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Customer Email</Label>
                  <Input
                    type="email"
                    value={newOrder.customerEmail}
                    onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Items</Label>
                  <Textarea
                    value={newOrder.items}
                    onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white"
                    placeholder="List items ordered..."
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Total Amount</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newOrder.total}
                    onChange={(e) => setNewOrder({ ...newOrder, total: Number.parseFloat(e.target.value) || 0 })}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Notes</Label>
                  <Textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white"
                    placeholder="Order notes..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewOrderDialogOpen(false)}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateOrder} className="bg-gradient-to-r from-cyan-500 to-purple-500">
                    Create Order
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{ordersData.length}</p>
              </div>
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Processing</p>
                <p className="text-2xl font-bold text-yellow-400">{processingOrders.length}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Shipped</p>
                <p className="text-2xl font-bold text-blue-400">{shippedOrders.length}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Truck className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Order ID</TableHead>
                <TableHead className="text-slate-300">Customer</TableHead>
                <TableHead className="text-slate-300">Customer ID</TableHead>
                <TableHead className="text-slate-300">Items</TableHead>
                <TableHead className="text-slate-300">Total</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Invoice</TableHead>
                <TableHead className="text-slate-300">Wix Customer Info</TableHead>
                <TableHead className="text-slate-300">TEST BUTTON</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.orderId} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell className="text-slate-300 font-mono text-sm">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
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
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-slate-300">
                    <div className="flex items-center space-x-2">
                      {order.invoice_link ? (
                        <a href={order.invoice_link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Invoice</a>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openInvoiceStatusDialog(order)}
                        className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 p-1 h-6 w-6"
                        title="Update Invoice Status"
                      >
                        <CreditCard className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWixCustomerInfo(order)}
                      className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      Wix Customer Info
                    </Button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleCreateWixCustomer(order.orderId)}
                      className="bg-cyan-700 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Create Wix Customer
                    </button>
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
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsDialogOpen} onOpenChange={setIsOrderDetailsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details - {selectedOrder?.orderId}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-slate-400 text-sm">Name</p>
                      <p className="text-white">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white">{selectedOrder.customerEmail}</p>
                    </div>
                    {selectedOrder.businessName && (
                      <div>
                        <p className="text-slate-400 text-sm">Business</p>
                        <p className="text-white">{selectedOrder.businessName}</p>
                      </div>
                    )}
                    {selectedOrder.phone && (
                      <div>
                        <p className="text-slate-400 text-sm">Phone</p>
                        <p className="text-white">{selectedOrder.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.addressStreet && (
                      <p className="text-white">{selectedOrder.addressStreet}</p>
                    )}
                    {(selectedOrder.addressCity || selectedOrder.addressState || selectedOrder.addressZIP) && (
                      <p className="text-white">
                        {[selectedOrder.addressCity, selectedOrder.addressState, selectedOrder.addressZIP]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    {!selectedOrder.addressStreet && !selectedOrder.addressCity && (
                      <p className="text-slate-500">No address provided</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Order Date</p>
                    <p className="text-white">{new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Status</p>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{selectedOrder.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Customer ID</p>
                    <p className="text-white font-mono">{selectedOrder.customer_id || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Products</h3>
                {selectedOrder.products && selectedOrder.products.length > 0 ? (
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-white font-medium text-lg">{product.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">${product.price.toFixed(2)}</p>
                            <p className="text-slate-400 text-sm">Qty: {product.quantity}</p>
                            <p className="text-green-400 font-medium">
                              ${(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-white">Total</p>
                        <p className="text-2xl font-bold text-green-400">${selectedOrder.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <p className="text-slate-400">No detailed product information available</p>
                    <p className="text-white mt-2">{selectedOrder.items}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Order Notes</h3>
                  <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                    <p className="text-white">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-4">
                {selectedOrder.invoice_link && (
                  <a 
                    href={selectedOrder.invoice_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    View Invoice
                  </a>
                )}
                {selectedOrder.payment_link && (
                  <a 
                    href={selectedOrder.payment_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    Payment Link
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Status Update Dialog */}
      <Dialog open={isInvoiceStatusDialogOpen} onOpenChange={setIsInvoiceStatusDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Update Invoice Status</DialogTitle>
          </DialogHeader>
          {selectedOrderForInvoiceUpdate && (
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Order Code</p>
                <p className="text-white font-mono">{selectedOrderForInvoiceUpdate.orderId}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Customer</p>
                <p className="text-white">{selectedOrderForInvoiceUpdate.customerName}</p>
              </div>
              <div>
                <Label className="text-slate-300">Invoice Status</Label>
                <Select value={newInvoiceStatus} onValueChange={setNewInvoiceStatus}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select invoice status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="PENDING" className="text-white">PENDING</SelectItem>
                    <SelectItem value="PAID" className="text-green-400">PAID</SelectItem>
                    <SelectItem value="OVERDUE" className="text-red-400">OVERDUE</SelectItem>
                    <SelectItem value="CANCELLED" className="text-gray-400">CANCELLED</SelectItem>
                    <SelectItem value="REFUNDED" className="text-yellow-400">REFUNDED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsInvoiceStatusDialogOpen(false)}
                  className="border-slate-600 text-slate-300"
                  disabled={updatingInvoiceStatus}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateInvoiceStatus} 
                  className="bg-gradient-to-r from-orange-500 to-red-500"
                  disabled={!newInvoiceStatus || updatingInvoiceStatus}
                >
                  {updatingInvoiceStatus ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Update Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Wix Customer Info Dialog */}
      <Dialog open={wixDialogOpen} onOpenChange={setWixDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wix Customer Info</DialogTitle>
          </DialogHeader>
          {creating ? (
            <div className="text-slate-400">Creating Wix customer...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : wixContactId ? (
            <div>
              <div className="mb-2 text-slate-300">Wix Contact ID: <span className="font-mono">{wixContactId}</span></div>
              <a
                href={`https://manage.wix.com/dashboard/f2af16bf-a8ba-42f3-a5c4-9425564347ac/contacts/${wixContactId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                Open in Wix Dashboard
              </a>
            </div>
          ) : (
            <div className="text-slate-400">No Wix Contact ID found.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
