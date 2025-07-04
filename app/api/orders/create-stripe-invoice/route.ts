import { NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    // Get the Google Apps Script web app URL from environment
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
    
    if (!scriptUrl) {
      return NextResponse.json(
        { error: "Google Apps Script URL not configured" },
        { status: 500 }
      )
    }

    // Call your existing Google Apps Script to create the Stripe invoice
    const scriptResponse = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createStripeInvoice',
        orderId: orderId
      })
    })

    if (!scriptResponse.ok) {
      throw new Error(`Google Apps Script failed: ${scriptResponse.statusText}`)
    }

    const scriptResult = await scriptResponse.json()

    return NextResponse.json({
      success: true,
      message: "Stripe invoice creation triggered successfully",
      orderId: orderId,
      result: scriptResult
    })

  } catch (error) {
    console.error("Error triggering Stripe invoice creation:", error)
    return NextResponse.json(
      { 
        error: "Failed to trigger Stripe invoice creation",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 