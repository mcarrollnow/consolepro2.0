import { NextResponse } from 'next/server';
import { ConsoleDiscountService } from '@/lib/discountService';
import { CreateDiscountCodeRequest } from '@/lib/types/discount';

export async function POST() {
  try {
    // Define the NBAPRIL discount code with quantity-based pricing tiers using actual inventory barcodes
    // Single unit prices for 1-9 units, kit prices for 10+ units
    const quantityPriceTiers = {
      // BPC-157 variants
      "GGG5814RX": [ // BPC-157 2mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "GGG5817RX": [ // BPC-157 5mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      "GGG58135DK": [ // BPC-157 10mg
        { minQuantity: 1, price: 80.00 },
        { minQuantity: 10, price: 75.00 }
      ],
      
      // GHRP-2 variants
      "LYVT56YL": [ // GHRP-2 2mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "LYVT59YL": [ // GHRP-2 5mg
        { minQuantity: 1, price: 50.00 },
        { minQuantity: 10, price: 45.00 }
      ],
      
      // AOD-9604
      "FFH39467DK": [ // AOD-9604 2mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      
      // Hexarelin variants
      "MVBEUSXNE6QJ": [ // Hexarelin 2mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "MVBEUSXNE9QJ": [ // Hexarelin 5mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      
      // Ipamorelin variants
      "NGEQRFQQZR6PU": [ // Ipamorelin 2mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "NGEQRFQQZR9PU": [ // Ipamorelin 5mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      "NGEQRFQQZR53AS": [ // Ipamorelin 10mg
        { minQuantity: 1, price: 55.00 },
        { minQuantity: 10, price: 50.00 }
      ],
      
      // CJC-1295 variants
      "HAG5537BZXLGOO7DK": [ // CJC-1295 WITH DAC 2mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      "HAG5537BZXLGOO0DK": [ // CJC-1295 with DAC 5mg
        { minQuantity: 1, price: 55.00 },
        { minQuantity: 10, price: 50.00 }
      ],
      
      // IGF-1 LR3
      "NXJ5OF56DK": [ // IGF-1 LR3 1mg
        { minQuantity: 1, price: 65.00 },
        { minQuantity: 10, price: 60.00 }
      ],
      
      // PEG-MGF
      "UVKQJT": [ // PEG-MGF
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      
      // Sermorelin variants
      "XVVQRFQQZR6PU": [ // Sermorelin 2mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "XVVQRFQQZR9PU": [ // Sermorelin 5mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      
      // Tesamorelin variants
      "YVWEPCDJCMR5AS": [ // Tesamorelin 2mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      "YVWEPCDJCMR8AS": [ // Tesamorelin 5mg
        { minQuantity: 1, price: 55.00 },
        { minQuantity: 10, price: 50.00 }
      ],
      "YVWEPCDJCMR44YL": [ // Tesamorelin 10mg
        { minQuantity: 1, price: 65.00 },
        { minQuantity: 10, price: 60.00 }
      ],
      
      // Thymosin variants
      "YYCQRGUSRPTKO3-0DK": [ // Thymosin Alpha-1 5mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "YYCQRGUSRPTKO3-67QK": [ // Thymosin Alpha-1 10mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      "YS943-6YL": [ // TB-500 2mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "YS943-9YL": [ // TB-500 5mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      
      // Melanotan & PT-141
      "RVPEQCFFE6-53AS": [ // Melanotan 2 10mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "UK58452RX": [ // PT-141 10mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      
      // Oxytocin & Nootropics
      "TOCXRQUSRGIWOFJ9QK": [ // Oxytocin 2mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "XVPEQY7RX": [ // Selank 5mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      
      // Longevity peptides
      "JGMXKOXTE54PU": [ // Epithalon 10mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "LYOGX92RX": [ // GHK-Cu 50mg
        { minQuantity: 1, price: 35.00 },
        { minQuantity: 10, price: 30.00 }
      ],
      "SRH934YL": [ // NAD+ 500mg
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 10, price: 40.00 }
      ],
      
      // Weight loss peptides (single pricing - no bulk discount)
      "XVQEJZGYZHI8AS": [ // Semaglutide 5mg
        { minQuantity: 1, price: 115.00 }
      ],
      "YZVDHDMYZHI8AS": [ // Tirzepatide 5mg
        { minQuantity: 1, price: 125.00 }
      ],
      "YZVDHDMYZHI44YL": [ // Tirzepatide 10mg
        { minQuantity: 1, price: 135.00 }
      ],
      "WVXEWFGYZHI44YL": [ // Retatrutide 10mg
        { minQuantity: 1, price: 155.00 }
      ]
    };

    const discountData: CreateDiscountCodeRequest = {
      code: "NBAPRIL",
      type: "price_override",
      value: 0, // Not used for price override
      quantityPriceTiers: quantityPriceTiers,
      usageLimit: 1000,
      validFrom: "2024-01-01",
      validUntil: "2025-12-31", 
      description: "NBAPRIL Special Pricing - Catalog prices with quantity discounts (10+ units get kit pricing)",
    };

    const discountCode = await ConsoleDiscountService.createDiscountCode(discountData);
    
    const totalProducts = Object.keys(quantityPriceTiers).length;
    
    return NextResponse.json({ 
      success: true, 
      data: discountCode,
      message: `NBAPRIL discount code created with quantity-based pricing for ${totalProducts} products using inventory barcodes`,
      summary: {
        code: discountCode.code,
        type: discountCode.type,
        productsCount: totalProducts,
        pricingStructure: "1-9 units: single price, 10+ units: kit price per unit",
        validFrom: discountCode.validFrom,
        validUntil: discountCode.validUntil,
        usageLimit: discountCode.usageLimit,
        sampleBarcodes: Object.keys(quantityPriceTiers).slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error creating NBAPRIL discount code:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create NBAPRIL discount code', details: error },
      { status: 500 }
    );
  }
} 