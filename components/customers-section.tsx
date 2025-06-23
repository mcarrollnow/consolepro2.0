"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Users, Search, UserPlus, Star, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export function CustomersSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true)
      try {
        const res = await fetch("/api/customers")
        const data = await res.json()
        setCustomers(data)
      } catch (e) {
        setCustomers([])
      }
      setLoading(false)
    }
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) =>
    (customer.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.customer_id || "").toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sorting logic
  const sortedCustomers = [...filteredCustomers]
  if (sortConfig) {
    sortedCustomers.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]
      if (sortConfig.key === 'name') {
        aValue = (aValue || '').toLowerCase()
        bValue = (bValue || '').toLowerCase()
      } else if (sortConfig.key === 'total_spent') {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Regular":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "New":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Customer Management</h2>
          <p className="text-slate-400 mt-1">Manage customer profiles and order history</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg shadow-cyan-500/25">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-white">{loading ? "..." : customers.length}</p>
              </div>
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Users className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">VIP Customers</p>
                <p className="text-2xl font-bold text-purple-400">156</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">New This Month</p>
                <p className="text-2xl font-bold text-green-400">89</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg. Order Value</p>
                <p className="text-2xl font-bold text-yellow-400">$187.50</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Customer Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-slate-400">Loading customers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Customer ID</TableHead>
                  <TableHead
                    className="text-slate-300 cursor-pointer select-none"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortConfig?.key === 'name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                    )}
                  </TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Orders</TableHead>
                  <TableHead
                    className="text-slate-300 cursor-pointer select-none"
                    onClick={() => handleSort('total_spent')}
                  >
                    Total Spent
                    {sortConfig?.key === 'total_spent' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                    )}
                  </TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer) => (
                  <TableRow key={customer.customer_id} className="border-slate-700 hover:bg-slate-800/30">
                    <TableCell className="text-slate-300 font-mono">{customer.customer_id}</TableCell>
                    <TableCell className="text-white font-medium">{customer.name}</TableCell>
                    <TableCell className="text-slate-300">{customer.email}</TableCell>
                    <TableCell className="text-slate-300">{customer.total_orders}</TableCell>
                    <TableCell className="text-slate-300">{customer.total_spent}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.customer_status)}>
                        {customer.customer_status === "VIP" && <Star className="h-3 w-3 mr-1" />}
                        {customer.customer_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/customers/${customer.customer_id}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2 py-1 rounded"
                      >
                        View Profile
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
