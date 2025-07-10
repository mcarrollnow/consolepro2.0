import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Google Sheets column mappings...');
    
    // Test 1: Check Customers sheet mapping
    console.log('Testing Customers sheet mapping...');
    const customers = await googleSheetsService.getCustomersData();
    const sampleCustomer = customers.find(c => c.customer_id && c.name && c.email);
    
    console.log('Sample customer:', {
      customer_id: sampleCustomer?.customer_id,
      name: sampleCustomer?.name,
      email: sampleCustomer?.email,
      addressStreet: (sampleCustomer as any)?.addressStreet,
      addressStreet2: (sampleCustomer as any)?.addressStreet2,
      addressCity: (sampleCustomer as any)?.addressCity,
      addressState: (sampleCustomer as any)?.addressState,
      addressZip: (sampleCustomer as any)?.addressZip,
      legacy_address: sampleCustomer?.address
    });

    // Test 2: Check Orders sheet mapping 
    console.log('Testing Orders sheet mapping...');
    const orders = await googleSheetsService.getActiveOrdersData();
    const sampleOrder = orders.find(o => o.orderId && o.customerName);
    
    console.log('Sample order:', {
      orderId: sampleOrder?.orderId,
      customerName: sampleOrder?.customerName,
      customerEmail: sampleOrder?.customerEmail,
      addressStreet: sampleOrder?.addressStreet,
      addressCity: sampleOrder?.addressCity,
      addressState: sampleOrder?.addressState,
      addressZIP: sampleOrder?.addressZIP,
      total: sampleOrder?.total,
      status: sampleOrder?.status,
      invoiceStatus: sampleOrder?.invoiceStatus,
      paymentStatus: sampleOrder?.paymentStatus
    });

    // Test 3: Check B2B requests mapping
    console.log('Testing B2B requests mapping...');
    const b2bRequests = await googleSheetsService.getB2BRequestsData();
    const sampleB2B = b2bRequests[0];
    
    console.log('Sample B2B request:', {
      id: sampleB2B?.id,
      company: sampleB2B?.company,
      contact: sampleB2B?.contact,
      email: sampleB2B?.email,
      phone: sampleB2B?.phone,
      estimatedValue: sampleB2B?.estimatedValue
    });

    return NextResponse.json({
      success: true,
      message: 'Sheet mapping test completed successfully',
      results: {
        customersCount: customers.length,
        ordersCount: orders.length,
        b2bRequestsCount: b2bRequests.length,
        sampleCustomer: sampleCustomer ? {
          customer_id: sampleCustomer.customer_id,
          name: sampleCustomer.name,
          email: sampleCustomer.email,
          hasStructuredAddress: !!(sampleCustomer as any)?.addressStreet,
          addressStreet: (sampleCustomer as any)?.addressStreet,
          addressStreet2: (sampleCustomer as any)?.addressStreet2,
          addressCity: (sampleCustomer as any)?.addressCity,
          addressState: (sampleCustomer as any)?.addressState,
          addressZip: (sampleCustomer as any)?.addressZip,
          legacy_address: sampleCustomer.address
        } : null,
        sampleOrder: sampleOrder ? {
          orderId: sampleOrder.orderId,
          customerName: sampleOrder.customerName,
          customerEmail: sampleOrder.customerEmail,
          hasAddressFields: !!(sampleOrder.addressStreet || sampleOrder.addressCity),
          addressStreet: sampleOrder.addressStreet,
          addressCity: sampleOrder.addressCity,
          addressState: sampleOrder.addressState,
          addressZIP: sampleOrder.addressZIP,
          total: sampleOrder.total,
          status: sampleOrder.status,
          invoiceStatus: sampleOrder.invoiceStatus,
          paymentStatus: sampleOrder.paymentStatus,
          productsCount: sampleOrder.products?.length || 0
        } : null,
        sampleB2BRequest: sampleB2B ? {
          id: sampleB2B.id,
          company: sampleB2B.company,
          contact: sampleB2B.contact,
          email: sampleB2B.email,
          phone: sampleB2B.phone,
          estimatedValue: sampleB2B.estimatedValue,
          hasValidData: !!(sampleB2B.id && sampleB2B.contact && sampleB2B.email)
        } : null
      },
      columnMappingStatus: {
        customersSheet: {
          rangeUsed: 'A:AA',
          addressFieldsAt: 'F-J (Address_Street, Address_Street_Line_2, Address_City, Address_State, Address_ZIP)',
          structuredAddressSupported: true
        },
        ordersSheet: {
          rangeUsed: 'A:BN',
          addressFieldsAt: 'I-M (Address_Street, Address_Street_Line_2, Address_City, Address_State, Address_ZIP)',
          invoiceStatusColumn: 'T',
          paymentStatusColumn: 'R',
          lastUpdatedColumn: 'V'
        }
      }
    });

  } catch (error) {
    console.error('Sheet mapping test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType } = body;

    if (testType === 'addOrder') {
      // Test adding a new order with structured address
      const testOrder = {
        customerName: 'Test Customer Mapping',
        customerId: 'TEST-MAPPING-123',
        customerEmail: 'test.mapping@example.com',
        phone: '555-TEST-MAP',
        businessName: 'Test Mapping Co',
        addressStreet: '123 Test Mapping St',
        addressStreet2: 'Suite 456',
        addressCity: 'Test City',
        addressState: 'TS',
        addressZIP: '12345',
        total: 99.99,
        notes: 'Test order for column mapping validation',
        orderType: 'TEST',
        recordType: 'TEST_MAPPING',
        products: [
          {
            name: 'Test Product',
            barcode: 'TEST-BARCODE',
            price: 99.99,
            quantity: 1
          }
        ]
      };

      const orderId = await googleSheetsService.addNewOrder(testOrder);
      
      return NextResponse.json({
        success: true,
        message: 'Test order created successfully',
        orderId: orderId,
        testOrder: testOrder
      });
    }

    if (testType === 'addCustomer') {
      // Test adding a new customer with structured address
      const testCustomer = {
        customer_id: `TEST-CUST-${Date.now()}`,
        name: 'Test Customer Address Mapping',
        email: `test.customer.${Date.now()}@example.com`,
        phone: '555-CUST-TEST',
        company: 'Test Customer Co',
        addressStreet: '789 Customer Test Blvd',
        addressStreet2: 'Unit B',
        addressCity: 'Customer City',
        addressState: 'TC',
        addressZIP: '67890',
        first_order_date: new Date().toISOString(),
        last_order_date: new Date().toISOString(),
        total_orders: '1',
        total_spent: '$99.99',
        customer_status: 'Active',
        preferred_contact: 'email',
        customer_notes: 'Test customer for address mapping validation',
        tags: 'test,mapping',
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        referred_by: 'mapping_test',
        customer_class: 'Test',
        square_reference_id: '',
        nickname: 'TestCustomer',
        birthday: '',
        square_customer_id: '',
        wix_contact_id: '',
        address: '' // Will be built from structured fields
      };

      const success = await googleSheetsService.addCustomer(testCustomer);
      
      return NextResponse.json({
        success: success,
        message: success ? 'Test customer created successfully' : 'Failed to create test customer',
        testCustomer: testCustomer
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid test type. Use "addOrder" or "addCustomer"'
    }, { status: 400 });

  } catch (error) {
    console.error('Sheet mapping POST test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 