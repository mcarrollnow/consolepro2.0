import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { customers, orders, archivedOrders } = await request.json()

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

    const systemPrompt = `You are an expert customer intelligence AI assistant. Analyze the provided customer and order data to provide actionable insights and recommendations.

Your analysis should include:

1. **Customer Segmentation**
   - Identify VIP customers based on spending and frequency
   - Segment customers by value, loyalty, and behavior
   - Identify at-risk customers who haven't ordered recently

2. **Customer Lifetime Value Analysis**
   - Calculate CLV for different customer segments
   - Identify high-value customers for special treatment
   - Suggest retention strategies for valuable customers

3. **Purchase Behavior Analysis**
   - Identify buying patterns and preferences
   - Suggest cross-selling and upselling opportunities
   - Recommend personalized marketing strategies

4. **Customer Satisfaction Insights**
   - Analyze order patterns for satisfaction indicators
   - Identify potential customer service issues
   - Suggest improvements to customer experience

5. **Growth Opportunities**
   - Identify customers with growth potential
   - Suggest referral programs and incentives
   - Recommend new customer acquisition strategies

6. **Predictive Analytics**
   - Predict which customers are likely to churn
   - Forecast customer lifetime value
   - Suggest optimal timing for re-engagement campaigns

Provide specific, actionable recommendations with clear next steps and prioritize by impact.`

    const userPrompt = `Please analyze this customer data and provide comprehensive intelligence:

Customer Data:
${JSON.stringify(customers, null, 2)}

Active Orders:
${JSON.stringify(orders?.slice(-100) || [], null, 2)}

Order History (Archived):
${JSON.stringify(archivedOrders?.slice(-200) || [], null, 2)}

Please provide a structured analysis with specific recommendations for customer management and growth.`

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

    const intelligence = msg.content?.[0]?.text || "Unable to generate customer intelligence."

    return NextResponse.json({
      intelligence,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("AI customer intelligence error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 