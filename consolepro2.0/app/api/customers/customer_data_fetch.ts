import { NextResponse } from 'next/server';
import { readGoogleSheet } from '@/lib/googleSheetsReader';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId');
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 });
  }
  const sheetId = process.env.GOOGLE_SPREADSHEET_ID as string;
  const range = 'Customers!A:W';
  const allCustomers = await readGoogleSheet(sheetId, range);
  // Skip header row and find all rows matching the customer_id
  const customerRows = (allCustomers || []).slice(1).filter(
    (row: any[]) => row[0] === customerId
  );
  return NextResponse.json(customerRows);
} 