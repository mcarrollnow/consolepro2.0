import { NextResponse } from "next/server"

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

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeApiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\n${userPrompt}`
          }
        ]
      })
    })

    console.log("Claude API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Claude API error response:", errorData)
      return NextResponse.json(
        { error: `Claude API error: ${response.status} - ${errorData}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log("Claude API success response received")
    
    const aiResponse = data.content[0]?.text || "I'm sorry, I couldn't generate a response at this time."

    return NextResponse.json({
      response: aiResponse,
      usage: data.usage
    })

  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 