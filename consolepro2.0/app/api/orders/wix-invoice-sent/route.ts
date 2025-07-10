import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function POST(request: Request) {
  try {
    const { orderCode, invoiceLink } = await request.json()

    if (!orderCode || !invoiceLink) {
      return NextResponse.json(
        { error: "Order code and invoice link are required" },
        { status: 400 }
      )
    }

    const success = await googleSheetsService.updateInvoiceStatusWithLink(orderCode, invoiceLink)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update invoice status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Invoice status updated successfully",
      orderCode,
      invoiceLink,
      status: "INVOICE SENT"
    })
  } catch (error) {
    console.error("Error updating invoice status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 