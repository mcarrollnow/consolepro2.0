"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Calendar, DollarSign, Package, MapPin } from "lucide-react"
import Link from "next/link"

interface CustomerOrdersDialogProps {
  customer: {
    customer_id: string
    name: string
    email: string
    phone: string
    purchases: number
    lastPurchase: string
    orders: any[]
  }
  productName: string
}

export function CustomerOrdersDialog({ customer, productName }: CustomerOrdersDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Package className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          <Eye className="h-3 w-3 mr-1" />
          View Orders
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            Orders for {customer.name} - {productName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Customer ID</p>
                <p className="text-white font-mono">{customer.customer_id}</p>
              </div>
              <div>
                <p className="text-slate-400">Name</p>
                <p className="text-white">{customer.name}</p>
              </div>
              <div>
                <p className="text-slate-400">Email</p>
                <p className="text-cyan-300 font-mono">{customer.email}</p>
              </div>
              <div>
                <p className="text-slate-400">Phone</p>
                <p className="text-cyan-300 font-mono">{customer.phone}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-slate-400">Total Purchases: <span className="text-white font-bold">{customer.purchases}</span></span>
                  <span className="text-slate-400">Last Purchase: <span className="text-white font-mono">{customer.lastPurchase}</span></span>
                </div>
                <Link href={`/customers/${customer.customer_id}`}>
                  <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                    View Full Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/50">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Order ID</TableHead>
                  <TableHead className="text-slate-300">Date</TableHead>
                  <TableHead className="text-slate-300">Items</TableHead>
                  <TableHead className="text-slate-300">Total</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Address</TableHead>
                  <TableHead className="text-slate-300">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders.map((order, index) => (
                  <TableRow key={index} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-cyan-300 font-mono text-sm">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono text-sm">
                      {order.orderDate}
                    </TableCell>
                    <TableCell className="text-white text-sm">
                      {order.items || (order.products && order.products.map((p: any) => p.name).join(", "))}
                    </TableCell>
                    <TableCell className="text-green-400 font-bold">
                      ${order.total?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {order.addressStreet && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {order.addressStreet}
                            {order.addressCity && `, ${order.addressCity}`}
                            {order.addressState && `, ${order.addressState}`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm max-w-xs truncate">
                      {order.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 