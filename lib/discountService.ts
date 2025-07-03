import { DiscountCode, DiscountCodeUsage, DiscountValidationResult, CreateDiscountCodeRequest } from './types/discount';
import { GoogleSheetsService } from './google-sheets';

export class ConsoleDiscountService {
  private static generateId(): string {
    return `console_disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async createDiscountCode(data: CreateDiscountCodeRequest): Promise<DiscountCode> {
    const sheetsService = new GoogleSheetsService();
    const sheets = sheetsService['sheets']; // Access the private sheets property
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables.');
    }

    const discountCode: DiscountCode = {
      id: this.generateId(),
      code: data.code || this.generateCode(),
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount,
      maxDiscount: data.maxDiscount,
      usageLimit: data.usageLimit,
      usedCount: 0,
      validFrom: new Date(data.validFrom),
      validUntil: new Date(data.validUntil),
      isActive: true,
      description: data.description,
      createdBy: 'console_admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into Google Sheets
    const discountRow = [
      discountCode.id,
      discountCode.code,
      discountCode.type,
      discountCode.value,
      discountCode.minOrderAmount || '',
      discountCode.maxDiscount || '',
      discountCode.usageLimit,
      discountCode.usedCount,
      discountCode.validFrom.toISOString(),
      discountCode.validUntil.toISOString(),
      discountCode.isActive ? 'TRUE' : 'FALSE',
      discountCode.description || '',
      discountCode.createdBy,
      discountCode.createdAt.toISOString(),
      discountCode.updatedAt.toISOString(),
    ];

    try {
          await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'DiscountCodes!A:O',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [discountRow] },
    });
    } catch (error: any) {
      // If the sheet doesn't exist, throw a helpful error
      if (error.code === 400 && error.message?.includes('Unable to parse range')) {
        throw new Error('ConsoleDiscountCodes sheet does not exist. Please run the setup first.');
      }
      throw error;
    }

    return discountCode;
  }

  static async validateDiscountCode(code: string, orderTotal: number): Promise<DiscountValidationResult> {
    const sheetsService = new GoogleSheetsService();
    const sheets = sheetsService['sheets'];
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables.');
    }

    try {
      // Get discount code
      const discountResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'DiscountCodes!A:O',
      });

      const discountRows = discountResponse.data.values || [];
      const discountCode = discountRows.find(row => row[1] === code.toUpperCase());

    if (!discountCode) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Invalid discount code.',
      };
    }

    const discount: DiscountCode = {
      id: discountCode[0],
      code: discountCode[1],
      type: discountCode[2] as 'percentage' | 'fixed',
      value: parseFloat(discountCode[3]),
      minOrderAmount: discountCode[4] ? parseFloat(discountCode[4]) : undefined,
      maxDiscount: discountCode[5] ? parseFloat(discountCode[5]) : undefined,
      usageLimit: parseInt(discountCode[6]),
      usedCount: parseInt(discountCode[7]),
      validFrom: new Date(discountCode[8]),
      validUntil: new Date(discountCode[9]),
      isActive: discountCode[10] === 'TRUE',
      description: discountCode[11],
      createdBy: discountCode[12],
      createdAt: new Date(discountCode[13]),
      updatedAt: new Date(discountCode[14]),
    };

    // Check if code is active
    if (!discount.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'This discount code is no longer active.',
      };
    }

    // Check validity period
    const now = new Date();
    if (now < discount.validFrom || now > discount.validUntil) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'This discount code has expired or is not yet valid.',
      };
    }

    // Check usage limit
    if (discount.usedCount >= discount.usageLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'This discount code has reached its usage limit.',
      };
    }

    // Check minimum order amount
    if (discount.minOrderAmount && orderTotal < discount.minOrderAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Minimum order amount of $${discount.minOrderAmount} required for this discount code.`,
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (orderTotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    // Apply maximum discount limit
    if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
      discountAmount = discount.maxDiscount;
    }

    // Ensure discount doesn't exceed order total
    if (discountAmount > orderTotal) {
      discountAmount = orderTotal;
    }

    return {
      isValid: true,
      discountAmount,
      message: `Discount applied: $${discountAmount.toFixed(2)}`,
      discountCode: discount,
    };
    } catch (error: any) {
      // If the sheet doesn't exist, return invalid code
      if (error.code === 400 && error.message?.includes('Unable to parse range')) {
        console.log('ConsoleDiscountCodes sheet does not exist yet. Returning invalid code.');
        return {
          isValid: false,
          discountAmount: 0,
          message: 'Invalid discount code.',
        };
      }
      throw error;
    }
  }

  static async applyDiscountCode(code: string, orderCode: string, customerEmail: string, orderTotal: number, discountAmount: number): Promise<void> {
    const sheetsService = new GoogleSheetsService();
    const sheets = sheetsService['sheets'];
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables.');
    }

    // Record usage
    const usage: DiscountCodeUsage = {
      id: this.generateId(),
      discountCodeId: '', // Will be filled below
      orderCode,
      customerEmail,
      discountAmount,
      orderTotal,
      usedAt: new Date(),
    };

    // Get discount code to update usage count
    const discountResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'DiscountCodes!A:O',
    });

    const discountRows = discountResponse.data.values || [];
    const discountRowIndex = discountRows.findIndex(row => row[1] === code.toUpperCase());

    if (discountRowIndex === -1) {
      throw new Error('Discount code not found.');
    }

    const discountRow = discountRows[discountRowIndex];
    usage.discountCodeId = discountRow[0];

    // Update usage count
    const newUsedCount = parseInt(discountRow[7]) + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `DiscountCodes!H${discountRowIndex + 2}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[newUsedCount]] },
    });

    // Record usage in DiscountCodeUsage sheet
    const usageRow = [
      usage.id,
      usage.discountCodeId,
      usage.orderCode,
      usage.customerEmail,
      usage.discountAmount,
      usage.orderTotal,
      usage.usedAt.toISOString(),
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'DiscountCodeUsage!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [usageRow] },
    });
  }

  static async getAllDiscountCodes(): Promise<DiscountCode[]> {
    const sheetsService = new GoogleSheetsService();
    const sheets = sheetsService['sheets'];
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables.');
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'ConsoleDiscountCodes!A:O',
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) return []; // No data or only header

      return rows.slice(1).map(row => ({
        id: row[0],
        code: row[1],
        type: row[2] as 'percentage' | 'fixed',
        value: parseFloat(row[3]),
        minOrderAmount: row[4] ? parseFloat(row[4]) : undefined,
        maxDiscount: row[5] ? parseFloat(row[5]) : undefined,
        usageLimit: parseInt(row[6]),
        usedCount: parseInt(row[7]),
        validFrom: new Date(row[8]),
        validUntil: new Date(row[9]),
        isActive: row[10] === 'TRUE',
        description: row[11],
        createdBy: row[12],
        createdAt: new Date(row[13]),
        updatedAt: new Date(row[14]),
      }));
    } catch (error: any) {
      // If the sheet doesn't exist, return empty array
      if (error.code === 400 && error.message?.includes('Unable to parse range')) {
        console.log('ConsoleDiscountCodes sheet does not exist yet. Returning empty discount codes.');
        return [];
      }
      throw error;
    }
  }

  static async getDiscountCodeUsage(): Promise<DiscountCodeUsage[]> {
    const sheetsService = new GoogleSheetsService();
    const sheets = sheetsService['sheets'];
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables.');
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'DiscountCodeUsage!A:G',
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) return []; // No data or only header

      return rows.slice(1).map(row => ({
        id: row[0],
        discountCodeId: row[1],
        orderCode: row[2],
        customerEmail: row[3],
        discountAmount: parseFloat(row[4]),
        orderTotal: parseFloat(row[5]),
        usedAt: new Date(row[6]),
      }));
    } catch (error: any) {
      // If the sheet doesn't exist, return empty array
      if (error.code === 400 && error.message?.includes('Unable to parse range')) {
        console.log('ConsoleDiscountCodeUsage sheet does not exist yet. Returning empty usage data.');
        return [];
      }
      throw error;
    }
  }

  static async toggleDiscountCodeStatus(codeId: string, isActive: boolean): Promise<boolean> {
    const sheetsService = new GoogleSheetsService();
    const sheets = sheetsService['sheets'];
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables.');
    }

    // Find the row index for the discount code
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'DiscountCodes!A:O',
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === codeId);

    if (rowIndex === -1) {
      throw new Error('Discount code not found.');
    }

    // Update the Is Active column (column K)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `ConsoleDiscountCodes!K${rowIndex + 1}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[isActive ? 'TRUE' : 'FALSE']] },
    });

    return true;
  }
} 