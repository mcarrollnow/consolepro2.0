"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ExternalLink, Download, RefreshCw, Search, Send, Eye, ChevronDown, MessageSquare, Mail, Share2, Archive, FileDown, X } from "lucide-react"
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
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

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

  const handleSelectInvoice = (invoiceId: string) => {
    const newSelected = new Set(selectedInvoices)
    if (newSelected.has(invoiceId)) {
      newSelected.delete(invoiceId)
    } else {
      newSelected.add(invoiceId)
    }
    setSelectedInvoices(newSelected)
    setIsSelectionMode(true)
  }

  const handleSelectAll = () => {
    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set())
      setIsSelectionMode(false)
    } else {
      const allIds = new Set(filteredInvoices.map(invoice => invoice.id))
      setSelectedInvoices(allIds)
      setIsSelectionMode(true)
    }
  }

  const handleBulkAction = async (action: 'archive' | 'export' | 'send' | 'cancel') => {
    const selectedInvoiceList = filteredInvoices.filter(invoice => selectedInvoices.has(invoice.id))
    
    switch (action) {
      case 'archive':
        try {
          toast.loading(`Archiving ${selectedInvoiceList.length} invoices...`)
          
          // Call API to archive invoices
          const response = await fetch('/api/invoices/bulk-archive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invoiceIds: selectedInvoiceList.map(inv => inv.id) })
          })
          
          if (response.ok) {
            toast.success(`Successfully archived ${selectedInvoiceList.length} invoices`)
            setSelectedInvoices(new Set())
            setIsSelectionMode(false)
            fetchInvoices() // Refresh the list
          } else {
            const error = await response.json()
            toast.error(`Failed to archive invoices: ${error.message}`)
          }
        } catch (error) {
          toast.error('Failed to archive invoices')
          console.error('Archive error:', error)
        }
        break
        
      case 'export':
        try {
          // Create CSV data
          const csvData = [
            ['Invoice #', 'Customer', 'Status', 'Amount Due', 'Amount Paid', 'Created', 'Due Date'],
            ...selectedInvoiceList.map(invoice => [
              invoice.number || invoice.id.slice(-8),
              invoice.customer.name || 'Unknown',
              invoice.status,
              formatCurrency(invoice.amount_due, invoice.currency),
              formatCurrency(invoice.amount_paid, invoice.currency),
              formatDate(invoice.created),
              invoice.due_date ? formatDate(invoice.due_date) : 'No due date'
            ])
          ]
          
          // Convert to CSV string
          const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
          
          // Create and download file
          const blob = new Blob([csvContent], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.csv`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
          
          toast.success(`Exported ${selectedInvoiceList.length} invoices to CSV`)
          setSelectedInvoices(new Set())
          setIsSelectionMode(false)
        } catch (error) {
          toast.error('Failed to export invoices')
          console.error('Export error:', error)
        }
        break
        
      case 'send':
        try {
          toast.loading(`Preparing to send ${selectedInvoiceList.length} invoices...`)
          
          // Call API to bulk send invoices
          const response = await fetch('/api/invoices/bulk-send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              invoices: selectedInvoiceList.map(inv => ({
                id: inv.id,
                customerEmail: inv.customer.email,
                customerName: inv.customer.name,
                invoiceUrl: inv.hosted_invoice_url || inv.invoice_pdf
              }))
            })
          })
          
          if (response.ok) {
            toast.success(`Successfully sent ${selectedInvoiceList.length} invoices`)
            setSelectedInvoices(new Set())
            setIsSelectionMode(false)
          } else {
            const error = await response.json()
            toast.error(`Failed to send invoices: ${error.message}`)
          }
        } catch (error) {
          toast.error('Failed to send invoices')
          console.error('Send error:', error)
        }
        break
        
      case 'cancel':
        setSelectedInvoices(new Set())
        setIsSelectionMode(false)
        break
    }
  }

  const handleSendInvoice = (type: 'text' | 'email' | 'share', invoice: StripeInvoice) => {
    const invoiceUrl = invoice.hosted_invoice_url || invoice.invoice_pdf
    if (!invoiceUrl) {
      toast.error('No invoice URL available')
      return
    }

    const customerName = invoice.customer.name || 'Customer'
    const invoiceNumber = invoice.number || invoice.id.slice(-8)
    const amount = formatCurrency(invoice.amount_due, invoice.currency)
    
    const message = `Invoice ${invoiceNumber} for ${customerName} - Amount: ${amount}\n\nView invoice: ${invoiceUrl}`

    switch (type) {
      case 'text':
        // Open native SMS app
        const smsUrl = `sms:?body=${encodeURIComponent(message)}`
        window.open(smsUrl, '_blank')
        break
        
      case 'email':
        // Open native email app
        const emailSubject = `Invoice ${invoiceNumber} - ${customerName}`
        const emailBody = `Hello,\n\nPlease find attached the invoice ${invoiceNumber} for ${customerName}.\n\nAmount: ${amount}\n\nView invoice: ${invoiceUrl}\n\nBest regards`
        const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
        window.open(emailUrl, '_blank')
        break
        
      case 'share':
        // Use Web Share API if available, fallback to copy to clipboard
        if (navigator.share) {
          navigator.share({
            title: `Invoice ${invoiceNumber}`,
            text: message,
            url: invoiceUrl
          }).catch((error) => {
            console.log('Error sharing:', error)
            // Fallback to copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
              toast.success('Invoice link copied to clipboard')
            }).catch(() => {
              toast.error('Failed to copy to clipboard')
            })
          })
        } else {
          // Fallback to copy to clipboard
          navigator.clipboard.writeText(message).then(() => {
            toast.success('Invoice link copied to clipboard')
          }).catch(() => {
            toast.error('Failed to copy to clipboard')
          })
        }
        break
    }
  }

  if (loading) {
    return (
      <Card className="bg-[#181818] text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stripe Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-400">Loading invoices...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-[#181818] text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Stripe Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button onClick={fetchInvoices} variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#181818] text-white border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Stripe Invoices</span>
          <Button onClick={fetchInvoices} variant="outline" size="sm" className="text-black bg-white border-gray-600 hover:bg-gray-100">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all" className="text-white hover:bg-gray-700">All Statuses</SelectItem>
              <SelectItem value="open" className="text-white hover:bg-gray-700">Open</SelectItem>
              <SelectItem value="paid" className="text-white hover:bg-gray-700">Paid</SelectItem>
              <SelectItem value="uncollectible" className="text-white hover:bg-gray-700">Uncollectible</SelectItem>
              <SelectItem value="void" className="text-white hover:bg-gray-700">Void</SelectItem>
            </SelectContent>
          </Select>
          <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
            <SelectTrigger className="w-24 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="25" className="text-white hover:bg-gray-700">25</SelectItem>
              <SelectItem value="50" className="text-white hover:bg-gray-700">50</SelectItem>
              <SelectItem value="100" className="text-white hover:bg-gray-700">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions Sub-menu */}
        {isSelectionMode && (
          <div className="mb-4 p-3 bg-gray-800/50 border border-gray-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {selectedInvoices.size} invoice{selectedInvoices.size !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('archive')}
                    className="text-black bg-white border-gray-600 hover:bg-gray-100"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('export')}
                    className="text-black bg-white border-gray-600 hover:bg-gray-100"
                  >
                    <FileDown className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('send')}
                    className="text-black bg-white border-gray-600 hover:bg-gray-100"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('cancel')}
                    className="text-black bg-white border-gray-600 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div className="rounded-md border border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-white border-gray-700 w-12">
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-4 h-4 border-2 border-white/50 rounded cursor-pointer transition-all duration-200 ${
                        selectedInvoices.size === filteredInvoices.length && filteredInvoices.length > 0
                          ? 'bg-white/50'
                          : 'bg-transparent'
                      }`}
                      onClick={handleSelectAll}
                    />
                  </div>
                </TableHead>
                <TableHead className="text-white border-gray-700">Invoice #</TableHead>
                <TableHead className="text-white border-gray-700">Customer</TableHead>
                <TableHead className="text-white border-gray-700">Status</TableHead>
                <TableHead className="text-white border-gray-700">Amount Due</TableHead>
                <TableHead className="text-white border-gray-700">Amount Paid</TableHead>
                <TableHead className="text-white border-gray-700">Created</TableHead>
                <TableHead className="text-white border-gray-700">Due Date</TableHead>
                <TableHead className="text-white border-gray-700">Send Invoice</TableHead>
                <TableHead className="text-white border-gray-700">View Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow className="border-gray-700">
                  <TableCell colSpan={10} className="text-center py-8 text-gray-400 border-gray-700">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-gray-700 hover:bg-gray-800 group">
                    <TableCell className="border-gray-700">
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-4 h-4 border-2 border-white/50 rounded cursor-pointer transition-all duration-200 ${
                            selectedInvoices.has(invoice.id) || isSelectionMode
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          } ${
                            selectedInvoices.has(invoice.id)
                              ? 'bg-white/50'
                              : 'bg-transparent'
                          }`}
                          onClick={() => handleSelectInvoice(invoice.id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white border-gray-700">
                      {invoice.number || invoice.id.slice(-8)}
                    </TableCell>
                    <TableCell className="border-gray-700">
                      <div>
                        <div className="font-medium text-white">
                          {invoice.customer.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {invoice.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="border-gray-700">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white border-gray-700">
                      {formatCurrency(invoice.amount_due, invoice.currency)}
                    </TableCell>
                    <TableCell className="text-white border-gray-700">
                      {formatCurrency(invoice.amount_paid, invoice.currency)}
                    </TableCell>
                    <TableCell className="text-white border-gray-700">
                      {formatDate(invoice.created)}
                    </TableCell>
                    <TableCell className="text-white border-gray-700">
                      {invoice.due_date ? formatDate(invoice.due_date) : 'No due date'}
                    </TableCell>
                    <TableCell className="border-gray-700">
                      {(invoice.hosted_invoice_url || invoice.invoice_pdf) ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-black bg-white border-gray-600 hover:bg-gray-100"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-600">
                            <DropdownMenuItem 
                              onClick={() => handleSendInvoice('text', invoice)}
                              className="text-white hover:bg-gray-700"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Text
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSendInvoice('email', invoice)}
                              className="text-white hover:bg-gray-700"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleSendInvoice('share', invoice)}
                              className="text-white hover:bg-gray-700"
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-gray-500 text-sm">No URL</span>
                      )}
                    </TableCell>
                    <TableCell className="border-gray-700">
                      {invoice.hosted_invoice_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-black bg-white border-gray-600 hover:bg-gray-100"
                          onClick={() => window.open(invoice.hosted_invoice_url!, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : invoice.invoice_pdf ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-black bg-white border-gray-600 hover:bg-gray-100"
                          onClick={() => window.open(invoice.invoice_pdf!, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      ) : (
                        <span className="text-gray-500 text-sm">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">
                {invoices.filter(i => i.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-400">Paid</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">
                {invoices.filter(i => i.status === 'open').length}
              </div>
              <div className="text-sm text-gray-400">Open</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-400">
                {invoices.filter(i => i.status === 'uncollectible').length}
              </div>
              <div className="text-sm text-gray-400">Uncollectible</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(
                  invoices.reduce((sum, i) => sum + i.amount_due, 0),
                  invoices[0]?.currency || 'usd'
                )}
              </div>
              <div className="text-sm text-gray-400">Total Outstanding</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
} 