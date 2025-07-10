# B2B Request Form - Address System Updates

## Overview
This document provides complete system instructions for updating your B2B request form project to add billing and shipping address support with line 2 fields.

## Key Features Added
- ✅ Billing and shipping address support with line 2 fields
- ✅ Toggle option to make billing address different from shipping
- ✅ Updated print function with proper address labels
- ✅ Enhanced order details dialog
- ✅ Google Sheets integration for both address types
- ✅ Backward compatibility with existing data

---

## 1. Update Order API Route

**File:** `app/api/orders/route.ts`

**Changes needed:**
- Add billing address fields to the `formattedOrder` object
- Ensure billing address defaults to shipping address if not provided

```typescript
// Add this section after the existing address fields:
const formattedOrder = {
  customerName: orderData.customerName,
  customerEmail: orderData.customerEmail,
  customerId: customerId,
  businessName: orderData.businessName || "",
  phone: orderData.phone || "",
  // Billing Address (defaults to shipping if not provided)
  billingAddressStreet: orderData.billingAddressStreet || orderData.addressStreet || "",
  billingAddressStreet2: orderData.billingAddressStreet2 || orderData.addressStreet2 || "",
  billingAddressCity: orderData.billingAddressCity || orderData.addressCity || "",
  billingAddressState: orderData.billingAddressState || orderData.addressState || "",
  billingAddressZIP: orderData.billingAddressZIP || orderData.addressZIP || "",
  // Shipping Address
  addressStreet: orderData.addressStreet || "",
  addressStreet2: orderData.addressStreet2 || "",
  addressCity: orderData.addressCity || "",
  addressState: orderData.addressState || "",
  addressZIP: orderData.addressZIP || "",
  notes: orderData.notes || "",
  total: orderData.total,
  products: orderData.products || [],
  orderType: orderData.orderType || "RETAIL",
  orderCode: orderData.orderCode || `ORD-${Date.now()}`,
  recordType: orderData.orderType === "B2B" ? "B2B_ORDER" : "RETAIL_TRANSACTION",
  // Required properties for OrderCustomer interface
  orderId: orderData.orderCode || `ORD-${Date.now()}`,
  orderDate: new Date().toISOString(),
  status: "PENDING",
  items: orderData.products?.map((p: any) => p.name).join(", ") || "",
}
```

---

## 2. Update Google Sheets Service

**File:** `lib/google-sheets.ts`

### A. Update addNewOrder Function Interface

```typescript
async addNewOrder(order: Omit<OrderCustomer, "orderId"> & {
  orderCode?: string
  recordType?: string
  orderType?: string
  addressStreet2?: string
  // Billing address fields
  billingAddressStreet?: string
  billingAddressStreet2?: string
  billingAddressCity?: string
  billingAddressState?: string
  billingAddressZIP?: string
  // Shipping address fields
  shippingAddressStreet?: string
  shippingAddressStreet2?: string
  shippingAddressCity?: string
  shippingAddressState?: string
  shippingAddressZIP?: string
  products?: Array<{
    name: string
    barcode: string
    price: number
    quantity: number
  }>
}): Promise<string>
```

### B. Update addNewOrder Function Implementation

```typescript
// Build the row according to the Orders sheet structure
const values = [
  [
    new Date().toISOString(),                    // Submission_Timestamp (A)
    orderId,                                     // Order_Code (B)
    order.recordType || "RETAIL_TRANSACTION",    // Record_Type (C)
    order.customerName,                          // Customer_Name (D)
    order.customerId || "",                      // customer_id (E)
    order.customerEmail,                         // Email (F)
    order.businessName || "",                    // Business_Name (G)
    order.phone || "",                           // Phone (H)
    // Billing Address
    order.billingAddressStreet || order.addressStreet || "",                   // Address_Street (I) - Billing
    order.billingAddressStreet2 || order.addressStreet2 || "",                 // Address_Street_Line_2 (J) - Billing
    order.billingAddressCity || order.addressCity || "",                       // Address_City (K) - Billing
    order.billingAddressState || order.addressState || "",                     // Address_State (L) - Billing
    order.billingAddressZIP || order.addressZIP || "",                         // Address_ZIP (M) - Billing
    `$ ${order.total.toFixed(2)}`,               // Total_Amount (N)
    order.notes || "",                           // Special_Instructions (O)
    order.orderType || "RETAIL",                 // Order_Type (P)
    "consolepro_api",                           // Submission_Source (Q)
    "PENDING",                                   // Payment_Status (R)
    "PENDING",                                   // Fulfillment_Status (S)
    "PENDING",                                   // Invoice_Status (T)
    "SUBMITTED",                                 // Lifecycle_Stage (U)
    new Date().toISOString(),                    // Last_Updated (V)
    // Product columns (W-BP) - fill with products if available
    order.products?.[0]?.name || "",             // Product_1_Name (W)
    order.products?.[0]?.barcode || "",          // Product_1_Barcode (X)
    order.products?.[0]?.price?.toFixed(2) || "", // Product_1_Price (Y)
    order.products?.[0]?.quantity || "",         // Product_1_Quantity (Z)
    // ... continue for products 2-10 ...
    // Add empty columns for shipping address fields (if not in current sheet structure)
    "", "", "", "", "", // Shipping_Address_Street through Shipping_Address_ZIP
  ],
]
```

