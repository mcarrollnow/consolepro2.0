# Wix Customer Sync - Setup Guide

## 🎯 Overview
This Google Apps Script automatically syncs customers from your Google Sheets to Wix Contacts using the Wix REST API.

## 📋 Prerequisites
- Wix site with API access
- Google Sheets with customer data
- Wix API key (we'll get this next)

## 🔑 Step 1: Get Your Wix API Key

### 1.1 Go to Wix Developer Center
- Navigate to: https://developers.wix.com/
- Sign in with your Wix account

### 1.2 Create an App
- Click "Create New App"
- Choose "Custom App"
- Give it a name like "Customer Sync Integration"

### 1.3 Get API Credentials
- In your app dashboard, go to "API Keys"
- Click "Generate API Key"
- Copy the API key (it will look like: `wix_api_key_abc123...`)

### 1.4 Configure Permissions
- Go to "Permissions" in your app
- Add these permissions:
  - `contacts.read`
  - `contacts.write`

## 📊 Step 2: Set Up Your Google Sheets

### 2.1 Create the Wix Sync Sheet
The script will automatically create a sheet called `Wix_Customer_Sync` with this structure:

| Column | Purpose | Required |
|--------|---------|----------|
| Customer_ID | Your customer identifier | ✅ |
| First_Name | Customer's first name | ✅ |
| Last_Name | Customer's last name | ✅ |
| Email | Customer's email address | ✅ |
| Phone | Customer's phone number | ❌ |
| Country_Code | Phone country code (default: US) | ❌ |
| Wix_Contact_ID | Wix's contact ID (auto-filled) | ❌ |
| Wix_Sync_Status | Sync status (Pending/Synced/Failed) | ❌ |
| Wix_Sync_Date | Date of last sync attempt | ❌ |
| Error_Message | Error details if sync failed | ❌ |

### 2.2 Prepare Your Main Customer Data
Ensure your main customer sheet has these columns (or similar):
- Customer ID
- First Name (or Name that can be split)
- Last Name
- Email
- Phone (optional)

## 🔧 Step 3: Set Up Google Apps Script

### 3.1 Create New Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Name it "Wix Customer Sync"

### 3.2 Copy the Script
1. Replace the default code with the `wix-customer-sync.gs` file
2. Update the configuration:

```javascript
const CONFIG = {
  WIX_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace with your API key
  WIX_SITE_ID: 'f2af16bf-a8ba-42f3-a5c4-9425564347ac', // Your site ID
  // ... other settings
};
```

### 3.3 Save the Script
- Click "Save" (Ctrl+S)
- Give it a name like "Wix Customer Sync"

## 🚀 Step 4: Test the Integration

### 4.1 Test API Connection
1. In the script editor, run the `testWixConnection()` function
2. Check the logs for success/error messages

### 4.2 Set Up the Sync Sheet
1. Run the `setupWixSyncSheet()` function
2. This creates the dedicated sync sheet with proper structure

### 4.3 Copy Customers to Sync Sheet
1. Run the `copyCustomersToSyncSheet()` function
2. This copies customers from your main sheet to the sync sheet

### 4.4 Test Sync
1. Run the `syncCustomersToWix()` function
2. Check the logs and sync sheet for results

## ⚙️ Step 5: Automation (Optional)

### 5.1 Set Up Triggers
1. In the script editor, click "Triggers" (clock icon)
2. Click "Add Trigger"
3. Configure:
   - **Function**: `syncCustomersToWix`
   - **Event**: "Time-driven"
   - **Frequency**: Choose your preference (hourly, daily, etc.)

### 5.2 Manual Sync
You can also run sync manually:
- In the script editor, select `syncCustomersToWix` and click "Run"
- Or add a button to your Google Sheet

## 📈 Step 6: Monitor and Maintain

### 6.1 Check Sync Status
- Look at the `Wix_Sync_Status` column in your sync sheet
- **Pending**: Ready to sync
- **Synced**: Successfully created in Wix
- **Failed**: Check `Error_Message` for details

### 6.2 Handle Failed Syncs
- Review the `Error_Message` column
- Fix data issues (invalid email, missing required fields, etc.)
- Re-run sync for failed customers

### 6.3 View Logs
- In the script editor, click "Executions" to see detailed logs
- Check for any API errors or rate limiting issues

## 🔍 Troubleshooting

### Common Issues:

#### 1. API Authentication Error
- **Problem**: "401 Unauthorized" error
- **Solution**: Check your API key and permissions

#### 2. Missing Required Fields
- **Problem**: "400 Bad Request" error
- **Solution**: Ensure all required fields (name, email) are filled

#### 3. Rate Limiting
- **Problem**: "429 Too Many Requests" error
- **Solution**: The script includes delays, but you may need to increase them

#### 4. Invalid Email Format
- **Problem**: Email validation fails
- **Solution**: Clean up email addresses in your sheet

## 📞 Support

If you encounter issues:
1. Check the script logs for detailed error messages
2. Verify your Wix API credentials
3. Ensure your customer data is properly formatted
4. Test with a small batch of customers first

## 🎉 Success!

Once everything is working:
- Your customers will automatically sync to Wix
- You'll have a complete audit trail in your sync sheet
- Failed syncs can be easily identified and retried
- Your customer data stays in sync between systems

---

**Need help?** The script includes comprehensive error handling and logging to help you troubleshoot any issues. 