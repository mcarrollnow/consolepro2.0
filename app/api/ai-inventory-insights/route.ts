import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { inventory, orders, purchases, sales } = await request.json()

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

    const systemPrompt = `You are an expert inventory management AI assistant. Analyze the provided inventory, orders, purchases, and sales data to provide actionable insights and recommendations.

Your analysis should include:

1. **Stock Level Analysis**
   - Identify items that need immediate restocking
   - Highlight overstocked items
   - Calculate optimal reorder quantities

2. **Demand Forecasting**
   - Predict which products will be in high demand
   - Identify seasonal trends
   - Suggest inventory adjustments

3. **Cost Optimization**
   - Identify products with low profit margins
   - Suggest pricing strategies
   - Recommend bulk purchase opportunities

4. **Product Performance**
   - Identify best and worst performing products
   - Suggest product discontinuation candidates
   - Recommend new product opportunities

5. **Operational Recommendations**
   - Suggest process improvements
   - Identify automation opportunities
   - Recommend supplier negotiations

Provide specific, actionable recommendations with clear next steps.`

    const userPrompt = `Please analyze this inventory data and provide comprehensive insights:

Inventory Data:
${JSON.stringify(inventory, null, 2)}

Recent Orders:
${JSON.stringify(orders?.slice(-50) || [], null, 2)}

Purchase History:
${JSON.stringify(purchases?.slice(-30) || [], null, 2)}

Sales History:
${JSON.stringify(sales?.slice(-30) || [], null, 2)}

Please provide a structured analysis with specific recommendations.`

    // Call Claude API
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
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

    const insights = msg.content?.[0]?.text || "Unable to generate inventory insights."

    return NextResponse.json({
      insights,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("AI inventory insights error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 