/**
 * Wix Customer Management - Individual Buttons
 * Create customers on-demand and send invoices via API
 */

const CONFIG = {
  WIX_API_KEY: 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjE3NjA4OTM5LWNmODItNGNhMi04ZDMwLTdhODZiYjVjMWYxYlwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjY5MGJlN2M1LTIwZTgtNDMxNC1hNzY4LTNlYzVlNTc5ZTdlY1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIzNzQyNTRlZS05MDQ3LTQ0ODYtYTY4Ni00NmVhNjA3YzZmZGFcIn19IiwiaWF0IjoxNzUxNDU0MTkwfQ.FioMCK1Yu4hmuWOah7Ftb_lto52rXrHZdWdXD15mJCite0QmYfcU7M585LKXC9HG79UWrCtatXnPzJZmWaCJmDsYwQnm58EfLLz0K8lkbqC1Iwsr4_5mFFaaYhrKFkQFXjRP9CVnj9TRJAbXq0RV90iVU901FlXcc25cR62uxuk2FVS4l8j7Ax1RWAs_F5Kg6fNC8qj3HL3Kt7Zsot86bQdsd9H8JlGR9evMbJRLL7_L4v8tV3r79gxlDENZReoS5CU42dEHe7yveaD0z8kaG-DssLaWB5ApdnmNp5edMMxUpqBmoMMIYsNinuWGlyIn3DmAgXGQalICXRX-ycr8GQ',
  WIX_SITE_ID: 'f2af16bf-a8ba-42f3-a5c4-9425564347ac'
};

// Helper to ensure only valid strings are sent to Wix
function safeString(val) {
  return (typeof val === 'string' && val.trim() !== '') ? val.trim() : undefined;
}

/**
 * Create Wix customer from customer profile (button function)
 */
function createWixCustomerFromProfile(customerId) {
  try {
    console.log(`Creating Wix customer for: ${customerId}`);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customers');
    const customer = findCustomerById(sheet, customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    // Check if already exists in Wix
    const existing = findExistingWixContact(customer.email);
    if (existing) {
      updateCustomerWixStatus(customerId, 'Already Exists', existing.id);
      return `Customer already exists in Wix (ID: ${existing.id})`;
    }
    
    // Create in Wix
    const wixId = createCustomerInWix(customer);
    updateCustomerWixStatus(customerId, 'Created', wixId);
    
    return `Customer created in Wix (ID: ${wixId})`;
    
  } catch (error) {
    console.error('Error:', error);
    updateCustomerWixStatus(customerId, 'Error', null, error.message);
    return `Error: ${error.message}`;
  }
}

/**
 * Wrapper for button: gets orderId from selected row and calls main function
 */
function createWixCustomerFromOrder() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = sheet.getActiveRange().getRow();
  var orderId = sheet.getRange(row, 2).getValue(); // Column 2 = Column B (Order_Code)
  return createWixCustomerFromOrderById(orderId);
}

/**
 * Create Wix customer from order (main logic)
 */
function createWixCustomerFromOrderById(orderId) {
  try {
    console.log(`Creating Wix customer from order: ${orderId}`);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
    const order = findOrderById(sheet, orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    // Check if already exists in Wix
    const existing = findExistingWixContact(order.customerEmail);
    if (existing) {
      updateOrderWixStatus(orderId, 'Already Exists', existing.id);
      return `Customer already exists in Wix (ID: ${existing.id})`;
    }
    // Create in Wix
    const wixId = createCustomerInWix(order);
    updateOrderWixStatus(orderId, 'Created', wixId);
    return `Customer created in Wix (ID: ${wixId})`;
  } catch (error) {
    console.error('Error:', error);
    updateOrderWixStatus(orderId, 'Error', null, error.message);
    return `Error: ${error.message}`;
  }
}

/**
 * Find order by Order_Code (column B, index 1)
 */
function findOrderById(sheet, orderId) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) { // Order_Code in column B (index 1)
      return {
        orderId: data[i][1], // Order_Code
        customerName: data[i][3], // Customer_Name (column D, index 3)
        customerEmail: data[i][5], // Email (column F, index 5)
        customerPhone: data[i][7], // Phone (column H, index 7)
        address: data[i][8], // Address_Street (column I, index 8)
        city: data[i][9], // Address_City (column J, index 9)
        state: data[i][10], // Address_State (column K, index 10)
        zipCode: data[i][11], // Address_ZIP (column L, index 11)
        totalAmount: data[i][12] || '0', // Total_Amount (column M, index 12)
      };
    }
  }
  return null;
}

/**
 * Create Wix contact using mapped order data, with all fields sanitized
 */
