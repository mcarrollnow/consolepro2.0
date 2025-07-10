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

    // Get API keys from environment
    const stripeApiKey = process.env.STRIPE_SECRET_KEY
    const wixApiKey = process.env.WIX_API_KEY
    const wixSiteId = process.env.WIX_SITE_ID
    
    console.log('Environment variables check:')
    console.log('Stripe key present:', stripeApiKey ? 'YES' : 'NO')
    console.log('Wix API key present:', wixApiKey ? 'YES' : 'NO')
    console.log('Wix Site ID present:', wixSiteId ? 'YES' : 'NO')
    
    if (!stripeApiKey) {
      return NextResponse.json(
        { error: "Stripe API key not configured" },
        { status: 500 }
      )
    }
    
    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json(
        { error: "Wix API credentials not configured" },
        { status: 500 }
      )
    }

    // Build URL with parameters for GET request
    const url = new URL(scriptUrl)
    url.searchParams.set('action', 'createStripeInvoice')
    url.searchParams.set('orderId', orderId)
    url.searchParams.set('stripeKey', stripeApiKey)
    url.searchParams.set('wixApiKey', wixApiKey)
    url.searchParams.set('wixSiteId', wixSiteId)

    console.log(`Making GET request to Google Apps Script: ${url.toString()}`)

    // Call your existing Google Apps Script to create the Stripe invoice
    const scriptResponse = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    console.log(`Script response status: ${scriptResponse.status} ${scriptResponse.statusText}`)
    console.log(`Script response headers:`, Object.fromEntries(scriptResponse.headers.entries()))

    // Get the response body once
    const responseText = await scriptResponse.text()
    console.log(`Script response body:`, responseText)

    if (!scriptResponse.ok) {
      console.error(`Google Apps Script error response body:`, responseText)
      throw new Error(`Google Apps Script failed: ${scriptResponse.status} ${scriptResponse.statusText}`)
    }

    // Check if response is JSON before parsing
    const contentType = scriptResponse.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Unexpected response type: ${contentType}`)
      console.error(`Raw response body:`, responseText)
      throw new Error(`Expected JSON response but got: ${contentType}`)
    }

    // Parse the response text as JSON
    let scriptResult
    try {
      scriptResult = JSON.parse(responseText)
    } catch (error) {
      console.error(`Failed to parse JSON response:`, error)
      throw new Error(`Invalid JSON response from Google Apps Script`)
    }

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