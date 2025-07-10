# Quick Setup Guide - Fix the Google Apps Script Error

## 🚨 The Error You're Seeing:
```
Cannot read properties of null (reading 'getSheetByName')
```

This happens because the script needs to run from within a Google Sheet context.

## ✅ How to Fix It:

### **Step 1: Open Your Google Sheet**
1. Go to your Google Sheets (the one with your customer data)
2. Make sure you have a sheet called "Customers" with your customer data

### **Step 2: Open Script Editor from the Sheet**
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. This opens the script editor **connected to your sheet**

### **Step 3: Copy the Script**
1. Delete any existing code in the script editor
2. Copy the entire `wix-customer-sync.gs` file
3. Paste it into the script editor
4. Click **Save** (Ctrl+S)

### **Step 4: Test the Connection**
1. In the script editor, select the `testWixConnection` function
2. Click the **Run** button (▶️)
3. You should see: "✅ Wix API connection successful!"

### **Step 5: Set Up the Sync Sheet**
1. Select the `setupWixSyncSheet` function
2. Click **Run**
3. This will create a new sheet called "Wix_Customer_Sync"

### **Step 6: Copy Your Customers**
1. Select the `copyCustomersToSyncSheet` function
2. Click **Run**
3. This copies customers from your "Customers" sheet to the sync sheet

### **Step 7: Test the Sync**
1. Select the `syncCustomersToWix` function
2. Click **Run**
3. Check the logs and your Wix contacts!

## 🔍 Important Notes:

- **Must run from Google Sheets**: The script editor must be opened from within your Google Sheet
- **Need a "Customers" sheet**: Make sure you have a sheet with your customer data
- **Check logs**: Click "Executions" in the script editor to see detailed logs

## 🎯 Expected Results:

- ✅ Connection test passes
- ✅ New "Wix_Customer_Sync" sheet created
- ✅ Customers copied to sync sheet
- ✅ Customers synced to Wix

**Try running it from within your Google Sheet now!** 🚀 