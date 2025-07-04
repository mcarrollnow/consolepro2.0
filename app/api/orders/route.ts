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

    // Format the order data according to the Orders sheet structure
    const formattedOrder = {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerId,
      businessName: orderData.businessName || "",
      phone: orderData.phone || "",
      addressStreet: orderData.addressStreet || "",
      addressCity: orderData.addressCity || "",
      addressState: orderData.addressState || "",
      addressZIP: orderData.addressZIP || "",
      notes: orderData.notes || "",
      total: orderData.total,
      products: orderData.products || [],
      orderType: orderData.orderType || "RETAIL",
      orderCode: orderData.orderCode || `ORD-${Date.now()}`,
      recordType: orderData.orderType === "B2B" ? "B2B_ORDER" : "RETAIL_TRANSACTION",
      // Required properties for OrderCustomer interface
      orderId: orderData.orderCode || `ORD-${Date.now()}`,
      orderDate: new Date().toISOString(),
      status: "PENDING",
      items: orderData.products?.map((p: any) => p.name).join(", ") || "",
    }

    const orderId = await googleSheetsService.addNewOrder(formattedOrder)

    // Also add sales records to inventory sheet for each product
    if (orderData.products && Array.isArray(orderData.products)) {
      for (const product of orderData.products) {
        if (product.barcode && product.quantity > 0) {
          await googleSheetsService.addSale({
            barcode: product.barcode,
            quantity: product.quantity,
            timestamp: new Date().toISOString(),
            product: product.name,
            customer_id: customerId,
            order_code: orderId,
            customer_name: orderData.customerName,
            email: orderData.customerEmail,
            wix_order_number: "", // Will be filled by Google Apps Script
            wix_contact_id: "" // Will be filled by Google Apps Script
          })
        }
      }
    }

    return NextResponse.json({ orderId, customerId })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
