function doGet(e) {
  try {
    Logger.log('Request received');
    Logger.log('Parameters: ' + JSON.stringify(e.parameter));
    
    const action = e.parameter.action;
    const orderId = e.parameter.orderId;
    const stripeKey = e.parameter.stripeKey;
    const wixApiKey = e.parameter.wixApiKey;
    const wixSiteId = e.parameter.wixSiteId;
    
    if (!action) {
      return simpleTest();
    }
    
    if (action === 'simpleTest') {
      return simpleTest();
    }
    
    if (action === 'createStripeInvoice') {
      return handleCreateStripeInvoice(orderId, stripeKey, wixApiKey, wixSiteId);
    }
    
    if (action === 'testConnection') {
      return handleTestConnection(stripeKey, wixApiKey, wixSiteId);
    }
    
    throw new Error('Unknown action: ' + action);
    
  } catch (error) {
    Logger.log('ERROR in doGet: ' + error.message);
    return createErrorResponse(error.message);
  }
}

function simpleTest() {
  try {
    const orderId = '8df61394-28f1-472a-97a0-fe5ced00ddb3';
    const orderData = getOrderDataFromSheet(orderId);
    
    const response = {
      success: true,
      message: "Google Apps Script is working!",
      orderData: orderData
    };
    
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    const response = {
      success: false,
      error: error.message
    };
    
    return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleCreateStripeInvoice(orderId, stripeKey, wixApiKey, wixSiteId) {
  try {
    if (!orderId) throw new Error('Order ID is required');
    if (!stripeKey) throw new Error('Stripe API key is required');
    
    Logger.log('Creating invoice for wix_order_id: ' + orderId);
    
    // Since we manage orders in Google Sheets, go directly to sheet data
    // Skip Wix API entirely to avoid errors
    Logger.log('Getting order data from Google Sheets...');
    const orderData = getOrderDataFromSheet(orderId);
    
    if (!orderData) {
      throw new Error('Failed to extract order data from Google Sheets');
    }
    
    Logger.log('Order data extracted successfully: ' + JSON.stringify(orderData));
    
    const stripeResult = createStripeInvoice(orderData, stripeKey);
    
    updateSheetWithInvoiceData(orderId, stripeResult);
    
    sendStripeInvoice(stripeResult.invoiceId, stripeKey);
    
    Logger.log('Invoice created successfully: ' + stripeResult.invoiceId);
    
    return createSuccessResponse({
      message: "Stripe invoice created and sent successfully",
      orderId: orderId,
      invoiceId: stripeResult.invoiceId,
      invoiceUrl: stripeResult.invoiceUrl,
      invoicePdf: stripeResult.invoicePdf
    });
    
  } catch (error) {
    Logger.log('ERROR in handleCreateStripeInvoice: ' + error.message);
    return createErrorResponse(error.message);
  }
}

function fetchWixOrder(orderId, wixApiKey, wixSiteId) {
  try {
    Logger.log('Fetching Wix order: ' + orderId);
    
    const url = 'https://www.wixapis.com/v1/orders/' + orderId;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': wixApiKey,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('Wix API response: ' + responseCode);
    
    if (responseCode !== 200) {
      const errorData = JSON.parse(responseText);
      throw new Error('Wix API error (' + responseCode + '): ' + (errorData.message || responseText));
    }
    
    const result = JSON.parse(responseText);
    return result.order;
    
  } catch (error) {
    Logger.log('ERROR fetching Wix order: ' + error.message);
    throw new Error('Failed to fetch Wix order: ' + error.message);
  }
}

function validateAndExtractOrderData(wixOrder, orderId) {
  try {
    Logger.log('validateAndExtractOrderData called with orderId: ' + orderId);
    
    // Always try sheet data first since we're managing orders in Google Sheets
    Logger.log('Attempting to get data from sheet first...');
    try {
      const sheetData = getOrderDataFromSheet(orderId);
      Logger.log('Sheet data found: ' + JSON.stringify(sheetData));
      return sheetData;
    } catch (sheetError) {
      Logger.log('Sheet data not found: ' + sheetError.message);
    }
    
    // Only try Wix if sheet data failed and we have a Wix order
    if (wixOrder) {
      Logger.log('Processing Wix order data...');
      
      const buyerInfo = wixOrder.buyerInfo || {};
      const customerEmail = buyerInfo.email;
      const customerName = (buyerInfo.firstName || '') + ' ' + (buyerInfo.lastName || '');
      
      const priceData = wixOrder.priceData || {};
      const totalAmount = parseFloat(priceData.total) || 0;
      
      const lineItems = wixOrder.lineItems || [];
      const orderDescription = lineItems.map(function(item) {
        return item.title || item.name;
      }).filter(Boolean).join(', ');
      
      if (!customerEmail) {
        throw new Error('Customer email not found in Wix order');
      }
      
      if (totalAmount <= 0) {
        throw new Error('Invalid order total: $' + totalAmount);
      }
      
      if (!orderDescription) {
        throw new Error('No line items found in order');
      }
      
      Logger.log('Wix order data validated - Customer: ' + customerName + ' (' + customerEmail + '), Total: $' + totalAmount);
      
      const wixResult = {
        customerEmail: customerEmail,
        customerName: customerName || 'Customer',
        totalAmount: totalAmount,
        orderDescription: orderDescription,
        orderId: orderId,
        currency: priceData.currency || 'usd'
      };
      
      Logger.log('Wix data result: ' + JSON.stringify(wixResult));
      return wixResult;
    }
    
    throw new Error('No order data found in either Google Sheets or Wix');
    
  } catch (error) {
    Logger.log('ERROR in validateAndExtractOrderData: ' + error.message);
    throw error;
  }
}

function getOrderDataFromSheet(orderId) {
  Logger.log('Getting order data from sheet for wix_order_id: ' + orderId);
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  Logger.log('Sheet has ' + data.length + ' rows');
  Logger.log('Headers: ' + JSON.stringify(headers));
  
  const wixOrderIdCol = headers.findIndex(function(h) { return h === 'wix_order_id'; });
  const emailCol = headers.findIndex(function(h) { return h === 'Email'; });
  const customerNameCol = headers.findIndex(function(h) { return h === 'Customer_Name'; });
  const totalAmountCol = headers.findIndex(function(h) { return h === 'Total_Amount'; });
  
  Logger.log('Column indices: wixOrderId=' + wixOrderIdCol + ', email=' + emailCol + ', customerName=' + customerNameCol + ', totalAmount=' + totalAmountCol);
  
  if (wixOrderIdCol === -1) throw new Error('wix_order_id column not found');
  if (emailCol === -1) throw new Error('Email column not found');
  if (totalAmountCol === -1) throw new Error('Total_Amount column not found');
  
  // Debug: Log all wix_order_id values to see what's in the sheet
  Logger.log('=== DEBUG: All wix_order_id values in sheet ===');
  for (let i = 1; i < Math.min(data.length, 6); i++) { // Only log first 5 rows
    const rowWixOrderId = data[i][wixOrderIdCol];
    Logger.log('Row ' + i + ' wix_order_id: "' + rowWixOrderId + '" (type: ' + typeof rowWixOrderId + ')');
  }
  Logger.log('Looking for: "' + orderId + '" (type: ' + typeof orderId + ')');
  Logger.log('=== END DEBUG ===');
  
  for (let i = 1; i < data.length; i++) {
    const rowWixOrderId = data[i][wixOrderIdCol];
    
    if (rowWixOrderId === orderId) {
      Logger.log('Found matching row ' + i);
      
      const customerEmail = data[i][emailCol];
      const customerName = data[i][customerNameCol] || 'Customer';
      const totalAmountRaw = data[i][totalAmountCol];
      
      Logger.log('Raw values: email="' + customerEmail + '", name="' + customerName + '", total="' + totalAmountRaw + '" (' + typeof totalAmountRaw + ')');
      
      let totalAmount = 0;
      if (totalAmountRaw != null && totalAmountRaw !== '') {
        if (typeof totalAmountRaw === 'number') {
          totalAmount = totalAmountRaw;
        } else {
          totalAmount = parseFloat(String(totalAmountRaw).replace(/[$,]/g, '')) || 0;
        }
      }
      
      Logger.log('Processed totalAmount: ' + totalAmount);
      
      const orderDescription = buildProductDescriptionFromSheet(data[i], headers);
      
      if (!customerEmail) throw new Error('Customer email is empty');
      if (totalAmount <= 0) throw new Error('Invalid total amount: ' + totalAmount);
      
      const result = {
        customerEmail: customerEmail,
        customerName: customerName,
        totalAmount: totalAmount,
        orderDescription: orderDescription || 'Order ' + orderId,
        orderId: orderId,
        currency: 'usd'
      };
      
      Logger.log('Success! Result: ' + JSON.stringify(result));
      return result;
    }
  }
  
  throw new Error('wix_order_id "' + orderId + '" not found in sheet');
}

function buildProductDescriptionFromSheet(rowData, headers) {
  const products = [];
  
  for (let i = 1; i <= 10; i++) {
    const nameCol = headers.findIndex(function(h) { return h === 'Product_' + i + '_Name'; });
    const quantityCol = headers.findIndex(function(h) { return h === 'Product_' + i + '_Quantity'; });
    
    if (nameCol !== -1 && rowData[nameCol]) {
      const productName = rowData[nameCol];
      const quantity = rowData[quantityCol] || 1;
      
      if (quantity > 1) {
        products.push(productName + ' (' + quantity + ')');
      } else {
        products.push(productName);
      }
    }
  }
  
  return products.join(', ');
}

function createStripeInvoice(orderData, stripeKey) {
  try {
    Logger.log('Creating Stripe invoice...');
    Logger.log('Order data received: ' + JSON.stringify(orderData));
    
    if (!orderData) {
      throw new Error('orderData is null or undefined');
    }
    
    if (!orderData.customerEmail) {
      throw new Error('orderData.customerEmail is missing');
    }
    
    const customer = findOrCreateStripeCustomer(orderData.customerEmail, orderData.customerName, stripeKey);
    
    const invoicePayload = {
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 30,
      auto_advance: false,
      metadata: {
        wix_order_id: orderData.orderId,
        customer_name: orderData.customerName
      }
    };
    
    const invoice = callStripeAPI('invoices', 'POST', invoicePayload, stripeKey);
    
    const lineItemPayload = {
      invoice: invoice.id,
      price_data: {
        currency: orderData.currency.toLowerCase(),
        product_data: {
          name: 'Order ' + orderData.orderId,
          description: orderData.orderDescription
        },
        unit_amount: Math.round(orderData.totalAmount * 100)
      },
      quantity: 1
    };
    
    callStripeAPI('invoice_items', 'POST', lineItemPayload, stripeKey);
    
    const finalizedInvoice = callStripeAPI('invoices/' + invoice.id + '/finalize', 'POST', {}, stripeKey);
    
    Logger.log('Stripe invoice created: ' + finalizedInvoice.id);
    
    return {
      invoiceId: finalizedInvoice.id,
      invoiceUrl: finalizedInvoice.hosted_invoice_url,
      invoicePdf: finalizedInvoice.invoice_pdf,
      customerId: customer.id
    };
    
  } catch (error) {
    Logger.log('ERROR creating Stripe invoice: ' + error.message);
    throw error;
  }
}

function findOrCreateStripeCustomer(email, name, stripeKey) {
  try {
    const searchResult = callStripeAPI('customers/search?query=email:\'' + email + '\'', 'GET', null, stripeKey);
    
    if (searchResult.data && searchResult.data.length > 0) {
      Logger.log('Found existing customer: ' + searchResult.data[0].id);
      return searchResult.data[0];
    }
    
    const customerData = {
      email: email,
      name: name,
      metadata: {
        source: 'wix_order_automation'
      }
    };
    
    const newCustomer = callStripeAPI('customers', 'POST', customerData, stripeKey);
    Logger.log('Created new customer: ' + newCustomer.id);
    
    return newCustomer;
    
  } catch (error) {
    Logger.log('ERROR with customer: ' + error.message);
    throw error;
  }
}

function callStripeAPI(endpoint, method, payload, stripeKey) {
  try {
    Logger.log('callStripeAPI called with endpoint: ' + endpoint);
    
    if (!endpoint) {
      throw new Error('Endpoint is required');
    }
    
    if (!stripeKey) {
      throw new Error('Stripe API key is required');
    }
    
    const url = 'https://api.stripe.com/v1/' + endpoint;
    Logger.log('Stripe API URL: ' + url);
    
    const options = {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + stripeKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2024-12-18' // Updated to latest version
      },
      muteHttpExceptions: true
    };
    
    if (payload && method !== 'GET') {
      const formData = [];
      for (const key in payload) {
        const value = payload[key];
        if (typeof value === 'object') {
          for (const subKey in value) {
            formData.push(key + '[' + subKey + ']=' + encodeURIComponent(value[subKey]));
          }
        } else {
          formData.push(key + '=' + encodeURIComponent(value));
        }
      }
      options.payload = formData.join('&');
    }
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('Stripe API response: ' + responseCode);
    
    if (responseCode < 200 || responseCode >= 300) {
      const errorData = JSON.parse(responseText);
      throw new Error('Stripe API error (' + responseCode + '): ' + (errorData.error ? errorData.error.message : responseText));
    }
    
    return JSON.parse(responseText);
    
  } catch (error) {
    Logger.log('ERROR calling Stripe API ' + endpoint + ': ' + error.message);
    throw error;
  }
}

function sendStripeInvoice(invoiceId, stripeKey) {
  try {
    Logger.log('Sending invoice: ' + invoiceId);
    
    const result = callStripeAPI('invoices/' + invoiceId + '/send', 'POST', {}, stripeKey);
    
    Logger.log('Invoice sent successfully');
    return result;
    
  } catch (error) {
    Logger.log('ERROR sending invoice: ' + error.message);
    Logger.log('Invoice created but failed to send automatically');
  }
}

function updateSheetWithInvoiceData(orderId, stripeResult) {
  try {
    Logger.log('Updating Google Sheet...');
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
    if (!sheet) {
      throw new Error('Orders sheet not found');
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length === 0) {
      throw new Error('Sheet is empty');
    }
    
    const headers = data[0];
    
    const wixOrderIdCol = headers.findIndex(function(h) { return h === 'wix_order_id'; });
    
    if (wixOrderIdCol === -1) {
      throw new Error('Could not find wix_order_id column in sheet');
    }
    
    const invoiceStatusCol = headers.findIndex(function(h) { return h === 'Invoice_Status'; });
    const invoiceLinkCol = headers.findIndex(function(h) { return h === 'invoice_link'; });
    const wixInvoiceIdCol = headers.findIndex(function(h) { return h === 'wix_invoice_id'; });
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][wixOrderIdCol] === orderId) {
        
        if (invoiceStatusCol !== -1) {
          sheet.getRange(i + 1, invoiceStatusCol + 1).setValue('Stripe Invoice Sent');
        }
        
        if (invoiceLinkCol !== -1) {
          sheet.getRange(i + 1, invoiceLinkCol + 1).setValue(stripeResult.invoiceUrl);
        }
        
        if (wixInvoiceIdCol !== -1) {
          sheet.getRange(i + 1, wixInvoiceIdCol + 1).setValue(stripeResult.invoiceId);
        }
        
        Logger.log('Updated sheet row ' + (i + 1) + ' for wix_order_id ' + orderId);
        Logger.log('   - Invoice Status: Stripe Invoice Sent');
        Logger.log('   - Invoice Link: ' + stripeResult.invoiceUrl);
        Logger.log('   - Stripe Invoice ID: ' + stripeResult.invoiceId);
        return;
      }
    }
    
    Logger.log('wix_order_id ' + orderId + ' not found in sheet');
    
  } catch (error) {
    Logger.log('ERROR updating sheet: ' + error.message);
  }
}

