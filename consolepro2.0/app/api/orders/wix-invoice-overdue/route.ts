import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function POST(request: Request) {
  try {
    const { orderCode } = await request.json()

    if (!orderCode) {
      return NextResponse.json(
        { error: "Order code is required" },
        { status: 400 }
      )
    }

    const success = await googleSheetsService.updateInvoiceStatus(orderCode, "OVERDUE")

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update invoice status to overdue" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Invoice status updated to overdue successfully",
      orderCode,
      status: "Invoice Overdue"
    })
  } catch (error) {
    console.error("Error updating invoice status to overdue:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 