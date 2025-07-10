import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Test reading customer data with new address structure
    const customers = await googleSheetsService.getCustomersData()
    
    // Find customers with structured addresses
    const structuredCustomers = customers.filter(customer => 
      (customer as any).addressStreet || (customer as any).addressCity
    )
    
    // Find customers with only legacy addresses
    const legacyCustomers = customers.filter(customer => 
      customer.address && !(customer as any).addressStreet
    )
    
    return NextResponse.json({
      success: true,
      summary: {
        totalCustomers: customers.length,
        withStructuredAddress: structuredCustomers.length,
        withLegacyAddressOnly: legacyCustomers.length,
        withNoAddress: customers.length - structuredCustomers.length - legacyCustomers.length
      },
      examples: {
        structuredCustomers: structuredCustomers.slice(0, 3).map(c => ({
          customer_id: c.customer_id,
          name: c.name,
          legacyAddress: c.address,
          structuredAddress: {
            street: (c as any).addressStreet,
            street2: (c as any).addressStreet2,
            city: (c as any).addressCity,
            state: (c as any).addressState,
            zip: (c as any).addressZip
          }
        })),
        legacyCustomers: legacyCustomers.slice(0, 3).map(c => ({
          customer_id: c.customer_id,
          name: c.name,
          legacyAddress: c.address
        }))
      }
    })
  } catch (error) {
    console.error("Error testing customer address structure:", error)
    return NextResponse.json({
      error: "Failed to test customer address structure",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Test creating a customer with structured address
    const testCustomer = {
      name: "Test Customer - Structured Address",
      email: `test-structured-${Date.now()}@example.com`,
      phone: "555-0123",
      mobile: "555-0123",
      addressStreet: "123 Test Street",
      addressStreet2: "Apt 4B",
      addressCity: "Test City",
      addressState: "TX",
      addressZip: "12345",
      notes: "Test customer created to verify structured address functionality"
    }
    
    // Use the same logic as the customer API
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCustomer),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create test customer')
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      message: "Test customer created successfully with structured address",
      customer: result.customer
    })
    
  } catch (error) {
    console.error("Error creating test customer:", error)
    return NextResponse.json({
      error: "Failed to create test customer",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 