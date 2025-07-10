import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    const { action, discountCodes, orders, customers, context } = await request.json()

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

    switch (action) {
      case "analyze":
        systemPrompt = `You are an expert discount code and marketing AI assistant. Analyze the provided discount codes and their usage patterns to provide insights and recommendations.

Your analysis should include:

1. **Discount Code Performance**
   - Most and least effective discount codes
   - Usage patterns and conversion rates
   - Revenue impact of each code
   - Customer segments that respond best

2. **Code Optimization**
   - Suggest improvements to underperforming codes
   - Identify optimal discount percentages
   - Recommend better targeting strategies
   - Suggest timing for code releases

3. **Customer Behavior Analysis**
   - Which customers use discount codes most
   - Average order value with vs without codes
   - Customer loyalty correlation with code usage
   - Seasonal patterns in code usage

4. **Strategic Recommendations**
   - New discount code ideas
   - A/B testing suggestions
   - Seasonal campaign recommendations
   - Customer retention code strategies

Provide specific, actionable recommendations with clear metrics.`

        userPrompt = `Please analyze these discount codes and provide insights:

Discount Codes:
${JSON.stringify(discountCodes, null, 2)}

Recent Orders (to see code usage):
${JSON.stringify(orders?.slice(-100) || [], null, 2)}

Customer Data:
${JSON.stringify(customers?.slice(-50) || [], null, 2)}

Please provide a comprehensive analysis with specific recommendations.`

        break

      case "create":
        systemPrompt = `You are an expert discount code strategist. Based on the business data provided, suggest new discount codes that would be effective for this business.

Consider:
1. **Customer Segments** - Different codes for different customer types
2. **Product Categories** - Category-specific promotions
3. **Seasonal Opportunities** - Time-based campaigns
4. **Customer Retention** - Loyalty and re-engagement codes
5. **Revenue Optimization** - Codes that increase average order value

For each suggested code, provide:
- Code name/pattern
- Discount percentage/amount
- Target audience
- Duration/expiry
- Expected impact
- Justification

Make sure codes are:
- Memorable and easy to type
- Appropriate for the business type
- Likely to drive desired behavior
- Not too generous to hurt margins`

        userPrompt = `Please suggest new discount codes based on this business data:

Recent Orders:
${JSON.stringify(orders?.slice(-50) || [], null, 2)}

Customer Segments:
${JSON.stringify(customers?.slice(-30) || [], null, 2)}

Current Inventory:
${JSON.stringify(context?.inventory?.slice(-20) || [], null, 2)}

Existing Discount Codes:
${JSON.stringify(discountCodes || [], null, 2)}

Please suggest 5-8 new discount codes with detailed reasoning for each.`

        break

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'analyze' or 'create'" },
          { status: 400 }
        )
    }

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

    const result = msg.content?.[0]?.text || "Unable to process discount code request."

    return NextResponse.json({
      result,
      action,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("AI discount codes error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 