/**
 * Wix Customer Sync - Google Apps Script
 * Syncs new customers from Google Sheets to Wix
 */

// Configuration
const CONFIG = {
  // Wix API Configuration
  WIX_API_BASE_URL: 'https://www.wixapis.com/v1',
  WIX_SITE_ID: 'f2af16bf-a8ba-42f3-a5c4-9425564347ac', // Your Wix site ID
  WIX_API_KEY: 'IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjE3NjA4OTM5LWNmODItNGNhMi04ZDMwLTdhODZiYjVjMWYxYlwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjY5MGJlN2M1LTIwZTgtNDMxNC1hNzY4LTNlYzVlNTc5ZTdlY1wifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCIzNzQyNTRlZS05MDQ3LTQ0ODYtYTY4Ni00NmVhNjA3YzZmZGFcIn19IiwiaWF0IjoxNzUxNDU0MTkwfQ.FioMCK1Yu4hmuWOah7Ftb_lto52rXrHZdWdXD15mJCite0QmYfcU7M585LKXC9HG79UWrCtatXnPzJZmWaCJmDsYwQnm58EfLLz0K8lkbqC1Iwsr4_5mFFaaYhrKFkQFXjRP9CVnj9TRJAbXq0RV90iVU901FlXcc25cR62uxuk2FVS4l8j7Ax1RWAs_F5Kg6fNC8qj3HL3Kt7Zsot86bQdsd9H8JlGR9evMbJRLL7_L4v8tV3r79gxlDENZReoS5CU42dEHe7yveaD0z8kaG-DssLaWB5ApdnmNp5edMMxUpqBmoMMIYsNinuWGlyIn3DmAgXGQalICXRX-ycr8GQ', // Your Wix API key
  
  // Google Sheets Configuration
  SHEET_NAME: 'Wix_Customer_Sync', // Dedicated sync sheet name
  STATUS_COLUMN: 'Wix_Sync_Status', // Column to track sync status
  SYNC_DATE_COLUMN: 'Wix_Sync_Date', // Column to track sync date
  WIX_CONTACT_ID_COLUMN: 'Wix_Contact_ID', // Column to store Wix contact ID
  
  // Sync Settings
  BATCH_SIZE: 10, // Number of customers to process per batch
  RETRY_ATTEMPTS: 3, // Number of retry attempts for failed syncs
  RETRY_DELAY: 2000 // Delay between retries in milliseconds
};

/**
 * Main function to sync customers to Wix
 * This can be triggered manually or automatically
 */
function syncCustomersToWix() {
  try {
    console.log('Starting Wix customer sync...');
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('No active spreadsheet found. Please run this script from within a Google Sheet.');
    }
    
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      console.log(`Sheet "${CONFIG.SHEET_NAME}" not found. Creating it now...`);
      setupWixSyncSheet();
      return;
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Find required column indices
    const columnIndices = findColumnIndices(headers);
    
    // Get customers that need to be synced
    const customersToSync = getCustomersToSync(data, columnIndices);
    
    if (customersToSync.length === 0) {
      console.log('No new customers to sync');
      return;
    }
    
    console.log(`Found ${customersToSync.length} customers to sync`);
    
    // Process customers in batches
    const results = processCustomerBatch(customersToSync, sheet, columnIndices);
    
    // Log results
    logSyncResults(results);
    
  } catch (error) {
    console.error('Error in syncCustomersToWix:', error);
    sendErrorNotification(error);
  }
}

/**
 * Find the indices of required columns
 */
function findColumnIndices(headers) {
  const requiredColumns = {
    customerId: ['Customer_ID', 'Customer ID', 'customer_id', 'CustomerID'],
    firstName: ['First_Name', 'First Name', 'firstName'],
    lastName: ['Last_Name', 'Last Name', 'lastName'],
    email: ['Email', 'Email Address'],
    phone: ['Phone', 'Phone Number', 'Telephone'],
    countryCode: ['Country_Code', 'Country Code', 'countryCode'],
    // Address fields
    addressLine: ['Address_Line', 'Address', 'Street_Address', 'Address Line'],
    city: ['City'],
    state: ['State', 'Province', 'Subdivision'],
    zipCode: ['Zip_Code', 'Postal_Code', 'ZipCode', 'PostalCode'],
    country: ['Country'],
    status: [CONFIG.STATUS_COLUMN],
    syncDate: [CONFIG.SYNC_DATE_COLUMN],
    wixContactId: [CONFIG.WIX_CONTACT_ID_COLUMN]
  };
  
  const indices = {};
  
  for (const [key, possibleNames] of Object.entries(requiredColumns)) {
    indices[key] = -1;
    for (const name of possibleNames) {
      const index = headers.findIndex(header => 
        header && header.toString().toLowerCase() === name.toLowerCase()
      );
      if (index !== -1) {
        indices[key] = index;
        break;
      }
    }
    
    if (indices[key] === -1 && !['phone', 'countryCode', 'addressLine', 'city', 'state', 'zipCode', 'country'].includes(key)) { // Address fields are optional
      throw new Error(`Required column not found: ${possibleNames[0]}`);
    }
  }
  
  return indices;
}

