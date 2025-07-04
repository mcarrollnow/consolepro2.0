/**
 * ConsolePro 2.0 - Simplified Backend
 * Compact version to avoid Google Docs errors
 */

const BACKEND_CONFIG = {
  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet().getId(),
  ORDERS_SHEET: 'Orders',
  CUSTOMERS_SHEET: 'Customers', 
  ARCHIVED_ORDERS_SHEET: 'Archived Orders',
  INVENTORY_SHEET: 'Product',
  WIX_API_KEY: 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjE3NjA4OTM5LWNmODItNGNhMi04ZDMwLTdhODZiYjVjMWYxYlwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjY5MGJlN2M1LTIwZTgtNDMxNC1hNzY4LTNlYzVlNTc5ZTdlY1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIzNzQyNTRlZS05MDQ3LTQ0ODYtYTY4Ni00NmVhNjA3YzZmZGFcIn19IiwiaWF0IjoxNzUxNDU0MTkwfQ.FioMCK1Yu4hmuWOah7Ftb_lto52rXrHZdWdXD15mJCite0QmYfcU7M585LKXC9HG79UWrCtatXnPzJZmWaCJmDsYwQnm58EfLLz0K8lkbqC1Iwsr4_5mFFaaYhrKFkQFXjRP9CVnj9TRJAbXq0RV90iVU901FlXcc25cR62uxuk2FVS4l8j7Ax1RWAs_F5Kg6fNC8qj3HL3Kt7Zsot86bQdsd9H8JlGR9evMbJRLL7_L4v8tV3r79gxlDENZReoS5CU42dEHe7yveaD0z8kaG-DssLaWB5ApdnmNp5edMMxUpqBmoMMIYsNinuWGlyIn3DmAgXGQalICXRX-ycr8GQ',
  WIX_SITE_ID: 'f2af16bf-a8ba-42f3-a5c4-9425564347ac'
};

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const { action, data } = request;
    
    switch (action) {
      case 'getOrders':
        return handleGetOrders(data);
      case 'getCustomers':
        return handleGetCustomers(data);
      case 'createOrder':
        return handleCreateOrder(data);
      case 'updateOrder':
        return handleUpdateOrder(data);
      case 'createCustomer':
        return handleCreateCustomer(data);
      case 'getInventory':
        return handleGetInventory(data);
      case 'createWixCustomer':
        return handleCreateWixCustomer(data);
      case 'createWixPaymentLink':
        return handleCreateWixPaymentLink(data);
      default:
        return createResponse(400, { error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
}

function doGet(e) {
  const { parameter } = e;
  const action = parameter.action || 'status';
  
  switch (action) {
    case 'status':
      return createResponse(200, { status: 'ConsolePro 2.0 Backend Running', timestamp: new Date().toISOString() });
    case 'test':
      return createResponse(200, { message: 'Backend test successful' });
    default:
      return createResponse(400, { error: 'Invalid action' });
  }
}

function handleGetOrders(data = {}) {
  const { sheet = 'Orders' } = data;
  const sheetName = sheet === 'Archived' ? BACKEND_CONFIG.ARCHIVED_ORDERS_SHEET : BACKEND_CONFIG.ORDERS_SHEET;
  const orders = getSheetData(sheetName);
  return createResponse(200, { orders, count: orders.length });
}

function handleGetCustomers(data = {}) {
  const customers = getSheetData(BACKEND_CONFIG.CUSTOMERS_SHEET);
  return createResponse(200, { customers, count: customers.length });
}

function handleCreateOrder(data) {
  const { customerName, customerEmail, items, total, notes } = data;
  
  if (!customerName || !customerEmail || !items || !total) {
    return createResponse(400, { error: 'Missing required fields' });
  }
  
  const customerId = ensureCustomerExists({ name: customerName, email: customerEmail });
  const orderId = generateOrderId();
  
  const order = {
    orderId,
    customerId,
    customerName,
    customerEmail,
    orderDate: new Date().toISOString(),
    status: 'Processing',
    total: parseFloat(total),
    items: JSON.stringify(items),
    notes: notes || '',
    created_date: new Date().toISOString()
  };
  
  const success = addRowToSheet(BACKEND_CONFIG.ORDERS_SHEET, order);
  
  if (success) {
    return createResponse(200, { orderId, customerId, message: 'Order created successfully' });
  } else {
    return createResponse(500, { error: 'Failed to create order' });
  }
}

function handleUpdateOrder(data) {
  const { orderId, updates } = data;
  
  if (!orderId || !updates) {
    return createResponse(400, { error: 'Missing orderId or updates' });
  }
  
  const success = updateRowInSheet(BACKEND_CONFIG.ORDERS_SHEET, 'orderId', orderId, {
    ...updates,
    last_updated: new Date().toISOString()
  });
  
  if (success) {
    return createResponse(200, { message: 'Order updated successfully' });
  } else {
    return createResponse(500, { error: 'Failed to update order' });
  }
}

function handleCreateCustomer(data) {
  const { name, email, phone, company, address } = data;
  
  if (!name || !email) {
    return createResponse(400, { error: 'Name and email are required' });
  }
  
  const existingCustomer = getRowFromSheet(BACKEND_CONFIG.CUSTOMERS_SHEET, 'email', email);
  if (existingCustomer) {
    return createResponse(409, { error: 'Customer with this email already exists', customerId: existingCustomer.customer_id });
  }
  
  const customerId = generateCustomerId(name, email);
  
  const customer = {
    customer_id: customerId,
    name,
    email,
    phone: phone || '',
    company: company || '',
    address: address || '',
    customer_status: 'Active',
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    wix_contact_id: ''
  };
  
  const success = addRowToSheet(BACKEND_CONFIG.CUSTOMERS_SHEET, customer);
  
  if (success) {
    return createResponse(200, { customerId, message: 'Customer created successfully' });
  } else {
    return createResponse(500, { error: 'Failed to create customer' });
  }
}

function handleGetInventory(data = {}) {
  const inventory = getSheetData(BACKEND_CONFIG.INVENTORY_SHEET);
  return createResponse(200, { inventory, count: inventory.length });
}

function handleCreateWixCustomer(data) {
  const { customerId } = data;
  
  if (!customerId) {
    return createResponse(400, { error: 'Missing customerId' });
  }
  
  const customer = getRowFromSheet(BACKEND_CONFIG.CUSTOMERS_SHEET, 'customer_id', customerId);
  if (!customer) {
    return createResponse(404, { error: 'Customer not found' });
  }
  
  try {
    const wixId = createCustomerInWix(customer);
    updateRowInSheet(BACKEND_CONFIG.CUSTOMERS_SHEET, 'customer_id', customerId, {
      wix_contact_id: wixId
    });
    
    return createResponse(200, { wixContactId: wixId, message: 'Wix customer created successfully' });
  } catch (error) {
    return createResponse(500, { error: 'Wix API error', details: error.message });
  }
}

function handleCreateWixPaymentLink(data) {
  const { orderId, customerId, amount, description } = data;
  
  if (!orderId || !amount) {
    return createResponse(400, { error: 'Missing orderId or amount' });
  }
  
  let wixContactId = null;
  if (customerId) {
    const customer = getRowFromSheet(BACKEND_CONFIG.CUSTOMERS_SHEET, 'customer_id', customerId);
    if (customer && customer.wix_contact_id) {
      wixContactId = customer.wix_contact_id;
    }
  }
  
  try {
    const paymentUrl = createWixBillableItemAndPaymentLink(orderId, amount, wixContactId, description);
    updateRowInSheet(BACKEND_CONFIG.ORDERS_SHEET, 'orderId', orderId, {
      payment_link: paymentUrl
    });
    
    return createResponse(200, { paymentLink: paymentUrl, message: 'Payment link created successfully' });
  } catch (error) {
    return createResponse(500, { error: 'Wix API error', details: error.message });
  }
}

function safeString(val) {
  return (typeof val === 'string' && val.trim() !== '') ? val.trim() : undefined;
}

function createCustomerInWix(customerData) {
  const url = 'https://www.wixapis.com/contacts/v4/contacts';
  const email = safeString(customerData.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid or missing email address for customer.');
  }
  
  let firstName = safeString(customerData.name);
  let lastName = "";
  if (firstName && firstName.includes(" ")) {
    const parts = firstName.split(" ");
    firstName = safeString(parts[0]);
    lastName = safeString(parts.slice(1).join(" "));
  }
  
  const wixData = {
    info: {
      name: { first: firstName, last: lastName },
      emails: { items: [{ tag: "MAIN", email: email }] },
      phones: safeString(customerData.phone) ? {
        items: [{ tag: "HOME", countryCode: "US", phone: safeString(customerData.phone) }]
      } : undefined
    }
  };

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BACKEND_CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': BACKEND_CONFIG.WIX_SITE_ID
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

function createWixBillableItemAndPaymentLink(orderId, amount, wixContactId, description) {
  const itemName = description || "Weight Loss Plan, Customized features, Add-on Consultations";
  const priceString = parseFloat(amount).toFixed(2);

  const billablePayload = {
    billableItem: {
      name: itemName,
      description: "This is a payment for your customized plan.",
      price: priceString
    }
  };
  
  const billableUrl = 'https://www.wixapis.com/billable-items/v1/billable-items';
  const billableOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BACKEND_CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': BACKEND_CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(billablePayload)
  };
  
  const billableResponse = UrlFetchApp.fetch(billableUrl, billableOptions);
  const billableResult = JSON.parse(billableResponse.getContentText());
  const billableItemId = billableResult.billableItem && billableResult.billableItem.id;
  
  if (!billableItemId) {
    throw new Error('Failed to create billable item.');
  }

  const paymentPayload = {
    paymentLink: {
      title: itemName,
      description: "This is a payment for your customized plan.",
      currency: "USD",
      recipients: wixContactId ? [{ sendMethods: ["EMAIL_METHOD"], contactId: wixContactId }] : undefined,
      paymentsLimit: 1,
      type: "ECOM",
      ecomPaymentLink: {
        lineItems: [{
          type: "CATALOG",
          catalogItem: {
            quantity: 1,
            catalogReference: {
              appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e",
              catalogItemId: billableItemId
            }
          }
        }]
      }
    }
  };
  
  const paymentUrl = 'https://www.wixapis.com/payment-links/v1/payment-links';
  const paymentOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BACKEND_CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': BACKEND_CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(paymentPayload)
  };
  
  const paymentResponse = UrlFetchApp.fetch(paymentUrl, paymentOptions);
  const paymentResult = JSON.parse(paymentResponse.getContentText());
  const paymentLinkUrl = paymentResult.paymentLink && paymentResult.paymentLink.links && paymentResult.paymentLink.links.url && paymentResult.paymentLink.links.url.url;
  
  if (!paymentLinkUrl) {
    throw new Error('No payment link URL returned.');
  }
  
  return paymentLinkUrl;
}

function ensureCustomerExists(customerData) {
  const { email, name } = customerData;
  
  const existingCustomer = getRowFromSheet(BACKEND_CONFIG.CUSTOMERS_SHEET, 'email', email);
  if (existingCustomer) {
    return existingCustomer.customer_id;
  }
  
  const customerId = generateCustomerId(name, email);
  const customer = {
    customer_id: customerId,
    name,
    email,
    phone: customerData.phone || '',
    company: customerData.businessName || '',
    address: customerData.address || '',
    customer_status: 'Active',
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    wix_contact_id: ''
  };
  
  addRowToSheet(BACKEND_CONFIG.CUSTOMERS_SHEET, customer);
  return customerId;
}

function generateCustomerId(name, email) {
  // Use email as customer_id
  // Clean the email to make it URL-safe and remove special characters
  const cleanEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '').replace(/[^a-z0-9._-]/g, '_');
  return cleanEmail;
}

