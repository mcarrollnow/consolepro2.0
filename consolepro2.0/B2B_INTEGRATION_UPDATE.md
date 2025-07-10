# B2B Integration Update - Active Orders Section

## Overview
The Active Orders Section has been updated to use the same B2B API process as the external B2B form, ensuring all orders created from this section go through the complete automation pipeline.

## Changes Made

### 1. New B2B API Endpoint
- **File:** `app/api/send-request/route.ts`
- **Purpose:** Handles B2B order creation with full automation pipeline
- **Features:**
  - Validates required fields (name, email, billing address, items)
  - Generates unique B2B order codes (B2B-MMDD-XXXX-1 format)
  - Processes discount codes through existing validation system
  - Creates/updates customer records in Google Sheets
  - Adds orders to Google Sheets with proper formatting
  - Records sales in inventory system
  - Triggers Google Apps Script for Wix integration

### 2. Updated Active Orders Section
- **File:** `components/active-orders-section.tsx`
- **Changes:**
  - Removed order type selection (all orders are now B2B)
  - Updated `handleCreateOrder` to use `/api/send-request` endpoint
  - Modified data formatting to match B2B API requirements
  - Updated UI text to reflect B2B process
  - Simplified price list loading (uses B2B pricing only)

### 3. Data Format Changes
The order creation now uses the B2B API format:

```typescript
// Old format (removed)
{
  customerName: string,
  customerEmail: string,
  products: Array<{name, barcode, price, quantity}>,
  // ... other fields
}

// New B2B format
{
  name: string,
  email: string,
  company?: string,
  phone?: string,
  billingAddress: string,
  billingAddress2?: string,
  billingCity: string,
  billingState: string,
  billingZip: string,
  shippingRecipient?: string,
  shippingAddress?: string,
  shippingAddress2?: string,
  shippingCity?: string,
  shippingState?: string,
  shippingZip?: string,
  shipToDifferent?: boolean,
  special?: string,
  discountCode?: string,
  items: Array<{item: string, qty: string, price: number}>
}
```

## Automation Pipeline

All orders created from the Active Orders Section now go through the complete B2B automation pipeline:

1. **Order Creation** → B2B API endpoint
2. **Customer Management** → Google Sheets Customers sheet
3. **Order Recording** → Google Sheets Orders sheet
4. **Inventory Updates** → Google Sheets Inventory sheet
5. **Wix Integration** → Google Apps Script creates Wix customer and order
6. **Email Notifications** → Internal and customer emails (TODO)
7. **Stripe Integration** → Ready for invoice creation

## Benefits

- **Consistency:** All orders use the same process regardless of source
- **Automation:** Full pipeline integration with Google Sheets and Wix
- **Validation:** Proper field validation and error handling
- **Discount Support:** Integrated with existing discount code system
- **Address Support:** Full billing and shipping address support
- **Order Codes:** Consistent B2B order code format

## Testing

To test the integration:

1. Open the Active Orders Section
2. Click "New B2B Order"
3. Fill in customer information and add products
4. Click "Create B2B Order"
5. Verify the order appears in the Active Orders list
6. Check Google Sheets for the new order and customer records

## API Documentation

The B2B API endpoint follows the documentation in `references/Integration Guide to B2B form/SIMPLE_API_INTEGRATION.md`:

- **Endpoint:** `POST /api/send-request`
- **Authentication:** None required
- **Response Format:** `{ok: true, orderCode: "B2B-0710-ABC1-1"}`

## Google Sheets Integration

The API now properly formats data to match the exact Google Sheets structure from `Order Tracking Sheet - Orders.csv`:

### Key Column Mappings:
- **Billing Address:** `Address_Street`, `Address_Street_Line_2`, `Address_City`, `Address_State`, `Address_ZIP`
- **Shipping Address:** `Shipping_Recipient`, `Shipping_Address_Street`, `Shipping_Address_Street_Line_2`, `Shipping_Address_City`, `Shipping_Address_State`, `Shipping_Address_ZIP`
- **Products:** `Product_1_Name`, `Product_1_Price`, `Product_1_Quantity` (up to Product_10)
- **Status Fields:** `Payment_Status`, `Fulfillment_Status`, `Invoice_Status`, `Lifecycle_Stage`
- **Integration:** `wix_order_id`, `Wix_Contact_ID`, `invoice_link`, etc.

### Form Structure:
- **Billing Address (Primary/Required)** - Always shown first with required fields marked (*)
- **Shipping Address (Optional)** - Toggle to show when different from billing
- **Product Selection** - Up to 10 products supported
- **Discount Codes** - Integrated with existing validation system

## Notes

- All orders created from the Active Orders Section are now B2B orders
- The order type selection has been removed for simplicity
- Price lists default to B2B pricing
- Discount codes are processed through the existing validation system
- The Google Apps Script trigger will automatically create Wix orders
- Stripe invoice creation will work once Wix orders are created 