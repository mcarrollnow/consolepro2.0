import { GoogleAuth } from "google-auth-library"
import { type sheets_v4, google } from "googleapis"

export interface InventoryItem {
  barcode: string
  product: string
  category: string
  image: string
  initialStock: number
  restockLevel: number
  currentStock: number
  manualAdjustment: number
  lastUpdated: string
  costPrice: string
  salePrice?: string
}

export interface OrderCustomer {
  orderId: string
  customerId: string
  customerName: string
  customerEmail: string
  orderDate: string
  status: string
  invoiceStatus?: string
  paymentStatus?: string
  total: number
  items: string
  notes: string
  invoice_link?: string
  payment_link?: string
  customer_id?: string
  // Additional fields for detailed order view
  businessName?: string
  phone?: string
  // Billing Address
  billingAddressStreet?: string
  billingAddressStreet2?: string
  billingAddressCity?: string
  billingAddressState?: string
  billingAddressZIP?: string
  // Shipping Address
  addressStreet?: string
  addressStreet2?: string
  addressCity?: string
  addressState?: string
  addressZIP?: string
  // Legacy shipping address field for backward compatibility
  shippingAddress?: string
  // Product details
  products?: Array<{
    name: string
    barcode: string
    price: number
    quantity: number
  }>
  productDetails?: Array<{
    name: string
    barcode: string
    price: number
    quantity: number
  }>
}

export interface Customer {
  customer_id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  first_order_date: string
  last_order_date: string
  total_orders: string
  total_spent: string
  customer_status: string
  preferred_contact: string
  customer_notes: string
  tags: string
  created_date: string
  last_updated: string
  referred_by: string
  customer_class: string
  square_reference_id: string
  nickname: string
  birthday: string
  square_customer_id: string
  wix_contact_id: string
}

export interface B2BRequest {
  id: string
  company: string
  contact: string
  email: string
  phone: string
  date: string
  status: string
  requestType: string
  description: string
  estimatedValue: number
  priority: string
}

export class GoogleSheetsService {
  private auth: GoogleAuth
  private sheets: sheets_v4.Sheets
  private spreadsheetId: string
  private inventorySheetId: string