function createCustomerInWix(customerData) {
  const url = 'https://www.wixapis.com/contacts/v4/contacts';
  const email = safeString(customerData.customerEmail);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid or missing email address for customer.');
  }
  // Optionally split customerName into first/last
  let firstName = safeString(customerData.customerName);
  let lastName = "";
  if (firstName && firstName.includes(" ")) {
    const parts = firstName.split(" ");
    firstName = safeString(parts[0]);
    lastName = safeString(parts.slice(1).join(" "));
  }
  const wixData = {
    info: {
      name: {
        first: firstName,
        last: lastName
      },
      emails: {
        items: [{
          tag: "MAIN",
          email: email
        }]
      },
      phones: safeString(customerData.customerPhone) ? {
        items: [{
          tag: "HOME",
          countryCode: "US",
          phone: safeString(customerData.customerPhone)
        }]
      } : undefined,
      addresses: (safeString(customerData.address) || safeString(customerData.city) || safeString(customerData.state) || safeString(customerData.zipCode)) ? {
        items: [{
          tag: "SHIPPING",
          address: {
            country: "US",
            subdivision: safeString(customerData.state) ? `US-${safeString(customerData.state)}` : undefined,
            city: safeString(customerData.city),
            postalCode: safeString(customerData.zipCode),
            addressLine: safeString(customerData.address)
          }
        }]
      } : undefined
    }
  };

  // Log the payload for debugging
  console.log("Wix Payload: " + JSON.stringify(wixData));

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(wixData)
  };
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
    return result.contact.id;
  } else {
    throw new Error(`Wix API error: ${response.getResponseCode()} - ${response.getContentText()}`);
  }
}

/**
 * Check if Wix contact already exists by email
 */
function findExistingWixContact(email) {
  try {
    const url = 'https://www.wixapis.com/contacts/v4/contacts';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
        'wix-site-id': CONFIG.WIX_SITE_ID
      }
    };
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    if (response.getResponseCode() === 200 && result.contacts) {
      return result.contacts.find(contact => 
        contact.primaryInfo && contact.primaryInfo.email === email
      );
    }
    return null;
  } catch (error) {
    console.error('Error finding contact:', error);
    return null;
  }
}

/**
 * Update order row with Wix status and contact ID
 */
function updateOrderWixStatus(orderId, status, wixId = null, error = '') {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  let wixStatusCol = headers.findIndex(h => h === 'Wix_Status');
  let wixIdCol = headers.findIndex(h => h === 'Wix_Contact_ID');
  let errorCol = headers.findIndex(h => h === 'Wix_Error');
  // Add columns if missing
  if (wixStatusCol === -1) {
    wixStatusCol = headers.length;
    sheet.getRange(1, wixStatusCol + 1).setValue('Wix_Status');
  }
  if (wixIdCol === -1) {
    wixIdCol = headers.length + 1;
    sheet.getRange(1, wixIdCol + 1).setValue('Wix_Contact_ID');
  }
  if (errorCol === -1) {
    errorCol = headers.length + 2;
    sheet.getRange(1, errorCol + 1).setValue('Wix_Error');
  }
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) { // Order_Code in column B (index 1)
      sheet.getRange(i + 1, wixStatusCol + 1).setValue(status);
      if (wixId) sheet.getRange(i + 1, wixIdCol + 1).setValue(wixId);
      if (error) sheet.getRange(i + 1, errorCol + 1).setValue(error);
      break;
    }
  }
}

/**
 * Send Wix invoice (button function)
 */
