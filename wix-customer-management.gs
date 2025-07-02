/**
 * ConsolePro 2.0 - Centralized Google Apps Script Backend
 * Handles robust syncing between Google Sheets and the React app
 * Privacy-focused customer management with minimal Wix exposure
 */

// Configuration - Using existing Wix credentials
const CONFIG = {
  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet().getId(), // Use active spreadsheet
  ORDERS_SHEET: 'Orders',
  CUSTOMERS_SHEET: 'Customers', 
  ARCHIVED_ORDERS_SHEET: 'Archived Orders',
  INVENTORY_SHEET: 'Product',
  WIX_API_URL: 'https://www.wixapis.com/v1',
  WIX_API_KEY: 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjE3NjA4OTM5LWNmODItNGNhMi04ZDMwLTdhODZiYjVjMWYxYlwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjY5MGJlN2M1LTIwZTgtNDMxNC1hNzY4LTNlYzVlNTc5ZTdlY1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIzNzQyNTRlZS05MDQ3LTQ0ODYtYTY4Ni00NmVhNjA3YzZmZGFcIn19IiwiaWF0IjoxNzUxNDU0MTkwfQ.FioMCK1Yu4hmuWOah7Ftb_lto52rXrHZdWdXD15mJCite0QmYfcU7M585LKXC9HG79UWrCtatXnPzJZmWaCJmDsYwQnm58EfLLz0K8lkbqC1Iwsr4_5mFFaaYhrKFkQFXjRP9CVnj9TRJAbXq0RV90iVU901FlXcc25cR62uxuk2FVS4l8j7Ax1RWAs_F5Kg6fNC8qj3HL3Kt7Zsot86bQdsd9H8JlGR9evMbJRLL7_L4v8tV3r79gxlDENZReoS5CU42dEHe7yveaD0z8kaG-DssLaWB5ApdnmNp5edMMxUpqBmoMMIYsNinuWGlyIn3DmAgXGQalICXRX-ycr8GQ',
  WIX_SITE_ID: 'f2af16bf-a8ba-42f3-a5c4-9425564347ac'
};

/**
 * Main function to handle all API requests from the React app
 * Acts as a REST-like backend for the app
 */
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const { action, data } = request;
    
    switch (action) {
      case 'getOrders':
        return handleGetOrders(data);
      case 'getCustomers':
        return handleGetCustomers(data);
      case 'getCustomerOrders':
        return handleGetCustomerOrders(data);
      case 'createOrder':
        return handleCreateOrder(data);
      case 'updateOrder':
        return handleUpdateOrder(data);
      case 'archiveOrder':
        return handleArchiveOrder(data);
      case 'createCustomer':
        return handleCreateCustomer(data);
      case 'updateCustomer':
        return handleUpdateCustomer(data);
      case 'getInventory':
        return handleGetInventory(data);
      case 'updateInventory':
        return handleUpdateInventory(data);
      case 'createWixCustomer':
        return handleCreateWixCustomer(data);
      case 'createWixPaymentLink':
        return handleCreateWixPaymentLink(data);
      case 'syncCustomerToWix':
        return handleSyncCustomerToWix(data);
      default:
        return createResponse(400, { error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return createResponse(500, { error: 'Internal server error', details: error.message });
  }
}

/**
 * Handle GET requests (for testing and direct access)
 */
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

// ============================================================================
// ORDER MANAGEMENT
// ============================================================================

function handleGetOrders(data = {}) {
  const { sheet = 'Orders', customerId, status } = data;
  const sheetName = sheet === 'Archived' ? CONFIG.ARCHIVED_ORDERS_SHEET : CONFIG.ORDERS_SHEET;
  
  const orders = getSheetData(sheetName);
  let filteredOrders = orders;
  
  // Apply filters
  if (customerId) {
    filteredOrders = filteredOrders.filter(order => order.customer_id === customerId);
  }
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  return createResponse(200, { orders: filteredOrders, count: filteredOrders.length });
}

function handleCreateOrder(data) {
  const { customerName, customerEmail, items, total, notes, businessName, phone, address } = data;
  
  // Validate required fields
  if (!customerName || !customerEmail || !items || !total) {
    return createResponse(400, { error: 'Missing required fields' });
  }
  
  // Generate or get customer ID
  const customerId = ensureCustomerExists({
    name: customerName,
    email: customerEmail,
    businessName,
    phone,
    address
  });
  
  // Generate order ID
  const orderId = generateOrderId();
  
  // Create order object
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
    businessName: businessName || '',
    phone: phone || '',
    address: address || '',
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString()
  };
  
  // Add to Orders sheet
  const success = addRowToSheet(CONFIG.ORDERS_SHEET, order);
  
  if (success) {
    return createResponse(200, { 
      orderId, 
      customerId, 
      message: 'Order created successfully' 
    });
  } else {
    return createResponse(500, { error: 'Failed to create order' });
  }
}

