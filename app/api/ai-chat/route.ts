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

IMPORTANT: If you need specific data to answer a question, ask the user to provide it or tell them what data you need. Don't make assumptions about data you don't have.

Available data sources:
- Inventory: ${dataSummary.inventoryCount} items available
- Orders: ${dataSummary.ordersCount} orders available  
- Customers: ${dataSummary.customersCount} customers available

Respond in a conversational, helpful tone. If you need more specific data, ask for it.`

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