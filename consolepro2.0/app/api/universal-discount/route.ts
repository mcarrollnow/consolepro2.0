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

// Headers from your Google Sheets structure
const DISCOUNT_SHEET_HEADERS = [
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
]

interface UniversalDiscountRequest {
  barcode: string
  quantity: number
  discountCode: string
  originalPrice?: number
  // For future Google Sheets integration
  discountRowData?: string[] // CSV row data from Google Sheets
}

interface DiscountResult {
  finalPrice: number
  discountType: string
  savings: number
  appliedRule: string
}

function parseDiscountRow(rowData: string[]): any {
  if (!rowData || rowData.length < 16) return null
  
  return {
    id: rowData[0],
    code: rowData[1],
    type: rowData[2],
    value: parseFloat(rowData[3]) || 0,
    minOrderAmount: parseFloat(rowData[4]) || 0,
    maxDiscount: parseFloat(rowData[5]) || 0,
    usageLimit: parseInt(rowData[6]) || 0,
    usedCount: parseInt(rowData[7]) || 0,
    validFrom: rowData[8],
    validUntil: rowData[9],
    isActive: rowData[10]?.toUpperCase() === 'TRUE',
    description: rowData[11],
    peptidePrices: rowData.slice(16) // All peptide pricing columns
  }
}

