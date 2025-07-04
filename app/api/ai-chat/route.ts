import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { message, context, action } = await request.json()

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

    // Smart data filtering based on question type to avoid token limits
    const question = message.toLowerCase()
    let relevantData: any = {}

    // Determine which data to send based on the question
    if (question.includes('customer') || question.includes('spending') || question.includes('top') || question.includes('paying')) {
      // For customer questions, send customers data and limited orders data
      relevantData = {
        customers: context?.customers || [],
        orders: context?.orders?.slice(-20) || [] // Only last 20 orders to reduce tokens
      }
    } else if (question.includes('inventory') || question.includes('stock') || question.includes('product')) {
      // For inventory questions, send inventory data only
      relevantData = {
        inventory: context?.inventory || []
      }
    } else if (question.includes('order') || question.includes('active') || question.includes('recent')) {
      // For order questions, send orders data only
      relevantData = {
        orders: context?.orders || []
      }
    } else {
      // For general questions, send limited data from all sources
      relevantData = {
        inventory: context?.inventory?.slice(0, 50) || [], // First 50 items
        orders: context?.orders?.slice(-20) || [], // Last 20 orders
        customers: context?.customers?.slice(0, 50) || [] // First 50 customers
      }
    }

    // Enhanced system prompt with action capabilities
    const systemPrompt = `
You are Geoffrey, the witty, formal, and polite butler from The Fresh Prince of Bel-Air. Always greet the user with respect, use clever and dry humor when appropriate, and refer to yourself as Geoffrey. Speak with a British butler's tone and verbiage. Your responses should be concise, helpful, and delivered with a touch of class and wit. If you provide business updates, do so as if you are briefing the head of the household, with a professional yet personable touch.

Strictly avoid any roleplay, body movements, or stage directions. Do not include asterisks, actions, or theatrical language. Remain professional and business-appropriate at all times. A touch of dry humor is acceptable, but always dignified.

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

ARCHIVED ORDERS SHEET:
- Same structure as Orders sheet, but with customer info at the end of each row
- customer_id: Customer ID (column 65)
- customer_name: Customer name (column 66) 
- customer_email: Customer email (column 67)
- customer_phone: Customer phone (column 68)
- All other columns same as Orders sheet

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

You have access to the relevant data below. Use it to answer questions directly.

Respond in a conversational, helpful tone.

If the user asks for specific actions or insights, provide actionable recommendations based on the data.

For inventory questions, suggest restocking strategies and identify trends.
For customer questions, provide segmentation insights and loyalty recommendations.
For order questions, suggest process improvements and revenue optimization strategies.
`

    const userPrompt = `User question: ${message}

Available data:
${JSON.stringify(relevantData, null, 2)}

Please provide a helpful response based on the data above. If this is a request for specific business insights or recommendations, provide actionable advice.`

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