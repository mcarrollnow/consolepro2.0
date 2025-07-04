"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Package, AlertTriangle, Edit, RefreshCw, Copy, MessageCircle, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { InventoryItem } from "@/lib/types"

import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { getDriveDirectImage } from "../app/inventory/[barcode]/page"
import { AIInventoryInsightsWidget } from "./ai-inventory-insights-widget"

export function InventorySection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false)
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false)
  const [purchaseQty, setPurchaseQty] = useState(0)
  const [saleQty, setSaleQty] = useState(0)
  const { toast } = useToast()
  const [activeView, setActiveView] = useState<'all' | 'low' | 'out'>('all')
  const [ordersData, setOrdersData] = useState<any[]>([])
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false)
  const [notifyMessage, setNotifyMessage] = useState("")

  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      const [inventoryRes, purchasesRes, salesRes] = await Promise.all([
        fetch("/api/inventory"),
        fetch("/api/purchases"),
        fetch("/api/sales"),
      ])
      const inventory = await inventoryRes.json()
      const purchasesData = await purchasesRes.json()
      const salesData = await salesRes.json()
      setInventoryData(inventory)
      setPurchases(purchasesData)
      setSales(salesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory or transaction data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchOrdersData = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrdersData(data)
      }
    } catch (error) {
      // ignore for now
    }
  }

  useEffect(() => {
    fetchInventoryData()
    fetchOrdersData()
  }, [])

  const getCurrentStock = (item: InventoryItem) => {
    const barcode = item.barcode.toLowerCase()
    const purchaseSum = purchases
      .filter((p) => (p["Product Barcode"] || p.barcode || "").toLowerCase() === barcode)
      .reduce((sum, p) => sum + (parseInt(p.Quantity) || 0), 0)
    const saleSum = sales
      .filter((s) => (s["Product Barcode"] || s.barcode || "").toLowerCase() === barcode)
      .reduce((sum, s) => sum + (parseInt(s.Quantity) || 0), 0)
    return (parseInt(item.initialStock) || 0) + purchaseSum - saleSum
  }

  const filteredInventory = inventoryData.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return "bg-red-500/20 text-red-400 border-red-500/30"
    } else if (item.currentStock <= item.restockLevel) {
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
    return "bg-green-500/20 text-green-400 border-green-500/30"
  }

  const getStatusText = (item: InventoryItem) => {
    if (item.currentStock === 0) return "Out of Stock"
    if (item.currentStock <= item.restockLevel) return "Low Stock"
    return "In Stock"
  }

  const handleUpdateStock = async (barcode: string, newStock: number) => {
    try {
      const response = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode,
          updates: { currentStock: newStock },
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Stock updated successfully",
        })
        fetchInventoryData() // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to update stock",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating stock:", error)
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      })
    }
  }

  const lowStockItems = inventoryData.filter((item) => item.currentStock <= 100 && item.currentStock > 0)
  const outOfStockItems = inventoryData.filter((item) => item.currentStock === 0)
  const totalValue = inventoryData.reduce((sum, item) => {
    const price = Number.parseFloat(item.costPrice.replace("$", "")) || 0
    return sum + price * item.currentStock
  }, 0)

  const unfulfilledOrders = ordersData.filter((order) => (order.status || '').toLowerCase() === 'processing')

  const getPendingOrdersForItem = (item: InventoryItem) => {
    return unfulfilledOrders.filter(order => {
      return (
        (order.items && order.items.toLowerCase().includes(item.product.toLowerCase())) ||
        (item.barcode && order.items && order.items.includes(item.barcode))
      )
    })
  }

  const generateSupplierMessage = (section: 'low' | 'out') => {
    const items = section === 'low' ? lowStockItems : outOfStockItems
    let context = section === 'low'
      ? 'The following items are low in stock (≤100 units) and may have pending orders:'
      : 'The following items are out of stock and may have pending orders:'
    let msg = context + '\n\n'
    items.forEach((item: InventoryItem) => {
      msg += `Product: ${item.product}\nBarcode: ${item.barcode}\nQty: ${item.currentStock}\n`
      const pending = getPendingOrdersForItem(item)
      if (pending.length > 0) {
        msg += `Pending Orders: ${pending.map((o: any) => o.orderId).join(", ")}\n`
      }
      msg += '\n'
    })
    return msg
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(notifyMessage)
    toast({ title: "Copied!", description: "Message copied to clipboard." })
  }
  const handleSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(notifyMessage)}`)
  }
  const handleThreema = () => {
    const threemaId = process.env.NEXT_PUBLIC_THREEMA_ID || ''
    const url = threemaId
      ? `threema://compose?to=${threemaId}&text=${encodeURIComponent(notifyMessage)}`
      : `threema://compose?text=${encodeURIComponent(notifyMessage)}`
    window.open(url)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
          <span className="ml-2 text-white">Loading inventory data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-section="inventory">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Inventory Management</h2>
          <p className="text-slate-400 mt-1">Real-time inventory tracking from Google Sheets</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchInventoryData}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-white">{inventoryData.length}</p>
              </div>
              <Package className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm cursor-pointer ${activeView==='low' ? 'ring-2 ring-yellow-400' : ''}`} onClick={() => setActiveView('low')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-400">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm cursor-pointer ${activeView==='out' ? 'ring-2 ring-red-400' : ''}`} onClick={() => setActiveView('out')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Out of Stock</p>
                <p className="text-2xl font-bold text-red-400">{outOfStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Inventory Insights Widget */}
      <div data-ai-widget="inventory">
        <AIInventoryInsightsWidget 
          inventory={inventoryData}
          orders={ordersData}
          purchases={purchases}
          sales={sales}
        />
      </div>

      {/* Filtered inventory view */}
      {(activeView === 'low' || activeView === 'out') && (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              {activeView === 'low' ? 'Low Stock Items' : 'Out of Stock Items'}
              <Button size="sm" variant="outline" className="ml-4 border-2 border-orange-500 text-black hover:bg-orange-500/10 hover:text-white font-semibold shadow-orange-500/30" onClick={() => {
                setNotifyMessage(generateSupplierMessage(activeView))
                setNotifyDialogOpen(true)
              }}>
                <Send className="h-4 w-4 mr-1" /> Notify Supplier
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Barcode</TableHead>
                  <TableHead className="text-slate-300">Product</TableHead>
                  <TableHead className="text-slate-300">Current Stock</TableHead>
                  <TableHead className="text-slate-300">Pending Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(activeView === 'low' ? lowStockItems : outOfStockItems).map(item => (
                  <TableRow key={item.barcode} className="border-slate-700">
                    <TableCell className="text-slate-300 font-mono text-xs">
                      <Link href={`/inventory/${item.barcode}`} className="text-cyan-400 hover:underline">
                        {item.barcode}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      <Link href={`/inventory/${item.barcode}`} className="text-cyan-400 hover:underline">
                        {item.product}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-300">{item.currentStock}</TableCell>
                    <TableCell className="text-slate-300">
                      {getPendingOrdersForItem(item).length > 0 ? (
                        <ul className="list-disc ml-4">
                          {getPendingOrdersForItem(item).map(order => (
                            <li key={order.orderId} className="text-xs">
                              Order #{order.orderId} (
                              {order.customer_id ? (
                                <>
                                  <Link 
                                    href={`/customers/${order.customer_id}`}
                                    className="text-cyan-400 hover:text-cyan-300 hover:underline"
                                  >
                                    {order.customerName}
                                  </Link>
                                  {" "}
                                  <span className="text-slate-500">({order.customer_id})</span>
                                </>
                              ) : (
                                order.customerName
                              )}
                              )
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button variant="ghost" className="mt-4 text-cyan-400" onClick={() => setActiveView('all')}>Back to Inventory</Button>
          </CardContent>
        </Card>
      )}

      {/* Notify Supplier Dialog */}
      <Dialog open={notifyDialogOpen} onOpenChange={(open: boolean) => setNotifyDialogOpen(open)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Notify Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea className="w-full bg-slate-900/50 border-slate-600 text-white" rows={8} value={notifyMessage} readOnly />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopy}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
              <Button variant="outline" onClick={handleSMS}><MessageCircle className="h-4 w-4 mr-1" /> SMS</Button>
              <Button variant="outline" onClick={handleThreema}><Send className="h-4 w-4 mr-1" /> Threema</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main inventory table (only if not in filtered view) */}
      {activeView === 'all' && (
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Product Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search products, barcodes, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Barcode</TableHead>
                  <TableHead className="text-slate-300">Product</TableHead>
                  <TableHead className="text-slate-300">Category</TableHead>
                  <TableHead className="text-slate-300">Current Stock</TableHead>
                  <TableHead className="text-slate-300">Restock Level</TableHead>
                  <TableHead className="text-slate-300">Cost Price</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.barcode} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 font-mono text-xs">
                      <Link href={`/inventory/${item.barcode}`} className="text-cyan-400 hover:underline">
                        {item.barcode}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      <Link href={`/inventory/${item.barcode}`} className="text-cyan-400 hover:underline">
                        {item.product}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-300">{item.category}</TableCell>
                    <TableCell className="text-slate-300">
                      {getCurrentStock(item)}
                      {getCurrentStock(item) <= item.restockLevel && (
                        <AlertTriangle className="inline h-4 w-4 text-yellow-400 ml-1" />
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">{item.restockLevel}</TableCell>
                    <TableCell className="text-slate-300">{item.costPrice}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item)}>{getStatusText(item)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsPurchaseDialogOpen(true)
                          }}
                          className="border-slate-600 text-black hover:bg-slate-800"
                        >
                          + Product
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item)
                            setIsSaleDialogOpen(true)
                          }}
                          className="border-slate-600 text-black hover:bg-slate-800"
                        >
                          - Product
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Purchase Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Purchase - {selectedItem?.product}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={purchaseQty}
                  onChange={(e) => setPurchaseQty(Number(e.target.value))}
                  className="bg-slate-900/50 border-slate-600 text-white"
                  placeholder="Enter quantity purchased"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPurchaseDialogOpen(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    // Call API to add purchase record
                    await fetch("/api/purchases", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        barcode: selectedItem.barcode,
                        quantity: purchaseQty,
                        timestamp: new Date().toISOString(),
                      }),
                    })
                    setIsPurchaseDialogOpen(false)
                    setPurchaseQty(0)
                    fetchInventoryData()
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500"
                  disabled={purchaseQty <= 0}
                >
                  Add Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Sale Dialog */}
      <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add Sale - {selectedItem?.product}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={saleQty}
                  onChange={(e) => setSaleQty(Number(e.target.value))}
                  className="bg-slate-900/50 border-slate-600 text-white"
                  placeholder="Enter quantity sold"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsSaleDialogOpen(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    // Call API to add sale record
                    await fetch("/api/sales", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        barcode: selectedItem.barcode,
                        quantity: saleQty,
                        timestamp: new Date().toISOString(),
                      }),
                    })
                    setIsSaleDialogOpen(false)
                    setSaleQty(0)
                    fetchInventoryData()
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500"
                  disabled={saleQty <= 0}
                >
                  Add Sale
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
