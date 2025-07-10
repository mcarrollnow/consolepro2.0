# Wix Customer Management - Button Implementation Guide

## Overview
This system allows you to create Wix customers on-demand and send invoices through individual buttons, rather than bulk syncing.

## Features
- **Create Wix Customer** button on customer profiles
- **Create Wix Customer** button on active orders
- **Send Wix Invoice** button (after customer is created)
- **Auto-create rows** when purchase requests come in

## Setup Instructions

### 1. Add Google Apps Script
1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Create a new script file called `wix-customer-buttons.gs`
4. Copy the code from `wix-customer-buttons.gs` into the script editor
5. Save the script

### 2. Test Connection
1. In the Apps Script editor, run the `testWixConnection()` function
2. Check the logs to ensure connection is successful
3. You should see: "✅ Wix API connection successful!"

### 3. Add Buttons to Your Application

#### Option A: Google Sheets Buttons
1. In your Google Sheet, go to **Insert > Drawing**
2. Create a button shape and add text like "Create Wix Customer"
3. Right-click the button and select **Assign script**
4. Enter: `createWixCustomerFromProfile` (for customer profiles) or `createWixCustomerFromOrder` (for orders)
5. The function will automatically detect the row based on selection

#### Option B: Web Application Buttons
If you're building a web app, you can call these functions via Google Apps Script's web API:

```javascript
// Example: Create Wix customer from customer profile
function createWixCustomer(customerId) {
  google.script.run
    .withSuccessHandler(onSuccess)
    .withFailureHandler(onError)
    .createWixCustomerFromProfile(customerId);
}

// Example: Send Wix invoice
function sendInvoice(orderId) {
  google.script.run
    .withSuccessHandler(onSuccess)
    .withFailureHandler(onError)
    .sendWixInvoice(orderId);
}
```

### 4. Sheet Structure Requirements

#### Customers Sheet
Your customers sheet should have these columns (in order):
- Customer_ID
- First_Name
- Last_Name
- Email
- Phone
- Address
- City
- State
- Zip_Code
- Country

The script will automatically add:
- Wix_Status
- Wix_Contact_ID

#### Orders Sheet
Your orders sheet should have these columns (in order):
- Order_ID
- Customer_ID
- Customer_Name
- Customer_Email
- Customer_Phone
- Items
- Total

The script will automatically add:
- Wix_Status
- Wix_Contact_ID

### 5. Workflow Implementation

#### Customer Profile Button
```html
<!-- Add this button to your customer profile page -->
<button onclick="createWixCustomer('CUSTOMER_ID_HERE')" class="btn btn-primary">
  Create Wix Customer
</button>
```

#### Active Orders Button
```html
<!-- Add this button to your active orders section -->
<button onclick="createWixCustomerFromOrder('ORDER_ID_HERE')" class="btn btn-success">
  Create Wix Customer
</button>

<button onclick="sendWixInvoice('ORDER_ID_HERE')" class="btn btn-warning">
  Send Wix Invoice
</button>
```

#### Purchase Request Auto-Creation
When a new purchase request is submitted, call:
```javascript
autoCreateWixCustomerRow({
  customerId: 'CUST123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '555-1234',
  address: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zipCode: '12345'
});
```

### 6. Status Tracking

The system automatically tracks status in your sheets:

#### Customer Status Values:
- `Pending` - Ready to be created
- `Created` - Successfully created in Wix
- `Already Exists` - Customer already in Wix
- `Error` - Failed to create (check error message)

#### Invoice Status Values:
- `Sent` - Invoice created in Wix
- `Error` - Failed to send (check error message)

### 7. Error Handling

All functions return status messages:
- Success: `"Customer created in Wix (ID: abc123)"`
- Error: `"Error: Customer not found"`

### 8. Security Notes

- Your Wix API key is stored in the script
- Only authorized users should have access to the Google Sheet
- Consider implementing user authentication for web app buttons

### 9. Testing

1. **Test Customer Creation:**
   - Select a customer row in your sheet
   - Click "Create Wix Customer" button
   - Check that Wix_Status updates to "Created"

2. **Test Invoice Sending:**
   - Ensure customer is created in Wix first
   - Click "Send Wix Invoice" button
   - Check that invoice is created in Wix

3. **Test Duplicate Prevention:**
   - Try creating the same customer twice
   - Should get "Already Exists" status

### 10. Troubleshooting

#### Common Issues:
1. **"Customer not found"** - Check that Customer_ID matches exactly
2. **"Wix API error"** - Verify API key and site ID are correct
3. **"Customer not in Wix"** - Create Wix customer before sending invoice

#### Debug Steps:
1. Run `testWixConnection()` to verify API access
2. Check Google Apps Script logs for detailed error messages
3. Verify sheet column structure matches requirements
4. Ensure all required fields are filled in

### 11. Next Steps

Once this is working, you can:
1. Add more sophisticated invoice templates
2. Implement automatic invoice reminders
3. Add customer data synchronization
4. Create dashboard views for Wix integration status

## Support

If you encounter issues:
1. Check the Google Apps Script logs
2. Verify your Wix API credentials
3. Ensure your sheet structure matches the requirements
4. Test with a simple customer record first 