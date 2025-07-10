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

    // First, create or find customer record
    const customerId = await googleSheetsService.generateCustomerId(orderData.customerName, orderData.customerEmail)
    
    // Check if customer already exists in Customers sheet
    const customers = await googleSheetsService.getCustomersData()
    const existingCustomer = customers.find((customer) => customer.email.toLowerCase() === orderData.customerEmail.toLowerCase())
    
    // If customer doesn't exist, create them in the Customers sheet
    if (!existingCustomer) {
      const customerData = {
        customer_id: customerId,
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.phone || "",
        company: orderData.businessName || "",
        address: `${orderData.addressStreet || ""} ${orderData.addressCity || ""} ${orderData.addressState || ""} ${orderData.addressZIP || ""}`.trim(),
        first_order_date: new Date().toISOString(),
        last_order_date: new Date().toISOString(),
        total_orders: "1",
        total_spent: orderData.total.toString(),
        customer_status: "Active",
        preferred_contact: "email",
        customer_notes: orderData.notes || "",
        tags: "",
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        referred_by: "",
        customer_class: "Standard",
        nickname: "",
        birthday: "",
        square_reference_id: "",
        square_customer_id: "",
        wix_contact_id: ""
      }

      const customerCreated = await googleSheetsService.addCustomer(customerData)
      if (!customerCreated) {
        console.warn("Failed to create customer record, but continuing with order creation")
      }
    } else {
      // Update existing customer's last order date and total spent
      const updatedTotalSpent = parseFloat(existingCustomer.total_spent || "0") + orderData.total
      const updatedTotalOrders = parseInt(existingCustomer.total_orders || "0") + 1
      
      // Note: We could add a method to update customer data, but for now we'll just log this
      console.log(`Customer ${existingCustomer.customer_id} already exists. Total orders: ${updatedTotalOrders}, Total spent: ${updatedTotalSpent}`)
    }

    // Format the order data according to the Orders sheet structure
    const formattedOrder = {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerId: customerId, // Now we have a proper customer ID
      businessName: orderData.businessName || "",
      phone: orderData.phone || "",
      // Billing Address (defaults to shipping if not provided)
      billingAddressStreet: orderData.billingAddressStreet || orderData.addressStreet || "",
      billingAddressStreet2: orderData.billingAddressStreet2 || orderData.addressStreet2 || "",
      billingAddressCity: orderData.billingAddressCity || orderData.addressCity || "",
      billingAddressState: orderData.billingAddressState || orderData.addressState || "",
      billingAddressZIP: orderData.billingAddressZIP || orderData.addressZIP || "",
      // Shipping Address
      addressStreet: orderData.addressStreet || "",
      addressStreet2: orderData.addressStreet2 || "",
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
    
    console.log(`Order created successfully: ${orderId}`)
    console.log(`Customer ID: ${customerId}`)
    console.log(`Order data added to Google Sheets - Google Apps Script trigger should now create Wix order automatically`)

    // Add a small delay to ensure Google Apps Script trigger has time to run
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Also add sales records to inventory sheet for each product
    if (orderData.products && Array.isArray(orderData.products)) {
      for (const product of orderData.products) {
        if (product.barcode && product.quantity > 0) {
          await googleSheetsService.addSale({
            barcode: product.barcode,
            quantity: product.quantity,
            timestamp: new Date().toISOString(),
            product: product.name,
            customer_id: customerId, // Now we have the proper customer ID
            order_code: orderId,
            customer_name: orderData.customerName,
            email: orderData.customerEmail,
            wix_order_number: "", // Will be filled by Google Apps Script
            wix_contact_id: "" // Will be filled by Google Apps Script
          })
        }
      }
    }

    return NextResponse.json({ 
      orderId, 
      customerId,
      message: "Order created successfully. Google Apps Script will automatically create Wix order and customer.",
      note: "The 'Send Stripe Invoice' function should now work once the Wix order is created by the Google Apps Script trigger."
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
