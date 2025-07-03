import { NextResponse } from 'next/server';
import { ConsoleDiscountService } from '@/lib/discountService';

export async function GET() {
  try {
    const usageData = await ConsoleDiscountService.getDiscountCodeUsage();
    return NextResponse.json({ success: true, data: usageData });
  } catch (error) {
    console.error('Error fetching console discount code usage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
} 