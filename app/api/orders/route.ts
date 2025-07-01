import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sheet = searchParams.get('sheet') || 'Archived Orders'
    
    let ordersData
    if (sheet === 'Orders') {
      ordersData = await googleSheetsService.getActiveOrdersData()
    } else {
      ordersData = await googleSheetsService.getOrdersData()
    }
    
    return NextResponse.json(ordersData)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    // Generate customer ID if new customer
    const customerId = await googleSheetsService.generateCustomerId(orderData.customerName, orderData.customerEmail)

    const newOrder = {
      ...orderData,
      customerId,
      orderDate: new Date().toISOString(),
      status: "Processing",
    }

    const orderId = await googleSheetsService.addNewOrder(newOrder)

    return NextResponse.json({ orderId, customerId })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