/**
 * Get customers that need to be synced to Wix
 */
function getCustomersToSync(data, columnIndices) {
  const customers = [];
  
  // First, get existing Wix contacts to check for duplicates
  const existingWixContacts = getExistingWixContacts();
  console.log(`Found ${existingWixContacts.length} existing contacts in Wix`);
  
  for (let i = 1; i < data.length; i++) { // Skip header row
    const row = data[i];
    const status = row[columnIndices.status] || '';
    
    // Check if customer needs to be synced
    if (!status || status.toLowerCase() === 'pending' || status.toLowerCase() === '') {
      const customer = {
        rowIndex: i + 1, // 1-based index for sheet
        customerId: row[columnIndices.customerId],
        firstName: row[columnIndices.firstName] || '',
        lastName: row[columnIndices.lastName] || '',
        email: row[columnIndices.email],
        phone: columnIndices.phone !== -1 ? row[columnIndices.phone] : '',
        countryCode: columnIndices.countryCode !== -1 ? row[columnIndices.countryCode] : 'US',
        // Address fields
        addressLine: columnIndices.addressLine !== -1 ? row[columnIndices.addressLine] : '',
        city: columnIndices.city !== -1 ? row[columnIndices.city] : '',
        state: columnIndices.state !== -1 ? row[columnIndices.state] : '',
        zipCode: columnIndices.zipCode !== -1 ? row[columnIndices.zipCode] : '',
        country: columnIndices.country !== -1 ? row[columnIndices.country] : 'US',
        originalData: row
      };
      
      // Validate required fields
      if (customer.customerId && customer.email && (customer.firstName || customer.lastName)) {
        // Check if customer already exists in Wix
        const existingContact = findExistingContact(customer, existingWixContacts);
        
        if (existingContact) {
          console.log(`Customer ${customer.email} already exists in Wix (ID: ${existingContact.id})`);
          // Update status to indicate existing contact
          updateCustomerStatus(sheet, customer.rowIndex, columnIndices, 'Already Exists', new Date(), existingContact.id);
        } else {
          customers.push(customer);
        }
      } else {
        console.warn(`Skipping row ${i + 1}: Missing required fields`);
      }
    }
  }
  
  return customers;
}

/**
 * Process customers in batches
 */
function processCustomerBatch(customers, sheet, columnIndices) {
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < customers.length; i += CONFIG.BATCH_SIZE) {
    const batch = customers.slice(i, i + CONFIG.BATCH_SIZE);
    
          for (const customer of batch) {
        try {
          const result = syncCustomerToWix(customer);
          
          if (result.success) {
            // Update sheet with success status and Wix contact ID
            updateCustomerStatus(sheet, customer.rowIndex, columnIndices, 'Synced', new Date(), result.wixContactId);
            results.success++;
          } else {
            // Update sheet with failure status
            updateCustomerStatus(sheet, customer.rowIndex, columnIndices, 'Failed', null);
            results.failed++;
          }
          
          // Add delay between requests to avoid rate limiting
          if (i < customers.length - 1) {
            Utilities.sleep(500);
          }
          
        } catch (error) {
          console.error(`Error syncing customer ${customer.customerId}:`, error);
          updateCustomerStatus(sheet, customer.rowIndex, columnIndices, 'Error', null);
          results.failed++;
          results.errors.push({
            customerId: customer.customerId,
            error: error.message
          });
        }
      }
  }
  
  return results;
}

/**
 * Sync a single customer to Wix
 */
