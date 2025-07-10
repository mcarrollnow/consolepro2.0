import { NextRequest, NextResponse } from 'next/server'

// Product name mapping from Google Sheets to inventory barcodes
const PRODUCT_NAME_TO_BARCODE: { [key: string]: string } = {
  'Adipotide - 10 MG': 'FUMTRHUIV54PU',
  'AOD-9604 2mg': 'FFH39467DK',
  'BPC 157 10mg': 'GGG58135DK', 
  'BPC 157 2mg': 'GGG5814RX',
  'BPC 157 5mg': 'GGG5817RX',
  'Cagrilintide 10mg': 'HRKVLZUSKMHH52RX',
  'Cagrilintide 5mg': 'HRKVLZUSKMHH9YL',
  'CJC-1295 WITH DAC 2mg': 'HAG5537BZXLGOO7DK',
  'CJC-1295 with DAC 5mg': 'HAG5537BZXLGOO0DK',
  'CJC-1295 without DAC 10mg': 'HAG5537BZXLRIFIRG53AS',
  'CJC-1295 without DAC 2mg': 'HAG5537BZXLRIFIRG6PU',
  'CJC-1295 without DAC 5mg': 'HAG5537BZXLRIFIRG9PU',
  'DSIP (Delta Sleep-Inducing Peptide) 5mg': 'IJMT8AS',
  'Epithalon 10mg': 'JGMXKOXTE54PU',
  'GHK-Cu 100mg': 'LYOGX525DK',
  'GHK-Cu 50mg': 'LYOGX92RX',
  'GHRP-2 - 2mg': 'LYVT56YL',
  'GHRP-2 5mg': 'LYVT59YL',
  'HCG 5,000iu': 'MTK9342NL',
  'Hexarelin 2mg': 'MVBEUSXNE6QJ',
  'Hexarelin 5mg': 'MVBEUSXNE9QJ',
  'HMG 75iu/vial': 'MDK18WG',
  'IGF-1 LR3 .1mg': 'NXJ5OF5.6DK',
  'IGF-1 LR3 1mg': 'NXJ5OF56DK',
  'Ipamorelin 10mg': 'NGEQRFQQZR53AS',
  'Ipamorelin 2mg': 'NGEQRFQQZR6PU',
  'Ipamorelin 5mg': 'NGEQRFQQZR9PU',
  'Kisspeptin-10 5mg': 'PZWWSSBYZR53-9YL',
  'Melanotan 2 10mg': 'RVPEQCFFE6-53AS',
  'MOTS-C 10mg': 'RFXWF52RX',
  'NAD+ 500mg': 'SRH934YL',
  'Oxytocin Acetate - 2mg': 'TOCXRQUSRGIWOFJ9QK',
  'PEG-MGF': 'UVKQJT',
  'PT-141 10mg': 'UK58452RX',
  'PT-141 5mg': 'UK5849YL',
  'Retatrutide 10 MG': 'WVXEWFGYZHI44YL',
  'Selank 5mg': 'XVPEQY7RX',
  'Semaglutide 10mg': 'XVQEJZGYZHI44YL',
  'Semaglutide 2mg': 'XVQEJZGYZHI5AS',
  'Semaglutide 5mg': 'XVQEJZGYZHI8AS',
  'Semax 10mg': 'XVQEA52RX',
  'Sermorelin 2mg': 'XVVQRFQQZR6PU',
  'Sermorelin 5mg': 'XVVQRFQQZR9PU',
  'Snap-8 10mg': 'XEET152RX',
  'SS-31 10mg': 'XJ75-44YL',
  'SS-31 50mg': 'XJ75-84YL',
  'TB-500 10mg': 'YS943-52RX',
  'TB-500 2mg': 'YS943-6YL',
  'TB-500 5mg': 'YS943-9YL',
  'Tesamorelin 10 mg': 'YVWEPCDJCMR44YL',
  'Tesamorelin 2 mg': 'YVWEPCDJCMR5AS',
  'Tesamorelin 5 mg': 'YVWEPCDJCMR8AS',
  'Thymosin alpha 1 - 10 MG': 'YYCQRGUSRPTKO3-67QK',
  'Thymosin alpha 1 - 5 MG': 'YYCQRGUSRPTKO3-0DK',
  'Thymulin': 'YYCQXZUNE',
  'Tirzepatide 10 mg': 'YZVDHDMYZHI44YL',
  'Tirzepatide 15 mg': 'YZVDHDMYZHI49YL',
  'Tirzepatide 30 mg': 'YZVDHDMYZHI64YL',
  'Tirzepatide 5mg': 'YZVDHDMYZHI8AS',
  'Tirzepatide 60 mg': 'YZVDHDMYZHI94YL'
}

