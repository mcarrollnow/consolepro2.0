import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()

    // Get Claude API key from environment
    const claudeApiKey = process.env.CLAUDE_API_KEY
    if (!claudeApiKey) {
      console.error("Claude API key not found in environment variables")
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      )
    }

    console.log("Claude API key found, proceeding with request")

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    })

    // Only send minimal context - let AI request specific data when needed
    const dataSummary = {
      hasInventory: !!context?.inventory?.length,
      hasOrders: !!context?.orders?.length,
      hasCustomers: !!context?.customers?.length,
      inventoryCount: context?.inventory?.length || 0,
      ordersCount: context?.orders?.length || 0,
      customersCount: context?.customers?.length || 0
    }

    // Create the prompt for Claude
    const systemPrompt = `You are an AI assistant for a business management dashboard. You have access to inventory, orders, and customer data.

Your role is to help users understand their business data and answer questions about:
- Inventory levels, low stock items, product categories
- Order status, recent orders, revenue
- Customer information, order history
- Business insights and recommendations

IMPORTANT DATA SOURCE GUIDELINES:
- For CUSTOMER questions: Check both 'Orders' and 'Customers' data sources
- For INVENTORY questions: Check 'Inventory' data source
- For ORDER questions: Check 'Orders' sheet (active orders only), NOT archived orders
- For PAST/HISTORICAL order questions: Check 'Archived Orders' data source
- For ACTIVE orders: Always check 'Orders' sheet, not archived orders

SHEET STRUCTURES AND COLUMNS:

INVENTORY SHEET:
- barcode: Product barcode/ID
- product: Product name
- category: Product category
- image: Product image URL
- initialStock: Starting stock level
- restockLevel: Minimum stock level before reorder
- currentStock: Current available stock
- manualAdjustment: Manual stock adjustments
- lastUpdated: Last update timestamp
- costPrice: Product cost price
- salePrice: Product sale price

ORDERS SHEET (Active Orders):
- Submission_Timestamp: Order date/time
- Order_Code: Unique order ID
- Customer_Name: Customer name
- Email: Customer email
- Business_Name: Business name
- Phone: Customer phone
- Address_Street: Shipping street address
- Address_City: Shipping city
- Address_State: Shipping state
- Address_ZIP: Shipping ZIP code
- Total_Amount: Order total
- Special_Instructions: Order notes
- Fulfillment_Status: Order status (Processing, Shipped, Delivered)
- Product_1_Name through Product_10_Name: Product names
- Product_1_Barcode through Product_10_Barcode: Product barcodes
- Product_1_Price through Product_10_Price: Product prices
- Product_1_Quantity through Product_10_Quantity: Product quantities
- payment_link: Payment link
- invoice_link: Invoice link
- customer_id: Customer ID (column 65)

CUSTOMERS SHEET:
- customer_id: Unique customer ID
- name: Customer name
- email: Customer email
- phone: Customer phone
- company: Company name
- address: Customer address
- first_order_date: First order date
- last_order_date: Last order date
- total_orders: Number of orders
- total_spent: Total amount spent
- customer_status: Customer status
- preferred_contact: Preferred contact method
- customer_notes: Customer notes
- tags: Customer tags
- created_date: Customer creation date
- last_updated: Last update date
- referred_by: Referral source
- customer_class: Customer classification
- square_reference_id: Square reference
- nickname: Customer nickname
- birthday: Customer birthday
- square_customer_id: Square customer ID
- wix_contact_id: Wix contact ID

When answering questions:
1. If asked about "active orders" - check the Orders data (not archived)
2. If asked about "customer orders" - check both Orders and Customers data
3. If asked about "inventory" - check Inventory data
4. If asked about "past orders" or "order history" - check Archived Orders data

Available data sources:
- Inventory: ${dataSummary.inventoryCount} items available
- Orders: ${dataSummary.ordersCount} orders available (ACTIVE orders only)
- Customers: ${dataSummary.customersCount} customers available

Respond in a conversational, helpful tone. If you need specific data to answer the question, ask the user to provide it.`

    const userPrompt = `User question: ${message}

Data available: ${JSON.stringify(dataSummary, null, 2)}

Please provide a helpful response. If you need specific data to answer the question, ask the user to provide it.`

    console.log("Sending request to Claude API...")

    // Call Claude API using the SDK
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 1,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `${systemPrompt}\n\n${userPrompt}`
            }
          ]
        }
      ]
    })

    console.log("Claude API success response received")
    
    // Extract text from the content array format
    const aiResponse = msg.content?.[0]?.text || "I'm sorry, I couldn't generate a response at this time."

    return NextResponse.json({
      response: aiResponse,
      usage: msg.usage
    })

  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 