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

    // Prepare context data for the AI
    const contextSummary = {
      inventory: {
        totalItems: context?.inventory?.length || 0,
        lowStockItems: context?.inventory?.filter((item: any) => item.currentStock <= item.restockLevel)?.length || 0,
        categories: [...new Set(context?.inventory?.map((item: any) => item.category) || [])]
      },
      orders: {
        totalOrders: context?.orders?.length || 0,
        recentOrders: context?.orders?.slice(0, 5) || [],
        totalRevenue: context?.orders?.reduce((sum: number, order: any) => sum + order.total, 0) || 0
      },
      customers: {
        totalCustomers: context?.customers?.length || 0,
        recentCustomers: context?.customers?.slice(0, 5) || []
      }
    }

    // Create the prompt for Claude
    const systemPrompt = `You are an AI assistant for a business management dashboard. You have access to inventory, orders, and customer data. 

Your role is to help users understand their business data and answer questions about:
- Inventory levels, low stock items, product categories
- Order status, recent orders, revenue
- Customer information, order history
- Business insights and recommendations

Be helpful, concise, and provide actionable insights. If you don't have enough information to answer a question, let the user know what additional data would be helpful.

Current data context:
- Inventory: ${contextSummary.inventory.totalItems} items, ${contextSummary.inventory.lowStockItems} low stock items
- Orders: ${contextSummary.orders.totalOrders} total orders, $${contextSummary.orders.totalRevenue.toFixed(2)} total revenue
- Customers: ${contextSummary.customers.totalCustomers} customers

Respond in a conversational, helpful tone.`

    const userPrompt = `User question: ${message}

Available data:
${JSON.stringify(context, null, 2)}

Please provide a helpful response based on the available data.`

    console.log("Sending request to Claude API...")

    // Call Claude API using the SDK
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 20000,
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