export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount in dollars
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
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  description?: string;
}

export interface ApplyDiscountRequest {
  code: string;
  orderTotal: number;
  customerEmail: string;
} 