function calculateFinalPrice(
  discountData: any, 
  originalPrice: number, 
  quantity: number, 
  productColumnIndex: number
): DiscountResult {
  
  // 🥇 HIGHEST PRIORITY: Peptide Column Price (ALWAYS wins if present)
  if (productColumnIndex >= 0 && discountData.peptidePrices && discountData.peptidePrices[productColumnIndex - 16]) {
    const peptidePrice = parseFloat(discountData.peptidePrices[productColumnIndex - 16])
    if (!isNaN(peptidePrice) && peptidePrice > 0) {
      const savings = Math.max(0, originalPrice - peptidePrice)
      return {
        finalPrice: peptidePrice,
        discountType: 'PEPTIDE_OVERRIDE',
        savings,
        appliedRule: `Peptide Column Price: $${peptidePrice} (FINAL - Overrides all other discounts)`
      }
    }
  }

  // 🥈 SECOND PRIORITY: Standard Discount Logic
  switch (discountData.type?.toLowerCase()) {
    case 'percentage':
      const percentageDiscount = (originalPrice * discountData.value) / 100
      const discountedPrice = originalPrice - percentageDiscount
      return {
        finalPrice: discountedPrice,
        discountType: 'PERCENTAGE',
        savings: percentageDiscount,
        appliedRule: `${discountData.value}% discount applied`
      }
    
    case 'fixed':
      const fixedSavings = Math.min(discountData.value, originalPrice)
      return {
        finalPrice: originalPrice - fixedSavings,
        discountType: 'FIXED',
        savings: fixedSavings,
        appliedRule: `$${discountData.value} fixed discount applied`
      }
    
    case 'price_override':
      // If price_override but no peptide price, no discount applies
      return {
        finalPrice: originalPrice,
        discountType: 'NO_OVERRIDE',
        savings: 0,
        appliedRule: 'Price override type but no peptide price set - no discount applied'
      }
    
    default:
      return {
        finalPrice: originalPrice,
        discountType: 'NONE',
        savings: 0,
        appliedRule: 'No valid discount type found'
      }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { barcode, quantity, discountCode, originalPrice, discountRowData }: UniversalDiscountRequest = body

    if (!barcode || !quantity || !discountCode) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: barcode, quantity, discountCode'
      }, { status: 400 })
    }

    // For now, use mock data. In production, this would come from Google Sheets API
    let mockDiscountData = discountRowData ? parseDiscountRow(discountRowData) : null
    
    // If no real data provided, fallback to mock data for testing
    if (!mockDiscountData) {
      // Mock NBAPRIL data from your actual sheet
      const mockNBAPRIL = [
        'console_disc_1751933058041_k12mvt4oq', 'NBAPRIL', 'price_override', '0', '', '', '1000', '0', 
        '2025-04-01T00:00:00.000Z', '2026-04-30T00:00:00.000Z', 'TRUE', 
        'NBAPRIL Special Pricing - Catalog prices with quantity discounts (10+ units get kit pricing)', 
        'console_admin', '2025-07-08T00:04:18.041Z', '2025-07-08T00:04:18.041Z', '[]',
        '50', '45', '80', '35', '45', '50', '26', '45', '55', '65', '35', '50', '35', '35', '40', '35', '35', 
        '50', '45', '35', '45', '25', '35', '65', '35', '25', '35', '35', '25', '35', '45', '35', '45', '30', 
        '18', '155', '35', '135', '30', '115', '35', '35', '45', '35', '35', '56', '65', '25', '45', '65', 
        '35', '55', '65', '45', '35', '135', '125', '145', '115', '240'
      ]

      const mockWELCOME10 = [
        'disc_1703123456789_abc123def', 'WELCOME10', 'percentage', '10', '50', '100', '50', '0',
        '2024-01-01T00:00:00.000Z', '2024-04-01T23:59:59.999Z', 'TRUE', 'Welcome discount - 10% off orders over $50',
        'admin', '2024-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z', '',
        ...Array(60).fill('') // No peptide prices for WELCOME10
      ]

      if (discountCode.toUpperCase() === 'NBAPRIL') {
        mockDiscountData = parseDiscountRow(mockNBAPRIL)
      } else if (discountCode.toUpperCase() === 'WELCOME10') {
        mockDiscountData = parseDiscountRow(mockWELCOME10)
      }
    }

    if (!mockDiscountData || !mockDiscountData.isActive) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or inactive discount code',
        originalPrice,
        discountedPrice: originalPrice,
        savings: 0
      })
    }

    // Find product by barcode
    const productName = Object.keys(PRODUCT_NAME_TO_BARCODE).find(
      name => PRODUCT_NAME_TO_BARCODE[name] === barcode
    )

    // Find product column index
    const productColumnIndex = productName ? DISCOUNT_SHEET_HEADERS.indexOf(productName) : -1

    // Calculate final price using priority system
    const calculatedOriginalPrice = originalPrice || 60 // Default fallback
    const discountResult = calculateFinalPrice(mockDiscountData, calculatedOriginalPrice, quantity, productColumnIndex)

    // Calculate totals
    const totalOriginal = calculatedOriginalPrice * quantity
    const totalDiscounted = discountResult.finalPrice * quantity
    const totalSavings = totalOriginal - totalDiscounted

    return NextResponse.json({
      success: true,
      message: `${discountCode.toUpperCase()} discount processed successfully`,
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
      appliedRule: discountResult.appliedRule,
      unitSavings: discountResult.savings,
      // Additional metadata
      priorityUsed: discountResult.discountType === 'PEPTIDE_OVERRIDE' ? 
        '🥇 HIGHEST PRIORITY: Peptide Column Price' : 
        '🥈 SECOND PRIORITY: Standard Discount Logic',
      discountMetadata: {
        type: mockDiscountData.type,
        value: mockDiscountData.value,
        usageCount: mockDiscountData.usedCount,
        usageLimit: mockDiscountData.usageLimit,
        hasPeptidePrice: productColumnIndex >= 16 && mockDiscountData.peptidePrices && 
                         mockDiscountData.peptidePrices[productColumnIndex - 16] && 
                         mockDiscountData.peptidePrices[productColumnIndex - 16] !== ''
      }
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
    message: '🏆 Universal Discount API - Peptide Column Pricing System',
    prioritySystem: {
      '🥇 HIGHEST PRIORITY': 'Peptide Column Price (ALWAYS used if number entered in product column)',
      '🥈 SECOND PRIORITY': 'Standard Discount Logic (percentage, fixed amount, etc.)',
      '🥉 LOWEST PRIORITY': 'Original Price (no discount applied)'
    },
    howItWorks: {
      peptideOverride: 'If you enter ANY number in a peptide column, that price ALWAYS wins',
      standardDiscounts: 'If no peptide price, uses percentage/fixed discount logic',
      noDiscount: 'If no peptide price and no valid discount, uses original price'
    },
    supportedProducts: Object.keys(PRODUCT_NAME_TO_BARCODE).length,
    exampleRequests: [
      {
        description: 'NBAPRIL with peptide override',
        request: { barcode: 'GGG5817RX', quantity: 5, discountCode: 'NBAPRIL', originalPrice: 60 },
        expectedResult: 'Uses $45 from peptide column (HIGHEST PRIORITY)'
      },
      {
        description: 'WELCOME10 percentage discount',
        request: { barcode: 'GGG5817RX', quantity: 5, discountCode: 'WELCOME10', originalPrice: 60 },
        expectedResult: 'Uses 10% discount = $54 (SECOND PRIORITY)'
      }
    ]
  })
} 