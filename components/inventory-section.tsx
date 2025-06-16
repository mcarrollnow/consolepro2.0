"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Package, AlertTriangle, Edit, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { InventoryItem } from "@/lib/google-sheets"
import { DebugConnection } from "./debug-connection"

export function InventorySection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchInventoryData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/inventory")
      if (response.ok) {
        const data = await response.json()
        setInventoryData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch inventory data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
      toast({
        title: "Error",
        description: "Failed to connect to inventory system",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryData()
  }, [])

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

  const lowStockItems = inventoryData.filter((item) => item.currentStock <= item.restockLevel && item.currentStock > 0)
  const outOfStockItems = inventoryData.filter((item) => item.currentStock === 0)
  const totalValue = inventoryData.reduce((sum, item) => {
    const price = Number.parseFloat(item.costPrice.replace("$", "")) || 0
    return sum + price * item.currentStock
  }, 0)

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
    <div className="space-y-6">
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

      {/* Debug Connection - Remove this after testing */}
      <DebugConnection />

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

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
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

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
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

      {/* Search and Filter */}
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
                  <TableCell className="text-slate-300 font-mono text-xs">{item.barcode}</TableCell>
                  <TableCell className="text-white font-medium">{item.product}</TableCell>
                  <TableCell className="text-slate-300">{item.category}</TableCell>
                  <TableCell className="text-slate-300">
                    {item.currentStock}
                    {item.currentStock <= item.restockLevel && (
                      <AlertTriangle className="inline h-4 w-4 text-yellow-400 ml-1" />
                    )}
                  </TableCell>
                  <TableCell className="text-slate-300">{item.restockLevel}</TableCell>
                  <TableCell className="text-slate-300">{item.costPrice}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item)}>{getStatusText(item)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item)
                        setIsEditDialogOpen(true)
                      }}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Update Stock - {selectedItem?.product}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Current Stock</Label>
                <Input
                  type="number"
                  defaultValue={selectedItem.currentStock}
                  className="bg-slate-900/50 border-slate-600 text-white"
                  onChange={(e) => {
                    const newStock = Number.parseInt(e.target.value) || 0
                    setSelectedItem({ ...selectedItem, currentStock: newStock })
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleUpdateStock(selectedItem.barcode, selectedItem.currentStock)
                    setIsEditDialogOpen(false)
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500"
                >
                  Update Stock
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