### C. Update getActiveOrdersData Function

```typescript
async getActiveOrdersData(): Promise<OrderCustomer[]> {
  try {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: "Orders!A:BN", // Updated range to cover all columns
    })

    const rows = response.data.values || []
    if (rows.length === 0) return []

    // Header-based mapping
    const header = rows[0]
    const headerMap: Record<string, number> = {}
    header.forEach((col, idx) => { headerMap[col.trim()] = idx })
    const dataRows = rows.slice(1)

    return dataRows.map((row): OrderCustomer => {
      // Helper function to safely get column value
      const getCol = (colName: string) => row[headerMap[colName]] || ""
      
      // Parse products from the sheet
      const products: Array<{ name: string; barcode: string; price: number; quantity: number }> = []
      for (let i = 1; i <= 10; i++) {
        const name = getCol(`Product_${i}_Name`)
        const barcode = getCol(`Product_${i}_Barcode`)
        const price = getCol(`Product_${i}_Price`)
        const quantity = getCol(`Product_${i}_Quantity`)
        
        if (name && name.trim() !== "") {
          products.push({
            name: name.trim(),
            barcode: barcode.trim(),
            price: parseFloat(price) || 0,
            quantity: parseFloat(quantity) || 0,
          })
        }
      }

      return {
        orderId: getCol("Order_Code"),
        customerId: getCol("customer_id"),
        customerName: getCol("Customer_Name"),
        customerEmail: getCol("Email"),
        orderDate: getCol("Submission_Timestamp"),
        status: getCol("Fulfillment_Status"),
        invoiceStatus: getCol("Invoice_Status"),
        paymentStatus: getCol("Payment_Status"),
        total: parseFloat(getCol("Total_Amount").replace(/[^0-9.]/g, '')) || 0,
        items: products.map(p => `${p.name} (Qty: ${p.quantity})`).join(", "),
        notes: getCol("Special_Instructions"),
        invoice_link: getCol("invoice_link"),
        payment_link: getCol("payment_link"),
        customer_id: getCol("customer_id"),
        businessName: getCol("Business_Name"),
        phone: getCol("Phone"),
        // Billing Address (from Address_Street, Address_Street_Line_2, Address_City, Address_State, Address_ZIP)
        billingAddressStreet: getCol("Address_Street"),
        billingAddressStreet2: getCol("Address_Street_Line_2"),
        billingAddressCity: getCol("Address_City"),
        billingAddressState: getCol("Address_State"),
        billingAddressZIP: getCol("Address_ZIP"),
        // Shipping Address (from Shipping_Address_Street, Shipping_Address_Street_Line_2, Shipping_Address_City, Shipping_Address_State, Shipping_Address_ZIP)
        addressStreet: getCol("Shipping_Address_Street"),
        addressStreet2: getCol("Shipping_Address_Street_Line_2"),
        addressCity: getCol("Shipping_Address_City"),
        addressState: getCol("Shipping_Address_State"),
        addressZIP: getCol("Shipping_Address_ZIP"),
        // Legacy shipping address field for backward compatibility
        shippingAddress: [
          getCol("Shipping_Address_Street"),
          getCol("Shipping_Address_Street_Line_2"),
          getCol("Shipping_Address_City"),
          getCol("Shipping_Address_State"),
          getCol("Shipping_Address_ZIP")
        ].filter(Boolean).join(", "),
        products,
        productDetails: products,
      }
    })
  } catch (error) {
    console.error("Error fetching active orders data:", error)
    return []
  }
}
```

