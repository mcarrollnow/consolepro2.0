"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Download, RefreshCw, Search } from "lucide-react"
import { toast } from "sonner"

interface StripeInvoice {
  id: string
  number: string
  status: 'paid' | 'open' | 'uncollectible' | 'void'
  amount_due: number
  amount_paid: number
  amount_remaining: number
  currency: string
  created: number
  due_date: number | null
  invoice_pdf: string | null
  hosted_invoice_url: string | null
  customer: {
    id: string
    name: string | null
    email: string | null
  }
  subscription_id: string | null
  description: string | null
  metadata: Record<string, string>
  lines: Array<{
    id: string
    description: string | null
    amount: number
    quantity: number | null
    price: {
      id: string
      unit_amount: number | null
      currency: string
      product: string | null
    } | null
  }>
}

interface InvoicesResponse {
  invoices: StripeInvoice[]
  has_more: boolean
  total_count: number
}

export default function InvoicesSection() {
  const [invoices, setInvoices] = useState<StripeInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [limit, setLimit] = useState(50)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        limit: limit.toString(),
      })
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      const response = await fetch(`/api/invoices?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch invoices')
      }
      
      const data: InvoicesResponse = await response.json()
      setInvoices(data.invoices)
      
    } catch (err) {
      console.error('Error fetching invoices:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [statusFilter, limit])

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'uncollectible':
        return 'bg-red-100 text-red-800'
      case 'void':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      invoice.number?.toLowerCase().includes(searchLower) ||
      invoice.customer.name?.toLowerCase().includes(searchLower) ||
      invoice.customer.email?.toLowerCase().includes(searchLower) ||
      invoice.description?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stripe Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading invoices...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stripe Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchInvoices} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Stripe Invoices</span>
          <Button onClick={fetchInvoices} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="uncollectible">Uncollectible</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
          <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoices Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.number || invoice.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {invoice.customer.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(invoice.amount_due, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(invoice.amount_paid, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      {formatDate(invoice.created)}
                    </TableCell>
                    <TableCell>
                      {invoice.due_date ? formatDate(invoice.due_date) : 'No due date'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {invoice.hosted_invoice_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(invoice.hosted_invoice_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        {invoice.invoice_pdf && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(invoice.invoice_pdf!, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {invoices.filter(i => i.status === 'paid').length}
              </div>
              <div className="text-sm text-muted-foreground">Paid</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {invoices.filter(i => i.status === 'open').length}
              </div>
              <div className="text-sm text-muted-foreground">Open</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {invoices.filter(i => i.status === 'uncollectible').length}
              </div>
              <div className="text-sm text-muted-foreground">Uncollectible</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {formatCurrency(
                  invoices.reduce((sum, i) => sum + i.amount_due, 0),
                  invoices[0]?.currency || 'usd'
                )}
              </div>
              <div className="text-sm text-muted-foreground">Total Outstanding</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
} 