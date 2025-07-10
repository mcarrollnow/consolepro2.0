import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'email', 'billingAddress', 'billingCity', 'billingState', 'billingZip', 'items']
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }

    // Validate items array
    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ 
        error: "At least one item is required" 
      }, { status: 400 })
    }

    // Generate unique order code (B2B-MMDD-XXXX-1 format)
    const date = new Date().toISOString().slice(5, 7) + new Date().toISOString().slice(8, 10) // MM-DD
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    const orderCode = `B2B-${date}-${random}-1`

    // Process discount code if provided
    let discountAmount = 0
    let finalTotal = 0
    if (orderData.discountCode) {
      try {
        // Calculate total before discount
        const subtotal = orderData.items.reduce((sum: number, item: any) => {
          return sum + (parseFloat(item.price) * parseInt(item.qty))
        }, 0)

        // Apply discount code
        const discountResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/console-discount-codes/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: orderData.discountCode,
            orderTotal: subtotal
          })
        })

        if (discountResponse.ok) {
          const discountResult = await discountResponse.json()
          if (discountResult.success && discountResult.data.valid) {
            discountAmount = discountResult.data.discountAmount || 0
            finalTotal = Math.max(0, subtotal - discountAmount)
          }
        }
      } catch (error) {
        console.warn('Discount code processing failed:', error)
        // Continue without discount
      }
    }

    // Calculate final total if no discount was applied
    if (finalTotal === 0) {
      finalTotal = orderData.items.reduce((sum: number, item: any) => {
        return sum + (parseFloat(item.price) * parseInt(item.qty))
      }, 0)
    }

    // Create or find customer record
    const customerId = await googleSheetsService.generateCustomerId(orderData.name, orderData.email)
    
    // Check if customer already exists
    const customers = await googleSheetsService.getCustomersData()
    const existingCustomer = customers.find((customer) => 
      customer.email.toLowerCase() === orderData.email.toLowerCase()
    )
    
    // If customer doesn't exist, create them
    if (!existingCustomer) {
      const customerData = {
        customer_id: customerId,
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone || "",
        company: orderData.company || "",
        address: `${orderData.billingAddress || ""} ${orderData.billingCity || ""} ${orderData.billingState || ""} ${orderData.billingZip || ""}`.trim(),
        first_order_date: new Date().toISOString(),
        last_order_date: new Date().toISOString(),
        total_orders: "1",
        total_spent: finalTotal.toString(),
        customer_status: "Active",
        preferred_contact: "email",
        customer_notes: orderData.special || "",
        tags: "",
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        referred_by: orderData.referredBy || "",
        customer_class: "B2B",
        nickname: "",
        birthday: "",
        square_reference_id: "",
        square_customer_id: "",
        wix_contact_id: ""
      }

      await googleSheetsService.addCustomer(customerData)
    }

    // Format order data for Google Sheets
    const formattedOrder = {
      // Basic order info
      Submission_Timestamp: new Date().toISOString(),
      Order_Code: orderCode,
      Record_Type: "B2B_ORDER",
      Customer_Name: orderData.name,
      customer_id: customerId,
      Email: orderData.email,
      Business_Name: orderData.company || "",
      Phone: orderData.phone || "",
      
      // Billing Address (using the exact column names from CSV)
      Address_Street: orderData.billingAddress,
      Address_Street_Line_2: orderData.billingAddress2 || "",
      Address_City: orderData.billingCity,
      Address_State: orderData.billingState,
      Address_ZIP: orderData.billingZip,
      
      // Order details
      Total_Amount: ` $ ${finalTotal.toFixed(2)} `,
      Special_Instructions: orderData.special || "",
      Order_Type: "B2B",
      Submission_Source: "consolepro_admin",
      Payment_Status: "PENDING",
      Fulfillment_Status: "PENDING",
      Invoice_Status: "PENDING",
      Lifecycle_Stage: "SUBMITTED",
      Last_Updated: new Date().toISOString(),
      
      // Product fields (up to 10 products as per CSV structure)
      ...(() => {
        const productFields: any = {}
        orderData.items.forEach((item: any, index: number) => {
          const productNum = index + 1
          if (productNum <= 10) {
            productFields[`Product_${productNum}_Name`] = item.item
            productFields[`Product_${productNum}_Barcode`] = ""
            productFields[`Product_${productNum}_Price`] = item.price.toString()
            productFields[`Product_${productNum}_Quantity`] = item.qty
          }
        })
        return productFields
      })(),
      
      // Shipping Address (only if different from billing)
      ...(orderData.shippingRecipient && orderData.shippingAddress ? {
        Shipping_Recipient: orderData.shippingRecipient,
        Shipping_Address_Street: orderData.shippingAddress,
        Shipping_Address_Street_Line_2: orderData.shippingAddress2 || "",
        Shipping_Address_City: orderData.shippingCity || "",
        Shipping_Address_State: orderData.shippingState || "",
        Shipping_Address_ZIP: orderData.shippingZip || "",
      } : {}),
      
      // Integration fields (will be filled by Google Apps Script)
      payment_link: "",
      invoice_link: "",
      wix_invoice_id: "",
      wix_order_id: "",
      Wix_Status: "",
      Wix_Contact_ID: "",
      Wix_Error: "",
      
      // Required properties for OrderCustomer interface
      orderId: orderCode,
      orderDate: new Date().toISOString(),
      status: "PENDING",
      items: orderData.items.map((item: any) => item.item).join(", "),
    }

    // Add order to Google Sheets
    const orderId = await googleSheetsService.addNewOrder(formattedOrder)
    
    console.log(`B2B Order created successfully: ${orderId}`)
    console.log(`Customer ID: ${customerId}`)
    console.log(`Order data added to Google Sheets - Google Apps Script trigger should now create Wix order automatically`)

    // Add a small delay to ensure Google Apps Script trigger has time to run
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Add sales records to inventory sheet for each product
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        if (item.item && parseInt(item.qty) > 0) {
          await googleSheetsService.addSale({
            barcode: "", // B2B orders may not have barcodes
            quantity: parseInt(item.qty),
            timestamp: new Date().toISOString(),
            product: item.item,
            customer_id: customerId,
            order_code: orderId,
            customer_name: orderData.name,
            email: orderData.email,
            wix_order_number: "", // Will be filled by Google Apps Script
            wix_contact_id: "" // Will be filled by Google Apps Script
          })
        }
      }
    }

    // TODO: Send email notifications
    // - Internal notification to sales team
    // - Customer confirmation email

    return NextResponse.json({ 
      ok: true,
      orderCode: orderCode,
      message: "B2B order created successfully. Google Apps Script will automatically create Wix order and customer.",
      note: "The 'Send Stripe Invoice' function should now work once the Wix order is created by the Google Apps Script trigger."
    })

  } catch (error) {
    console.error("Error creating B2B order:", error)
    return NextResponse.json({ 
      error: `Failed to create B2B order: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
} 