function handleTestConnection(stripeKey, wixApiKey, wixSiteId) {
  const results = {
    stripe: false,
    wix: false,
    sheet: false,
    errors: []
  };
  
  Logger.log('Testing connections...');
  Logger.log('Stripe key provided: ' + !!stripeKey);
  Logger.log('Wix API key provided: ' + !!wixApiKey);
  Logger.log('Wix Site ID provided: ' + !!wixSiteId);
  
  if (stripeKey) {
    try {
      Logger.log('Testing Stripe API...');
      const stripeResult = callStripeAPI('account', 'GET', null, stripeKey);
      Logger.log('Stripe API test successful: ' + stripeResult.id);
      results.stripe = true;
    } catch (error) {
      Logger.log('Stripe API test failed: ' + error.message);
      results.errors.push('Stripe: ' + error.message);
    }
  } else {
    results.errors.push('Stripe: API key not provided');
  }
  
  if (wixApiKey && wixSiteId) {
    try {
      Logger.log('Testing Wix API...');
      fetchWixOrder('test', wixApiKey, wixSiteId);
    } catch (error) {
      Logger.log('Wix API test result: ' + error.message);
      if (error.message.includes('404') || error.message.includes('not found')) {
        results.wix = true;
      } else {
        results.errors.push('Wix: ' + error.message);
      }
    }
  } else {
    results.errors.push('Wix: API key or Site ID not provided (will use sheet data)');
  }
  
  try {
    Logger.log('Testing Google Sheet access...');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      results.sheet = data.length > 0;
      Logger.log('Sheet test successful: ' + data.length + ' rows found');
      if (!results.sheet) {
        results.errors.push('Sheet: Orders sheet is empty');
      }
    } else {
      results.errors.push('Sheet: Orders sheet not found');
    }
  } catch (error) {
    Logger.log('Sheet test failed: ' + error.message);
    results.errors.push('Sheet: ' + error.message);
  }
  
  Logger.log('Test results: ' + JSON.stringify(results));
  return createSuccessResponse(results);
}

function createSuccessResponse(data) {
  const response = {
    success: true,
    data: data
  };
  
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  const response = {
    success: false,
    error: message
  };
  
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function testOrderDataOnly() {
  try {
    Logger.log('=== TESTING ORDER DATA EXTRACTION ONLY ===');
    
    const orderId = '8df61394-28f1-472a-97a0-fe5ced00ddb3';
    Logger.log('Testing with order ID: ' + orderId);
    
    const orderData = validateAndExtractOrderData(null, orderId);
    Logger.log('✅ Order data extracted successfully:');
    Logger.log('  Customer: ' + orderData.customerName);
    Logger.log('  Email: ' + orderData.customerEmail);
    Logger.log('  Total: $' + orderData.totalAmount);
    Logger.log('  Products: ' + orderData.orderDescription);
    
    return orderData;
    
  } catch (error) {
    Logger.log('❌ ERROR: ' + error.message);
    return null;
  }
} 