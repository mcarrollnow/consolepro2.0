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
import { Plus, Search, Truck, Clock, CheckCircle, AlertCircle, RefreshCw, CreditCard, Package, MapPin, X, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { OrderCustomer } from "@/lib/types"
import { getUnifiedOrderStatus } from "@/lib/types"
import Link from "next/link"

interface Product {
  barcode: string
  name: string
  price: number
  category: string
}

interface OrderProduct {
  name: string
  barcode: string
  price: number
  quantity: number
}

export function ActiveOrdersSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ordersData, setOrdersData] = useState<OrderCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderCustomer | null>(null)
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)
  const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false)
  const [isInvoiceStatusDialogOpen, setIsInvoiceStatusDialogOpen] = useState(false)
  const [selectedOrderForInvoiceUpdate, setSelectedOrderForInvoiceUpdate] = useState<OrderCustomer | null>(null)
  const [newInvoiceStatus, setNewInvoiceStatus] = useState("")
  const [updatingInvoiceStatus, setUpdatingInvoiceStatus] = useState(false)
  const [creatingStripeInvoice, setCreatingStripeInvoice] = useState<string | null>(null)
  const { toast } = useToast()

  // New Order Form State
  const [orderType, setOrderType] = useState<"B2B" | "RETAIL">("RETAIL")
  const [inventoryData, setInventoryData] = useState<Product[]>([])
  const [priceList, setPriceList] = useState<Record<string, number>>({})
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    businessName: "",
    phone: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZIP: "",
    specialInstructions: "",
  })
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

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

  const fetchInventoryData = async () => {
    try {
      const response = await fetch("/api/inventory")
      if (response.ok) {
        const data = await response.json()
        setInventoryData(data)
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const loadPriceList = async () => {
    try {
      const priceListFile = orderType === "B2B" ? "b2b_product_price_list.csv" : "retail_product_price_list.csv"
      const response = await fetch(`/${priceListFile}`)
      if (response.ok) {
        const csvText = await response.text()
        const lines = csvText.split('\n').slice(1) // Skip header
        const priceMap: Record<string, number> = {}
        
        lines.forEach(line => {
          const [barcode, name, price] = line.split(',')
          if (barcode && price) {
            const cleanPrice = parseFloat(price.replace(/[^0-9.]/g, ''))
            if (!isNaN(cleanPrice)) {
              priceMap[barcode.trim()] = cleanPrice
            }
          }
        })
        
        setPriceList(priceMap)
      }
    } catch (error) {
      console.error("Error loading price list:", error)
    }
  }

  useEffect(() => {
    fetchActiveOrdersData()
  }, [])

  useEffect(() => {
    if (isNewOrderDialogOpen) {
      fetchInventoryData()
      loadPriceList()
    }
  }, [isNewOrderDialogOpen, orderType])

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

  const getUnifiedStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "invoice sent":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "paid-ready to ship":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "invoice overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getUnifiedStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return <Plus className="h-4 w-4" />
      case "invoice sent":
        return <CreditCard className="h-4 w-4" />
      case "paid-ready to ship":
        return <CheckCircle className="h-4 w-4" />
      case "invoice overdue":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const openOrderDetails = (order: OrderCustomer) => {
    setSelectedOrder(order)
    setIsOrderDetailsDialogOpen(true)
  }

  const addProductToOrder = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.barcode === product.barcode)
    if (existingProduct) {
      setSelectedProducts(prev => 
        prev.map(p => 
          p.barcode === product.barcode 
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      )
    } else {
      const price = priceList[product.barcode] || 0
      setSelectedProducts(prev => [...prev, {
        name: product.product,
        barcode: product.barcode,
        price,
        quantity: 1
      }])
    }
  }

  const removeProductFromOrder = (barcode: string) => {
    setSelectedProducts(prev => prev.filter(p => p.barcode !== barcode))
  }

  const updateProductQuantity = (barcode: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromOrder(barcode)
      return
    }
    setSelectedProducts(prev => 
      prev.map(p => 
        p.barcode === barcode 
          ? { ...p, quantity }
          : p
      )
    )
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0)
  }

  const generateOrderCode = () => {
    const prefix = orderType === "B2B" ? "B2B" : "RTL"
    const date = new Date().toISOString().slice(5, 7) + new Date().toISOString().slice(8, 10) // MM-DD
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${prefix}-${date}-${random}-1`
  }

  const handleCreateOrder = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product to the order",
        variant: "destructive",
      })
      return
    }

    if (!newOrder.customerName || !newOrder.customerEmail) {
      toast({
        title: "Error",
        description: "Customer name and email are required",
        variant: "destructive",
      })
      return
    }

    setIsCreatingOrder(true)
    try {
      const orderData = {
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        businessName: newOrder.businessName,
        phone: newOrder.phone,
        addressStreet: newOrder.addressStreet,
        addressCity: newOrder.addressCity,
        addressState: newOrder.addressState,
        addressZIP: newOrder.addressZIP,
        notes: newOrder.specialInstructions,
        total: calculateTotal(),
        products: selectedProducts,
        orderType,
        orderCode: generateOrderCode(),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: `Order ${result.orderId} created successfully`,
        })
        setIsNewOrderDialogOpen(false)
        resetNewOrderForm()
        fetchActiveOrdersData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create order",
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
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const resetNewOrderForm = () => {
    setNewOrder({
      customerName: "",
      customerEmail: "",
      businessName: "",
      phone: "",
      addressStreet: "",
      addressCity: "",
      addressState: "",
      addressZIP: "",
      specialInstructions: "",
    })
    setSelectedProducts([])
    setOrderType("RETAIL")
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
        fetchActiveOrdersData()
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

  const handleCreateStripeInvoice = async (orderId: string) => {
    try {
      setCreatingStripeInvoice(orderId)
      const response = await fetch("/api/orders/create-stripe-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (response.ok) {
        const result = await response.json()
        toast({ 
          title: "Stripe Invoice Created", 
          description: `Invoice created successfully for order ${orderId}` 
        });
        
        fetchActiveOrdersData()
      } else {
        const error = await response.json();
        toast({ 
          title: "Error", 
          description: error.error || "Failed to create Stripe invoice", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to create Stripe invoice", 
        variant: "destructive" 
      });
    } finally {
      setCreatingStripeInvoice(null)
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
    <div className="space-y-6" data-section="active-orders">
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
                  <TableHead className="text-slate-300 font-medium">Order Status</TableHead>
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
                      {(() => {
                        const unifiedStatus = getUnifiedOrderStatus(order)
                        return (
                          <Badge className={`${getUnifiedStatusColor(unifiedStatus)} border`}>
                            <span className="flex items-center space-x-1">
                              {getUnifiedStatusIcon(unifiedStatus)}
                              <span>{unifiedStatus}</span>
                            </span>
                          </Badge>
                        )
                      })()}
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
                          variant="outline"
                          onClick={() => handleCreateStripeInvoice(order.orderId)}
                          disabled={creatingStripeInvoice === order.orderId}
                          className="border-purple-600 text-purple-300 hover:bg-purple-700 h-8 px-2"
                        >
                          {creatingStripeInvoice === order.orderId ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            "Stripe Invoice"
                          )}
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

      {/* Enhanced New Order Dialog */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Order</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Customer Information */}
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Order Type</h3>
                <div className="flex space-x-4">
                  <Button
                    variant={orderType === "RETAIL" ? "default" : "outline"}
                    onClick={() => setOrderType("RETAIL")}
                    className={orderType === "RETAIL" ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
                  >
                    Retail
                  </Button>
                  <Button
                    variant={orderType === "B2B" ? "default" : "outline"}
                    onClick={() => setOrderType("B2B")}
                    className={orderType === "B2B" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
                  >
                    B2B
                  </Button>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={newOrder.customerName}
                      onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={newOrder.customerEmail}
                      onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={newOrder.businessName}
                      onChange={(e) => setNewOrder({ ...newOrder, businessName: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter business name (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newOrder.phone}
                      onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="addressStreet">Street Address</Label>
                    <Input
                      id="addressStreet"
                      value={newOrder.addressStreet}
                      onChange={(e) => setNewOrder({ ...newOrder, addressStreet: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="addressCity">City</Label>
                      <Input
                        id="addressCity"
                        value={newOrder.addressCity}
                        onChange={(e) => setNewOrder({ ...newOrder, addressCity: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressState">State</Label>
                      <Input
                        id="addressState"
                        value={newOrder.addressState}
                        onChange={(e) => setNewOrder({ ...newOrder, addressState: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="addressZIP">ZIP Code</Label>
                    <Input
                      id="addressZIP"
                      value={newOrder.addressZIP}
                      onChange={(e) => setNewOrder({ ...newOrder, addressZIP: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Special Instructions</h3>
                <Textarea
                  value={newOrder.specialInstructions}
                  onChange={(e) => setNewOrder({ ...newOrder, specialInstructions: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                  placeholder="Enter any special instructions or notes"
                />
              </div>
            </div>

            {/* Right Column - Product Selection */}
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Product Selection</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {inventoryData.map((product) => (
                    <div
                      key={product.barcode}
                      className="flex items-center justify-between p-2 bg-slate-600/50 rounded hover:bg-slate-600/70 cursor-pointer"
                      onClick={() => addProductToOrder(product)}
                    >
                      <div className="flex-1">
                        <div className="text-white font-medium">{product.product}</div>
                        <div className="text-slate-300 text-sm">Barcode: {product.barcode}</div>
                        <div className="text-cyan-400 text-sm">
                          ${priceList[product.barcode]?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Selected Products</h3>
                {selectedProducts.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No products selected</p>
                ) : (
                  <div className="space-y-2">
                    {selectedProducts.map((product) => (
                      <div key={product.barcode} className="flex items-center justify-between p-2 bg-slate-600/50 rounded">
                        <div className="flex-1">
                          <div className="text-white font-medium">{product.name}</div>
                          <div className="text-slate-300 text-sm">Barcode: {product.barcode}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => updateProductQuantity(product.barcode, parseInt(e.target.value) || 1)}
                            className="w-16 bg-slate-700 border-slate-600 text-white text-center"
                          />
                          <div className="text-cyan-400 font-medium">
                            ${(product.price * product.quantity).toFixed(2)}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeProductFromOrder(product.barcode)}
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-slate-600 pt-2 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Total:</span>
                        <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => {
                setIsNewOrderDialogOpen(false)
                resetNewOrderForm()
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrder} 
              disabled={isCreatingOrder || selectedProducts.length === 0}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isCreatingOrder ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Order
                </>
              )}
            </Button>
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
                    <span className="text-slate-400">Order Status:</span>
                    {(() => {
                      const unifiedStatus = getUnifiedOrderStatus(selectedOrder)
                      return (
                        <Badge className={`${getUnifiedStatusColor(unifiedStatus)} border`}>
                          <span className="flex items-center space-x-1">
                            {getUnifiedStatusIcon(unifiedStatus)}
                            <span>{unifiedStatus}</span>
                          </span>
                        </Badge>
                      )
                    })()}
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