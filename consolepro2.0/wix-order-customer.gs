/**
 * STANDALONE SCRIPT: Wix Customer and Payment Link Creator
 * Updated to work with sorted data (newest on top)
 */

const STANDALONE_CONFIG = {
  WIX_API_KEY: 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjBjYzMzMjAwLWQxYWUtNGY0ZC1iYjA1LTJjZGQ1OTgxYjYyMlwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjRiOTQ4ZjI1LTY5ZDktNDM3OS05Zjc0LTVmODMxNWExZDgyYlwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIzNzQyNTRlZS05MDQ3LTQ0ODYtYTY4Ni00NmVhNjA3YzZmZGFcIn19IiwiaWF0IjoxNzUxNTAxOTEzfQ.DqFX3v-Zd_al27eKBr82T7saU6MwEAYAurGT1AtSMVEXYndSXiEJ1eGhrbyJDY_xP8MZRKIUhRaw5ayZMMDfcRqTF1vj0MGMVH14f_suNwgOfvbWp6eyTx9Qfb9cr5_M1_4hLSqvrQisyqnIehT2iQKcFr-0GUiGLWKEZWe7QjFNro4HSFfgOn6GN4kuyPniNi2k591tG3fJXPFnwgcXf_EHoXU9fzKUlCPko4_3tDeq6l75Z8DOIq9wZYEZPJzXZdOzRnNT8hap8QkQpr_9pVTL1211SelSPTwtsOAfvHwbu2dZJIEthh35ddjuqvNju389Ug0Cuu1OqSTMbwUzZQ',
  WIX_SITE_ID: 'f2af16bf-a8ba-42f3-a5c4-9425564347ac'
};

// Helper to ensure only valid strings are sent to Wix
function safeString(val) {
  return (typeof val === 'string' && val.trim() !== '') ? val.trim() : undefined;
}

// Generate a valid GUID for line items
function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create a Wix eCommerce order using the official API structure
 */
function createWixOrder(contactId, totalAmount, orderData) {
  const url = 'https://www.wixapis.com/ecom/v1/orders';
  
  const orderPayload = {
    order: {
      buyerInfo: {
        contactId: contactId,
        email: orderData.customerEmail
      },
      priceSummary: {
        subtotal: {
          amount: totalAmount.toFixed(2),
          formattedAmount: `$${totalAmount.toFixed(2)}`
        },
        total: {
          amount: totalAmount.toFixed(2),
          formattedAmount: `$${totalAmount.toFixed(2)}`
        }
      },
      billingInfo: {
        address: {
          country: "US",
          subdivision: orderData.state ? `US-${orderData.state}` : "US-AZ",
          city: String(orderData.city || "Phoenix"),
          postalCode: String(orderData.zipCode || "85001"),
          addressLine: String(orderData.address || "123 Main St")
        },
        contactDetails: {
          firstName: String(orderData.customerName.split(' ')[0] || "Customer"),
          lastName: String(orderData.customerName.split(' ').slice(1).join(' ') || ""),
          phone: String(orderData.customerPhone || "")
        }
      },
      status: "APPROVED",
      lineItems: [
        {
          id: generateGUID(),
          productName: {
            original: "Weight Loss Plan Payment"
          },
          quantity: 1,
          totalDiscount: {
            amount: "0",
            formattedAmount: "$0.00"
          },
          itemType: {
            preset: "CUSTOM"
          },
          price: {
            amount: totalAmount.toFixed(2),
            formattedAmount: `${totalAmount.toFixed(2)}`
          },
          taxDetails: {
            taxRate: "0",
            totalTax: {
              amount: "0",
              formattedAmount: "$0.00"
            }
          },
          totalPriceBeforeTax: {
            amount: totalAmount.toFixed(2),
            formattedAmount: `${totalAmount.toFixed(2)}`
          },
          totalPriceAfterTax: {
            amount: totalAmount.toFixed(2),
            formattedAmount: `${totalAmount.toFixed(2)}`
          },
          paymentOption: "FULL_PAYMENT_ONLINE",
          lineItemPrice: {
            amount: totalAmount.toFixed(2),
            formattedAmount: `${totalAmount.toFixed(2)}`
          }
        }
      ],
      channelInfo: {
        type: "BACKOFFICE_MERCHANT"
      },
      paymentStatus: "NOT_PAID",
      currency: "USD",
      taxIncludedInPrices: false
    }
  };

  console.log("Wix Order Payload: " + JSON.stringify(orderPayload, null, 2));

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STANDALONE_CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': STANDALONE_CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(orderPayload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  console.log(`Order Response Code: ${response.getResponseCode()}`);
  console.log(`Order Response: ${response.getContentText()}`);
  
  const result = JSON.parse(response.getContentText());
  
  if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
    return result.order.id;
  } else {
    throw new Error(`Wix order creation failed: ${response.getContentText()}`);
  }
}

/**
 * MAIN FUNCTION: Create Wix customer and payment link from order (combined function)
 * Updated to work with sorted data (newest on top)
 */
