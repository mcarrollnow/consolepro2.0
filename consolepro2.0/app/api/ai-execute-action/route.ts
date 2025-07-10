import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { action, orderId, context, orders, customers } = await request.json()

    // Get Claude API key from environment
    const claudeApiKey = process.env.CLAUDE_API_KEY
    if (!claudeApiKey) {
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    })

    let systemPrompt = ""
    let userPrompt = ""
    let executeAction = false
    let actionData = {}

    switch (action) {
      case "generate_stripe_invoice":
        systemPrompt = `You are an AI assistant that can generate Stripe invoices for orders. Analyze the order data and determine if an invoice should be generated.

Consider:
1. Does the order already have an invoice?
2. Is the order in a state that requires invoicing?
3. Are all necessary customer details present?
4. Is the order total valid and complete?

If the order is suitable for invoicing, provide the necessary data for invoice generation.`

        userPrompt = `Please analyze this order for Stripe invoice generation:

Order ID: ${orderId}

Order Data:
${JSON.stringify(orders?.find(o => o.Order_Code === orderId || o.orderId === orderId) || {}, null, 2)}

Customer Data:
${JSON.stringify(customers || [], null, 2)}

Should an invoice be generated for this order? If yes, provide the invoice data. If no, explain why.`

        break

      case "update_order_status":
        systemPrompt = `You are an AI assistant that can update order statuses. Analyze the order and suggest appropriate status updates.

Consider:
1. Current order status
2. Order fulfillment progress
3. Customer communication needs
4. Business process requirements

Provide recommendations for status updates with reasoning.`

        userPrompt = `Please analyze this order for status update:

Order ID: ${orderId}

Order Data:
${JSON.stringify(orders?.find(o => o.Order_Code === orderId || o.orderId === orderId) || {}, null, 2)}

What status update would you recommend for this order and why?`

        break

      case "customer_communication":
        systemPrompt = `You are an AI assistant that can generate customer communication. Analyze the order and customer data to suggest appropriate communication.

Consider:
1. Order status and timeline
2. Customer history and preferences
3. Communication urgency
4. Professional tone and branding

Provide communication recommendations and suggested messages.`

        userPrompt = `Please analyze this order for customer communication:

Order ID: ${orderId}

Order Data:
${JSON.stringify(orders?.find(o => o.Order_Code === orderId || o.orderId === orderId) || {}, null, 2)}

Customer Data:
${JSON.stringify(customers?.find(c => c.customer_id === orders?.find(o => o.Order_Code === orderId || o.orderId === orderId)?.customer_id) || {}, null, 2)}

What communication would you recommend for this customer and why?`

        break

      case "inventory_restock":
        systemPrompt = `You are an AI assistant that can analyze inventory and suggest restocking actions. Review the inventory data and identify items that need restocking.

Consider:
1. Current stock levels vs restock levels
2. Recent sales velocity
3. Seasonal demand patterns
4. Supplier lead times

Provide specific restocking recommendations with quantities and priorities.`

        userPrompt = `Please analyze the inventory for restocking needs:

Inventory Data:
${JSON.stringify(context?.inventory || [], null, 2)}

Recent Orders:
${JSON.stringify(orders?.slice(-50) || [], null, 2)}

Which items need restocking and in what quantities?`

        break

      default:
        return NextResponse.json(
          { error: "Invalid action. Supported actions: generate_stripe_invoice, update_order_status, customer_communication, inventory_restock" },
          { status: 400 }
        )
    }

    // Call Claude API for analysis
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.7,
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

    const analysis = msg.content?.[0]?.text || "Unable to analyze action."

    // Execute the actual action if it's a Stripe invoice generation
    if (action === "generate_stripe_invoice") {
      const order = orders?.find(o => o.Order_Code === orderId || o.orderId === orderId)
      if (order && !order.invoice_link) {
        try {
          // Call the existing Stripe invoice generation endpoint
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          const invoiceResponse = await fetch(`${baseUrl}/api/orders/create-stripe-invoice`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          })

          if (invoiceResponse.ok) {
            const invoiceData = await invoiceResponse.json()
            actionData = { success: true, invoice: invoiceData }
            executeAction = true
          } else {
            actionData = { success: false, error: "Failed to generate invoice" }
          }
        } catch (error) {
          actionData = { success: false, error: error instanceof Error ? error.message : "Unknown error" }
        }
      } else {
        actionData = { success: false, error: "Order not found or already has invoice" }
      }
    }

    return NextResponse.json({
      analysis,
      action,
      orderId,
      executeAction,
      actionData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("AI execute action error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 