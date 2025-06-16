import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET() {
  try {
    console.log("API: Starting inventory data fetch...")
    console.log("Environment check:")
    console.log("- GOOGLE_SERVICE_ACCOUNT_JSON exists:", !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    console.log("- GOOGLE_SPREADSHEET_ID:", process.env.GOOGLE_SPREADSHEET_ID)
    console.log("- INVENTORY_SHEET_ID:", process.env.INVENTORY_SHEET_ID)

    const inventoryData = await googleSheetsService.getInventoryData()
    console.log("API: Inventory data fetched successfully, items:", inventoryData.length)

    return NextResponse.json(inventoryData)
  } catch (error) {
    console.error("API Error fetching inventory:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch inventory data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { barcode, updates } = await request.json()
    const success = await googleSheetsService.updateInventoryItem(barcode, updates)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to update item" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating inventory:", error)
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 })
  }
}
