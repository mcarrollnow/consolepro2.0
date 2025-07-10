export interface QuantityPriceTier {
  minQuantity: number;
  price: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'price_override';
  value: number; // percentage (0-100), fixed amount in dollars, or specific price for override
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  // New fields for price override functionality
  applicableProducts?: string[]; // Array of barcodes this discount applies to
  overridePrices?: { [barcode: string]: number }; // Specific prices for each product
  // New field for quantity-based pricing
  quantityPriceTiers?: { [barcode: string]: QuantityPriceTier[] }; // Quantity-based pricing tiers
}

export interface DiscountCodeUsage {
  id: string;
  discountCodeId: string;
  orderCode: string;
  customerEmail: string;
  discountAmount: number;
  orderTotal: number;
  usedAt: Date;
}

export interface DiscountValidationResult {
  isValid: boolean;
  discountAmount: number;
  message: string;
  discountCode?: DiscountCode;
}

export interface CreateDiscountCodeRequest {
  code: string;
  type: 'percentage' | 'fixed' | 'price_override';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  description?: string;
  // New fields for price override
  applicableProducts?: string[];
  overridePrices?: { [barcode: string]: number };
  // New field for quantity-based pricing
  quantityPriceTiers?: { [barcode: string]: QuantityPriceTier[] };
}

export interface ApplyDiscountRequest {
  code: string;
  orderTotal: number;
  customerEmail: string;
}