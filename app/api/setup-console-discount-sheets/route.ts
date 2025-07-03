import { NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets';

export async function POST() {
  try {
    const sheetsService = new GoogleSheetsService();
    const sheets = sheetsService['sheets']; // Access the private sheets property
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SPREADSHEET_ID is not set in environment variables.');
    }

    // Get existing sheets to check what's already there
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = spreadsheet.data.sheets || [];
    const existingSheetNames = existingSheets.map(sheet => sheet.properties?.title || '');

    const results = [];

    // 1. Set up ConsoleDiscountCodes sheet
    if (!existingSheetNames.includes('ConsoleDiscountCodes')) {
      // Create new sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'ConsoleDiscountCodes',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 15
                }
              }
            }
          }]
        }
      });

      // Add headers
      const discountHeaders = [
        'ID',
        'Code',
        'Type',
        'Value',
        'Min Order Amount',
        'Max Discount',
        'Usage Limit',
        'Used Count',
        'Valid From',
        'Valid Until',
        'Is Active',
        'Description',
        'Created By',
        'Created At',
        'Updated At'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'ConsoleDiscountCodes!A1:O1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [discountHeaders] }
      });

      results.push('✅ Created ConsoleDiscountCodes sheet with headers');
    } else {
      results.push('ℹ️ ConsoleDiscountCodes sheet already exists');
    }

    // 2. Set up ConsoleDiscountCodeUsage sheet
    if (!existingSheetNames.includes('ConsoleDiscountCodeUsage')) {
      // Create new sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'ConsoleDiscountCodeUsage',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 7
                }
              }
            }
          }]
        }
      });

      // Add headers
      const usageHeaders = [
        'ID',
        'Discount Code ID',
        'Order Code',
        'Customer Email',
        'Discount Amount',
        'Order Total',
        'Used At'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'ConsoleDiscountCodeUsage!A1:G1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [usageHeaders] }
      });

      results.push('✅ Created ConsoleDiscountCodeUsage sheet with headers');
    } else {
      results.push('ℹ️ ConsoleDiscountCodeUsage sheet already exists');
    }

    // 3. Create a sample discount code for testing
    try {
      const sampleCode = {
        code: 'CONSOLE10',
        type: 'percentage',
        value: 10,
        minOrderAmount: 50,
        maxDiscount: 100,
        usageLimit: 50,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Console test discount - 10% off orders over $50'
      };

      const sampleRow = [
        `console_disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sampleCode.code,
        sampleCode.type,
        sampleCode.value,
        sampleCode.minOrderAmount,
        sampleCode.maxDiscount,
        sampleCode.usageLimit,
        0, // Used Count
        sampleCode.validFrom,
        sampleCode.validUntil,
        'TRUE', // Is Active
        sampleCode.description,
        'console_admin',
        new Date().toISOString(),
        new Date().toISOString()
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'ConsoleDiscountCodes!A:O',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [sampleRow] }
      });

      results.push('✅ Created sample console discount code: CONSOLE10 (10% off orders over $50)');
    } catch {
      results.push('⚠️ Could not create sample console discount code (may already exist)');
    }

    return NextResponse.json({
      success: true,
      message: 'Console discount code sheets setup completed',
      results
    });

  } catch (error) {
    console.error('Error setting up console discount sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set up console discount sheets' },
      { status: 500 }
    );
  }
} 