function handleUpdateOrder(data) {
  const { orderId, updates } = data;
  
  if (!orderId || !updates) {
    return createResponse(400, { error: 'Missing orderId or updates' });
  }
  
  const success = updateRowInSheet(CONFIG.ORDERS_SHEET, 'orderId', orderId, {
    ...updates,
    last_updated: new Date().toISOString()
  });
  
  if (success) {
    return createResponse(200, { message: 'Order updated successfully' });
  } else {
    return createResponse(500, { error: 'Failed to update order' });
  }
}

function handleArchiveOrder(data) {
  const { orderId } = data;
  
  if (!orderId) {
    return createResponse(400, { error: 'Missing orderId' });
  }
  
  // Get order from Orders sheet
  const order = getRowFromSheet(CONFIG.ORDERS_SHEET, 'orderId', orderId);
  
  if (!order) {
    return createResponse(404, { error: 'Order not found' });
  }
  
  // Add to Archived Orders sheet
  const archiveSuccess = addRowToSheet(CONFIG.ARCHIVED_ORDERS_SHEET, {
    ...order,
    archived_date: new Date().toISOString()
  });
  
  if (archiveSuccess) {
    // Remove from Orders sheet
    const deleteSuccess = deleteRowFromSheet(CONFIG.ORDERS_SHEET, 'orderId', orderId);
    
    if (deleteSuccess) {
      return createResponse(200, { message: 'Order archived successfully' });
    } else {
      return createResponse(500, { error: 'Order archived but failed to remove from active orders' });
    }
  } else {
    return createResponse(500, { error: 'Failed to archive order' });
  }
}

function handleGetCustomerOrders(data) {
  const { customerId } = data;
  
  if (!customerId) {
    return createResponse(400, { error: 'Missing customerId' });
  }
  
  // Get active orders
  const activeOrders = getSheetData(CONFIG.ORDERS_SHEET)
    .filter(order => order.customer_id === customerId);
  
  // Get archived orders
  const archivedOrders = getSheetData(CONFIG.ARCHIVED_ORDERS_SHEET)
    .filter(order => order.customer_id === customerId);
  
  return createResponse(200, {
    activeOrders,
    archivedOrders,
    totalOrders: activeOrders.length + archivedOrders.length
  });
}

// ============================================================================
// CUSTOMER MANAGEMENT
// ============================================================================

function handleGetCustomers(data = {}) {
  const { customerId, email, status } = data;
  const customers = getSheetData(CONFIG.CUSTOMERS_SHEET);
  let filteredCustomers = customers;
  
  // Apply filters
  if (customerId) {
    filteredCustomers = filteredCustomers.filter(customer => customer.customer_id === customerId);
  }
  if (email) {
    filteredCustomers = filteredCustomers.filter(customer => customer.email === email);
  }
  if (status) {
    filteredCustomers = filteredCustomers.filter(customer => customer.customer_status === status);
  }
  
  return createResponse(200, { customers: filteredCustomers, count: filteredCustomers.length });
}

