import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export async function GET() {
  try {
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
    // Fetch only active orders for summary
    const [ordersRes, archivedOrdersRes, customersRes] = await Promise.all([
      fetch(`${baseUrl}/api/orders?sheet=Orders`),
      fetch(`${baseUrl}/api/orders?sheet=Archived Orders`),
      fetch(`${baseUrl}/api/customers`)
    ])

    const orders = await ordersRes.json()
    const archivedOrders = await archivedOrdersRes.json()
    const customers = await customersRes.json()

    // Calculate 30-day revenue, pending, invoices from active orders only
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.Submission_Timestamp || order.orderDate)
      return orderDate >= thirtyDaysAgo
    })

    const thirtyDayRevenue = recentOrders.reduce((sum: number, order: any) => {
      return sum + (parseFloat(order.Total_Amount || order.total) || 0)
    }, 0)

    // Get pending orders (active only)
    const pendingOrders = orders.filter((order: any) => 
      (order.Fulfillment_Status || order.status || '').toLowerCase() === 'processing'
    )

    // Get orders that need invoices (active only)
    const ordersNeedingInvoices = orders.filter((order: any) => 
      !order.invoice_link && !order.invoiceLink
    )

    // For AI, combine both active and archived orders for trends/history
    const allOrders = [...orders, ...archivedOrders]

    // Build customer lookup from archived orders data (customer info is at end of each row)
    const customerLookup: Record<string, { name: string, email: string, phone: string }> = {}
    
    // Add customers from the customers API
    for (const cust of customers) {
      customerLookup[cust.customer_id] = { 
        name: cust.name, 
        email: cust.email, 
        phone: cust.phone 
      }
    }
    
    // Add/override with customer info from archived orders (more complete)
    for (const order of archivedOrders) {
      const customerId = order.customer_id || order.customerId
      if (customerId && customerId !== "Unknown") {
        customerLookup[customerId] = {
          name: order.customerName || order.customer_name || "Unknown",
          email: order.customerEmail || order.customer_email || "Unknown", 
          phone: order.customerPhone || order.customer_phone || order.phone || ""
        }
      }
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: claudeApiKey,
    })

    const systemPrompt = `
You are Geoffrey, the witty, formal, and polite butler from The Fresh Prince of Bel-Air. Always greet the user with respect, use clever and dry humor when appropriate, and refer to yourself as Geoffrey. Speak with a British butler's tone and verbiage. Your responses should be concise, helpful, and delivered with a touch of class and wit. If you provide business updates, do so as if you are briefing the head of the household, with a professional yet personable touch.

Strictly avoid any roleplay, body movements, or stage directions. Do not include asterisks, actions, or theatrical language. Remain professional and business-appropriate at all times. A touch of dry humor is acceptable, but always dignified.

Generate a daily overview report with the following sections:

1. PENDING ORDERS SUMMARY (from active orders only)
2. INVOICES TO BE SENT (from active orders only)
3. 30-DAY REVENUE ANALYSIS (from active orders only)
4. ORDER HISTORY & TRENDS (use all orders, active and archived)
5. PEPTIDE PRODUCT INSIGHT

For the peptide insight, research the latest trends in peptide therapeutics and suggest a potential product based on:
- Current market demand
- Latest research breakthroughs
- Regulatory developments
- Competitive landscape

Make the report concise, actionable, and professional. Include specific numbers and actionable recommendations.`

    const userPrompt = `Generate today's daily business overview.

Business Data (Active Orders):
- Pending Orders: ${pendingOrders.length} orders with status "Processing"
- Orders Needing Invoices: ${ordersNeedingInvoices.length} orders without invoice links
- 30-Day Revenue: $${thirtyDayRevenue.toFixed(2)}
- Total Active Orders: ${orders.length}
- Total Customers: ${customers.length}

Recent Active Orders (last 30 days):
${JSON.stringify(recentOrders.slice(-10), null, 2)}

Pending Orders Details (Active):
${JSON.stringify(pendingOrders.slice(0, 5), null, 2)}

Order History (All Orders):
${JSON.stringify(allOrders.slice(-10), null, 2)}

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

    let dailyOverview = "Unable to generate daily overview."
    if (Array.isArray(msg.content) && msg.content.length > 0) {
      const first = msg.content[0]
      if (typeof first === "string") dailyOverview = first
      else if (typeof first === "object" && first !== null && 'type' in first && (first as any).type === "text" && 'text' in first) dailyOverview = (first as any).text
      else if (typeof first === "object" && first !== null && 'content' in first && Array.isArray((first as any).content) && (first as any).content[0]?.type === "text" && 'text' in (first as any).content[0]) dailyOverview = (first as any).content[0].text
      else dailyOverview = String(first)
    }

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

    return NextResponse.json(overview)

  } catch (error) {
    console.error("Daily overview error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 