function sendWixInvoice(orderId) {
  try {
    console.log(`Sending Wix invoice for order: ${orderId}`);
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
    const order = findOrderById(sheet, orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Get Wix contact ID
    const wixContactId = getWixContactIdForOrder(orderId);
    if (!wixContactId) {
      throw new Error('Customer not in Wix. Create Wix customer first.');
    }
    
    // Create invoice
    const invoiceId = createWixInvoice(wixContactId, order);
    updateInvoiceStatus(orderId, 'Sent', invoiceId);
    
    return `Invoice sent (ID: ${invoiceId})`;
    
  } catch (error) {
    console.error('Error:', error);
    updateInvoiceStatus(orderId, 'Error', null, error.message);
    return `Error: ${error.message}`;
  }
}

/**
 * Auto-create Wix customer row for new purchase request
 */
function autoCreateWixCustomerRow(purchaseData) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Wix_Customers');
    
    const newRow = [
      purchaseData.customerId,
      purchaseData.firstName,
      purchaseData.lastName,
      purchaseData.email,
      purchaseData.phone || '',
      'US',
      purchaseData.address || '',
      purchaseData.city || '',
      purchaseData.state || '',
      purchaseData.zipCode || '',
      'US',
      '', // Wix Contact ID
      'Pending', // Status
      new Date(),
      '' // Error
    ];
    
    sheet.appendRow(newRow);
    return 'Wix customer row created';
    
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error.message}`;
  }
}

// Helper functions
function findCustomerById(sheet, customerId) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === customerId) {
      return {
        customerId: data[i][0],
        firstName: data[i][1] || '',
        lastName: data[i][2] || '',
        email: data[i][3],
        phone: data[i][4] || '',
        address: data[i][5] || '',
        city: data[i][6] || '',
        state: data[i][7] || '',
        zipCode: data[i][8] || '',
        country: data[i][9] || 'US'
      };
    }
  }
  return null;
}

function getWixContactIdForOrder(orderId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      const wixIdCol = headers.findIndex(h => h === 'Wix_Contact_ID');
      return wixIdCol !== -1 ? data[i][wixIdCol] : null;
    }
  }
  return null;
}

function updateInvoiceStatus(orderId, status, invoiceId = null, error = '') {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('Wix_Invoices');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Wix_Invoices');
    sheet.getRange(1, 1, 1, 5).setValues([['Order_ID', 'Invoice_Date', 'Status', 'Wix_Invoice_ID', 'Error']]);
  }
  
  sheet.appendRow([orderId, new Date(), status, invoiceId || '', error || '']);
}

/**
 * Test Wix API connection
 */
function testWixConnection() {
  try {
    const url = 'https://www.wixapis.com/contacts/v4/contacts';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
        'wix-site-id': CONFIG.WIX_SITE_ID
      }
    };
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() === 200) {
      console.log('✅ Wix API connection successful!');
      return '✅ Wix API connection successful!';
    } else {
      console.error(`❌ Wix API connection failed: ${response.getResponseCode()}`);
      return `❌ Wix API connection failed: ${response.getResponseCode()}`;
    }
  } catch (error) {
    console.error('❌ Wix API connection error:', error);
    return `❌ Wix API connection error: ${error.message}`;
  }
}

function createWixPaymentLink() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = sheet.getActiveRange().getRow();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var orderRow = data[row - 1];

  // Get required fields
  var wixContactId = orderRow[headers.findIndex(h => h === 'Wix_Contact_ID')];
  var totalStr = orderRow[headers.findIndex(h => h === 'Total_Amount')];
  if (typeof totalStr === 'string') totalStr = totalStr.replace(/[$,]/g, '');
  var total = Number(totalStr);

  if (!wixContactId) throw new Error('No Wix Contact ID for this order.');
  if (!total || isNaN(total)) throw new Error('Invalid total amount.');

  // price must be a string with two decimals
  var priceString = total.toFixed(2);

  var payload = {
    paymentLink: {
      title: "Weight Loss Plan, Customized features, Add-on Consultations",
      description: "This is a payment for your customized plan.",
      currency: "USD",
      recipients: [
        {
          sendMethods: ["EMAIL_METHOD"],
          contactId: wixContactId
        }
      ],
      paymentsLimit: 1,
      type: "ECOM",
      ecomPaymentLink: {
        lineItems: [
          {
            type: "CUSTOM",
            customItem: {
              name: "Weight Loss Plan, Customized features, Add-on Consultations",
              quantity: 1,
              price: priceString, // "324.00"
              description: "This is a payment for your customized plan."
            }
          }
        ]
      }
    }
  };

  // Log the payload for debugging
  console.log("Wix Payment Link Payload: " + JSON.stringify(payload));

  var url = 'https://www.wixapis.com/payment-links/v1/payment-links';
  var options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    var paymentUrl = result.paymentLink && result.paymentLink.links && result.paymentLink.links.url && result.paymentLink.links.url.url;
    if (paymentUrl) {
      var linkCol = headers.findIndex(h => h === 'payment_link');
      if (linkCol !== -1) {
        sheet.getRange(row, linkCol + 1).setValue(paymentUrl);
      }
      return paymentUrl;
    } else {
      throw new Error('No payment link URL returned.');
    }
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error.message}`;
  }
}