function handleCreateCustomer(data) {
  const { name, email, phone, company, address, notes } = data;
  
  // Validate required fields
  if (!name || !email) {
    return createResponse(400, { error: 'Name and email are required' });
  }
  
  // Check if customer already exists
  const existingCustomer = getRowFromSheet(CONFIG.CUSTOMERS_SHEET, 'email', email);
  if (existingCustomer) {
    return createResponse(409, { error: 'Customer with this email already exists', customerId: existingCustomer.customer_id });
  }
  
  // Generate customer ID
  const customerId = generateCustomerId(name, email);
  
  // Create customer object
  const customer = {
    customer_id: customerId,
    name,
    email,
    phone: phone || '',
    company: company || '',
    address: address || '',
    first_order_date: '',
    last_order_date: '',
    total_orders: '0',
    total_spent: '0',
    customer_status: 'Active',
    preferred_contact: 'email',
    customer_notes: notes || '',
    tags: '',
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    referred_by: '',
    customer_class: 'Standard',
    square_reference_id: '',
    nickname: '',
    birthday: '',
    square_customer_id: '',
    wix_contact_id: ''
  };
  
  // Add to Customers sheet
  const success = addRowToSheet(CONFIG.CUSTOMERS_SHEET, customer);
  
  if (success) {
    return createResponse(200, { customerId, message: 'Customer created successfully' });
  } else {
    return createResponse(500, { error: 'Failed to create customer' });
  }
}

function handleUpdateCustomer(data) {
  const { customerId, updates } = data;
  
  if (!customerId || !updates) {
    return createResponse(400, { error: 'Missing customerId or updates' });
  }
  
  const success = updateRowInSheet(CONFIG.CUSTOMERS_SHEET, 'customer_id', customerId, {
    ...updates,
    last_updated: new Date().toISOString()
  });
  
  if (success) {
    return createResponse(200, { message: 'Customer updated successfully' });
  } else {
    return createResponse(500, { error: 'Failed to update customer' });
  }
}

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

function handleGetInventory(data = {}) {
  const { barcode, category } = data;
  const inventory = getSheetData(CONFIG.INVENTORY_SHEET);
  let filteredInventory = inventory;
  
  // Apply filters
  if (barcode) {
    filteredInventory = filteredInventory.filter(item => item.barcode === barcode);
  }
  if (category) {
    filteredInventory = filteredInventory.filter(item => item.category === category);
  }
  
  return createResponse(200, { inventory: filteredInventory, count: filteredInventory.length });
}

function handleUpdateInventory(data) {
  const { barcode, updates } = data;
  
  if (!barcode || !updates) {
    return createResponse(400, { error: 'Missing barcode or updates' });
  }
  
  const success = updateRowInSheet(CONFIG.INVENTORY_SHEET, 'barcode', barcode, {
    ...updates,
    lastUpdated: new Date().toISOString()
  });
  
  if (success) {
    return createResponse(200, { message: 'Inventory updated successfully' });
  } else {
    return createResponse(500, { error: 'Failed to update inventory' });
  }
}

// ============================================================================
// WIX INTEGRATION (MINIMAL & PRIVACY-FOCUSED)
// ============================================================================

function handleCreateWixCustomer(data) {
  const { customerId } = data;
  
  if (!customerId) {
    return createResponse(400, { error: 'Missing customerId' });
  }
  
  // Get customer data
  const customer = getRowFromSheet(CONFIG.CUSTOMERS_SHEET, 'customer_id', customerId);
  if (!customer) {
    return createResponse(404, { error: 'Customer not found' });
  }
  
  try {
    // Use existing proven Wix contact creation method
    const wixId = createCustomerInWix(customer);
    
    // Update customer with Wix contact ID
    updateRowInSheet(CONFIG.CUSTOMERS_SHEET, 'customer_id', customerId, {
      wix_contact_id: wixId
    });
    
    return createResponse(200, { 
      wixContactId: wixId,
      message: 'Wix customer created successfully' 
    });
  } catch (error) {
    return createResponse(500, { error: 'Wix API error', details: error.message });
  }
}

