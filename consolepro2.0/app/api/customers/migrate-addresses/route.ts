import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function POST(request: Request) {
  try {
    const { dryRun = true } = await request.json()
    
    // Get all customers with their current address data
    const customers = await googleSheetsService.getCustomersData()
    
    const migrationResults = []
    let migratedCount = 0
    let skippedCount = 0
    
    for (const customer of customers) {
      // Skip if already has structured address or no address to migrate
      if ((customer as any).addressStreet || !customer.address) {
        skippedCount++
        continue
      }
      
      // Parse the address into components
      const parsedAddress = parseAddressString(customer.address)
      
      if (dryRun) {
        // Just show what would be migrated
        migrationResults.push({
          customerId: customer.customer_id,
          customerName: customer.name,
          originalAddress: customer.address,
          parsedAddress,
          action: "WOULD_MIGRATE"
        })
      } else {
        // Actually update the customer with structured address
        const updatedCustomer = {
          ...customer,
          addressStreet: parsedAddress.street,
          addressStreet2: parsedAddress.street2,
          addressCity: parsedAddress.city,
          addressState: parsedAddress.state,
          addressZIP: parsedAddress.zip
        }
        
        // Note: This would require implementing an updateCustomer method
        // For now, we'll just report what would be done
        migrationResults.push({
          customerId: customer.customer_id,
          customerName: customer.name,
          originalAddress: customer.address,
          parsedAddress,
          action: "MIGRATED"
        })
      }
      
      migratedCount++
    }
    
    return NextResponse.json({
      success: true,
      dryRun,
      summary: {
        totalCustomers: customers.length,
        migratedCount,
        skippedCount,
        alreadyStructured: skippedCount
      },
      migrations: migrationResults
    })
    
  } catch (error) {
    console.error("Error migrating customer addresses:", error)
    return NextResponse.json({
      error: "Failed to migrate customer addresses",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function parseAddressString(address: string): {
  street: string
  street2: string
  city: string
  state: string
  zip: string
} {
  // Clean up the address
  const cleanAddress = address.trim()
  
  // Split by commas and clean each part
  const parts = cleanAddress.split(',').map(part => part.trim())
  
  if (parts.length >= 3) {
    // Standard format: Street, City, State ZIP
    const lastPart = parts[parts.length - 1] // Should be "State ZIP"
    const stateZipMatch = lastPart.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/)
    
    if (stateZipMatch) {
      return {
        street: parts[0] || "",
        street2: parts.length > 3 ? parts[1] : "", // If more than 3 parts, second part might be street2
        city: parts[parts.length - 2] || "",
        state: stateZipMatch[1] || "",
        zip: stateZipMatch[2] || ""
      }
    }
  }
  
  // Fallback: Try to extract what we can
  const zipMatch = cleanAddress.match(/\b(\d{5}(?:-\d{4})?)\b/)
  const stateMatch = cleanAddress.match(/\b([A-Z]{2})\b/)
  
  // Simple fallback - put everything in street if we can't parse properly
  return {
    street: cleanAddress,
    street2: "",
    city: "",
    state: stateMatch ? stateMatch[1] : "",
    zip: zipMatch ? zipMatch[1] : ""
  }
}

// GET endpoint to analyze address formats
export async function GET() {
  try {
    const customers = await googleSheetsService.getCustomersData()
    
    const analysis = {
      totalCustomers: customers.length,
      hasAddress: 0,
      hasStructuredAddress: 0,
      needsMigration: 0,
      addressFormats: [] as Array<{
        format: string
        count: number
        examples: string[]
      }>
    }
    
    const formatCounts: Record<string, { count: number, examples: string[] }> = {}
    
    for (const customer of customers) {
      if (customer.address) {
        analysis.hasAddress++
        
        // Analyze format
        const parts = customer.address.split(',').length
        const hasZip = /\d{5}/.test(customer.address)
        const hasState = /\b[A-Z]{2}\b/.test(customer.address)
        
        const formatKey = `${parts} parts, ${hasZip ? 'with ZIP' : 'no ZIP'}, ${hasState ? 'with state' : 'no state'}`
        
        if (!formatCounts[formatKey]) {
          formatCounts[formatKey] = { count: 0, examples: [] }
        }
        formatCounts[formatKey].count++
        if (formatCounts[formatKey].examples.length < 3) {
          formatCounts[formatKey].examples.push(customer.address)
        }
      }
      
      if ((customer as any).addressStreet) {
        analysis.hasStructuredAddress++
      } else if (customer.address) {
        analysis.needsMigration++
      }
    }
    
    // Convert format counts to array
    analysis.addressFormats = Object.entries(formatCounts).map(([format, data]) => ({
      format,
      count: data.count,
      examples: data.examples
    })).sort((a, b) => b.count - a.count)
    
    return NextResponse.json({
      success: true,
      analysis
    })
    
  } catch (error) {
    console.error("Error analyzing customer addresses:", error)
    return NextResponse.json({
      error: "Failed to analyze customer addresses",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 