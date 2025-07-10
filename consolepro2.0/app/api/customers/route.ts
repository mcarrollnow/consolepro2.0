import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET() {
  try {
    const customersData = await googleSheetsService.getCustomersData()
    return NextResponse.json(customersData)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      mobile,
      billingAddress,
      shippingAddress,
      // New structured address fields
      addressStreet,
      addressStreet2,
      addressCity,
      addressState,
      addressZip,
      nickname,
      birthday,
      notes
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Generate customer ID using the same logic as form submission
    const customerId = await googleSheetsService.generateCustomerId(name, email)

    // Build consolidated address for backward compatibility
    const consolidatedAddress = shippingAddress || billingAddress || 
      [addressStreet, addressStreet2, addressCity, addressState, addressZip]
        .filter(Boolean)
        .join(", ")

    // Create customer data with both legacy and structured address fields
    const customerData = {
      customer_id: customerId,
      name,
      email,
      phone: mobile || "",
      company: "",
      address: consolidatedAddress, // Legacy field
      // Structured address fields for Google Sheets
      addressStreet: addressStreet || "",
      addressStreet2: addressStreet2 || "",
      addressCity: addressCity || "",
      addressState: addressState || "",
      addressZIP: addressZip || "", // Note: Google Sheets uses addressZIP
      first_order_date: "",
      last_order_date: "",
      total_orders: "0",
      total_spent: "0",
      customer_status: "Active",
      preferred_contact: "email",
      customer_notes: notes || "",
      tags: "",
      created_date: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      referred_by: "",
      customer_class: "Standard",
      nickname: nickname || "",
      birthday: birthday || "",
      square_reference_id: "",
      square_customer_id: "",
      wix_contact_id: ""
    }

    // Add customer to Google Sheets
    const success = await googleSheetsService.addCustomer(customerData)

    if (success) {
      return NextResponse.json({ 
        success: true, 
        customer: customerData,
        message: "Customer created successfully" 
      })
    } else {
      return NextResponse.json(
        { error: "Failed to create customer" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    )
  }
} 