function createWixBillableItemAndPaymentLink() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = sheet.getActiveRange().getRow();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var orderRow = data[row - 1];

  // Get required fields
  var wixContactId = orderRow[headers.findIndex(h => h === 'Wix_Contact_ID')];
  var totalStr = orderRow[headers.findIndex(h => h === 'Total_Amount')];
  if (typeof totalStr === 'string') totalStr = totalStr.replace(/[$,]/g, '');
  var total = Number(totalStr);

  if (!wixContactId) throw new Error('No Wix Contact ID for this order.');
  if (!total || isNaN(total)) throw new Error('Invalid total amount.');

  var itemName = "Weight Loss Plan, Customized features, Add-on Consultations";
  var itemDescription = "This is a payment for your customized plan.";
  var priceString = total.toFixed(2);

  // 1. Create Billable Item
  var billablePayload = {
    billableItem: {
      name: itemName,
      description: itemDescription,
      price: priceString
    }
  };
  var billableUrl = 'https://www.wixapis.com/billable-items/v1/billable-items';
  var billableOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(billablePayload)
  };
  console.log("Wix Billable Item Payload: " + JSON.stringify(billablePayload));
  var billableResponse = UrlFetchApp.fetch(billableUrl, billableOptions);
  var billableResult = JSON.parse(billableResponse.getContentText());
  var billableItemId = billableResult.billableItem && billableResult.billableItem.id;
  if (!billableItemId) throw new Error('Failed to create billable item.');

  // 2. Create Payment Link using the Billable Item as a CATALOG line item (omit catalogOverrideFields)
  var paymentPayload = {
    paymentLink: {
      title: itemName,
      description: itemDescription,
      currency: "USD",
      recipients: [
        {
          sendMethods: ["EMAIL_METHOD"],
          contactId: wixContactId
        }
      ],
      paymentsLimit: 1,
      type: "ECOM",
      ecomPaymentLink: {
        lineItems: [
          {
            type: "CATALOG",
            catalogItem: {
              quantity: 1,
              catalogReference: {
                appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e", // Wix Stores appId
                catalogItemId: billableItemId
              }
              // No catalogOverrideFields
            }
          }
        ]
      }
    }
  };
  var paymentUrl = 'https://www.wixapis.com/payment-links/v1/payment-links';
  var paymentOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(paymentPayload)
  };
  console.log("Wix Payment Link Payload: " + JSON.stringify(paymentPayload));
  var paymentResponse = UrlFetchApp.fetch(paymentUrl, paymentOptions);
  var paymentResult = JSON.parse(paymentResponse.getContentText());
  var paymentLinkUrl = paymentResult.paymentLink && paymentResult.paymentLink.links && paymentResult.paymentLink.links.url && paymentResult.paymentLink.links.url.url;
  if (paymentLinkUrl) {
    var linkCol = headers.findIndex(h => h === 'payment_link');
    if (linkCol !== -1) {
      sheet.getRange(row, linkCol + 1).setValue(paymentLinkUrl);
    }
    return paymentLinkUrl;
  } else {
    throw new Error('No payment link URL returned.');
  }
}

/**
 * Stripe Invoice Creation Functions (Secure Version)
 * This version calls your Next.js API instead of handling Stripe directly
 */

/**
 * Main function to create Stripe invoice from selected row (button function)
 */
function createStripeInvoiceFromRow() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const row = sheet.getActiveRange().getRow();
    const orderId = sheet.getRange(row, 2).getValue(); // Column B = Order_Code
    
    if (!orderId) {
      throw new Error('No order ID found in selected row');
    }
    
    return createStripeInvoiceViaAPI(orderId);
  } catch (error) {
    console.error('Error:', error);
    return `Error: ${error.message}`;
  }
}

/**
 * Create Stripe invoice by calling your secure Next.js API
 */
function createStripeInvoiceViaAPI(orderId) {
  try {
    console.log(`Creating Stripe invoice for order: ${orderId} via API`);
    
    // Get your Next.js API URL from environment or set it directly
    const apiUrl = 'https://your-vercel-app.vercel.app/api/orders/create-stripe-invoice';
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({ orderId })
    };
    
    const response = UrlFetchApp.fetch(apiUrl, options);
    const result = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() === 200 && result.success) {
      console.log('✅ Stripe invoice created successfully');
      return `✅ Stripe invoice created successfully! Invoice ID: ${result.invoiceId}`;
    } else {
      throw new Error(result.error || 'Failed to create invoice');
    }
    
  } catch (error) {
    console.error('Error creating Stripe invoice via API:', error);
    return `Error: ${error.message}`;
  }
}

/**
 * Web app entry point for external API calls (if needed)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { action, orderId, token } = data;
    
    // Verify token if needed
    if (token !== 'your-secret-token') {
      return ContentService.createTextOutput(JSON.stringify({
        error: 'Unauthorized'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'createStripeInvoice' && orderId) {
      const result = createStripeInvoiceViaAPI(orderId);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: result
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        error: 'Invalid action or missing orderId'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 