// Use existing proven Wix contact creation method
function createCustomerInWix(customerData) {
  const url = 'https://www.wixapis.com/contacts/v4/contacts';
  const email = safeString(customerData.email);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid or missing email address for customer.');
  }
  
  // Split customerName into first/last
  let firstName = safeString(customerData.name);
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
      phones: safeString(customerData.phone) ? {
        items: [{
          tag: "HOME",
          countryCode: "US",
          phone: safeString(customerData.phone)
        }]
      } : undefined,
      addresses: (safeString(customerData.address)) ? {
        items: [{
          tag: "SHIPPING",
          address: {
            country: "US",
            addressLine: safeString(customerData.address)
          }
        }]
      } : undefined
    }
  };

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

function handleCreateWixPaymentLink(data) {
  const { orderId, customerId, amount, description } = data;
  
  if (!orderId || !amount) {
    return createResponse(400, { error: 'Missing orderId or amount' });
  }
  
  // Get customer Wix contact ID
  let wixContactId = null;
  if (customerId) {
    const customer = getRowFromSheet(CONFIG.CUSTOMERS_SHEET, 'customer_id', customerId);
    if (customer && customer.wix_contact_id) {
      wixContactId = customer.wix_contact_id;
    }
  }
  
  try {
    // Use existing proven payment link creation method
    const paymentUrl = createWixBillableItemAndPaymentLink(orderId, amount, wixContactId, description);
    
    // Update order with payment link
    updateRowInSheet(CONFIG.ORDERS_SHEET, 'orderId', orderId, {
      payment_link: paymentUrl
    });
    
    return createResponse(200, { 
      paymentLink: paymentUrl,
      message: 'Payment link created successfully' 
    });
  } catch (error) {
    return createResponse(500, { error: 'Wix API error', details: error.message });
  }
}

// Use existing proven payment link creation method
function createWixBillableItemAndPaymentLink(orderId, amount, wixContactId, description) {
  const itemName = description || "Weight Loss Plan, Customized features, Add-on Consultations";
  const itemDescription = "This is a payment for your customized plan.";
  const priceString = parseFloat(amount).toFixed(2);

  // 1. Create Billable Item
  const billablePayload = {
    billableItem: {
      name: itemName,
      description: itemDescription,
      price: priceString
    }
  };
  
  const billableUrl = 'https://www.wixapis.com/billable-items/v1/billable-items';
  const billableOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(billablePayload)
  };
  
  const billableResponse = UrlFetchApp.fetch(billableUrl, billableOptions);
  const billableResult = JSON.parse(billableResponse.getContentText());
  const billableItemId = billableResult.billableItem && billableResult.billableItem.id;
  
  if (!billableItemId) {
    throw new Error('Failed to create billable item.');
  }

  // 2. Create Payment Link using the Billable Item
  const paymentPayload = {
    paymentLink: {
      title: itemName,
      description: itemDescription,
      currency: "USD",
      recipients: wixContactId ? [
        {
          sendMethods: ["EMAIL_METHOD"],
          contactId: wixContactId
        }
      ] : undefined,
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
            }
          }
        ]
      }
    }
  };
  
  const paymentUrl = 'https://www.wixapis.com/payment-links/v1/payment-links';
  const paymentOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': CONFIG.WIX_SITE_ID
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