function generateOrderId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD_${timestamp}_${random}`;
}

function getSheetData(sheetName) {
  try {
    const sheet = SpreadsheetApp.openById(BACKEND_CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];
    
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  } catch (error) {
    console.error(`Error getting data from ${sheetName}:`, error);
    return [];
  }
}

function getRowFromSheet(sheetName, columnName, value) {
  const data = getSheetData(sheetName);
  return data.find(row => row[columnName] === value);
}

function addRowToSheet(sheetName, rowData) {
  try {
    const sheet = SpreadsheetApp.openById(BACKEND_CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) return false;
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(header => rowData[header] || '');
    
    sheet.appendRow(row);
    return true;
  } catch (error) {
    console.error(`Error adding row to ${sheetName}:`, error);
    return false;
  }
}

function updateRowInSheet(sheetName, columnName, value, updates) {
  try {
    const sheet = SpreadsheetApp.openById(BACKEND_CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) return false;
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const columnIndex = headers.indexOf(columnName);
    
    if (columnIndex === -1) return false;
    
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][columnIndex] === value) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) return false;
    
    Object.keys(updates).forEach(key => {
      const keyIndex = headers.indexOf(key);
      if (keyIndex !== -1) {
        sheet.getRange(rowIndex, keyIndex + 1).setValue(updates[key]);
      }
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating row in ${sheetName}:`, error);
    return false;
  }
}

function createResponse(statusCode, data) {
  // Google Apps Script doesn't support custom status codes in web apps
  // We'll return 200 and include status in the response body
  return ContentService
    .createTextOutput(JSON.stringify({
      ...data,
      _statusCode: statusCode
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function testBackend() {
  console.log('Testing ConsolePro 2.0 Backend...');
  console.log('Configuration:', BACKEND_CONFIG);
  
  try {
    const orders = getSheetData(BACKEND_CONFIG.ORDERS_SHEET);
    console.log(`Orders sheet has ${orders.length} rows`);
  } catch (error) {
    console.error('Error accessing Orders sheet:', error);
  }
  
  try {
    const customers = getSheetData(BACKEND_CONFIG.CUSTOMERS_SHEET);
    console.log(`Customers sheet has ${customers.length} rows`);
  } catch (error) {
    console.error('Error accessing Customers sheet:', error);
  }
  
  console.log('Backend test completed');
} 