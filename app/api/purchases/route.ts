import { NextResponse } from "next/server"
import { getGoogleSheetsService } from "@/lib/google-sheets"

export async function GET() {
  const sheets = getGoogleSheetsService()
  const purchases = await sheets.getPurchasesData()
  return NextResponse.json(purchases)
}

export async function POST(req: Request) {
  const sheets = getGoogleSheetsService()
  const body = await req.json()
  const { barcode, quantity, timestamp } = body
  const result = await sheets.addPurchase({ barcode, quantity, timestamp })
  return NextResponse.json({ success: true, result })
} 