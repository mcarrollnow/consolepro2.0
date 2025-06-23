import { NextRequest, NextResponse } from "next/server"
import { GoogleSheetsService } from "@/lib/google-sheets"

const googleSheetsService = new GoogleSheetsService()

// Valid invoice statuses
const VALID_STATUSES = ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderCode, invoiceStatus } = body

    // Validate required fields
    if (!orderCode || !invoiceStatus) {
      return NextResponse.json(
        { error: "Missing required fields: orderCode and invoiceStatus" },
        { status: 400 }
      )
    }

    // Validate invoice status
    if (!VALID_STATUSES.includes(invoiceStatus.toUpperCase())) {
      return NextResponse.json(
        { error: `Invalid invoice status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    // Update the invoice status in Google Sheets
    const success = await googleSheetsService.updateInvoiceStatus(
      orderCode,
      invoiceStatus.toUpperCase()
    )

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update invoice status. Order may not exist." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Invoice status updated to ${invoiceStatus.toUpperCase()} for order ${orderCode}`,
      orderCode,
      invoiceStatus: invoiceStatus.toUpperCase()
    })

  } catch (error) {
    console.error("Error updating invoice status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve current status (optional, for debugging)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orderCode = searchParams.get('orderCode')

  if (!orderCode) {
    return NextResponse.json(
      { error: "Missing orderCode parameter" },
      { status: 400 }
    )
  }

  try {
    // Get orders data to find the current status
    const orders = await googleSheetsService.getOrdersData()
    const order = orders.find(o => o.orderId === orderCode)

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      orderCode,
      currentStatus: order.status,
      validStatuses: VALID_STATUSES
    })

  } catch (error) {
    console.error("Error retrieving order status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 