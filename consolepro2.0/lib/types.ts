// Types for the application - can be safely imported in client components

export interface InventoryItem {
  barcode: string
  product: string
  category: string
  image: string
  initialStock: number
  restockLevel: number
  currentStock: number
  manualAdjustment: number
  lastUpdated: string
  costPrice: number
  salePrice: number
}

export interface OrderCustomer {
  orderId: string
  customerId: string
  customerName: string
  customerEmail: string
  orderDate: string
  status: string
  invoiceStatus?: string
  paymentStatus?: string
  total: number
  items: string
  notes: string
  invoice_link?: string
  payment_link?: string
  customer_id?: string
  // Additional fields for detailed order view
  businessName?: string
  phone?: string
  // Billing Address
  billingAddressStreet?: string
  billingAddressStreet2?: string
  billingAddressCity?: string
  billingAddressState?: string
  billingAddressZIP?: string
  // Shipping Address
  addressStreet?: string
  addressStreet2?: string
  addressCity?: string
  addressState?: string
  addressZIP?: string
  // Legacy shipping address field for backward compatibility
  shippingAddress?: string
  // Product details
  products?: Array<{
    name: string
    barcode: string
    price: number
    quantity: number
  }>
  productDetails?: Array<{
    name: string
    barcode: string
    price: number
    quantity: number
  }>
}

export interface Customer {
  customer_id: string
  name: string
  email: string
  phone: string
  company: string
  address: string // Keep for backward compatibility
  // New structured address fields
  addressStreet?: string
  addressStreet2?: string
  addressCity?: string
  addressState?: string
  addressZip?: string
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
  square_reference_id: string
  nickname: string
  birthday: string
  square_customer_id: string
  wix_contact_id: string
}

export interface DiscountCode {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  validFrom: Date
  validUntil: Date
  maxUses: number
  currentUses: number
  isActive: boolean
  applicableProducts?: string[]
  minimumOrderAmount?: number
}

export interface DiscountUsage {
  id: string
  discountCode: string
  customerId: string
  customerName: string
  orderId: string
  usedAt: Date
  discountAmount: number
  orderTotal: number
}

export interface SalesRecord {
  barcode: string
  quantity: number
  timestamp: string
  product?: string
  customer_id?: string
  order_code?: string
  customer_name?: string
  email?: string
  wix_order_number?: string
  wix_contact_id?: string
}

export interface PurchaseRecord {
  barcode: string
  quantity: number
  timestamp: string
  product?: string
  cost?: number
  supplier?: string
}

// Utility function that can be used client-side
export function getUnifiedOrderStatus(order: OrderCustomer): string {
  // Check invoice status first
  if (order.invoiceStatus) {
    const status = order.invoiceStatus.toLowerCase()
    if (status.includes('paid') || status.includes('complete')) {
      return 'paid-ready to ship'
    } else if (status.includes('sent')) {
      return 'invoice sent'
    } else if (status.includes('overdue')) {
      return 'invoice overdue'
    }
  }

  // Check payment status
  if (order.paymentStatus) {
    const status = order.paymentStatus.toLowerCase()
    if (status.includes('paid') || status.includes('complete')) {
      return 'paid-ready to ship'
    } else if (status.includes('pending')) {
      return 'invoice sent'
    }
  }

  // Check fulfillment status
  if (order.status) {
    const status = order.status.toLowerCase()
    if (status.includes('shipped') || status.includes('delivered')) {
      return 'paid-ready to ship'
    } else if (status.includes('processing') || status.includes('pending')) {
      return 'invoice sent'
    }
  }

  // Default to new if no status found
  return 'new'
} 