  constructor() {
    try {
      // Parse the service account JSON from environment variable
      const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
      if (!serviceAccountJson) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set")
      }

      const serviceAccount = JSON.parse(serviceAccountJson)
      console.log("Service account loaded:", serviceAccount.client_email)

      this.auth = new GoogleAuth({
        credentials: serviceAccount,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      this.sheets = google.sheets({ version: "v4", auth: this.auth })
      this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || ""
      this.inventorySheetId = process.env.INVENTORY_SHEET_ID || ""

      console.log("Google Sheets service initialized")
      console.log("Spreadsheet ID:", this.spreadsheetId)
      console.log("Inventory Sheet ID:", this.inventorySheetId)
    } catch (error) {
      console.error("Error initializing Google Sheets service:", error)
      throw error
    }
  }

  async getInventoryData(): Promise<InventoryItem[]> {
    try {
      console.log("Fetching inventory data from Google Sheets...")
      console.log("Using spreadsheet ID:", this.inventorySheetId)

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.inventorySheetId,
        range: "Product!A:L",
      })

      console.log("Google Sheets response:", response.data)
      const rows = response.data.values || []
      console.log("Number of rows received:", rows.length)

      if (rows.length === 0) {
        console.log("No data found in sheet")
        return []
      }

      // Log the headers to verify structure
      console.log("Headers:", rows[0])

      // Skip header row
      const dataRows = rows.slice(1)
      console.log("Processing", dataRows.length, "data rows")

      return dataRows.map((row, index): InventoryItem => {
        console.log(`Processing row ${index + 1}:`, row)
        return {
          barcode: row[0] || "",
          product: row[1] || "",
          category: row[2] || "",
          image: row[3] || "",
          initialStock: Number.parseInt(row[4]) || 0,
          restockLevel: Number.parseInt(row[5]) || 0,
          currentStock: Number.parseInt(row[6]) || 0,
          manualAdjustment: Number.parseInt(row[7]) || 0,
          lastUpdated: row[8] || "",
          costPrice: row[9] || "",
          salePrice: row[10] || "",
        }
      })
    } catch (error: any) {
      console.error("Error fetching inventory data:", error)
      if (error.code === 403) {
        console.error("Permission denied. Check if the service account has access to the spreadsheet.")
      }
      if (error.code === 404) {
        console.error("Spreadsheet not found. Check the spreadsheet ID.")
      }
      return []
    }
  }

  async getActiveOrdersData(): Promise<OrderCustomer[]> {
    try {
      // Active orders from the Orders sheet
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:BN", // Updated to match new structure
      })

      const rows = response.data.values || []
      if (rows.length === 0) return []

      // Header-based mapping
      const header = rows[0]
      const headerMap: Record<string, number> = {}
      header.forEach((col, idx) => { headerMap[col.trim()] = idx })
      const dataRows = rows.slice(1)

      return dataRows.map((row): OrderCustomer => {
        // Helper function to safely get column value
        const getCol = (colName: string) => row[headerMap[colName]] || ""
        
        // Parse products from the sheet
        const products: Array<{ name: string; barcode: string; price: number; quantity: number }> = []
        for (let i = 1; i <= 10; i++) {
          const name = getCol(`Product_${i}_Name`)
          const barcode = getCol(`Product_${i}_Barcode`)
          const price = getCol(`Product_${i}_Price`)
          const quantity = getCol(`Product_${i}_Quantity`)
          
          if (name && name.trim() !== "") {
            products.push({
              name: name.trim(),
              barcode: barcode.trim(),
              price: parseFloat(price) || 0,
              quantity: parseFloat(quantity) || 0,
            })
          }
        }

        return {
          orderId: getCol("Order_Code"),
          customerId: getCol("customer_id"),
          customerName: getCol("Customer_Name"),
          customerEmail: getCol("Email"),
          orderDate: getCol("Submission_Timestamp"),
          status: getCol("Fulfillment_Status"),
          invoiceStatus: getCol("Invoice_Status"),
          paymentStatus: getCol("Payment_Status"),
          total: parseFloat(getCol("Total_Amount").replace(/[^0-9.]/g, '')) || 0,
          items: products.map(p => `${p.name} (Qty: ${p.quantity})`).join(", "),
          notes: getCol("Special_Instructions"),
          invoice_link: getCol("invoice_link"),
          payment_link: getCol("payment_link"),
          customer_id: getCol("customer_id"),
          businessName: getCol("Business_Name"),
          phone: getCol("Phone"),
          // Billing Address (from Address_Street, Address_Street_Line_2, Address_City, Address_State, Address_ZIP)
          billingAddressStreet: getCol("Address_Street"),
          billingAddressStreet2: getCol("Address_Street_Line_2"),
          billingAddressCity: getCol("Address_City"),
          billingAddressState: getCol("Address_State"),
          billingAddressZIP: getCol("Address_ZIP"),
          // Shipping Address (from Shipping_Address_Street, Shipping_Address_Street_Line_2, Shipping_Address_City, Shipping_Address_State, Shipping_Address_ZIP)
          addressStreet: getCol("Shipping_Address_Street"),
          addressStreet2: getCol("Shipping_Address_Street_Line_2"),
          addressCity: getCol("Shipping_Address_City"),
          addressState: getCol("Shipping_Address_State"),
          addressZIP: getCol("Shipping_Address_ZIP"),
          // Legacy shipping address field for backward compatibility
          shippingAddress: [
            getCol("Shipping_Address_Street"),
            getCol("Shipping_Address_Street_Line_2"),
            getCol("Shipping_Address_City"),
            getCol("Shipping_Address_State"),
            getCol("Shipping_Address_ZIP")
          ].filter(Boolean).join(", "),
          products,
          productDetails: products,
        }
      })
    } catch (error) {
      console.error("Error fetching active orders data:", error)
      return []
    }
  }

  async getOrdersData(): Promise<OrderCustomer[]> {
    try {
      // Try to read from Archived Orders first, fallback to Orders
      let response
      let isArchivedOrders = false
      try {
        response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "Archived Orders!A:BM",
        })
        isArchivedOrders = true
      } catch (error) {
        console.log("Archived Orders sheet not found, falling back to Orders sheet")
        response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "Orders!A:BN",  // Updated to match new structure
        })
        isArchivedOrders = false
      }

      const rows = response.data.values || []
      if (rows.length === 0) return []

      // Header-based mapping
      const header = rows[0]
      const headerMap: Record<string, number> = {}
      header.forEach((col, idx) => { headerMap[col.trim()] = idx })
      const dataRows = rows.slice(1)

      return dataRows.map((row): OrderCustomer => {
        // Pad row to header length
        const paddedRow = [...row]
        while (paddedRow.length < header.length) paddedRow.push("")

        // Product details (use header-based indices, robust to column order)
        const products = []
        for (let i = 1; i <= 10; i++) {
          const nameCol = headerMap[`Product_${i}_Name`]
          const barcodeCol = headerMap[`Product_${i}_Barcode`]
          const priceCol = headerMap[`Product_${i}_Price`]
          const qtyCol = headerMap[`Product_${i}_Quantity`]
          if (
            nameCol !== undefined && barcodeCol !== undefined &&
            (paddedRow[nameCol] || paddedRow[barcodeCol]) &&
            (paddedRow[nameCol]?.trim() !== '' || paddedRow[barcodeCol]?.trim() !== '')
          ) {
            products.push({
              name: paddedRow[nameCol] || '',
              barcode: paddedRow[barcodeCol] || '',
              price: parseFloat(paddedRow[priceCol] || '0'),
              quantity: parseInt(paddedRow[qtyCol] || '0'),
            })
          }
        }

        // Customer info (header-based) - Updated for new structure
        let customerName, customerEmail, customerPhone, businessName
        // Use the new structure: Customer_Name (D), customer_id (E), Email (F), Business_Name (G), Phone (H)
        customerName = paddedRow[headerMap["Customer_Name"]] || paddedRow[headerMap["customer_name"]] || ""
        customerEmail = paddedRow[headerMap["Email"]] || paddedRow[headerMap["customer_email"]] || ""
        customerPhone = paddedRow[headerMap["Phone"]] || paddedRow[headerMap["customer_phone"]] || ""
        businessName = paddedRow[headerMap["Business_Name"]] || ""

        const customer_id = paddedRow[headerMap["customer_id"]] || ""

        return {
          orderId: paddedRow[headerMap["wix_order_id"]] || paddedRow[headerMap["Order_Code"]] || "",
          customerId: customer_id,
          customerName: customerName,
          customerEmail: customerEmail,
          orderDate: paddedRow[headerMap["Submission_Timestamp"]] || "",
          status: paddedRow[headerMap["Fulfillment_Status"]] || "",
          invoiceStatus: paddedRow[headerMap["Invoice_Status"]] || "",
          paymentStatus: paddedRow[headerMap["Payment_Status"]] || "",
          total: parseFloat((paddedRow[headerMap["Total_Amount"]] || "0").replace(/[^0-9.]/g, "")),
          items: products.map(p => p.name).join(", "),
          notes: paddedRow[headerMap["Special_Instructions"]] || "",
          invoice_link: paddedRow[headerMap["invoice_link"]] || "",
          payment_link: paddedRow[headerMap["payment_link"]] || "",
          customer_id,
          businessName: businessName,
          phone: customerPhone,
          addressStreet: paddedRow[headerMap["Address_Street"]] || "",
          addressCity: paddedRow[headerMap["Address_City"]] || "",
          addressState: paddedRow[headerMap["Address_State"]] || "",
          addressZIP: paddedRow[headerMap["Address_ZIP"]] || "",
          products,
          productDetails: products, // Add this for frontend compatibility
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching orders data:", error.message, error.stack);
      } else {
        console.error("Error fetching orders data:", error);
      }
      return [];
    }
  }

  async updateInventoryItem(barcode: string, updates: Partial<InventoryItem>): Promise<boolean> {
    try {
      // First, find the row with the matching barcode
      const inventoryData = await this.getInventoryData()
      const rowIndex = inventoryData.findIndex((item) => item.barcode === barcode)

      if (rowIndex === -1) {
        console.error("Item not found:", barcode)
        return false
      }

      // Update the specific row (add 2 to account for header and 0-based index)
      const actualRowIndex = rowIndex + 2

      // Build the update values array
      const currentItem = inventoryData[rowIndex]
      const updatedItem = { ...currentItem, ...updates }

      const values = [
        [
          updatedItem.barcode,
          updatedItem.product,
          updatedItem.category,
          updatedItem.image,
          updatedItem.initialStock,
          updatedItem.restockLevel,
          updatedItem.currentStock,
          updatedItem.manualAdjustment,
          new Date().toISOString(),
          updatedItem.costPrice,
          updatedItem.salePrice || "",
        ],
      ]

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Inventory!A${actualRowIndex}:K${actualRowIndex}`,
        valueInputOption: "RAW",
        requestBody: { values },
      })

      return true
    } catch (error) {
      console.error("Error updating inventory item:", error)
      return false
    }
  }

  async addNewOrder(order: Omit<OrderCustomer, "orderId"> & {
    orderCode?: string
    recordType?: string
    orderType?: string
    addressStreet2?: string
    // Billing address fields
    billingAddressStreet?: string
    billingAddressStreet2?: string
    billingAddressCity?: string
    billingAddressState?: string
    billingAddressZIP?: string
    // Shipping address fields
    shippingAddressStreet?: string
    shippingAddressStreet2?: string
    shippingAddressCity?: string
    shippingAddressState?: string
    shippingAddressZIP?: string
    products?: Array<{
      name: string
      barcode: string
      price: number
      quantity: number
    }>
  }): Promise<string> {
    try {
      // Generate new order ID if not provided
      const orderId = order.orderCode || `ORD-${Date.now()}`

      // Build the row according to the Orders sheet structure
      const values = [
        [
          new Date().toISOString(),                    // Submission_Timestamp (A)
          orderId,                                     // Order_Code (B)
          order.recordType || "RETAIL_TRANSACTION",    // Record_Type (C)
          order.customerName,                          // Customer_Name (D)
          order.customerId || "",                      // customer_id (E) - Use provided customer ID
          order.customerEmail,                         // Email (F)
          order.businessName || "",                    // Business_Name (G)
          order.phone || "",                           // Phone (H)
          // Billing Address
          order.billingAddressStreet || order.addressStreet || "",                   // Address_Street (I) - Billing
          order.billingAddressStreet2 || order.addressStreet2 || "",                 // Address_Street_Line_2 (J) - Billing
          order.billingAddressCity || order.addressCity || "",                       // Address_City (K) - Billing
          order.billingAddressState || order.addressState || "",                     // Address_State (L) - Billing
          order.billingAddressZIP || order.addressZIP || "",                         // Address_ZIP (M) - Billing
          `$ ${order.total.toFixed(2)}`,               // Total_Amount (N) - formatted with $ and space
          order.notes || "",                           // Special_Instructions (O)
          order.orderType || "RETAIL",                 // Order_Type (P)
          "consolepro_api",                           // Submission_Source (Q)
          "PENDING",                                   // Payment_Status (R)
          "PENDING",                                   // Fulfillment_Status (S)
          "PENDING",                                   // Invoice_Status (T)
          "SUBMITTED",                                 // Lifecycle_Stage (U)
          new Date().toISOString(),                    // Last_Updated (V)
          // Product columns (W-BP) - fill with products if available
          order.products?.[0]?.name || "",             // Product_1_Name (W)
          order.products?.[0]?.barcode || "",          // Product_1_Barcode (X)
          order.products?.[0]?.price?.toFixed(2) || "", // Product_1_Price (Y)
          order.products?.[0]?.quantity || "",         // Product_1_Quantity (Z)
          order.products?.[1]?.name || "",             // Product_2_Name (AA)
          order.products?.[1]?.barcode || "",          // Product_2_Barcode (AB)
          order.products?.[1]?.price?.toFixed(2) || "", // Product_2_Price (AC)
          order.products?.[1]?.quantity || "",         // Product_2_Quantity (AD)
          order.products?.[2]?.name || "",             // Product_3_Name (AE)
          order.products?.[2]?.barcode || "",          // Product_3_Barcode (AF)
          order.products?.[2]?.price?.toFixed(2) || "", // Product_3_Price (AG)
          order.products?.[2]?.quantity || "",         // Product_3_Quantity (AH)
          order.products?.[3]?.name || "",             // Product_4_Name (AI)
          order.products?.[3]?.barcode || "",          // Product_4_Barcode (AJ)
          order.products?.[3]?.price?.toFixed(2) || "", // Product_4_Price (AK)
          order.products?.[3]?.quantity || "",         // Product_4_Quantity (AL)
          order.products?.[4]?.name || "",             // Product_5_Name (AM)
          order.products?.[4]?.barcode || "",          // Product_5_Barcode (AN)
          order.products?.[4]?.price?.toFixed(2) || "", // Product_5_Price (AO)
          order.products?.[4]?.quantity || "",         // Product_5_Quantity (AP)
          order.products?.[5]?.name || "",             // Product_6_Name (AQ)
          order.products?.[5]?.barcode || "",          // Product_6_Barcode (AR)
          order.products?.[5]?.price?.toFixed(2) || "", // Product_6_Price (AS)
          order.products?.[5]?.quantity || "",         // Product_6_Quantity (AT)
          order.products?.[6]?.name || "",             // Product_7_Name (AU)
          order.products?.[6]?.barcode || "",          // Product_7_Barcode (AV)
          order.products?.[6]?.price?.toFixed(2) || "", // Product_7_Price (AW)
          order.products?.[6]?.quantity || "",         // Product_7_Quantity (AX)
          order.products?.[7]?.name || "",             // Product_8_Name (AY)
          order.products?.[7]?.barcode || "",          // Product_8_Barcode (AZ)
          order.products?.[7]?.price?.toFixed(2) || "", // Product_8_Price (BA)
          order.products?.[7]?.quantity || "",         // Product_8_Quantity (BB)
          order.products?.[8]?.name || "",             // Product_9_Name (BC)
          order.products?.[8]?.barcode || "",          // Product_9_Barcode (BD)
          order.products?.[8]?.price?.toFixed(2) || "", // Product_9_Price (BE)
          order.products?.[8]?.quantity || "",         // Product_9_Quantity (BF)
          order.products?.[9]?.name || "",             // Product_10_Name (BG)
          order.products?.[9]?.barcode || "",          // Product_10_Barcode (BH)
          order.products?.[9]?.price?.toFixed(2) || "", // Product_10_Price (BI)
          order.products?.[9]?.quantity || "",         // Product_10_Quantity (BJ)
          "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 
          "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",  // payment_link through Shipping_Address_ZIP
        ],
      ]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:BN",  // Updated range to cover all columns in new structure
        valueInputOption: "RAW",
        requestBody: { values },
      })

      return orderId
    } catch (error) {
      console.error("Error adding new order:", error)
      throw error
    }
  }

  async generateCustomerId(customerName: string, email: string): Promise<string> {
    // First, check if customer already exists in Customers sheet
    try {
      const customers = await this.getCustomersData()
      const existingCustomer = customers.find((customer) => customer.email.toLowerCase() === email.toLowerCase())
      
      if (existingCustomer) {
        console.log(`Found existing customer: ${existingCustomer.customer_id} for email: ${email}`)
        return existingCustomer.customer_id
      }
    } catch (error) {
      console.log("Could not check Customers sheet, falling back to Orders sheet")
    }

    // Fallback: Check if customer already exists in Orders
    const orders = await this.getOrdersData()
    const existingOrder = orders.find((order) => order.customerEmail.toLowerCase() === email.toLowerCase())

    if (existingOrder) {
      console.log(`Found existing order with customer: ${existingOrder.customerId} for email: ${email}`)
      return existingOrder.customerId
    }

    // Generate new sequential customer ID (777001, 777002, etc.)
    try {
      const customers = await this.getCustomersData()
      
      // Find the highest existing customer ID number
      let maxNumber = 777000 // Start from 777000 as base
      
      customers.forEach(customer => {
        const customerId = customer.customer_id
        // Check if it's a numeric ID (like 777001, 777002, etc.)
        if (customerId && /^\d{6}$/.test(customerId)) {
          const number = parseInt(customerId)
          if (number > maxNumber) {
            maxNumber = number
          }
        }
      })
      
      // Generate next sequential number
      const nextNumber = maxNumber + 1
      const newCustomerId = nextNumber.toString()
      
      console.log(`Generated new sequential customer ID: ${newCustomerId} for email: ${email}`)
      return newCustomerId
    } catch (error) {
      console.error("Error generating sequential customer ID, falling back to timestamp method:", error)
      
      // Fallback to timestamp method if sequential generation fails
      const timestamp = Date.now().toString(36)
      const random = Math.random().toString(36).substr(2, 5)
      const fallbackCustomerId = `CUST-${timestamp}-${random}`.toUpperCase()
      console.log(`Generated fallback customer ID: ${fallbackCustomerId} for email: ${email}`)
      return fallbackCustomerId
    }
  }

  async getCustomersData(): Promise<Customer[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Customers!A:AA", // Based on your actual sheet structure
      })
      const rows = response.data.values || []
      if (rows.length === 0) return []
      // Skip header row
      const dataRows = rows.slice(1)
      return dataRows.map((row): Customer & { addressStreet?: string, addressStreet2?: string, addressCity?: string, addressState?: string, addressZip?: string } => ({
        customer_id: row[0]?.trim() || "",
        name: row[1]?.trim() || "",
        email: row[2]?.trim() || "",
        phone: row[3]?.trim() || "",
        company: row[4]?.trim() || "",
        // Based on your CSV structure: Address fields are at F, G, H, I, J
        addressStreet: row[5]?.trim() || "", // Column F: Address_Street
        addressStreet2: row[6]?.trim() || "", // Column G: Address_Street_Line_2
        addressCity: row[7]?.trim() || "", // Column H: Address_City
        addressState: row[8]?.trim() || "", // Column I: Address_State
        addressZip: row[9]?.trim() || "", // Column J: Address_ZIP
        first_order_date: row[10]?.trim() || "",
        last_order_date: row[11]?.trim() || "",
        total_orders: row[12]?.trim() || "",
        total_spent: row[13]?.trim() || "",
        customer_status: row[14]?.trim() || "",
        preferred_contact: row[15]?.trim() || "",
        customer_notes: row[16]?.trim() || "",
        tags: row[17]?.trim() || "",
        created_date: row[18]?.trim() || "",
        last_updated: row[19]?.trim() || "",
        referred_by: row[20]?.trim() || "",
        customer_class: row[21]?.trim() || "",
        square_reference_id: row[22]?.trim() || "",
        nickname: row[23]?.trim() || "",
        birthday: row[24]?.trim() || "",
        square_customer_id: row[25]?.trim() || "",
        wix_contact_id: row[26]?.trim() || "",
        // Legacy address field - build from structured fields for backward compatibility
        address: [row[5], row[6], row[7], row[8], row[9]].filter(Boolean).join(", ") || "",
      }))
    } catch (error) {
      console.error("Error fetching customers data:", error)
      return []
    }
  }

  async getB2BRequestsData(): Promise<B2BRequest[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:BN", // Updated to match new structure
      })

      const rows = response.data.values || []
      if (rows.length === 0) return []

      // Skip header row
      const dataRows = rows.slice(1)

      // Filter for requests from last 60 days and B2B orders
      const sixtyDaysAgo = new Date()
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

      return dataRows
        .map((row): B2BRequest => ({
          id: row[1] || "", // Order_Code (column B)
          company: row[6] || "", // Business_Name (column G) - FIXED from F to G
          contact: row[3] || "", // Customer_Name (column D)
          email: row[5] || "", // Email (column F) - FIXED from E to F  
          phone: row[7] || "", // Phone (column H) - FIXED from G to H
          date: row[0] || "", // Submission_Timestamp (column A)
          status: row[19] || "", // Lifecycle_Stage (column T) - FIXED from S to T
          requestType: row[14] || "", // Order_Type (column O) - FIXED from N to O
          description: row[13] || "", // Special_Instructions (column N) - FIXED from M to N
          estimatedValue: Number.parseFloat(row[12]) || 0, // Total_Amount (column M) - FIXED from L to M
          priority: row[2] === 'B2B_ORDER' ? 'High' : 'Medium', // Based on Record_Type (column C)
        }))
        .filter(request => {
          // Filter for B2B orders and within last 60 days
          const requestDate = new Date(request.date)
          return requestDate >= sixtyDaysAgo && (request.requestType === 'B2B' || request.priority === 'High')
        })
    } catch (error) {
      console.error("Error fetching B2B requests data:", error)
      return []
    }
  }

  async getPurchasesData(): Promise<any[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.inventorySheetId,
        range: "Purchases!A:D", // Timestamp, Product Barcode, Quantity, Product
      })
      const rows = response.data.values || []
      if (rows.length === 0) return []
      const headers = rows[0]
      return rows.slice(1).map(row => {
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header] = row[i] || ""
        })
        return obj
      })
    } catch (error: any) {
      console.error("Error fetching purchases data:", error)
      return []
    }
  }

  async addPurchase({ barcode, quantity, timestamp }: { barcode: string, quantity: number, timestamp: string }): Promise<boolean> {
    try {
      const values = [[timestamp, barcode, quantity, ""]]
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.inventorySheetId,
        range: "Purchases!A:D",
        valueInputOption: "RAW",
        requestBody: { values },
      })
      return true
    } catch (error: any) {
      console.error("Error adding purchase:", error)
      return false
    }
  }

  async getSalesData(): Promise<any[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.inventorySheetId,
        range: "Sales!A:J", // Updated to cover all 10 columns: Timestamp, Product Barcode, Quantity, Product, customer_id, Customer_Name, Email, Order_Code, Wix_Order_Number, Wix_Contact_Id
      })
      const rows = response.data.values || []
      if (rows.length === 0) return []
      const headers = rows[0]
      return rows.slice(1).map(row => {
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header] = row[i] || ""
        })
        return obj
      })
    } catch (error: any) {
      console.error("Error fetching sales data:", error)
      return []
    }
  }

  async addSale({ 
    barcode, 
    quantity, 
    timestamp, 
    product = "", 
    customer_id = "", 
    order_code = "",
    customer_name = "",
    email = "",
    wix_order_number = "",
    wix_contact_id = ""
  }: { 
    barcode: string, 
    quantity: number, 
    timestamp: string, 
    product?: string, 
    customer_id?: string, 
    order_code?: string,
    customer_name?: string,
    email?: string,
    wix_order_number?: string,
    wix_contact_id?: string
  }): Promise<boolean> {
    try {
      // Updated to match the new Sales sheet structure with all columns
      const values = [[
        timestamp, 
        barcode, 
        quantity, 
        product, 
        customer_id, 
        customer_name, 
        email, 
        order_code, 
        wix_order_number, 
        wix_contact_id
      ]]
      
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.inventorySheetId,
        range: "Sales!A:J", // Updated to cover all 10 columns
        valueInputOption: "RAW",
        requestBody: { values },
      })
      return true
    } catch (error: any) {
      console.error("Error adding sale:", error)
      return false
    }
  }

  async updateInvoiceStatus(orderCode: string, invoiceStatus: string): Promise<boolean> {
    try {
      console.log(`Updating invoice status for order ${orderCode} to ${invoiceStatus}`)
      
      // Get all orders data to find the row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:BN", // Updated to match new structure
      })

      const rows = response.data.values || []
      if (rows.length === 0) {
        console.error("No data found in Orders sheet")
        return false
      }

      // Find the row with the matching order code (Order_Code is in column B, index 1)
      const headerRow = rows[0]
      const dataRows = rows.slice(1)
      const orderRowIndex = dataRows.findIndex(row => row[1] === orderCode) // Column B (index 1) is Order_Code

      if (orderRowIndex === -1) {
        console.error(`Order not found: ${orderCode}`)
        return false
      }

      // Calculate the actual row number (add 2 to account for header row and 0-based index)
      const actualRowNumber = orderRowIndex + 2

      // Update Invoice_Status column (column T, which is index 19)
      const updateRange = `Orders!T${actualRowNumber}`
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: updateRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [[invoiceStatus]]
        }
      })

      // Also update the Last_Updated column (column V, which is index 21)
      const lastUpdatedRange = `Orders!V${actualRowNumber}`
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: lastUpdatedRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [[new Date().toISOString()]]
        }
      })

      console.log(`Successfully updated invoice status for order ${orderCode} to ${invoiceStatus}`)
      return true
    } catch (error) {
      console.error("Error updating invoice status:", error)
      return false
    }
  }

  async updatePaymentStatus(orderCode: string, paymentStatus: string): Promise<boolean> {
    try {
      console.log(`Updating payment status for order ${orderCode} to ${paymentStatus}`)
      
      // Get all orders data to find the row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:BN",
      })

      const rows = response.data.values || []
      if (rows.length === 0) {
        console.error("No data found in Orders sheet")
        return false
      }

      // Find the row with the matching order code (Order_Code is in column B, index 1)
      const headerRow = rows[0]
      const dataRows = rows.slice(1)
      const orderRowIndex = dataRows.findIndex(row => row[1] === orderCode)

      if (orderRowIndex === -1) {
        console.error(`Order not found: ${orderCode}`)
        return false
      }

      // Calculate the actual row number (add 2 to account for header row and 0-based index)
      const actualRowNumber = orderRowIndex + 2

      // Update Payment_Status column (column R, which is index 17)
      const updateRange = `Orders!R${actualRowNumber}`
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: updateRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [[paymentStatus]]
        }
      })

      // Also update the Last_Updated column (column V, which is index 21)
      const lastUpdatedRange = `Orders!V${actualRowNumber}`
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: lastUpdatedRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [[new Date().toISOString()]]
        }
      })

      console.log(`Successfully updated payment status for order ${orderCode} to ${paymentStatus}`)
      return true
    } catch (error) {
      console.error("Error updating payment status:", error)
      return false
    }
  }

  async updateInvoiceStatusWithLink(orderCode: string, invoiceLink: string): Promise<boolean> {
    try {
      console.log(`Updating invoice link for order ${orderCode} to ${invoiceLink}`)
      
      // Get all orders data to find the row
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:BN",
      })

      const rows = response.data.values || []
      if (rows.length === 0) {
        console.error("No data found in Orders sheet")
        return false
      }

      // Find the row with the matching order code (Order_Code is in column B, index 1)
      const headerRow = rows[0]
      const dataRows = rows.slice(1)
      const orderRowIndex = dataRows.findIndex(row => row[1] === orderCode)

      if (orderRowIndex === -1) {
        console.error(`Order not found: ${orderCode}`)
        return false
      }

      // Calculate the actual row number (add 2 to account for header row and 0-based index)
      const actualRowNumber = orderRowIndex + 2

      // Update Invoice_Status column (column T, which is index 19) to "SENT"
      const statusUpdateRange = `Orders!T${actualRowNumber}`
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: statusUpdateRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [[invoiceLink]]
        }
      })

      // Also update the Last_Updated column (column V, which is index 21)
      const lastUpdatedRange = `Orders!V${actualRowNumber}`
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: lastUpdatedRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [[new Date().toISOString()]]
        }
      })

      console.log(`Successfully updated invoice link for order ${orderCode} to ${invoiceLink}`)
      return true
    } catch (error) {
      console.error("Error updating invoice link:", error)
      return false
    }
  }

  async getCustomerOrderHistory(customerId: string): Promise<OrderCustomer[]> {
    try {
      console.log(`Fetching order history for customer: ${customerId}`);
      
      // Try Archived Orders sheet first
      let response;
      let isArchivedOrders = false;
      try {
        response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "Archived Orders!A:BM",
        });
        isArchivedOrders = true;
        console.log("Using Archived Orders sheet for customer order history");
      } catch (archiveError) {
        // Fallback to Orders sheet
        console.log("Archived Orders not found, using Orders sheet");
        response = await this.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
          range: "Orders!A:BN",
        });
        isArchivedOrders = false;
      }

      const rows = response.data.values || [];
      if (rows.length === 0) {
        console.log("No data found in sheet");
        return [];
      }

      // Header-based mapping
      const header = rows[0];
      const headerMap: Record<string, number> = {};
      header.forEach((col, idx) => { headerMap[col.trim()] = idx });
      const dataRows = rows.slice(1);
      console.log(`Processing ${dataRows.length} total rows`);

      // Filter and map orders for this specific customer
      const customerOrders = dataRows
        .filter(row => {
          // Pad row to header length
          const paddedRow = [...row];
          while (paddedRow.length < header.length) paddedRow.push("");
          
          const orderCustomerId = (paddedRow[headerMap["customer_id"]] || "").toString().trim();
          return orderCustomerId === customerId.trim();
        })
        .map((row): OrderCustomer => {
          // Pad row to header length
          const paddedRow = [...row];
          while (paddedRow.length < header.length) paddedRow.push("");
          
          // Product details (use header-based indices)
          const products = [];
          for (let i = headerMap["Product_1_Name"]; i <= headerMap["Product_10_Quantity"]; i += 4) {
            if (paddedRow[i] && paddedRow[i].trim() !== "") {
              products.push({
                name: paddedRow[i] || "",
                barcode: paddedRow[i + 1] || "",
                price: parseFloat(paddedRow[i + 2] || "0"),
                quantity: parseInt(paddedRow[i + 3] || "0"),
              });
            }
          }
          
          // Customer info (header-based)
          const customerName = paddedRow[headerMap["customer_name"]] || paddedRow[headerMap["Customer_Name"]] || "";
          const customerEmail = paddedRow[headerMap["customer_email"]] || paddedRow[headerMap["Email"]] || "";
          const customerPhone = paddedRow[headerMap["customer_phone"]] || paddedRow[headerMap["Phone"]] || "";
          const businessName = paddedRow[headerMap["Business_Name"]] || "";
          
          return {
            orderId: paddedRow[headerMap["Order_Code"]] || "",
            customerId: customerId,
            customerName: customerName,
            customerEmail: customerEmail,
            orderDate: paddedRow[headerMap["Submission_Timestamp"]] || "",
            status: paddedRow[headerMap["Fulfillment_Status"]] || "",
            invoiceStatus: paddedRow[headerMap["Invoice_Status"]] || "",
            paymentStatus: paddedRow[headerMap["Payment_Status"]] || "",
            total: parseFloat((paddedRow[headerMap["Total_Amount"]] || "0").toString().replace(/[^0-9.]/g, "")),
            items: products.map(p => p.name).join(", "),
            notes: paddedRow[headerMap["Special_Instructions"]] || "",
            invoice_link: paddedRow[headerMap["invoice_link"]] || "",
            payment_link: paddedRow[headerMap["payment_link"]] || "",
            customer_id: customerId,
            businessName: businessName,
            phone: customerPhone,
            addressStreet: paddedRow[headerMap["Address_Street"]] || "",
            addressCity: paddedRow[headerMap["Address_City"]] || "",
            addressState: paddedRow[headerMap["Address_State"]] || "",
            addressZIP: paddedRow[headerMap["Address_ZIP"]] || "",
            products: products,
          };
        });

      console.log(`Found ${customerOrders.length} orders for customer ${customerId}`);
      return customerOrders;

    } catch (error) {
      console.error("Error fetching customer order history:", error);
      return [];
    }
  }

  async appendToArchivedOrders(order: OrderCustomer): Promise<void> {
    // Get header for Archived Orders - using range that matches Orders sheet structure
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Archived Orders!A:BN',
    });
    const header = response.data.values?.[0] || [];
    // Map order fields to row
    const row: any[] = header.map((col: string) => {
      // Try to match by header name (case-insensitive)
      const key = Object.keys(order).find(k => k.toLowerCase() === col.trim().toLowerCase());
      return key ? (order as any)[key] : '';
    });
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Archived Orders!A:BN',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
  }

  async deleteOrderFromOrdersSheet(orderId: string): Promise<void> {
    // Get all orders
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
              range: 'Orders!A:BN',
    });
    const rows = response.data.values || [];
    const header = rows[0];
    const orderIdCol = header.findIndex((col: string) => col.trim() === 'Order_Code');
    const rowIndex = rows.findIndex((row, idx) => idx > 0 && row[orderIdCol] === orderId);
    if (rowIndex === -1) return;
    // Delete the row (rowIndex is 0-based, add 1 for 1-based, add 1 for header)
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Orders sheet is usually the first, adjust if needed
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });
  }

    async addCustomer(customerData: Customer & { addressStreet?: string, addressStreet2?: string, addressCity?: string, addressState?: string, addressZIP?: string }): Promise<boolean> {
    try {
      // Prepare the row data to match your actual Customers sheet structure
      const values = [[
        customerData.customer_id,
        customerData.name,
        customerData.email,
        customerData.phone,
        customerData.company,
        // Structured address fields (columns F, G, H, I, J based on your CSV)
        customerData.addressStreet || "",
        customerData.addressStreet2 || "", // Street Address Line 2
        customerData.addressCity || "",
        customerData.addressState || "",
        customerData.addressZIP || "",
        customerData.first_order_date,
        customerData.last_order_date,
        customerData.total_orders,
        customerData.total_spent,
        customerData.customer_status,
        customerData.preferred_contact,
        customerData.customer_notes,
        customerData.tags,
        customerData.created_date,
        customerData.last_updated,
        customerData.referred_by,
        customerData.customer_class,
        customerData.square_reference_id,
        customerData.nickname,
        customerData.birthday,
        customerData.square_customer_id,
        customerData.wix_contact_id
      ]]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: "Customers!A:AA", // Based on your actual sheet structure
        valueInputOption: "RAW",
        requestBody: { values },
      })

      console.log(`Successfully added customer: ${customerData.customer_id}`)
      return true
    } catch (error) {
      console.error("Error adding customer:", error)
      return false
    }
  }
}

// Function to determine unified order status based on sheet data
export function getUnifiedOrderStatus(order: OrderCustomer): string {
  // Check if it's a new order (no invoice link and no payment status)
  if (!order.invoice_link && !order.paymentStatus) {
    return "NEW"
  }
  
  // Check if invoice has been sent (invoice_link exists)
  if (order.invoice_link && !order.paymentStatus) {
    return "INVOICE SENT"
  }
  
  // Check if invoice is overdue
  if (order.invoiceStatus === "OVERDUE") {
    return "Invoice Overdue"
  }
  
  // Check if payment has been received (payment timestamp exists)
  if (order.paymentStatus && order.paymentStatus !== "PENDING") {
    return "Paid-Ready to Ship"
  }
  
  // Default fallback
  return "NEW"
}

export const googleSheetsService = new GoogleSheetsService()