// Mock discount codes data based on your CSV structure
const MOCK_DISCOUNT_DATA = {
  headers: [
    'ID', 'Code', 'Type', 'Value', 'Min Order Amount', 'Max Discount', 'Usage Limit', 'Used Count', 
    'Valid From', 'Valid Until', 'Is Active', 'Description', 'Created By', 'Created At', 'Updated At', '',
    'Adipotide - 10 MG', 'AOD-9604 2mg', 'BPC 157 10mg', 'BPC 157 2mg', 'BPC 157 5mg', 'Cagrilintide 10mg', 
    'Cagrilintide 5mg', 'CJC-1295 WITH DAC 2mg', 'CJC-1295 with DAC 5mg', 'CJC-1295 without DAC 10mg', 
    'CJC-1295 without DAC 2mg', 'CJC-1295 without DAC 5mg', 'DSIP (Delta Sleep-Inducing Peptide) 5mg', 
    'Epithalon 10mg', 'GHK-Cu 100mg', 'GHK-Cu 50mg', 'GHRP-2 - 2mg', 'GHRP-2 5mg', 'HCG 5', 'Hexarelin 2mg', 
    'Hexarelin 5mg', 'HMG 75iu/vial', 'IGF-1 LR3 .1mg', 'IGF-1 LR3 1mg', 'Ipamorelin 10mg', 'Ipamorelin 2mg', 
    'Ipamorelin 5mg', 'Kisspeptin-10 5mg', 'Melanotan 2 10mg', 'MOTS-C 10mg', 'NAD+ 500mg', 'Oxytocin Acetate - 2mg', 
    'PEG-MGF', 'PT-141 10mg', 'PT-141 5mg', 'Retatrutide 10 MG', 'Selank 5mg', 'Semaglutide 10mg', 'Semaglutide 2mg', 
    'Semaglutide 5mg', 'Semax 10mg', 'Sermorelin 2mg', 'Sermorelin 5mg', 'Snap-8 10mg', 'SS-31 10mg', 'SS-31 50mg', 
    'TB-500 10mg', 'TB-500 2mg', 'TB-500 5mg', 'Tesamorelin 10 mg', 'Tesamorelin 2 mg', 'Tesamorelin 5 mg', 
    'Thymosin alpha 1 - 10 MG', 'Thymosin alpha 1 - 5 MG', 'Thymulin', 'Tirzepatide 10 mg', 'Tirzepatide 15 mg', 
    'Tirzepatide 30 mg', 'Tirzepatide 5mg', 'Tirzepatide 60 mg'
  ],
  // Multiple discount codes - NBAPRIL, WELCOME10, etc.
  discountRows: [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      isActive: true,
      prices: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] // No peptide prices = use percentage logic
    },
    {
      code: 'NBAPRIL', 
      type: 'price_override',
      value: 0,
      isActive: true,
      prices: ['50', '45', '80', '35', '45', '50', '26', '45', '55', '65', '35', '50', '35', '35', '40', '35', '35', 
               '50', '45', '35', '45', '25', '35', '65', '35', '25', '35', '35', '25', '35', '45', '35', '45', '30', 
               '18', '155', '35', '135', '30', '115', '35', '35', '45', '35', '35', '56', '65', '25', '45', '65', 
               '35', '55', '65', '45', '35', '135', '125', '145', '115', '240']
    }
  ]
}

interface UniversalDiscountRequest {
  barcode: string
  quantity: number
  discountCode: string
  originalPrice?: number
}

