"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Star, UserPlus, Search, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Customer } from "@/lib/google-sheets"
import { AICustomerIntelligenceWidget } from "./ai-customer-intelligence-widget"
import { AddCustomerDialog } from "./add-customer-dialog"

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

export function CustomersSection() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch("/api/customers")
        if (response.ok) {
          const data = await response.json()
          setCustomers(data)
        } else {
          console.error("Failed to fetch customers")
        }
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const handleCreateWixCustomer = async (customerId: string) => {
    if (!APPS_SCRIPT_URL) {
      alert("Apps Script URL is not set.")
      return
    }
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createWixCustomerFromProfile", customerId }),
      });
      const data = await res.json();
      alert(data.result || "Wix customer creation triggered.");
    } catch (error) {
      alert("Failed to create Wix customer: " + error);
    }
  };

  const handleCustomerAdded = () => {
    // Refresh the customers list
    window.location.reload()
  }

  // Filter and sort customers
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key as keyof Customer] || ""
    const bValue = b[sortConfig.key as keyof Customer] || ""

    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  return (
    <div className="space-y-6" data-section="customers">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Customer Management</h2>
          <p className="text-slate-400 mt-1">Manage customer profiles and order history</p>
        </div>
        <AddCustomerDialog onCustomerAdded={handleCustomerAdded} />
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

      {/* AI Customer Intelligence Widget */}
      <div data-ai-widget="customers">
        <AICustomerIntelligenceWidget 
          customers={customers}
          orders={[]} // We'll need to fetch orders data for this
          archivedOrders={[]} // We'll need to fetch archived orders data for this
        />
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
                    <TableCell className="text-slate-300 font-mono">
                      <Link 
                        href={`/customers/${customer.customer_id}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        {customer.customer_id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      <Link 
                        href={`/customers/${customer.customer_id}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        {customer.name}
                      </Link>
                    </TableCell>
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
                      <div className="flex space-x-2">
                        <Link
                          href={`/customers/${customer.customer_id}`}
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2 py-1 rounded text-xs"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => handleCreateWixCustomer(customer.customer_id)}
                          className="bg-cyan-700 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Create Wix Customer
                        </button>
                      </div>
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
