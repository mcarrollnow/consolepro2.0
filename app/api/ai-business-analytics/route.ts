import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { orders, customers, inventory, sales, purchases } = await request.json()

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

    const systemPrompt = `You are an expert business intelligence AI assistant. Analyze the provided business data to provide comprehensive analytics and predictive insights.

Your analysis should include:

1. **Revenue Analysis**
   - Monthly, quarterly, and annual revenue trends
   - Revenue growth rates and projections
   - Seasonal patterns and peak periods
   - Profit margin analysis

2. **Sales Performance**
   - Top-performing products and categories
   - Sales velocity and conversion rates
   - Average order value trends
   - Sales channel effectiveness

3. **Customer Analytics**
   - Customer acquisition costs
   - Customer retention rates
   - Customer lifetime value trends
   - Customer satisfaction metrics

4. **Operational Efficiency**
   - Order fulfillment times
   - Inventory turnover rates
   - Supply chain optimization opportunities
   - Cost reduction recommendations

5. **Predictive Insights**
   - Revenue forecasting for next 3, 6, 12 months
   - Demand forecasting for key products
   - Customer churn prediction
   - Market opportunity identification

6. **Strategic Recommendations**
   - Growth opportunities and expansion strategies
   - Risk assessment and mitigation
   - Competitive positioning
   - Investment priorities

Provide specific, actionable recommendations with clear metrics and timelines.`

    const userPrompt = `Please analyze this business data and provide comprehensive analytics:

Orders Data:
${JSON.stringify(orders?.slice(-200) || [], null, 2)}

Customer Data:
${JSON.stringify(customers?.slice(-100) || [], null, 2)}

Inventory Data:
${JSON.stringify(inventory?.slice(-50) || [], null, 2)}

Sales History:
${JSON.stringify(sales?.slice(-100) || [], null, 2)}

Purchase History:
${JSON.stringify(purchases?.slice(-50) || [], null, 2)}

Please provide a structured analysis with specific insights, predictions, and strategic recommendations.`

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

    const analytics = msg.content?.[0]?.text || "Unable to generate business analytics."

    return NextResponse.json({
      analytics,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("AI business analytics error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 