function calculateDiscountPrice(discountRow: any, originalPrice: number, quantity: number, productColumnIndex: number): { finalPrice: number, discountType: string, savings: number } {
  // PRIORITY 1: Peptide column price ALWAYS trumps everything else
  if (productColumnIndex >= 0 && discountRow.prices[productColumnIndex] && discountRow.prices[productColumnIndex] !== '') {
    const peptidePrice = parseFloat(discountRow.prices[productColumnIndex])
    if (!isNaN(peptidePrice) && peptidePrice > 0) {
      const savings = Math.max(0, originalPrice - peptidePrice)
      return {
        finalPrice: peptidePrice,
        discountType: 'PEPTIDE_OVERRIDE',
        savings
      }
    }
  }

  // PRIORITY 2: Standard discount logic (percentage, fixed, etc.)
  switch (discountRow.type) {
    case 'percentage':
      const percentageDiscount = (originalPrice * discountRow.value) / 100
      const percentageFinalPrice = originalPrice - percentageDiscount
      return {
        finalPrice: percentageFinalPrice,
        discountType: 'PERCENTAGE',
        savings: percentageDiscount
      }
    
    case 'fixed':
      const fixedSavings = Math.min(discountRow.value, originalPrice)
      return {
        finalPrice: originalPrice - fixedSavings,
        discountType: 'FIXED',
        savings: fixedSavings
      }
    
    case 'price_override':
      // If no peptide price, use original price (no discount)
      return {
        finalPrice: originalPrice,
        discountType: 'NO_OVERRIDE',
        savings: 0
      }
    
    default:
      return {
        finalPrice: originalPrice,
        discountType: 'NONE',
        savings: 0
      }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { barcode, quantity, discountCode, originalPrice }: UniversalDiscountRequest = await request.json()

    if (!barcode || !quantity || !discountCode) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: barcode, quantity, discountCode'
      }, { status: 400 })
    }

    // Find the discount code in our data
    const discountRow = MOCK_DISCOUNT_DATA.discountRows.find(
      row => row.code.toUpperCase() === discountCode.toUpperCase() && row.isActive
    )

    if (!discountRow) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or inactive discount code',
        originalPrice,
        discountedPrice: originalPrice,
        savings: 0
      })
    }

    // Find product name by barcode
    const productName = Object.keys(PRODUCT_NAME_TO_BARCODE).find(
      name => PRODUCT_NAME_TO_BARCODE[name] === barcode
    )

    // Find the product column index in headers
    const productColumnIndex = productName ? MOCK_DISCOUNT_DATA.headers.indexOf(productName) : -1

    // Calculate final price using priority system
    const calculatedOriginalPrice = originalPrice || 60 // Default if not provided
    const discountResult = calculateDiscountPrice(discountRow, calculatedOriginalPrice, quantity, productColumnIndex)

    // Calculate totals
    const totalOriginal = calculatedOriginalPrice * quantity
    const totalDiscounted = discountResult.finalPrice * quantity
    const totalSavings = totalOriginal - totalDiscounted

    return NextResponse.json({
      success: true,
      message: `${discountCode} discount applied successfully`,
      product: productName || 'Unknown Product',
      barcode,
      quantity,
      unitPrice: discountResult.finalPrice,
      originalPrice: calculatedOriginalPrice,
      discountedPrice: discountResult.finalPrice,
      totalOriginal,
      totalDiscounted,
      totalSavings,
      discountCode: discountCode.toUpperCase(),
      discountType: discountResult.discountType,
      priceSource: discountResult.discountType === 'PEPTIDE_OVERRIDE' ? 'Peptide Column Price (Final Override)' : 
                   discountResult.discountType === 'PERCENTAGE' ? `${discountRow.value}% Discount` :
                   discountResult.discountType === 'FIXED' ? `$${discountRow.value} Fixed Discount` :
                   'Original Price (No Discount Applied)',
      unitSavings: discountResult.savings
    })

  } catch (error) {
    console.error('Universal Discount API Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error processing discount'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Universal Discount API - Peptide prices ALWAYS override other discount logic',
    prioritySystem: {
      1: 'Peptide Column Price (HIGHEST PRIORITY - Always used if present)',
      2: 'Standard Discount Logic (percentage, fixed, etc.)',
      3: 'Original Price (if no discounts apply)'
    },
    supportedCodes: MOCK_DISCOUNT_DATA.discountRows.map(row => ({ 
      code: row.code, 
      type: row.type,
      hasPeptidePrices: row.prices.some(price => price && price !== '')
    })),
    example: {
      barcode: 'GGG5817RX',
      quantity: 5,
      discountCode: 'NBAPRIL'
    }
  })
} 