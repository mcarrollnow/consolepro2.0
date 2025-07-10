import { NextRequest, NextResponse } from 'next/server'

// Mock discount code data using actual inventory barcodes
const NBAPRIL_DISCOUNT = {
  code: 'NBAPRIL',
  type: 'price_override' as const,
  startDate: '2024-01-01',
  endDate: '2025-12-31',
  usageLimit: 1000,
  usageCount: 0,
  isActive: true,
  applicableProducts: [
    'GGG5817RX', 'GGG58135DK', 'GGG5814RX', // BPC-157 variants
    'LYVT56YL', 'LYVT59YL', // GHRP-2 variants
    'FFH39467DK', // AOD-9604 2mg
    'MTK9342NL', // HCG 5000iu
    'RVPEQCFFE6-53AS', // Melanotan 2 10mg
    'JGMXKOXTE54PU', // Epithalon 10mg
    'YYCQRGUSRPTKO3-67QK', 'YYCQRGUSRPTKO3-0DK', // Thymosin Alpha-1
    'YYCQXZUNE', // Thymulin 10mg
    'XVVQRFQQZR6PU', 'XVVQRFQQZR9PU', // Sermorelin variants
    'YVWEPCDJCMR5AS', 'YVWEPCDJCMR8AS', 'YVWEPCDJCMR44YL', // Tesamorelin variants
    'XVQEJZGYZHI8AS', 'XVQEJZGYZHI44YL', // Semaglutide variants
    'YZVDHDMYZHI8AS', 'YZVDHDMYZHI44YL', // Tirzepatide variants
    'HRKVLZUSKMHH9YL', // Cagrilintide 5mg
    'SRH934YL', // NAD+ 500mg
    'RFXWF52RX', // MOTS-C 10mg
    'LYOGX92RX', 'LYOGX525DK', // GHK-Cu variants
    'PZWWSSBYZR53-9YL', // Kisspeptin-10 5mg
    'UK58452RX', 'UK5849YL', // PT-141 variants
    'XVPEQY7RX', // Selank 5mg
    'UVKQJT', // PEG-MGF
    'FUMTRHUIV54PU' // Adipotide 10mg
  ],
  quantityPriceTiers: [
    {
      barcode: 'GGG5817RX', // BPC-157 5mg
      tiers: [
        { minQuantity: 1, maxQuantity: 9, price: 45 },
        { minQuantity: 10, maxQuantity: 999, price: 40 }
      ]
    },
    {
      barcode: 'GGG58135DK', // BPC-157 10mg
      tiers: [
        { minQuantity: 1, maxQuantity: 9, price: 80 },
        { minQuantity: 10, maxQuantity: 999, price: 75 }
      ]
    },
    {
      barcode: 'LYVT56YL', // GHRP-2 2mg
      tiers: [
        { minQuantity: 1, maxQuantity: 9, price: 35 },
        { minQuantity: 10, maxQuantity: 999, price: 30 }
      ]
    },
    {
      barcode: 'LYVT59YL', // GHRP-2 5mg
      tiers: [
        { minQuantity: 1, maxQuantity: 9, price: 50 },
        { minQuantity: 10, maxQuantity: 999, price: 45 }
      ]
    },
    {
      barcode: 'FFH39467DK', // AOD-9604 2mg
      tiers: [
        { minQuantity: 1, maxQuantity: 9, price: 45 },
        { minQuantity: 10, maxQuantity: 999, price: 40 }
      ]
    },
    {
      barcode: 'XVQEJZGYZHI8AS', // Semaglutide 5mg
      tiers: [
        { minQuantity: 1, maxQuantity: 999, price: 115 } // No bulk discount
      ]
    },
    {
      barcode: 'YZVDHDMYZHI8AS', // Tirzepatide 5mg
      tiers: [
        { minQuantity: 1, maxQuantity: 999, price: 125 } // No bulk discount
      ]
    },
    {
      barcode: 'YZVDHDMYZHI44YL', // Tirzepatide 10mg
      tiers: [
        { minQuantity: 1, maxQuantity: 999, price: 135 } // No bulk discount
      ]
    }
    // Add more products as needed for testing
  ]
}

function calculateDiscountedPrice(barcode: string, quantity: number, originalPrice: number) {
  if (NBAPRIL_DISCOUNT.type !== 'price_override') {
    return originalPrice
  }

  // Check if barcode is in applicable products
  if (!NBAPRIL_DISCOUNT.applicableProducts.includes(barcode)) {
    return originalPrice
  }

  // Find the product's pricing tiers by barcode
  const productTiers = NBAPRIL_DISCOUNT.quantityPriceTiers.find(
    p => p.barcode === barcode
  )

  if (!productTiers) {
    return originalPrice
  }

  // Find the applicable tier based on quantity
  const applicableTier = productTiers.tiers.find(
    tier => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
  )

  if (!applicableTier) {
    return originalPrice
  }

  return applicableTier.price
}

export async function POST(request: NextRequest) {
  try {
    const { barcode, quantity, originalPrice, discountCode } = await request.json()

    if (discountCode !== 'NBAPRIL') {
      return NextResponse.json({
        success: false,
        message: 'Invalid discount code'
      }, { status: 400 })
    }

    // Check if discount is active and within date range
    const now = new Date()
    const start = new Date(NBAPRIL_DISCOUNT.startDate)
    const end = new Date(NBAPRIL_DISCOUNT.endDate)

    if (!NBAPRIL_DISCOUNT.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Discount code is not active'
      }, { status: 400 })
    }

    if (now < start || now > end) {
      return NextResponse.json({
        success: false,
        message: 'Discount code is not valid for this date range'
      }, { status: 400 })
    }

    const discountedPrice = calculateDiscountedPrice(barcode, quantity, originalPrice)
    const savings = originalPrice - discountedPrice

    return NextResponse.json({
      success: true,
      originalPrice,
      discountedPrice,
      savings,
      discountType: 'price_override',
      barcode,
      message: `NBAPRIL pricing applied: $${discountedPrice} per unit (${quantity >= 10 ? 'Kit price' : 'Single price'})`
    })

  } catch (error) {
    console.error('Error processing discount:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing discount code'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    discountCode: NBAPRIL_DISCOUNT,
    availableProducts: NBAPRIL_DISCOUNT.applicableProducts,
    message: 'NBAPRIL discount code details - now using inventory barcodes'
  })
} 