function handleSyncCustomerToWix(data) {
  const { customerId } = data;
  
  if (!customerId) {
    return createResponse(400, { error: 'Missing customerId' });
  }
  
  // First create Wix customer if not exists
  const createResult = handleCreateWixCustomer({ customerId });
  if (createResult.getResponseCode() !== 200) {
    return createResult;
  }
  
  return createResponse(200, { message: 'Customer synced to Wix successfully' });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Helper to ensure only valid strings are sent to Wix (from existing setup)
function safeString(val) {
  return (typeof val === 'string' && val.trim() !== '') ? val.trim() : undefined;
}

function ensureCustomerExists(customerData) {
  const { email, name } = customerData;
  
  // Check if customer exists
  const existingCustomer = getRowFromSheet(CONFIG.CUSTOMERS_SHEET, 'email', email);
  if (existingCustomer) {
    return existingCustomer.customer_id;
  }
  
  // Create new customer
  const customerId = generateCustomerId(name, email);
  const customer = {
    customer_id: customerId,
    name,
    email,
    phone: customerData.phone || '',
    company: customerData.businessName || '',
    address: customerData.address || '',
    first_order_date: new Date().toISOString(),
    last_order_date: new Date().toISOString(),
    total_orders: '1',
    total_spent: '0',
    customer_status: 'Active',
    preferred_contact: 'email',
    customer_notes: '',
    tags: '',
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    referred_by: '',
    customer_class: 'Standard',
    square_reference_id: '',
    nickname: '',
    birthday: '',
    square_customer_id: '',
    wix_contact_id: ''
  };
  
  addRowToSheet(CONFIG.CUSTOMERS_SHEET, customer);
  return customerId;
}

function generateCustomerId(name, email) {
  const timestamp = new Date().getTime();
  const namePart = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
  const emailPart = email.split('@')[0].substring(0, 3).toUpperCase();
  return `CUST_${namePart}${emailPart}_${timestamp}`;
}

function generateOrderId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD_${timestamp}_${random}`;
}

function getSheetData(sheetName) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
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
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
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
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const columnIndex = headers.indexOf(columnName);
    
    if (columnIndex === -1) {
      throw new Error(`Column ${columnName} not found`);
    }
    
    // Find the row to update
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][columnIndex] === value) {
        rowIndex = i + 1; // +1 because sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error(`Row with ${columnName} = ${value} not found`);
    }
    
    // Update the row
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

function deleteRowFromSheet(sheetName, columnName, value) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const columnIndex = headers.indexOf(columnName);
    
    if (columnIndex === -1) {
      throw new Error(`Column ${columnName} not found`);
    }
    
    // Find the row to delete
    for (let i = 1; i < data.length; i++) {
      if (data[i][columnIndex] === value) {
        sheet.deleteRow(i + 1); // +1 because sheet rows are 1-indexed
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error deleting row from ${sheetName}:`, error);
    return false;
  }
}

function createResponse(statusCode, data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setStatusCode(statusCode);
}

// ============================================================================
// TESTING FUNCTIONS
// ============================================================================

function testBackend() {
  console.log('Testing ConsolePro 2.0 Backend...');
  
  // Test configuration
  console.log('Configuration:', CONFIG);
  
  // Test sheet access
  try {
    const orders = getSheetData(CONFIG.ORDERS_SHEET);
    console.log(`Orders sheet has ${orders.length} rows`);
  } catch (error) {
    console.error('Error accessing Orders sheet:', error);
  }
  
  try {
    const customers = getSheetData(CONFIG.CUSTOMERS_SHEET);
    console.log(`Customers sheet has ${customers.length} rows`);
  } catch (error) {
    console.error('Error accessing Customers sheet:', error);
  }
  
  // Test Wix connection
  try {
    const testResult = testWixConnection();
    console.log('Wix connection test:', testResult);
  } catch (error) {
    console.error('Wix connection test failed:', error);
  }
  
  console.log('Backend test completed');
}

// Test Wix API connection (from existing setup)
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
      return '✅ Wix API connection successful!';
    } else {
      return `❌ Wix API connection failed: ${response.getResponseCode()}`;
    }
  } catch (error) {
    return `❌ Wix API connection error: ${error.message}`;
  }
}

function setupWebhook() {
  const webhookUrl = ScriptApp.getService().getUrl();
  console.log('Webhook URL:', webhookUrl);
  return webhookUrl;
} 