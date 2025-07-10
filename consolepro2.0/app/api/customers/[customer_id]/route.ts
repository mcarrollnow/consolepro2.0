import { NextResponse } from "next/server";
import { googleSheetsService } from "@/lib/google-sheets";

export async function GET(request, { params }) {
  const { customer_id } = params;
  try {
    const customers = await googleSheetsService.getCustomersData();
    const customer = customers.find((c) => c.customer_id === customer_id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "Failed to fetch customer data" }, { status: 500 });
  }
} 