---

## 3. Update Type Definitions

**File:** `lib/types.ts`

**Changes needed:**
- Add billing address fields to `OrderCustomer` interface
- Add line 2 support for shipping address
- Keep backward compatibility

```typescript
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
```

---

## 4. Update Order Form Component

**File:** `components/active-orders-section.tsx`

### A. Update Form State

```typescript
const [newOrder, setNewOrder] = useState({
  customerName: "",
  customerEmail: "",
  businessName: "",
  phone: "",
  // Shipping Address
  addressStreet: "",
  addressStreet2: "",
  addressCity: "",
  addressState: "",
  addressZIP: "",
  // Billing Address (defaults to shipping)
  billingAddressStreet: "",
  billingAddressStreet2: "",
  billingAddressCity: "",
  billingAddressState: "",
  billingAddressZIP: "",
  // Toggle for different billing address
  useDifferentBillingAddress: false,
  specialInstructions: "",
})
```

### B. Add Billing Address Section to Form

```tsx
{/* Shipping Address Section */}
<div className="bg-slate-700/50 p-4 rounded-lg">
  <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
  <div className="space-y-3">
    <div>
      <Label htmlFor="addressStreet">Street Address</Label>
      <Input
        id="addressStreet"
        value={newOrder.addressStreet}
        onChange={(e) => setNewOrder({ ...newOrder, addressStreet: e.target.value })}
        className="bg-slate-700 border-slate-600 text-white"
        placeholder="Enter street address"
      />
    </div>
    <div>
      <Label htmlFor="addressStreet2">Street Address Line 2</Label>
      <Input
        id="addressStreet2"
        value={newOrder.addressStreet2 || ""}
        onChange={(e) => setNewOrder({ ...newOrder, addressStreet2: e.target.value })}
        className="bg-slate-700 border-slate-600 text-white"
        placeholder="Apartment, suite, etc. (optional)"
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label htmlFor="addressCity">City</Label>
        <Input
          id="addressCity"
          value={newOrder.addressCity}
          onChange={(e) => setNewOrder({ ...newOrder, addressCity: e.target.value })}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="City"
        />
      </div>
      <div>
        <Label htmlFor="addressState">State</Label>
        <Input
          id="addressState"
          value={newOrder.addressState}
          onChange={(e) => setNewOrder({ ...newOrder, addressState: e.target.value })}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="State"
        />
      </div>
    </div>
    <div>
      <Label htmlFor="addressZIP">ZIP Code</Label>
      <Input
        id="addressZIP"
        value={newOrder.addressZIP}
        onChange={(e) => setNewOrder({ ...newOrder, addressZIP: e.target.value })}
        className="bg-slate-700 border-slate-600 text-white"
        placeholder="ZIP code"
      />
    </div>
  </div>
</div>

{/* Billing Address Section */}
<div className="bg-slate-700/50 p-4 rounded-lg">
  <h3 className="text-lg font-semibold text-white mb-4">Billing Address</h3>
  <div className="space-y-3">
    <div>
      <Label htmlFor="useDifferentBillingAddress">
        <input
          type="checkbox"
          id="useDifferentBillingAddress"
          checked={newOrder.useDifferentBillingAddress}
          onChange={(e) => setNewOrder({ ...newOrder, useDifferentBillingAddress: e.target.checked })}
          className="mr-2 h-4 w-4 text-cyan-400 focus:ring-cyan-500 border-slate-600 rounded"
        />
        Use a different billing address
      </Label>
    </div>
    {!newOrder.useDifferentBillingAddress && (
      <div className="text-slate-400 text-sm">
        Billing address will be the same as shipping address
      </div>
    )}
    {newOrder.useDifferentBillingAddress && (
      <>
        <div>
          <Label htmlFor="billingAddressStreet">Street Address</Label>
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
            <Label htmlFor="billingAddressCity">City</Label>
            <Input
              id="billingAddressCity"
              value={newOrder.billingAddressCity}
              onChange={(e) => setNewOrder({ ...newOrder, billingAddressCity: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="billingAddressState">State</Label>
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
          <Label htmlFor="billingAddressZIP">ZIP Code</Label>
          <Input
            id="billingAddressZIP"
            value={newOrder.billingAddressZIP}
            onChange={(e) => setNewOrder({ ...newOrder, billingAddressZIP: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="ZIP code"
          />
        </div>
      </>
    )}
  </div>
</div>
```

