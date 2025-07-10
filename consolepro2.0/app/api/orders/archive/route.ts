import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // 1. Get all active orders
    const activeOrders = await googleSheetsService.getOrdersData();
    const order = activeOrders.find((o) => o.orderId === orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Append to Archived Orders
    await googleSheetsService.appendToArchivedOrders(order);

    // 3. Delete from Orders
    await googleSheetsService.deleteOrderFromOrdersSheet(orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error archiving order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 