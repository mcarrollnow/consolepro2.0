import { NextRequest, NextResponse } from 'next/server';
import { ConsoleDiscountService } from '@/lib/discountService';
import { CreateDiscountCodeRequest } from '@/lib/types/discount';

export async function GET() {
  try {
    const discountCodes = await ConsoleDiscountService.getAllDiscountCodes();
    return NextResponse.json({ success: true, data: discountCodes });
  } catch (error) {
    console.error('Error fetching console discount codes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discount codes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: CreateDiscountCodeRequest = await req.json();
    
    // Validate required fields
    if (!data.type || !data.value || !data.usageLimit || !data.validFrom || !data.validUntil) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate value ranges
    if (data.type === 'percentage' && (data.value < 0 || data.value > 100)) {
      return NextResponse.json(
        { success: false, error: 'Percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (data.type === 'fixed' && data.value < 0) {
      return NextResponse.json(
        { success: false, error: 'Fixed discount amount must be positive' },
        { status: 400 }
      );
    }

    // Validate price override specific fields
    if (data.type === 'price_override') {
      if (!data.overridePrices || Object.keys(data.overridePrices).length === 0) {
        return NextResponse.json(
          { success: false, error: 'Price override codes must specify at least one product price' },
          { status: 400 }
        );
      }

      // Validate that all override prices are positive
      for (const [barcode, price] of Object.entries(data.overridePrices)) {
        if (price < 0) {
          return NextResponse.json(
            { success: false, error: `Override price for ${barcode} must be positive` },
            { status: 400 }
          );
        }
      }
    }

    if (data.usageLimit < 1) {
      return NextResponse.json(
        { success: false, error: 'Usage limit must be at least 1' },
        { status: 400 }
      );
    }

    // Validate dates
    const validFrom = new Date(data.validFrom);
    const validUntil = new Date(data.validUntil);
    
    if (isNaN(validFrom.getTime()) || isNaN(validUntil.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (validFrom >= validUntil) {
      return NextResponse.json(
        { success: false, error: 'Valid from date must be before valid until date' },
        { status: 400 }
      );
    }

    const discountCode = await ConsoleDiscountService.createDiscountCode(data);
    
    return NextResponse.json({ 
      success: true, 
      data: discountCode,
      message: 'Console discount code created successfully'
    });
  } catch (error) {
    console.error('Error creating console discount code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create discount code' },
      { status: 500 }
    );
  }
} 