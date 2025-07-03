import { NextRequest, NextResponse } from 'next/server';
import { ConsoleDiscountService } from '@/lib/discountService';

export async function POST(req: NextRequest) {
  try {
    const { codeId, isActive } = await req.json();
    
    if (!codeId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: codeId, isActive' },
        { status: 400 }
      );
    }

    const result = await ConsoleDiscountService.toggleDiscountCodeStatus(codeId, isActive);
    
    return NextResponse.json({
      success: true,
      data: { isActive },
      message: `Discount code ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling console discount code status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle discount code status' },
      { status: 500 }
    );
  }
} 