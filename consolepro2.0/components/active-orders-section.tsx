"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Truck, Clock, CheckCircle, AlertCircle, RefreshCw, CreditCard, Package, MapPin, X, ShoppingCart, Printer, ChevronDown, ChevronDown as ChevronDownIcon } from "lucide-react"
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
  customPrice?: number // Allow custom pricing
}

interface Customer {
  customer_id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  first_order_date: string
  last_order_date: string
  total_orders: string
  total_spent: string
  customer_status: string
  preferred_contact: string
  customer_notes: string
  tags: string
  created_date: string
  last_updated: string
  referred_by: string
  customer_class: string
  nickname: string
  birthday: string
  square_reference_id: string
  square_customer_id: string
  wix_contact_id: string
}

// Autocomplete Component
function CustomerAutocomplete({ 
  value, 
  onChange, 
  onCustomerSelect 
}: { 
  value: string
  onChange: (value: string) => void
  onCustomerSelect: (customer: Customer) => void
}) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch customers when component mounts
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue)
    
    if (inputValue.trim() === '') {
      setFilteredCustomers([])
      setIsOpen(false)
      return
    }

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      customer.email.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 5) // Limit to 5 results

    setFilteredCustomers(filtered)
    setIsOpen(filtered.length > 0)
  }

  const handleCustomerSelect = (customer: Customer) => {
    onChange(customer.name)
    onCustomerSelect(customer)
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    if (value.trim() !== '' && filteredCustomers.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
        className="bg-slate-700 border-slate-600 text-white"
        placeholder="Start typing customer name or email..."
      />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.customer_id}
              className="px-3 py-2 hover:bg-slate-600 cursor-pointer border-b border-slate-600 last:border-b-0"
              onClick={() => handleCustomerSelect(customer)}
            >
              <div className="text-white font-medium">{customer.name}</div>
              <div className="text-slate-300 text-sm">{customer.email}</div>
              {customer.phone && (
                <div className="text-slate-400 text-xs">{customer.phone}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
  const [printMode, setPrintMode] = useState<"all" | "paid" | "custom" | null>(null)
  const [selectedOrdersForPrint, setSelectedOrdersForPrint] = useState<Set<string>>(new Set())
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false)
  const { toast } = useToast()

  // New Order Form State
  const [inventoryData, setInventoryData] = useState<Product[]>([])
  const [priceList, setPriceList] = useState<Record<string, number>>({})
  const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([])
  const [customDiscount, setCustomDiscount] = useState<number>(0) // Custom discount amount
  const [promoCode, setPromoCode] = useState<string>("") // Promo code
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    businessName: "",
    phone: "",
    // Billing Address (required)
    billingAddressStreet: "",
    billingAddressStreet2: "",
    billingAddressCity: "",
    billingAddressState: "",
    billingAddressZIP: "",
    // Shipping Address (optional - defaults to billing)
    shippingRecipient: "",
    shippingAddress: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    // Toggle for different shipping address
    useDifferentShippingAddress: false,
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
      const priceListFile = "b2b_product_price_list.csv"
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
  }, [isNewOrderDialogOpen])

  // Close print dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isPrintDropdownOpen && !target.closest('.print-dropdown-container')) {
        setIsPrintDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPrintDropdownOpen])

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
        name: product.name,
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

  const updateProductPrice = (barcode: string, price: number) => {
    if (price < 0) return
    setSelectedProducts(prev => 
      prev.map(p => 
        p.barcode === barcode 
          ? { ...p, customPrice: price }
          : p
      )
    )
  }

  const getProductPrice = (product: OrderProduct) => {
    return product.customPrice !== undefined ? product.customPrice : product.price
  }

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, product) => sum + (getProductPrice(product) * product.quantity), 0)
  }

  // New function to calculate total with promo code
  const [promoCodeDiscount, setPromoCodeDiscount] = useState<number>(0)
  const [promoCodeLoading, setPromoCodeLoading] = useState(false)

  const calculatePromoCodeDiscount = async () => {
    if (!promoCode.trim() || selectedProducts.length === 0) {
      setPromoCodeDiscount(0)
      return
    }

    setPromoCodeLoading(true)
    try {
      let totalDiscount = 0
      
      // Calculate discount for each product
      for (const product of selectedProducts) {
        const response = await fetch('/api/universal-discount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barcode: product.barcode,
            quantity: product.quantity,
            discountCode: promoCode,
            originalPrice: getProductPrice(product)
          })
        })

        const discountResult = await response.json()
        if (discountResult.success) {
          const originalTotal = getProductPrice(product) * product.quantity
          const discountedTotal = discountResult.unitPrice * product.quantity
          const productSavings = originalTotal - discountedTotal
          totalDiscount += productSavings
        }
      }
      
      setPromoCodeDiscount(totalDiscount)
    } catch (error) {
      console.error('Error calculating promo code discount:', error)
      setPromoCodeDiscount(0)
    } finally {
      setPromoCodeLoading(false)
    }
  }

  // Calculate promo code discount when promo code or products change
  useEffect(() => {
    calculatePromoCodeDiscount()
  }, [promoCode, selectedProducts])

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const totalAfterPromo = Math.max(0, subtotal - promoCodeDiscount)
    return Math.max(0, totalAfterPromo - customDiscount)
  }

  const generateOrderCode = () => {
    const prefix = "B2B"
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
      // Format data for B2B API
      const b2bOrderData = {
        name: newOrder.customerName,
        email: newOrder.customerEmail,
        company: newOrder.businessName,
        phone: newOrder.phone,
        
        // Billing Address (required)
        billingAddress: newOrder.billingAddressStreet,
        billingAddress2: newOrder.billingAddressStreet2,
        billingCity: newOrder.billingAddressCity,
        billingState: newOrder.billingAddressState,
        billingZip: newOrder.billingAddressZIP,
        
        // Shipping Address (optional - will use billing if not provided)
        ...(newOrder.useDifferentShippingAddress && {
          shippingRecipient: newOrder.shippingRecipient || newOrder.customerName,
          shippingAddress: newOrder.shippingAddress,
          shippingAddress2: newOrder.shippingAddress2,
          shippingCity: newOrder.shippingCity,
          shippingState: newOrder.shippingState,
          shippingZip: newOrder.shippingZip,
          shipToDifferent: true,
        }),
        
        // Order details
        special: newOrder.specialInstructions,
        discountCode: promoCode || undefined,
        items: selectedProducts.map(product => ({
          item: product.name,
          qty: product.quantity.toString(),
          price: getProductPrice(product)
        }))
      }

      const response = await fetch("/api/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b2bOrderData),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.ok) {
          toast({
            title: "Success",
            description: `B2B Order ${result.orderCode} created successfully`,
          })
          setIsNewOrderDialogOpen(false)
          resetNewOrderForm()
          fetchActiveOrdersData()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create B2B order",
            variant: "destructive",
          })
        }
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create B2B order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating B2B order:", error)
      toast({
        title: "Error",
        description: "Failed to create B2B order",
        variant: "destructive",
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleCustomerSelect = (customer: Customer) => {
    // Check if customer has structured address fields
    const hasStructuredAddress = (customer as any).addressStreet || (customer as any).addressCity
    
    setNewOrder({
      ...newOrder,
      customerName: customer.name,
      customerEmail: customer.email,
      businessName: customer.company || "",
      phone: customer.phone || "",
      // Use structured address if available, otherwise parse legacy address
      ...(hasStructuredAddress ? {
        // Billing Address (primary)
        billingAddressStreet: (customer as any).addressStreet || "",
        billingAddressStreet2: (customer as any).addressStreet2 || "",
        billingAddressCity: (customer as any).addressCity || "",
        billingAddressState: (customer as any).addressState || "",
        billingAddressZIP: (customer as any).addressZip || "",
        // Shipping Address (defaults to billing)
        shippingRecipient: "",
        shippingAddress: "",
        shippingAddress2: "",
        shippingCity: "",
        shippingState: "",
        shippingZip: "",
        useDifferentShippingAddress: false,
      } : (customer.address && parseAddress(customer.address)))
    })
  }

  const parseAddress = (address: string) => {
    // Simple address parsing - you might want to improve this
    const parts = address.split(',').map(part => part.trim())
    if (parts.length >= 3) {
      return {
        // Billing Address (primary)
        billingAddressStreet: parts[0] || "",
        billingAddressStreet2: "",
        billingAddressCity: parts[1] || "",
        billingAddressState: parts[2] || "",
        billingAddressZIP: parts[3] || "",
        // Shipping Address (defaults to billing)
        shippingRecipient: "",
        shippingAddress: "",
        shippingAddress2: "",
        shippingCity: "",
        shippingState: "",
        shippingZip: "",
        useDifferentShippingAddress: false,
      }
    }
    return {
      // Billing Address (primary)
      billingAddressStreet: address,
      billingAddressStreet2: "",
      billingAddressCity: "",
      billingAddressState: "",
      billingAddressZIP: "",
      // Shipping Address (defaults to billing)
      shippingRecipient: "",
      shippingAddress: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingState: "",
      shippingZip: "",
      useDifferentShippingAddress: false,
    }
  }

  const resetNewOrderForm = () => {
    setNewOrder({
      customerName: "",
      customerEmail: "",
      businessName: "",
      phone: "",
      // Billing Address (required)
      billingAddressStreet: "",
      billingAddressStreet2: "",
      billingAddressCity: "",
      billingAddressState: "",
      billingAddressZIP: "",
      // Shipping Address (optional - defaults to billing)
      shippingRecipient: "",
      shippingAddress: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingState: "",
      shippingZip: "",
      // Toggle for different shipping address
      useDifferentShippingAddress: false,
      specialInstructions: "",
    })
    setSelectedProducts([])
    setCustomDiscount(0)
    setPromoCode("")
    setPromoCodeDiscount(0)
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

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrdersForPrint)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrdersForPrint(newSelected)
  }

  const formatOrderForPrint = (order: OrderCustomer) => {
    const orderDate = order.orderDate || "Not specified"
    const products = order.productDetails && order.productDetails.length > 0 
      ? order.productDetails.map(p => {
          const lineTotal = (p.price * p.quantity).toFixed(2)
          return `${p.name} | Qty: ${p.quantity} | Unit: $${p.price.toFixed(2)} | Line Total: $${lineTotal}`
        }).join("\n      ")
      : order.products && order.products.length > 0
      ? order.products.map(p => {
          const lineTotal = (p.price * p.quantity).toFixed(2)
          return `${p.name} | Qty: ${p.quantity} | Unit: $${p.price.toFixed(2)} | Line Total: $${lineTotal}`
        }).join("\n      ")
      : order.items || "No products listed"
    
    // Build billing address from individual components
    const billingAddressParts = [
      order.billingAddressStreet,
      order.billingAddressStreet2,
      order.billingAddressCity,
      order.billingAddressState,
      order.billingAddressZIP
    ].filter(part => part && part.trim() !== "")
    
    const billingAddress = billingAddressParts.length > 0 
      ? billingAddressParts.join(", ")
      : "Not provided"
    
    // Build shipping address from individual components
    const shippingAddressParts = [
      order.addressStreet,
      order.addressStreet2,
      order.addressCity,
      order.addressState,
      order.addressZIP
    ].filter(part => part && part.trim() !== "")
    
    const shippingAddress = shippingAddressParts.length > 0 
      ? shippingAddressParts.join(", ")
      : order.shippingAddress || "Not provided"
    
    return `
      Order ID: ${order.orderId}
      Date: ${orderDate}
      
      Customer Information:
      Name: ${order.customerName}
      Email: ${order.customerEmail}
      Phone: ${order.phone || "Not provided"}
      Business: ${order.businessName || "N/A"}
      
      Billing Address:
      ${billingAddress}
      
      Shipping Address:
      ${shippingAddress}
      
      Products:
      ${products}
      
      Total: $${order?.total != null ? order.total.toFixed(2) : "N/A"}
      
      ----------------------------------------
    `
  }

  const handlePrint = (mode: "all" | "paid" | "custom") => {
    let ordersToPrint: OrderCustomer[] = []
    
    switch (mode) {
      case "all":
        ordersToPrint = ordersData
        break
      case "paid":
        ordersToPrint = ordersData.filter(order => {
          const status = getUnifiedOrderStatus(order).toLowerCase()
          return status === "paid-ready to ship"
        })
        break
      case "custom":
        ordersToPrint = ordersData.filter(order => selectedOrdersForPrint.has(order.orderId))
        break
    }

    if (ordersToPrint.length === 0) {
      toast({
        title: "No Orders to Print",
        description: mode === "custom" ? "Please select orders to print" : "No orders found for the selected criteria",
        variant: "destructive",
      })
      return
    }

    const printContent = ordersToPrint.map(formatOrderForPrint).join("\n")
    
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Orders Print - ${mode.charAt(0).toUpperCase() + mode.slice(1)}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                font-size: 12px; 
                line-height: 1.4;
                margin: 20px;
              }
              h1 { 
                font-size: 18px; 
                margin-bottom: 20px; 
                text-align: center;
              }
              pre { 
                white-space: pre-wrap; 
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <h1>Orders Report - ${mode.charAt(0).toUpperCase() + mode.slice(1)} (${ordersToPrint.length} orders)</h1>
            <pre>${printContent}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }

    // Reset states after printing
    setPrintMode(null)
    setSelectedOrdersForPrint(new Set())
    setIsPrintDropdownOpen(false)
  }

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
              
              {/* Print Button with Dropdown */}
              <div className="relative print-dropdown-container">
                <Button
                  onClick={() => setIsPrintDropdownOpen(!isPrintDropdownOpen)}
                  variant="outline"
                  className="border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Orders
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                
                {isPrintDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <Button
                        onClick={() => handlePrint("all")}
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-slate-700"
                      >
                        Print All Orders
                      </Button>
                      <Button
                        onClick={() => handlePrint("paid")}
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-slate-700"
                      >
                        Print Paid Orders
                      </Button>
                      <Button
                        onClick={() => setPrintMode(printMode === "custom" ? null : "custom")}
                        variant="ghost"
                        className={`w-full justify-start ${printMode === "custom" ? "bg-slate-700 text-cyan-400" : "text-white hover:bg-slate-700"}`}
                      >
                        Custom Select Orders
                      </Button>
                      
                      {printMode === "custom" && (
                        <div className="mt-2 pt-2 border-t border-slate-600">
                          <div className="text-xs text-slate-400 mb-2">
                            Selected: {selectedOrdersForPrint.size} orders
                          </div>
                          <div className="space-y-1">
                            <Button
                              onClick={() => handlePrint("custom")}
                              disabled={selectedOrdersForPrint.size === 0}
                              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                            >
                              Print Selected ({selectedOrdersForPrint.size})
                            </Button>
                            <Button
                              onClick={() => setSelectedOrdersForPrint(new Set())}
                              variant="ghost"
                              className="w-full text-slate-400 hover:text-white hover:bg-slate-700 text-sm"
                            >
                              Clear Selection
                            </Button>
                            <Button
                              onClick={() => {
                                setPrintMode(null)
                                setSelectedOrdersForPrint(new Set())
                              }}
                              variant="ghost"
                              className="w-full text-slate-400 hover:text-white hover:bg-slate-700 text-sm"
                            >
                              Cancel Custom Mode
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => setIsNewOrderDialogOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New B2B Order
              </Button>
              <Button
                onClick={fetchActiveOrdersData}
                variant="outline"
                className="border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white"
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
                  {printMode === "custom" && (
                    <TableHead className="text-slate-300 font-medium w-12">Select</TableHead>
                  )}
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
                    {printMode === "custom" && (
                      <TableCell className="w-12">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedOrdersForPrint.has(order.orderId)}
                            onChange={() => toggleOrderSelection(order.orderId)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 border-white/50 flex items-center justify-center ${
                            selectedOrdersForPrint.has(order.orderId) 
                              ? 'bg-white/20 border-white' 
                              : 'bg-transparent'
                          }`}>
                            {selectedOrdersForPrint.has(order.orderId) && (
                              <div className="w-2 h-2 bg-white"></div>
                            )}
                          </div>
                        </label>
                      </TableCell>
                    )}
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
                    <TableCell className="text-slate-300 max-w-xs">
                      {order.productDetails && order.productDetails.length > 0 ? (
                        <div className="space-y-1">
                          {order.productDetails.slice(0, 2).map((product, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium">{product.name}</span>
                              <span className="text-slate-400"> (Qty: {product.quantity})</span>
                            </div>
                          ))}
                          {order.productDetails.length > 2 && (
                            <div className="text-xs text-slate-400">
                              +{order.productDetails.length - 2} more items
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="truncate">{order.items}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">${order?.total != null ? order.total.toFixed(2) : "N/A"}</TableCell>
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
                          className="border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white h-8 px-2"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openInvoiceStatusDialog(order)}
                          className="border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white h-8 px-2"
                        >
                          Invoice
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateStripeInvoice(order.orderId)}
                          disabled={creatingStripeInvoice === order.orderId}
                          className="border-purple-600 text-black hover:bg-purple-700 hover:text-white h-8 px-2"
                        >
                          {creatingStripeInvoice === order.orderId ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            "Send Invoice"
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
            <DialogTitle className="text-2xl">Create New B2B Order</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Customer Information */}
            <div className="space-y-4">


              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <CustomerAutocomplete
                      value={newOrder.customerName}
                      onChange={(value) => setNewOrder({ ...newOrder, customerName: value })}
                      onCustomerSelect={handleCustomerSelect}
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
                <h3 className="text-lg font-semibold text-white mb-4">Billing Address *</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="billingAddressStreet">Street Address *</Label>
                    <Input
                      id="billingAddressStreet"
                      value={newOrder.billingAddressStreet}
                      onChange={(e) => setNewOrder({ ...newOrder, billingAddressStreet: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingAddressStreet2">Street Address Line 2</Label>
                    <Input
                      id="billingAddressStreet2"
                      value={newOrder.billingAddressStreet2 || ""}
                      onChange={(e) => setNewOrder({ ...newOrder, billingAddressStreet2: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="billingAddressCity">City *</Label>
                      <Input
                        id="billingAddressCity"
                        value={newOrder.billingAddressCity}
                        onChange={(e) => setNewOrder({ ...newOrder, billingAddressCity: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="billingAddressState">State *</Label>
                      <Input
                        id="billingAddressState"
                        value={newOrder.billingAddressState}
                        onChange={(e) => setNewOrder({ ...newOrder, billingAddressState: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="billingAddressZIP">ZIP Code *</Label>
                    <Input
                      id="billingAddressZIP"
                      value={newOrder.billingAddressZIP}
                      onChange={(e) => setNewOrder({ ...newOrder, billingAddressZIP: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="useDifferentShippingAddress">
                      <input
                        type="checkbox"
                        id="useDifferentShippingAddress"
                        checked={newOrder.useDifferentShippingAddress}
                        onChange={(e) => setNewOrder({ ...newOrder, useDifferentShippingAddress: e.target.checked })}
                        className="mr-2 h-4 w-4 text-cyan-400 focus:ring-cyan-500 border-slate-600 rounded"
                      />
                      Ship to a different address
                    </Label>
                  </div>
                  {!newOrder.useDifferentShippingAddress && (
                    <div className="text-slate-400 text-sm">
                      Shipping address will be the same as billing address
                    </div>
                  )}
                  {newOrder.useDifferentShippingAddress && (
                    <>
                      <div>
                        <Label htmlFor="shippingRecipient">Shipping Recipient</Label>
                        <Input
                          id="shippingRecipient"
                          value={newOrder.shippingRecipient || ""}
                          onChange={(e) => setNewOrder({ ...newOrder, shippingRecipient: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Recipient name (optional)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingAddress">Street Address</Label>
                        <Input
                          id="shippingAddress"
                          value={newOrder.shippingAddress || ""}
                          onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter street address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingAddress2">Street Address Line 2</Label>
                        <Input
                          id="shippingAddress2"
                          value={newOrder.shippingAddress2 || ""}
                          onChange={(e) => setNewOrder({ ...newOrder, shippingAddress2: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="shippingCity">City</Label>
                          <Input
                            id="shippingCity"
                            value={newOrder.shippingCity || ""}
                            onChange={(e) => setNewOrder({ ...newOrder, shippingCity: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shippingState">State</Label>
                          <Input
                            id="shippingState"
                            value={newOrder.shippingState || ""}
                            onChange={(e) => setNewOrder({ ...newOrder, shippingState: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="State"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="shippingZip">ZIP Code</Label>
                        <Input
                          id="shippingZip"
                          value={newOrder.shippingZip || ""}
                          onChange={(e) => setNewOrder({ ...newOrder, shippingZip: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="ZIP code"
                        />
                      </div>
                    </>
                  )}
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
                        <div className="text-white font-medium text-lg">{product.name}</div>
                        <div className="text-cyan-400 text-sm font-semibold">
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
                          <div className="text-white font-medium text-lg">{product.name}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => updateProductQuantity(product.barcode, parseInt(e.target.value) || 1)}
                            className="w-16 bg-slate-700 border-slate-600 text-white text-center"
                          />
                          <div className="flex flex-col items-end space-y-1">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={getProductPrice(product).toFixed(2)}
                              onChange={(e) => updateProductPrice(product.barcode, parseFloat(e.target.value) || 0)}
                              className="w-20 bg-slate-700 border-slate-600 text-white text-center text-sm"
                              placeholder="Price"
                            />
                            <div className="text-cyan-400 font-medium text-sm">
                              ${(getProductPrice(product) * product.quantity).toFixed(2)}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeProductFromOrder(product.barcode)}
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-white"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Discount and Promo Code Section */}
                    <div className="border-t border-slate-600 pt-4 mt-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Label className="text-white text-sm">Custom Discount:</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={customDiscount}
                          onChange={(e) => setCustomDiscount(parseFloat(e.target.value) || 0)}
                          className="w-24 bg-slate-700 border-slate-600 text-white text-center"
                          placeholder="0.00"
                        />
                        <span className="text-slate-400 text-sm">USD</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Label className="text-white text-sm">Promo Code:</Label>
                        <Input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 bg-slate-700 border-slate-600 text-white"
                          placeholder="Enter promo code (optional)"
                        />
                        {promoCodeLoading && (
                          <div className="text-cyan-400 text-sm">Calculating...</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-600 pt-2 mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Subtotal:</span>
                        <span className="text-white">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      {promoCodeDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Promo Code Discount:</span>
                          <span className="text-green-400">-${promoCodeDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {customDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Custom Discount:</span>
                          <span className="text-red-400">-${customDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {promoCode && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Promo Code:</span>
                          <span className="text-cyan-400">{promoCode}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold border-t border-slate-600 pt-2">
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
              className="border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white"
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
                  Creating B2B Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create B2B Order
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

              {/* Billing Address */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-cyan-400" />
                  Billing Address
                </h3>
                <div className="space-y-2">
                  {selectedOrder.billingAddressStreet && (
                    <p className="text-white">{selectedOrder.billingAddressStreet}</p>
                  )}
                  {selectedOrder.billingAddressStreet2 && (
                    <p className="text-white">{selectedOrder.billingAddressStreet2}</p>
                  )}
                  {(selectedOrder.billingAddressCity || selectedOrder.billingAddressState || selectedOrder.billingAddressZIP) && (
                    <p className="text-white">
                      {[selectedOrder.billingAddressCity, selectedOrder.billingAddressState, selectedOrder.billingAddressZIP]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {!selectedOrder.billingAddressStreet && !selectedOrder.billingAddressCity && (
                    <p className="text-slate-500">No billing address provided</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-cyan-400" />
                  Shipping Address
                </h3>
                <div className="space-y-2">
                  {selectedOrder.addressStreet && (
                    <p className="text-white">{selectedOrder.addressStreet}</p>
                  )}
                  {selectedOrder.addressStreet2 && (
                    <p className="text-white">{selectedOrder.addressStreet2}</p>
                  )}
                  {(selectedOrder.addressCity || selectedOrder.addressState || selectedOrder.addressZIP) && (
                    <p className="text-white">
                      {[selectedOrder.addressCity, selectedOrder.addressState, selectedOrder.addressZIP]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {!selectedOrder.addressStreet && !selectedOrder.addressCity && (
                    <p className="text-slate-500">No shipping address provided</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.productDetails && selectedOrder.productDetails.length > 0 ? (
                    selectedOrder.productDetails.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-600/50 rounded">
                        <div className="flex-1">
                          <p className="text-white font-medium">{product.name}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-slate-400 text-sm">Qty: {product.quantity}</span>
                            <span className="text-slate-400 text-sm">Unit Price: ${product.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                          <p className="text-slate-400 text-xs">Line Total</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-slate-600/50 rounded">
                      <p className="text-slate-400">{selectedOrder.items}</p>
                      <p className="text-slate-500 text-sm mt-1">Detailed product information not available</p>
                    </div>
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
                    <span className="text-white font-bold text-lg">${selectedOrder?.total != null ? selectedOrder.total.toFixed(2) : "N/A"}</span>
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
                  <Button asChild variant="outline" className="border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white">
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
                className="border-slate-600 text-black hover:bg-slate-700 hover:text-white bg-white"
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