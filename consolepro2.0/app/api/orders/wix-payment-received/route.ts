import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function POST(request: Request) {
  try {
    const { orderCode, paymentTimestamp } = await request.json()

    if (!orderCode || !paymentTimestamp) {
      return NextResponse.json(
        { error: "Order code and payment timestamp are required" },
        { status: 400 }
      )
    }

    const success = await googleSheetsService.updatePaymentStatus(orderCode, paymentTimestamp)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Payment status updated successfully",
      orderCode,
      paymentTimestamp,
      status: "Paid-Ready to Ship"
    })
  } catch (error) {
    console.error("Error updating payment status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 