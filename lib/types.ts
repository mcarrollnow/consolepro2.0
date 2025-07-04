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
  orderDate: string
  customerName: string
  customerEmail: string
  businessName?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  total: number
  status: string
  specialInstructions?: string
  products: Array<{
    name: string
    barcode: string
    price: number
    quantity: number
  }>
  paymentLink?: string
  invoiceLink?: string
  customerId?: string
  // Unified status fields
  invoice_status?: string
  payment_status?: string
  fulfillment_status?: string
}

export interface Customer {
  customer_id: string
  name: string
  email: string
  phone: string
  company?: string
  address?: string
  first_order_date?: string
  last_order_date?: string
  total_orders?: number
  total_spent?: number
  customer_status?: string
  preferred_contact?: string
  customer_notes?: string
  tags?: string
  created_date?: string
  last_updated?: string
  referred_by?: string
  customer_class?: string
  square_reference_id?: string
  nickname?: string
  birthday?: string
  square_customer_id?: string
  wix_contact_id?: string
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
  // Priority order: payment_status > invoice_status > fulfillment_status > status
  if (order.payment_status) {
    return order.payment_status
  }
  if (order.invoice_status) {
    return order.invoice_status
  }
  if (order.fulfillment_status) {
    return order.fulfillment_status
  }
  return order.status || "Processing"
} 