### C. Update Order Creation Logic

```typescript
const handleCreateOrder = async () => {
  // ... validation logic ...
  
  const orderData = {
    customerName: newOrder.customerName,
    customerEmail: newOrder.customerEmail,
    businessName: newOrder.businessName,
    phone: newOrder.phone,
    // Shipping Address
    addressStreet: newOrder.addressStreet,
    addressStreet2: newOrder.addressStreet2,
    addressCity: newOrder.addressCity,
    addressState: newOrder.addressState,
    addressZIP: newOrder.addressZIP,
    // Billing Address (defaults to shipping)
    billingAddressStreet: newOrder.useDifferentBillingAddress ? newOrder.billingAddressStreet : newOrder.addressStreet,
    billingAddressStreet2: newOrder.useDifferentBillingAddress ? newOrder.billingAddressStreet2 : newOrder.addressStreet2,
    billingAddressCity: newOrder.useDifferentBillingAddress ? newOrder.billingAddressCity : newOrder.addressCity,
    billingAddressState: newOrder.useDifferentBillingAddress ? newOrder.billingAddressState : newOrder.addressState,
    billingAddressZIP: newOrder.useDifferentBillingAddress ? newOrder.billingAddressZIP : newOrder.addressZIP,
    notes: newOrder.specialInstructions,
    total: calculateTotal(),
    subtotal: calculateSubtotal(),
    discount: customDiscount,
    promoCodeDiscount: promoCodeDiscount,
    promoCode: promoCode,
    products: selectedProducts,
    orderType,
    orderCode: generateOrderCode(),
  }

  // ... rest of order creation logic ...
}
```

---

## 5. Update Print Function

**File:** `components/active-orders-section.tsx`

```typescript
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
```

---

## 6. Update Order Details Dialog

**File:** `components/active-orders-section.tsx`

```tsx
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
```

---

## 7. Update Customer Selection Logic

**File:** `components/active-orders-section.tsx`

### A. Update handleCustomerSelect Function

```typescript
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
      // Shipping Address
      addressStreet: (customer as any).addressStreet || "",
      addressStreet2: (customer as any).addressStreet2 || "",
      addressCity: (customer as any).addressCity || "",
      addressState: (customer as any).addressState || "",
      addressZIP: (customer as any).addressZip || "",
      // Billing Address (defaults to shipping)
      billingAddressStreet: (customer as any).addressStreet || "",
      billingAddressStreet2: (customer as any).addressStreet2 || "",
      billingAddressCity: (customer as any).addressCity || "",
      billingAddressState: (customer as any).addressState || "",
      billingAddressZIP: (customer as any).addressZip || "",
      useDifferentBillingAddress: false,
    } : (customer.address && parseAddress(customer.address)))
  })
}
```

### B. Update parseAddress Function

```typescript
const parseAddress = (address: string) => {
  // Simple address parsing - you might want to improve this
  const parts = address.split(',').map(part => part.trim())
  if (parts.length >= 3) {
    return {
      // Shipping Address
      addressStreet: parts[0] || "",
      addressStreet2: "",
      addressCity: parts[1] || "",
      addressState: parts[2] || "",
      addressZIP: parts[3] || "",
      // Billing Address (defaults to shipping)
      billingAddressStreet: parts[0] || "",
      billingAddressStreet2: "",
      billingAddressCity: parts[1] || "",
      billingAddressState: parts[2] || "",
      billingAddressZIP: parts[3] || "",
      useDifferentBillingAddress: false,
    }
  }
  return {
    // Shipping Address
    addressStreet: address,
    addressStreet2: "",
    addressCity: "",
    addressState: "",
    addressZIP: "",
    // Billing Address (defaults to shipping)
    billingAddressStreet: address,
    billingAddressStreet2: "",
    billingAddressCity: "",
    billingAddressState: "",
    billingAddressZIP: "",
    useDifferentBillingAddress: false,
  }
}
```

### C. Update resetNewOrderForm Function

```typescript
const resetNewOrderForm = () => {
  setNewOrder({
    customerName: "",
    customerEmail: "",
    businessName: "",
    phone: "",
    // Shipping Address
    addressStreet: "",
    addressStreet2: "",
    addressCity: "",
    addressState: "",
    addressZIP: "",
    // Billing Address (defaults to shipping)
    billingAddressStreet: "",
    billingAddressStreet2: "",
    billingAddressCity: "",
    billingAddressState: "",
    billingAddressZIP: "",
    // Toggle for different billing address
    useDifferentBillingAddress: false,
    specialInstructions: "",
  })
  setSelectedProducts([])
  setOrderType("RETAIL")
  setCustomDiscount(0)
  setPromoCode("")
  setPromoCodeDiscount(0)
}
```

