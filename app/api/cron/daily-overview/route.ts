import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  try {
    // Verify the request is from a legitimate cron service
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get Claude API key from environment
    const claudeApiKey = process.env.CLAUDE_API_KEY
    if (!claudeApiKey) {
      return NextResponse.json(
        { error: "Claude API key not configured" },
        { status: 500 }
      )
    }

    // Fetch current business data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const [inventoryRes, ordersRes, customersRes] = await Promise.all([
      fetch(`${baseUrl}/api/inventory`),
      fetch(`${baseUrl}/api/orders`),
      fetch(`${baseUrl}/api/customers`)
    ])

    const inventory = await inventoryRes.json()
    const orders = await ordersRes.json()
    const customers = await customersRes.json()

    // Calculate 30-day revenue
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.Submission_Timestamp || order.orderDate)
      return orderDate >= thirtyDaysAgo
    })

    const thirtyDayRevenue = recentOrders.reduce((sum: number, order: any) => {
      return sum + (parseFloat(order.Total_Amount || order.total) || 0)
    }, 0)

    // Get pending orders
    const pendingOrders = orders.filter((order: any) => 
      (order.Fulfillment_Status || order.status || '').toLowerCase() === 'processing'
    )

    // Get orders that need invoices (no invoice link)
    const ordersNeedingInvoices = orders.filter((order: any) => 
      !order.invoice_link && !order.invoiceLink
    )

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    })

    const systemPrompt = `You are a business intelligence AI assistant. Generate a daily overview report with the following sections:

1. PENDING ORDERS SUMMARY
2. INVOICES TO BE SENT
3. 30-DAY REVENUE ANALYSIS
4. PEPTIDE PRODUCT INSIGHT

For the peptide insight, research the latest trends in peptide therapeutics and suggest a potential product based on:
- Current market demand
- Latest research breakthroughs
- Regulatory developments
- Competitive landscape

Make the report concise, actionable, and professional. Include specific numbers and actionable recommendations.`

    const userPrompt = `Generate today's daily business overview.

Business Data:
- Pending Orders: ${pendingOrders.length} orders with status "Processing"
- Orders Needing Invoices: ${ordersNeedingInvoices.length} orders without invoice links
- 30-Day Revenue: $${thirtyDayRevenue.toFixed(2)}
- Total Orders: ${orders.length}
- Total Customers: ${customers.length}

Recent Orders (last 30 days):
${JSON.stringify(recentOrders.slice(-10), null, 2)}

Pending Orders Details:
${JSON.stringify(pendingOrders.slice(0, 5), null, 2)}

Please provide a comprehensive daily overview with actionable insights.`

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

    const dailyOverview = msg.content?.[0]?.text || "Unable to generate daily overview."

    // Create structured response
    const overview = {
      date: new Date().toISOString().split('T')[0],
      summary: {
        pendingOrders: pendingOrders.length,
        ordersNeedingInvoices: ordersNeedingInvoices.length,
        thirtyDayRevenue: thirtyDayRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length
      },
      details: {
        pendingOrders: pendingOrders.slice(0, 10), // Top 10 pending orders
        ordersNeedingInvoices: ordersNeedingInvoices.slice(0, 10), // Top 10 needing invoices
        recentOrders: recentOrders.slice(-5) // Last 5 orders
      },
      aiInsights: dailyOverview
    }

    // Store the daily overview (you could save this to a database or file)
    console.log(`Daily overview generated for ${overview.date}:`, {
      pendingOrders: overview.summary.pendingOrders,
      ordersNeedingInvoices: overview.summary.ordersNeedingInvoices,
      thirtyDayRevenue: overview.summary.thirtyDayRevenue
    })

    return NextResponse.json({
      success: true,
      message: "Daily overview generated successfully",
      overview
    })

  } catch (error) {
    console.error("Daily overview cron error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
} 