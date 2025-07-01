import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { overview, recipientEmail } = await request.json()

    // For now, we'll just log the email content
    // In production, you'd integrate with a service like SendGrid, Resend, or AWS SES
    console.log("=== DAILY OVERVIEW EMAIL ===")
    console.log(`To: ${recipientEmail || 'admin@consolepro.com'}`)
    console.log(`Subject: Daily Business Overview - ${overview.date}`)
    console.log("\nContent:")
    console.log(overview.aiInsights)
    console.log("\nSummary:")
    console.log(`- Pending Orders: ${overview.summary.pendingOrders}`)
    console.log(`- Orders Needing Invoices: ${overview.summary.ordersNeedingInvoices}`)
    console.log(`- 30-Day Revenue: $${overview.summary.thirtyDayRevenue.toFixed(2)}`)
    console.log("===========================")

    // TODO: Implement actual email sending
    // Example with a service like Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'noreply@consolepro.com',
      to: recipientEmail,
      subject: `Daily Business Overview - ${overview.date}`,
      html: `
        <h1>Daily Business Overview</h1>
        <h2>Summary</h2>
        <ul>
          <li>Pending Orders: ${overview.summary.pendingOrders}</li>
          <li>Orders Needing Invoices: ${overview.summary.ordersNeedingInvoices}</li>
          <li>30-Day Revenue: $${overview.summary.thirtyDayRevenue.toFixed(2)}</li>
        </ul>
        <h2>AI Insights</h2>
        <div>${overview.aiInsights.replace(/\n/g, '<br>')}</div>
      `
    })
    */

    return NextResponse.json({
      success: true,
      message: "Email notification logged successfully",
      note: "Email service integration needed for actual sending"
    })

  } catch (error) {
    console.error("Email notification error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
} 