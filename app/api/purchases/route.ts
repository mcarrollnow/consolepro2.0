import { NextResponse } from "next/server"
import { googleSheetsService } from "@/lib/google-sheets"

export async function GET() {
  const sheets = googleSheetsService
  const purchases = await sheets.getPurchasesData()
  return NextResponse.json(purchases)
}

export async function POST(req: Request) {
  const sheets = googleSheetsService
  const body = await req.json()
  const { barcode, quantity, timestamp } = body
  const result = await sheets.addPurchase({ barcode, quantity, timestamp })
  return NextResponse.json({ success: true, result })
} 