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