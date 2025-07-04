# Wix Order Status API Documentation

## Overview
This API allows Wix automations to update order statuses in the Orders sheet, which automatically updates the unified "Order Status" displayed in the Active Orders section.

## Order Status Flow
- **NEW**: When a new row is added to the Orders sheet
- **INVOICE SENT**: When an invoice is sent and invoice_link is added to column S
- **Paid-Ready to Ship**: When payment is received and timestamp is added to column Q
- **Invoice Overdue**: When invoice status is updated to "OVERDUE" in column S

## API Endpoints

### 1. Invoice Sent
**Endpoint:** `POST /api/orders/wix-invoice-sent`

**Description:** Call this when an invoice is sent from Wix to update the Invoice_Status column with the invoice preview link.

**Request Body:**
```json
{
  "orderCode": "ORD-1234567890",
  "invoiceLink": "https://your-wix-invoice-link.com"
}
```

**Response:**
```json
{
  "message": "Invoice status updated successfully",
  "orderCode": "ORD-1234567890",
  "invoiceLink": "https://your-wix-invoice-link.com",
  "status": "INVOICE SENT"
}
```

### 2. Payment Received
**Endpoint:** `POST /api/orders/wix-payment-received`

**Description:** Call this when payment is received in Wix to update the Payment_Status column with the payment timestamp.

**Request Body:**
```json
{
  "orderCode": "ORD-1234567890",
  "paymentTimestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "message": "Payment status updated successfully",
  "orderCode": "ORD-1234567890",
  "paymentTimestamp": "2024-01-15T10:30:00Z",
  "status": "Paid-Ready to Ship"
}
```

### 3. Invoice Overdue
**Endpoint:** `POST /api/orders/wix-invoice-overdue`

**Description:** Call this when an invoice becomes overdue in Wix to update the Invoice_Status column.

**Request Body:**
```json
{
  "orderCode": "ORD-1234567890"
}
```

**Response:**
```json
{
  "message": "Invoice status updated to overdue successfully",
  "orderCode": "ORD-1234567890",
  "status": "Invoice Overdue"
}
```

## Setting Up Wix Automations

### 1. Invoice Sent Automation
1. Go to Wix Automations
2. Create a new automation with trigger: "Invoice Sent"
3. Add action: "HTTP Request"
4. Configure:
   - URL: `https://your-domain.com/api/orders/wix-invoice-sent`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body: 
     ```json
     {
       "orderCode": "{{order.orderNumber}}",
       "invoiceLink": "{{invoice.link}}"
     }
     ```

### 2. Payment Received Automation
1. Go to Wix Automations
2. Create a new automation with trigger: "Payment Received"
3. Add action: "HTTP Request"
4. Configure:
   - URL: `https://your-domain.com/api/orders/wix-payment-received`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "orderCode": "{{order.orderNumber}}",
       "paymentTimestamp": "{{payment.timestamp}}"
     }
     ```

### 3. Invoice Overdue Automation
1. Go to Wix Automations
2. Create a new automation with trigger: "Invoice Overdue"
3. Add action: "HTTP Request"
4. Configure:
   - URL: `https://your-domain.com/api/orders/wix-invoice-overdue`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "orderCode": "{{order.orderNumber}}"
     }
     ```

## Notes
- Replace `your-domain.com` with your actual domain
- The exact field names for Wix variables may vary depending on your Wix setup
- Order codes must match exactly between Wix and your Orders sheet
- All API endpoints require valid JSON in the request body
- The Order Status in the Active Orders section will automatically update when these APIs are called

## Error Handling
All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (missing required fields)
- 500: Internal Server Error (failed to update sheet)

Check the response body for error details if the request fails. 