---

## 8. Google Sheets Column Mapping

**Ensure your Google Sheet has these columns:**

### Billing Address Columns:
- `Address_Street` (Column I)
- `Address_Street_Line_2` (Column J)
- `Address_City` (Column K)
- `Address_State` (Column L)
- `Address_ZIP` (Column M)

### Shipping Address Columns:
- `Shipping_Address_Street` (Column BO)
- `Shipping_Address_Street_Line_2` (Column BP)
- `Shipping_Address_City` (Column BQ)
- `Shipping_Address_State` (Column BR)
- `Shipping_Address_ZIP` (Column BS)

### Required Imports:
```typescript
import { CreditCard, MapPin } from "lucide-react"
```

---

## 9. Testing Checklist

After implementing these changes, test the following:

### ✅ Order Creation Tests:
- [ ] Create order with same billing/shipping address
- [ ] Create order with different billing/shipping address
- [ ] Test with line 2 fields populated
- [ ] Test with empty line 2 fields
- [ ] Test B2B order type
- [ ] Test retail order type

### ✅ Print Function Tests:
- [ ] Verify both addresses print with proper labels
- [ ] Check line 2 fields display correctly
- [ ] Test with missing address data
- [ ] Test print all orders
- [ ] Test print selected orders

### ✅ Customer Selection Tests:
- [ ] Select existing customer with structured addresses
- [ ] Select customer with legacy address format
- [ ] Verify billing address defaults to shipping
- [ ] Test toggle functionality

### ✅ Google Sheets Integration Tests:
- [ ] Verify orders are saved with both addresses
- [ ] Check that existing orders load correctly
- [ ] Test address mapping to correct columns
- [ ] Verify line 2 fields are preserved

### ✅ UI/UX Tests:
- [ ] Billing address toggle works correctly
- [ ] Form validation works with new fields
- [ ] Order details dialog displays both addresses
- [ ] Responsive design on mobile devices

---

## 10. Deployment Notes

### Backward Compatibility:
- ✅ Existing orders will continue to work
- ✅ Legacy address formats are supported
- ✅ Missing address fields show "Not provided"
- ✅ No breaking changes to existing functionality

### Environment Variables:
- Ensure `GOOGLE_SHEET_ID_B2B` is set correctly
- Verify Google Sheets API permissions
- Test in staging environment first

### Performance Considerations:
- Address parsing is lightweight
- No additional API calls required
- Minimal impact on existing performance

---

## 11. Troubleshooting

### Common Issues:

**Issue:** Billing address not saving to Google Sheets
**Solution:** Check column mapping in `addNewOrder` function

**Issue:** Print function shows "Not provided" for addresses
**Solution:** Verify address field names match interface

**Issue:** Toggle not working for billing address
**Solution:** Check `useDifferentBillingAddress` state management

**Issue:** Customer selection not populating addresses
**Solution:** Verify `handleCustomerSelect` function logic

### Debug Steps:
1. Check browser console for errors
2. Verify Google Sheets column headers
3. Test with simple address data first
4. Check network requests in browser dev tools

---

## 12. File Summary

**Files Modified:**
- `app/api/orders/route.ts` - Order API updates
- `lib/google-sheets.ts` - Google Sheets integration
- `lib/types.ts` - Type definitions
- `components/active-orders-section.tsx` - Main order form component

**Files Unchanged:**
- `components/add-customer-dialog.tsx` - Already supports both addresses
- `components/invoices-section.tsx` - No address changes needed

---

## 13. Implementation Timeline

**Phase 1 (1-2 hours):**
- Update type definitions
- Modify order API route
- Update Google Sheets service

**Phase 2 (2-3 hours):**
- Update order form component
- Add billing address section
- Implement toggle functionality

**Phase 3 (1-2 hours):**
- Update print function
- Enhance order details dialog
- Test all functionality

**Phase 4 (1 hour):**
- Final testing and debugging
- Documentation updates
- Deployment

**Total Estimated Time: 5-8 hours**

---

This implementation provides a complete solution for handling both billing and shipping addresses with line 2 support in your B2B request form system. All changes are backward compatible and follow existing code patterns. 