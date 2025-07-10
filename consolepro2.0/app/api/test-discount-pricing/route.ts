import { NextRequest, NextResponse } from 'next/server'

// Mock inventory data with NBAPRIL pricing columns
const MOCK_INVENTORY = [
  {
    barcode: 'GGG5817RX',
    product: 'BPC-157 5 mg',
    salePrice: '$60.00',
    NBAPRIL_Single_Price: '$45.00',
    NBAPRIL_Kit_Price: '$40.00'
  },
  {
    barcode: 'GGG58135DK', 
    product: 'BPC-157 10 mg',
    salePrice: '$90.00',
    NBAPRIL_Single_Price: '$80.00',
    NBAPRIL_Kit_Price: '$75.00'
  },
  {
    barcode: 'LYVT59YL',
    product: 'GHRP-2 5mg', 
    salePrice: '$65.00',
    NBAPRIL_Single_Price: '$50.00',
    NBAPRIL_Kit_Price: '$45.00'
  },
  {
    barcode: 'XVQEJZGYZHI8AS',
    product: 'Semaglutide 5mg',
    salePrice: '$140.00', 
    NBAPRIL_Single_Price: '$115.00',
    // No kit price - single pricing only
  },
  {
    barcode: 'TEST123',
    product: 'Test Product',
    salePrice: '$50.00',
    // No NBAPRIL pricing - should return original price
  }
]

interface DiscountPricingRequest {
  barcode: string
  quantity: number
  discountCode: string
}

export async function POST(request: NextRequest) {
  try {
    const { barcode, quantity, discountCode }: DiscountPricingRequest = await request.json()

    if (!barcode || !quantity || !discountCode) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: barcode, quantity, discountCode'
      }, { status: 400 })
    }

    // Find the product in mock data
    const product = MOCK_INVENTORY.find(item => item.barcode === barcode)
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: `Product with barcode ${barcode} not found in test data`
      }, { status: 404 })
    }

    // Get the original sale price
    const originalPrice = parseFloat(product.salePrice.replace('$', '').replace(',', ''))

    // Determine which pricing columns to check based on discount code and quantity
    const singlePriceColumn = `${discountCode}_Single_Price` as keyof typeof product
    const kitPriceColumn = `${discountCode}_Kit_Price` as keyof typeof product
    
    // Check if the product has discount pricing set
    const singlePrice = product[singlePriceColumn] as string | undefined
    const kitPrice = product[kitPriceColumn] as string | undefined

    let discountedPrice = originalPrice
    let pricingTier = 'Original'
    
    if (quantity >= 10 && kitPrice) {
      // Use kit pricing for 10+ units
      discountedPrice = parseFloat(kitPrice.replace('$', '').replace(',', ''))
      pricingTier = 'Kit'
    } else if (quantity >= 1 && singlePrice) {
      // Use single pricing for 1-9 units
      discountedPrice = parseFloat(singlePrice.replace('$', '').replace(',', ''))
      pricingTier = 'Single'
    }

    const savings = originalPrice - discountedPrice
    const isDiscountApplied = savings > 0

    return NextResponse.json({
      success: true,
      barcode,
      productName: product.product,
      quantity,
      discountCode,
      originalPrice,
      discountedPrice,
      savings,
      pricingTier,
      isDiscountApplied,
      availableColumns: {
        singlePrice: singlePrice || 'Not set',
        kitPrice: kitPrice || 'Not set'
      },
      message: isDiscountApplied 
        ? `${discountCode} pricing applied: $${discountedPrice} per unit (${pricingTier} price)`
        : `No ${discountCode} pricing set for this product`
    })

  } catch (error) {
    console.error('Error processing discount pricing:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing discount pricing',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test Discount Pricing API - Mock Data Version',
    description: 'Tests discount pricing logic with mock inventory data',
    availableProducts: MOCK_INVENTORY.map(p => ({
      barcode: p.barcode,
      product: p.product,
      hasNBAPRILSingle: !!p.NBAPRIL_Single_Price,
      hasNBAPRILKit: !!p.NBAPRIL_Kit_Price
    })),
    usage: {
      endpoint: 'POST /api/test-discount-pricing',
      body: {
        barcode: 'Product barcode (e.g., GGG5817RX)',
        quantity: 'Number of units',
        discountCode: 'Discount code (e.g., NBAPRIL)'
      }
    },
    testExamples: [
      {
        description: 'BPC-157 5mg - Single price',
        request: { barcode: 'GGG5817RX', quantity: 5, discountCode: 'NBAPRIL' },
        expected: '$60 → $45 (Single price)'
      },
      {
        description: 'BPC-157 5mg - Kit price', 
        request: { barcode: 'GGG5817RX', quantity: 15, discountCode: 'NBAPRIL' },
        expected: '$60 → $40 (Kit price)'
      },
      {
        description: 'No discount pricing set',
        request: { barcode: 'TEST123', quantity: 5, discountCode: 'NBAPRIL' },
        expected: '$50 → $50 (No discount)'
      }
    ]
  })
} 