import { NextRequest, NextResponse } from 'next/server'
import { GoogleSheetsService } from '@/lib/google-sheets'

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

    // Initialize Google Sheets service
    const googleSheets = new GoogleSheetsService()
    
    // Get inventory data with discount columns
    const inventoryData = await googleSheets.getInventoryData()
    
    // Find the product by barcode
    const product = inventoryData.find(item => item.barcode === barcode)
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: `Product with barcode ${barcode} not found`
      }, { status: 404 })
    }

    // Get the original sale price
    const originalPrice = parseFloat(product.salePrice?.replace('$', '').replace(',', '') || '0')

    // Determine which pricing columns to check based on discount code and quantity
    const singlePriceColumn = `${discountCode}_Single_Price`
    const kitPriceColumn = `${discountCode}_Kit_Price`
    
    // Check if the product has discount pricing set
    const singlePrice = (product as any)[singlePriceColumn]
    const kitPrice = (product as any)[kitPriceColumn]

    let discountedPrice = originalPrice
    let pricingTier = 'Original'
    
    if (quantity >= 10 && kitPrice) {
      // Use kit pricing for 10+ units
      discountedPrice = parseFloat(kitPrice.replace('$', '').replace(',', '') || '0')
      pricingTier = 'Kit'
    } else if (quantity >= 1 && singlePrice) {
      // Use single pricing for 1-9 units
      discountedPrice = parseFloat(singlePrice.replace('$', '').replace(',', '') || '0')
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
    message: 'Dynamic Discount Pricing API',
    description: 'Reads discount prices from Google Sheets columns',
    usage: {
      endpoint: 'POST /api/discount-pricing',
      body: {
        barcode: 'Product barcode',
        quantity: 'Number of units',
        discountCode: 'Discount code (e.g., NBAPRIL, SUMMER)'
      }
    },
    columnFormat: {
      singlePrice: '{DISCOUNT_CODE}_Single_Price',
      kitPrice: '{DISCOUNT_CODE}_Kit_Price'
    }
  })
} 