function createWixCustomerAndPaymentLink(e) {
  try {
    var sheet, row, orderId;
    
    if (e && e.range) {
      // Called by trigger
      sheet = e.source.getActiveSheet();
      row = e.range.getRow();
      
      // Only process Orders sheet
      if (sheet.getName() !== 'Orders') {
        console.log('Not Orders sheet, skipping');
        return;
      }
      
      // Skip header row
      if (row === 1) {
        console.log('Header row changed, skipping');
        return;
      }
      
      // Get Order_Code directly from the changed row
      orderId = sheet.getRange(row, 2).getValue();
      if (!orderId) {
        console.log(`No Order_Code found in row ${row}, skipping`);
        return;
      }
      
      // Check for required data in the row
      var customerName = sheet.getRange(row, 4).getValue(); // Column D = Customer_Name
      var customerEmail = sheet.getRange(row, 6).getValue(); // Column F = Email
      if (!customerName || !customerEmail) {
        console.log(`Row ${row} missing required data, skipping`);
        return;
      }
      
      console.log(`Auto-processing new order: ${orderId} in row ${row}`);
      
    } else {
      // Called manually
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      row = sheet.getActiveRange().getRow();
      
      // Skip header row
      if (row === 1) {
        throw new Error('Please select a data row, not the header row');
      }
      
      // Get Order_Code directly from selected row
      orderId = sheet.getRange(row, 2).getValue();
      console.log(`Manual processing, row: ${row}, Order ID: ${orderId}`);
    }
    
    if (!orderId) {
      throw new Error('No Order_Code found in selected row');
    }
    
    console.log(`Creating Wix customer and payment link for order: ${orderId}`);
    
    // Step 1: Get order data by searching for the Order_Code
    const order = findOrderById(sheet, orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Step 2: Check if customer already exists in Wix
    const existing = findExistingWixContact(order.customerEmail);
    let wixContactId;
    
    if (existing) {
      console.log(`Customer already exists in Wix (ID: ${existing.id})`);
      wixContactId = existing.id;
      updateOrderWixStatus(orderId, 'Already Exists', existing.id);
    } else {
      // Step 3: Create customer in Wix
      console.log('Creating new customer in Wix...');
      wixContactId = createCustomerInWix(order);
      updateOrderWixStatus(orderId, 'Created', wixContactId);
      console.log(`Customer created in Wix (ID: ${wixContactId})`);
    }
    
    // Step 4: Get total amount for payment link
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    
    // Find the order data by Order_Code (since data might be sorted)
    var orderRowData = null;
    var orderRowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === orderId) { // Column B = Order_Code
        orderRowData = data[i];
        orderRowIndex = i;
        break;
      }
    }
    
    if (!orderRowData) {
      throw new Error('Order row not found in data');
    }
    
    var totalColIndex = headers.findIndex(h => h === ' Total_Amount ');
    console.log(`Total_Amount column index: ${totalColIndex}`);
    
    if (totalColIndex === -1) {
      totalColIndex = headers.findIndex(h => h === 'Total_Amount');
      console.log(`Total_Amount (no spaces) column index: ${totalColIndex}`);
    }
    
    if (totalColIndex === -1) {
      totalColIndex = headers.findIndex(h => h && h.toString().trim() === 'Total_Amount');
      console.log(`Total_Amount (trimmed) column index: ${totalColIndex}`);
    }
    
    if (totalColIndex === -1) {
      throw new Error(`Could not find Total_Amount column. Available headers: ${headers.join(', ')}`);
    }
    
    var totalStr = orderRowData[totalColIndex];
    
    console.log(`Raw Total_Amount from sheet: "${totalStr}"`);
    console.log(`Total_Amount type: ${typeof totalStr}`);
    
    // More robust total amount parsing
    if (!totalStr) {
      throw new Error(`Total amount is empty for this order`);
    }
    
    var total = Number(totalStr);
    
    if (!total || isNaN(total) || total <= 0) {
      throw new Error(`Invalid total amount: ${total}`);
    }
    
    // Step 5: Create Wix order first, then payment link
    console.log('Creating Wix order...');
    const wixOrderId = createWixOrder(wixContactId, total, order);
    console.log(`Wix order created: ${wixOrderId}`);
    
    // Save Wix Order ID back to the sheet for future invoice matching
    updateOrderWithWixOrderId(orderId, wixOrderId);
    
    // Step 6: Create payment link using catalog item without price override
    console.log('Creating payment link with catalog item (no price override)...');
    var payload = {
      paymentLink: {
        title: "Weight Loss Plan Payment",
        description: `Payment for order ${order.orderId} - Amount: ${total.toFixed(2)}`,
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
                  appId: "215238eb-22a5-4c36-9e7b-e7c08025e04e", // Wix Stores app ID
                  catalogItemId: "f04ea8a1-262a-b9ec-6cac-2d6cd10fdea5" // Your Weight Loss Plan product
                }
              }
            }
          ]
        }
      }
    };
    
    console.log("Payment Link Payload: " + JSON.stringify(payload, null, 2));
    
    var url = 'https://www.wixapis.com/payment-links/v1/payment-links';
    var options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STANDALONE_CONFIG.WIX_API_KEY}`,
        'Content-Type': 'application/json',
        'wix-site-id': STANDALONE_CONFIG.WIX_SITE_ID
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true  // This will show us the full error
    };
    
    var response = UrlFetchApp.fetch(url, options);
    console.log(`Response Code: ${response.getResponseCode()}`);
    console.log(`Full Response: ${response.getContentText()}`);
    
    var result = JSON.parse(response.getContentText());
    
    if (response.getResponseCode() !== 200 && response.getResponseCode() !== 201) {
      throw new Error(`Payment link creation failed: ${response.getContentText()}`);
    }
    
    var paymentUrl = result.paymentLink && result.paymentLink.links && result.paymentLink.links.url && result.paymentLink.links.url.url;
    
    if (paymentUrl) {
      // Step 7: Save payment link to sheet - find the correct row by Order_Code
      var linkCol = headers.findIndex(h => h === 'payment_link');
      if (linkCol !== -1) {
        // Find the row with this Order_Code and update it
        for (let i = 1; i < data.length; i++) {
          if (data[i][1] === orderId) { // Column B = Order_Code
            sheet.getRange(i + 1, linkCol + 1).setValue(paymentUrl);
            break;
          }
        }
      }
      
      console.log(`Payment link created: ${paymentUrl}`);
      return `✅ SUCCESS!\nCustomer: ${wixContactId}\nOrder: ${wixOrderId}\nPayment Link: ${paymentUrl}`;
    } else {
      throw new Error('No payment link URL returned from Wix API.');
    }
    
  } catch (error) {
    console.error('Error:', error);
    return `❌ Error: ${error.message}`;
  }
}

/**
 * Find order by Order_Code (searches all rows) - UPDATED FOR SORTED DATA
 */
function findOrderById(sheet, orderId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) { // Order_Code in column B (index 1)
      return {
        orderId: data[i][1], // Order_Code
        customerName: data[i][3], // Customer_Name (column D, index 3)
        customerEmail: data[i][5], // Email (column F, index 5) - UPDATED
        customerPhone: data[i][7], // Phone (column H, index 7) - UPDATED
        address: data[i][8], // Address_Street (column I, index 8) - UPDATED
        city: data[i][9], // Address_City (column J, index 9) - UPDATED
        state: data[i][10], // Address_State (column K, index 10) - UPDATED
        zipCode: data[i][11], // Address_ZIP (column L, index 11) - UPDATED
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
      extendedFields: {
        items: {
          "custom.form": "request-form"  // This fills your custom 'form' field
        }
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
  console.log("Wix Customer Payload: " + JSON.stringify(wixData));

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STANDALONE_CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': STANDALONE_CONFIG.WIX_SITE_ID
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
        'Authorization': `Bearer ${STANDALONE_CONFIG.WIX_API_KEY}`,
        'wix-site-id': STANDALONE_CONFIG.WIX_SITE_ID
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
 * Update order row with Wix status and contact ID - UPDATED FOR SORTED DATA
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
  
  // Find the row by Order_Code (works with sorted data)
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
 * Update order row with Wix Order ID for future reference - UPDATED FOR SORTED DATA
 */
function updateOrderWithWixOrderId(orderId, wixOrderId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find wix_order_id column
  let wixOrderIdCol = headers.findIndex(h => h === 'wix_order_id');
  
  if (wixOrderIdCol === -1) {
    console.log('wix_order_id column not found in headers');
    return;
  }
  
  // Find the row with matching Order_Code and update it (works with sorted data)
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) { // Order_Code in column B
      sheet.getRange(i + 1, wixOrderIdCol + 1).setValue(wixOrderId);
      console.log(`Updated Order_Code ${orderId} with Wix Order ID: ${wixOrderId}`);
      break;
    }
  }
}

/**
 * Find Order_Code in Google Sheet by Wix Order ID
 * Use this when working with invoices to find which sheet row to update
 */
function findOrderCodeByWixOrderId(wixOrderId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  let wixOrderIdCol = headers.findIndex(h => h === 'wix_order_id');
  
  if (wixOrderIdCol === -1) {
    console.log('wix_order_id column not found');
    return null;
  }
  
  // Find the row with matching Wix Order ID
  for (let i = 1; i < data.length; i++) {
    if (data[i][wixOrderIdCol] === wixOrderId) {
      return data[i][1]; // Return Order_Code from column B
    }
  }
  
  return null;
}

/**
 * Test function - just run this to test the connection
 */
function testConnection() {
  try {
    const url = 'https://www.wixapis.com/contacts/v4/contacts';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STANDALONE_CONFIG.WIX_API_KEY}`,
        'wix-site-id': STANDALONE_CONFIG.WIX_SITE_ID
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
}\