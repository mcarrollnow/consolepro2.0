import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { orderData } = await request.json()

    // Validate required fields
    if (!orderData.customerName || !orderData.email) {
      return NextResponse.json({
        error: "Missing required fields: customerName and email are required",
        fixes: {
          customerName: orderData.customerName || "MISSING",
          email: orderData.email || "MISSING"
        }
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(orderData.email)) {
      return NextResponse.json({
        error: "Invalid email format",
        fixes: {
          email: orderData.email,
          validEmail: false
        }
      }, { status: 400 })
    }

    // Build structured address from individual components for Wix
    const wixAddressPayload = {
      info: {
        name: {
          first: orderData.customerName.split(' ')[0] || orderData.customerName,
          last: orderData.customerName.split(' ').slice(1).join(' ') || ""
        },
        emails: {
          items: [{
            tag: "MAIN",
            email: orderData.email
          }]
        },
        addresses: {
          items: [{
            tag: "SHIPPING",
            address: {
              country: "US", // Default to US, can be made configurable
              subdivision: orderData.addressState ? `US-${orderData.addressState}` : "",
              city: orderData.addressCity || "",
              addressLine: buildAddressLine(orderData),
              postalCode: orderData.addressZIP || ""
            }
          }]
        }
      }
    }

    // Additional validation for address completeness
    const addressWarnings = []
    if (!orderData.addressStreet) addressWarnings.push("Missing street address")
    if (!orderData.addressCity) addressWarnings.push("Missing city")
    if (!orderData.addressState) addressWarnings.push("Missing state")
    if (!orderData.addressZIP) addressWarnings.push("Missing ZIP code")

    return NextResponse.json({
      success: true,
      wixPayload: wixAddressPayload,
      addressWarnings,
      addressComplete: addressWarnings.length === 0,
      originalData: {
        customerName: orderData.customerName,
        email: orderData.email,
        addressStreet: orderData.addressStreet,
        addressCity: orderData.addressCity,
        addressState: orderData.addressState,
        addressZIP: orderData.addressZIP
      }
    })

  } catch (error) {
    console.error("Error fixing Wix address:", error)
    return NextResponse.json({
      error: "Failed to process address data",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function buildAddressLine(orderData: any): string {
  const addressParts = []
  
  if (orderData.addressStreet) {
    addressParts.push(orderData.addressStreet)
  }
  
  // For Wix, we combine street address parts into a single addressLine
  // Street Address Line 2 would be included here if it exists
  if (orderData.addressStreet2) {
    addressParts.push(orderData.addressStreet2)
  }
  
  return addressParts.join(", ") || "Address not provided"
}

// Validation function for order data
export function validateOrderData(orderData: any): { isValid: boolean, errors: string[] } {
  const errors = []
  
  if (!orderData.customerName || orderData.customerName.trim() === "") {
    errors.push("Customer name is required")
  }
  
  if (!orderData.email || orderData.email.trim() === "") {
    errors.push("Email is required")
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(orderData.email)) {
      errors.push("Invalid email format")
    }
  }
  
  if (!orderData.orderCode || orderData.orderCode.trim() === "") {
    errors.push("Order code is required")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 