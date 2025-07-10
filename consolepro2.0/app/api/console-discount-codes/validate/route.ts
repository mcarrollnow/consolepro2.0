import { NextRequest, NextResponse } from 'next/server';
import { ConsoleDiscountService } from '@/lib/discountService';

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();
    
    if (!code || typeof orderTotal !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: code, orderTotal' },
        { status: 400 }
      );
    }

    if (orderTotal < 0) {
      return NextResponse.json(
        { success: false, error: 'Order total must be positive' },
        { status: 400 }
      );
    }

    const validationResult = await ConsoleDiscountService.validateDiscountCode(code, orderTotal);
    
    return NextResponse.json({
      success: true,
      data: validationResult
    });
  } catch (error) {
    console.error('Error validating console discount code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate discount code' },
      { status: 500 }
    );
  }
} 