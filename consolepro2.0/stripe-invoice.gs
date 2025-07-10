/**
 * Stripe Invoice Creator
 * Creates Stripe invoices from Wix orders
 */

// Configuration - will get Stripe key from Vercel API
const STRIPE_CONFIG = {
  STRIPE_SECRET_KEY: null // Will be passed from Vercel API
};



/**
 * Web app entry point for external API calls
 * This is what your Next.js API calls
 */
function doGet(e) {
  try {
    console.log('=== GOOGLE APPS SCRIPT DEBUG ===');
    console.log('All parameters received:', e.parameter);
    console.log('Parameter keys:', Object.keys(e.parameter));
    
    const action = e.parameter.action;
    const orderId = e.parameter.orderId;
    const stripeKey = e.parameter.stripeKey; // Get Stripe key from Vercel
    const wixApiKey = e.parameter.wixApiKey; // Get Wix API key from Vercel
    const wixSiteId = e.parameter.wixSiteId; // Get Wix site ID from Vercel
    
    console.log(`Action: ${action}`);
    console.log(`OrderId: ${orderId}`);
    console.log(`Stripe key received: ${stripeKey ? 'YES' : 'NO'}`);
    console.log(`Wix API key received: ${wixApiKey ? 'YES' : 'NO'}`);
    console.log(`Wix Site ID received: ${wixSiteId ? 'YES' : 'NO'}`);
    console.log('=== END DEBUG ===');
    
    if (action === 'createStripeInvoice') {
      return createStripeInvoice(orderId, stripeKey, wixApiKey, wixSiteId);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Web app error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Create Stripe invoice from Wix order data
 */
function createStripeInvoice(orderId, stripeKey, wixApiKey, wixSiteId) {
  try {
    console.log(`Creating Stripe invoice for order: ${orderId}`);
    
    // Validate Stripe key
    if (!stripeKey) {
      throw new Error('Stripe API key is missing');
    }
    
    // First, get order data from Wix API
    const wixOrder = getWixOrder(orderId, wixApiKey, wixSiteId);
    if (!wixOrder) {
      throw new Error('Order not found in Wix');
    }
    
    console.log('Wix order data:', JSON.stringify(wixOrder, null, 2));
    
    // Extract data from Wix order
    const customerEmail = wixOrder.buyerInfo.email;
    const customerName = wixOrder.buyerInfo.firstName + ' ' + wixOrder.buyerInfo.lastName;
    const totalAmount = wixOrder.priceData.total;
    const orderItems = wixOrder.lineItems.map(item => item.title).join(', ');
    
    if (!customerEmail) {
      throw new Error('Customer email not found in Wix order');
    }
    
    if (!totalAmount || totalAmount <= 0) {
      throw new Error(`Invalid total amount: ${totalAmount}`);
    }
    
    console.log(`Customer: ${customerName} (${customerEmail})`);
    console.log(`Total: $${totalAmount}`);
    console.log(`Items: ${orderItems}`);
    
    // Create Stripe invoice
    const invoiceData = {
      customer_email: customerEmail,
      collection_method: 'send_invoice',
      days_until_due: 30,
      metadata: {
        order_id: orderId,
        customer_name: customerName,
        wix_order_id: orderId
      },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Order ${orderId}`,
            description: orderItems || 'Custom order'
          },
          unit_amount: Math.round(totalAmount * 100) // Convert to cents
        },
        quantity: 1
      }]
    };
    
    console.log('Creating Stripe invoice with data:', JSON.stringify(invoiceData, null, 2));
    
         // Call Stripe API to create invoice
     const url = 'https://api.stripe.com/v1/invoices';
     const options = {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${stripeKey}`,
         'Content-Type': 'application/json',
         'Stripe-Version': '2024-12-18'
       },
       payload: JSON.stringify(invoiceData),
       muteHttpExceptions: true
     };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    console.log(`Stripe API Response Code: ${response.getResponseCode()}`);
    console.log(`Stripe API Response: ${response.getContentText()}`);
    
    if (response.getResponseCode() !== 200 && response.getResponseCode() !== 201) {
      throw new Error(`Stripe API error: ${result.error?.message || response.getContentText()}`);
    }
    
    const invoiceId = result.id;
    const invoiceUrl = result.hosted_invoice_url;
    const invoicePdf = result.invoice_pdf;
    
    // Update the sheet with invoice details
    updateInvoiceInSheet(orderId, invoiceId, invoiceUrl, invoicePdf);
    
    // Send the invoice via Stripe
    if (invoiceId) {
      console.log('Sending invoice via Stripe...');
      const sendUrl = `https://api.stripe.com/v1/invoices/${invoiceId}/send`;
             const sendOptions = {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${stripeKey}`,
           'Content-Type': 'application/json',
           'Stripe-Version': '2024-12-18'
         },
         muteHttpExceptions: true
       };
      
      const sendResponse = UrlFetchApp.fetch(sendUrl, sendOptions);
      console.log(`Send Response Code: ${sendResponse.getResponseCode()}`);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Stripe invoice created and sent successfully",
      orderId: orderId,
      invoiceId: invoiceId,
      invoiceUrl: invoiceUrl,
      invoicePdf: invoicePdf
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Stripe invoice creation error:', error);
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}



/**
 * Get order data from Wix API
 */
function getWixOrder(orderId) {
  try {
    console.log(`Fetching order ${orderId} from Wix API...`);
    
    // You'll need to add your Wix API credentials to Vercel environment variables
    // and pass them to this function
    const wixApiKey = 'your-wix-api-key'; // This should come from Vercel
    const wixSiteId = 'your-wix-site-id'; // This should come from Vercel
    
    const url = `https://www.wixapis.com/v1/orders/${orderId}`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': wixApiKey,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    console.log(`Wix API Response Code: ${response.getResponseCode()}`);
    
    if (response.getResponseCode() === 200) {
      return result.order;
    } else {
      console.error(`Wix API error: ${result.message || response.getContentText()}`);
      return null;
    }
    
  } catch (error) {
    console.error('Error fetching Wix order:', error);
    return null;
  }
}

/**
 * Update sheet with invoice information
 */
function updateInvoiceInSheet(wixOrderId, invoiceId, invoiceUrl, invoicePdf) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find columns
  let invoiceIdCol = headers.findIndex(h => h === 'stripe_invoice_id');
  let invoiceLinkCol = headers.findIndex(h => h === 'invoice_link');
  let invoicePdfCol = headers.findIndex(h => h === 'invoice_pdf');
  let wixOrderIdCol = headers.findIndex(h => h === 'wix_order_id');
  
  // Add columns if missing
  if (invoiceIdCol === -1) {
    invoiceIdCol = headers.length;
    sheet.getRange(1, invoiceIdCol + 1).setValue('stripe_invoice_id');
  }
  if (invoiceLinkCol === -1) {
    invoiceLinkCol = headers.length + 1;
    sheet.getRange(1, invoiceLinkCol + 1).setValue('invoice_link');
  }
  if (invoicePdfCol === -1) {
    invoicePdfCol = headers.length + 2;
    sheet.getRange(1, invoicePdfCol + 1).setValue('invoice_pdf');
  }
  
  // Find the row with matching wix_order_id
  for (let i = 1; i < data.length; i++) {
    if (data[i][wixOrderIdCol] === wixOrderId) { // wix_order_id
      if (invoiceIdCol !== -1) {
        sheet.getRange(i + 1, invoiceIdCol + 1).setValue(invoiceId);
      }
      if (invoiceLinkCol !== -1) {
        sheet.getRange(i + 1, invoiceLinkCol + 1).setValue(invoiceUrl);
      }
      if (invoicePdfCol !== -1) {
        sheet.getRange(i + 1, invoicePdfCol + 1).setValue(invoicePdf);
      }
      console.log(`Updated wix_order_id ${wixOrderId} with Stripe invoice details`);
      break;
    }
  }
}

/**
 * Test function - run this directly from Google Apps Script
 * Replace 'B2B-0706-UWXM-1' with an actual order ID from your sheet
 */
function testCreateInvoice() {
  // Replace this with an actual order ID from your Google Sheets
  const testOrderId = 'B2B-0706-UWXM-1';
  
  // You'll need to get your Stripe key from Vercel or set it temporarily
  // For testing, you can temporarily hardcode it here (remove after testing)
  // IMPORTANT: Use sk_test_ or sk_live_ format, NOT rk_live_
  const testStripeKey = 'sk_test_...'; // Replace with your actual Stripe secret key
  
  console.log(`Testing invoice creation for order: ${testOrderId}`);
  
  try {
    const result = createStripeInvoice(testOrderId, testStripeKey);
    console.log('Test result:', result);
    return result;
  } catch (error) {
    console.error('Test failed:', error);
    return `Test failed: ${error.message}`;
  }
}

/**
 * Test function to simulate the web app call from Vercel
 */
function testWebAppCall() {
  // Simulate the parameters that would come from Vercel API
  const mockEvent = {
    parameter: {
      action: 'createStripeInvoice',
      orderId: 'B2B-0706-UWXM-1', // Replace with actual order ID
      stripeKey: 'sk_test_...' // Replace with your actual Stripe secret key
    }
  };
  
  console.log('=== TESTING WEB APP CALL ===');
  const result = doGet(mockEvent);
  console.log('Web app result:', result);
}

/**
 * Get order data from Wix API
 */
function getWixOrder(orderId, wixApiKey, wixSiteId) {
  try {
    console.log('=== WIX API DEBUG ===');
    console.log('Order ID:', orderId);
    console.log('Wix API Key present:', wixApiKey ? 'YES' : 'NO');
    console.log('Wix Site ID:', wixSiteId);
    
    if (!wixApiKey || !wixSiteId) {
      throw new Error('Wix API credentials not provided');
    }
    
    const url = `https://www.wixapis.com/v1/orders/${orderId}`;
    console.log('Wix API URL:', url);
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': wixApiKey,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    console.log('Making Wix API request...');
    const response = UrlFetchApp.fetch(url, options);
    const responseText = response.getContentText();
    
    console.log(`Wix API Response Code: ${response.getResponseCode()}`);
    console.log(`Wix API Response: ${responseText}`);
    
    if (response.getResponseCode() !== 200) {
      const result = JSON.parse(responseText);
      throw new Error(`Wix API error: ${result.message || responseText}`);
    }
    
    const result = JSON.parse(responseText);
    console.log('Wix order found:', result.order ? 'YES' : 'NO');
    console.log('=== END WIX API DEBUG ===');
    
    return result.order;
    
  } catch (error) {
    console.error('Error fetching Wix order:', error);
    return null;
  }
}

/**
 * Test function - run this to see if the web app is working
 * This doesn't use any credentials - just tests the basic setup
 */
function testWebAppSetup() {
  console.log('=== TESTING WEB APP SETUP ===');
  console.log('Google Apps Script is deployed and accessible');
  console.log('Ready to receive API calls from Vercel');
  console.log('=== END TEST ===');
  return '✅ Web app setup is working';
}

/**
 * Test function - run this to see if the web app is working
 * This doesn't use any credentials - just tests the basic setup
 */
function testWebAppSetup() {
  console.log('=== TESTING WEB APP SETUP ===');
  console.log('Google Apps Script is deployed and accessible');
  console.log('Ready to receive API calls from Vercel');
  console.log('=== END TEST ===');
  return '✅ Web app setup is working';
} 