function syncCustomerToWix(customer) {
  for (let attempt = 1; attempt <= CONFIG.RETRY_ATTEMPTS; attempt++) {
    try {
      console.log(`Syncing customer ${customer.customerId} (attempt ${attempt})`);
      
      // Prepare customer data for Wix API format
      const wixCustomerData = {
        info: {
          name: {
            first: customer.firstName,
            last: customer.lastName
          },
          emails: {
            items: [
              {
                tag: "MAIN",
                email: customer.email
              }
            ]
          }
        }
      };
      
      // Add phone if provided
      if (customer.phone) {
        wixCustomerData.info.phones = {
          items: [
            {
              tag: "HOME",
              countryCode: customer.countryCode,
              phone: customer.phone
            }
          ]
        };
      }
      
      // Add shipping address if provided
      if (customer.addressLine || customer.city || customer.state || customer.zipCode) {
        wixCustomerData.info.addresses = {
          items: [
            {
              tag: "SHIPPING",
              address: {
                country: customer.country,
                subdivision: customer.state ? `US-${customer.state}` : undefined,
                city: customer.city,
                postalCode: customer.zipCode,
                addressLine: customer.addressLine
              }
            }
          ]
        };
      }
      
      // Add custom field for customer ID
      wixCustomerData.info.extendedFields = {
        items: {
          "custom.customerId": customer.customerId
        }
      };
      
      // Make API call to Wix
      const response = createWixCustomer(wixCustomerData);
      
      if (response && response.contact && response.contact.id) {
        console.log(`Successfully synced customer ${customer.customerId} to Wix`);
        return { success: true, wixContactId: response.contact.id };
      } else {
        throw new Error('Invalid response from Wix API');
      }
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed for customer ${customer.customerId}:`, error);
      
      if (attempt < CONFIG.RETRY_ATTEMPTS) {
        Utilities.sleep(CONFIG.RETRY_DELAY);
      } else {
        throw error;
      }
    }
  }
  
  return { success: false, wixContactId: null };
}

/**
 * Create customer in Wix via API
 */
function createWixCustomer(customerData) {
  const url = 'https://www.wixapis.com/contacts/v4/contacts';
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
      'Content-Type': 'application/json',
      'wix-site-id': CONFIG.WIX_SITE_ID
    },
    payload: JSON.stringify(customerData)
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();
  
  console.log(`Wix API Response Code: ${responseCode}`);
  console.log(`Wix API Response: ${responseText}`);
  
  if (responseCode === 200 || responseCode === 201) {
    return JSON.parse(responseText);
  } else {
    throw new Error(`Wix API error: ${responseCode} - ${responseText}`);
  }
}

/**
 * Update customer status in the sheet
 */
function updateCustomerStatus(sheet, rowIndex, columnIndices, status, syncDate, wixContactId = null) {
  try {
    // Update status
    if (columnIndices.status !== -1) {
      sheet.getRange(rowIndex, columnIndices.status + 1).setValue(status);
    }
    
    // Update sync date
    if (columnIndices.syncDate !== -1 && syncDate) {
      sheet.getRange(rowIndex, columnIndices.syncDate + 1).setValue(syncDate);
    }
    
    // Update Wix contact ID if provided
    if (columnIndices.wixContactId !== -1 && wixContactId) {
      sheet.getRange(rowIndex, columnIndices.wixContactId + 1).setValue(wixContactId);
    }
    
  } catch (error) {
    console.error(`Error updating status for row ${rowIndex}:`, error);
  }
}

/**
 * Log sync results
 */
function logSyncResults(results) {
  console.log('=== Sync Results ===');
  console.log(`Successfully synced: ${results.success}`);
  console.log(`Failed to sync: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('Errors:');
    results.errors.forEach(error => {
      console.log(`- Customer ${error.customerId}: ${error.error}`);
    });
  }
  
  // Send notification if there were failures
  if (results.failed > 0) {
    sendFailureNotification(results);
  }
}

/**
 * Send error notification
 */
function sendErrorNotification(error) {
  // You can implement email notifications here
  console.error('Critical error in Wix sync:', error);
  
  // Example email notification (uncomment and configure as needed)
  /*
  const emailBody = `
    Wix Customer Sync Error
    
    Error: ${error.message}
    Time: ${new Date().toISOString()}
    Stack: ${error.stack}
  `;
  
  MailApp.sendEmail({
    to: 'your-email@example.com',
    subject: 'Wix Customer Sync Error',
    body: emailBody
  });
  */
}

/**
 * Send failure notification
 */
function sendFailureNotification(results) {
  // You can implement email notifications here
  console.log('Some customers failed to sync');
  
  // Example email notification (uncomment and configure as needed)
  /*
  const emailBody = `
    Wix Customer Sync Results
    
    Successfully synced: ${results.success}
    Failed to sync: ${results.failed}
    
    Errors:
    ${results.errors.map(e => `- Customer ${e.customerId}: ${e.error}`).join('\n')}
  `;
  
  MailApp.sendEmail({
    to: 'your-email@example.com',
    subject: 'Wix Customer Sync Results',
    body: emailBody
  });
  */
}

/**
 * Test function to verify Wix API connection
 */
function testWixConnection() {
  try {
    console.log('Testing Wix API connection...');
    
    // Test with the correct Wix API endpoint
    const url = 'https://www.wixapis.com/contacts/v4/contacts';
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.WIX_API_KEY}`,
        'wix-site-id': CONFIG.WIX_SITE_ID
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log(`Response Code: ${responseCode}`);
    console.log(`Response Text: ${responseText}`);
    
    if (responseCode === 200) {
      console.log('✅ Wix API connection successful!');
      return true;
    } else {
      console.error(`❌ Wix API connection failed: ${responseCode}`);
      console.error(`Response: ${responseText}`);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Wix API connection error:', error);
    return false;
  }
}

/**
 * Setup function to create the Wix sync sheet with proper structure
 */
function setupWixSyncSheet() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('No active spreadsheet found. Please run this script from within a Google Sheet.');
    }
    
    // Check if sheet already exists
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      // Create new sheet
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      console.log(`Created new sheet: ${CONFIG.SHEET_NAME}`);
    }
    
    // Define the header structure for Wix sync
    const headers = [
      'Customer_ID',
      'First_Name', 
      'Last_Name',
      'Email',
      'Phone',
      'Country_Code',
      'Address_Line',
      'City',
      'State',
      'Zip_Code',
      'Country',
      CONFIG.WIX_CONTACT_ID_COLUMN,
      CONFIG.STATUS_COLUMN,
      CONFIG.SYNC_DATE_COLUMN,
      'Error_Message'
    ];
    
    // Set headers
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header row
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#f3f4f6');
    
    // Set column widths
    sheet.setColumnWidth(1, 120); // Customer_ID
    sheet.setColumnWidth(2, 100); // First_Name
    sheet.setColumnWidth(3, 100); // Last_Name
    sheet.setColumnWidth(4, 200); // Email
    sheet.setColumnWidth(5, 120); // Phone
    sheet.setColumnWidth(6, 100); // Country_Code
    sheet.setColumnWidth(7, 200); // Address_Line
    sheet.setColumnWidth(8, 100); // City
    sheet.setColumnWidth(9, 100); // State
    sheet.setColumnWidth(10, 100); // Zip_Code
    sheet.setColumnWidth(11, 100); // Country
    sheet.setColumnWidth(12, 200); // Wix_Contact_ID
    sheet.setColumnWidth(13, 100); // Status
    sheet.setColumnWidth(14, 120); // Sync_Date
    sheet.setColumnWidth(15, 200); // Error_Message
    
    console.log('✅ Wix sync sheet setup complete!');
    console.log('📋 Sheet structure:');
    headers.forEach((header, index) => {
      console.log(`  ${index + 1}. ${header}`);
    });
    
  } catch (error) {
    console.error('Error setting up Wix sync sheet:', error);
  }
}

/**
 * Function to copy customers from main sheet to Wix sync sheet
 */
function copyCustomersToSyncSheet() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('No active spreadsheet found. Please run this script from within a Google Sheet.');
    }
    
    const mainSheet = spreadsheet.getSheetByName('Customers'); // Your main customers sheet
    const syncSheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!mainSheet) {
      throw new Error('Main Customers sheet not found');
    }
    
    if (!syncSheet) {
      setupWixSyncSheet();
    }
    
    // Get data from main sheet
    const mainData = mainSheet.getDataRange().getValues();
    const mainHeaders = mainData[0];
    
    // Find column indices in main sheet
    const mainIndices = {
      customerId: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('customer')),
      firstName: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('first')),
      lastName: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('last')),
      email: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('email')),
      phone: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('phone')),
      addressLine: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('address')),
      city: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('city')),
      state: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('state')),
      zipCode: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('zip')),
      country: mainHeaders.findIndex(h => h && h.toString().toLowerCase().includes('country'))
    };
    
    // Get sync sheet headers
    const syncHeaders = syncSheet.getRange(1, 1, 1, syncSheet.getLastColumn()).getValues()[0];
    
    // Process each customer from main sheet
    let newCustomers = 0;
    
    for (let i = 1; i < mainData.length; i++) {
      const row = mainData[i];
      const customerId = row[mainIndices.customerId];
      
      // Check if customer already exists in sync sheet
      const existingCustomer = syncSheet.getRange(2, 1, syncSheet.getLastRow() - 1, 1).getValues()
        .find(cell => cell[0] === customerId);
      
      if (!existingCustomer) {
        // Add new customer to sync sheet
        const syncRow = [
          customerId,
          row[mainIndices.firstName] || '',
          row[mainIndices.lastName] || '',
          row[mainIndices.email] || '',
          row[mainIndices.phone] || '',
          'US', // Default country code
          row[mainIndices.addressLine] || '', // Address Line
          row[mainIndices.city] || '', // City
          row[mainIndices.state] || '', // State
          row[mainIndices.zipCode] || '', // Zip Code
          row[mainIndices.country] || 'US', // Country
          '', // Wix Contact ID (empty)
          'Pending', // Status
          '', // Sync Date (empty)
          '' // Error Message (empty)
        ];
        
        syncSheet.appendRow(syncRow);
        newCustomers++;
      }
    }
    
    console.log(`✅ Copied ${newCustomers} new customers to sync sheet`);
    
  } catch (error) {
    console.error('Error copying customers to sync sheet:', error);
  }
} 