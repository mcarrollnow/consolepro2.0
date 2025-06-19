import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET() {
  try {
    // For now, we'll use a placeholder method - you can extend googleSheetsService to add getB2BRequestsData()
    // This would read from a B2B requests sheet in your Google Sheets
    const b2bRequestsData = await googleSheetsService.getB2BRequestsData()
    return NextResponse.json(b2bRequestsData)
  } catch (error) {
    console.error("Error fetching B2B requests:", error)
    return NextResponse.json({ error: "Failed to fetch B2B requests data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json()
    
    // In a real app, this would save to Google Sheets or database
    const newRequest = {
      id: `B2B-${Date.now()}`,
      ...requestData,
      date: new Date().toISOString(),
      status: "Pending Review"
    }

    return NextResponse.json(newRequest)
  } catch (error) {
    console.error("Error creating B2B request:", error)
    return NextResponse.json({ error: "Failed to create B2B request" }, { status: 500 })
  }
} 