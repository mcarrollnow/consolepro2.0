import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET(
  request: Request,
  { params }: { params: { customer_id: string } }
) {
  try {
    const customerId = params.customer_id
    
    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    console.log(`Fetching orders for customer: ${customerId}`)
    const orders = await googleSheetsService.getCustomerOrderHistory(customerId)
    
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    return NextResponse.json({ error: "Failed to fetch customer orders" }, { status: 500 })
  }
} 