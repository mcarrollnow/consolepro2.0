import { NextResponse } from "next/server"
import Stripe from "stripe"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Get Stripe API key from environment
    const stripeApiKey = process.env.STRIPE_SECRET_KEY
    if (!stripeApiKey) {
      return NextResponse.json(
        { error: "Stripe API key not configured" },
        { status: 500 }
      )
    }

    // Initialize Stripe with restricted key (read-only)
    const stripe = new Stripe(stripeApiKey, {
      apiVersion: '2024-06-20',
    })

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') // 'paid', 'open', 'uncollectible', 'void'
    const customerId = searchParams.get('customer_id')

    // Build query parameters
    const queryParams: Stripe.InvoiceListParams = {
      limit: Math.min(limit, 100), // Cap at 100 for performance
      expand: ['data.customer', 'data.subscription'], // Expand full data for maximum visibility
    }

    if (status) {
      queryParams.status = status as Stripe.InvoiceListParams.Status
    }

    if (customerId) {
      queryParams.customer = customerId
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list(queryParams)

    // Transform the data to include only what we need
    const transformedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      amount_remaining: invoice.amount_remaining,
      currency: invoice.currency,
      created: invoice.created,
      due_date: invoice.due_date,
      invoice_pdf: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      customer: {
        id: invoice.customer?.id || invoice.customer,
        name: typeof invoice.customer === 'object' ? invoice.customer.name : null,
        email: typeof invoice.customer === 'object' ? invoice.customer.email : null,
      },
      subscription_id: invoice.subscription,
      description: invoice.description,
      metadata: invoice.metadata,
      lines: invoice.lines.data.map(line => ({
        id: line.id,
        description: line.description,
        amount: line.amount,
        quantity: line.quantity,
        price: line.price ? {
          id: line.price.id,
          unit_amount: line.price.unit_amount,
          currency: line.price.currency,
          product: line.price.product,
        } : null,
      })),
    }))

    return NextResponse.json({
      invoices: transformedInvoices,
      has_more: invoices.has_more,
      total_count: invoices.data.length,
    })

  } catch (error) {
    console.error("Error fetching Stripe invoices:", error)
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { 
          error: "Stripe API error",
          message: error.message,
          type: error.type,
        },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 