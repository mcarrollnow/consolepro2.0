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
  total: number
  items: string
  notes: string
  invoice_link?: string
  payment_link?: string
  customer_id?: string
  // Additional fields for detailed order view
  businessName?: string
  phone?: string
  addressStreet?: string
  addressCity?: string
  addressState?: string
  addressZIP?: string
  // Product details
  products?: Array<{
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
        range: "Orders!A:BM", // Active orders only
      })

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

        // Product details (use header-based indices)
        const products = []
        for (let i = headerMap["Product_1_Name"]; i <= headerMap["Product_10_Quantity"]; i += 4) {
          if (paddedRow[i] && paddedRow[i].trim() !== "") {
            products.push({
              name: paddedRow[i] || "",
              barcode: paddedRow[i + 1] || "",
              price: parseFloat(paddedRow[i + 2] || "0"),
              quantity: parseInt(paddedRow[i + 3] || "0"),
            })
          }
        }
        
        // Customer info (header-based)
        const customerName = paddedRow[headerMap["customer_name"]] || paddedRow[headerMap["Customer_Name"]] || ""
        const customerEmail = paddedRow[headerMap["customer_email"]] || paddedRow[headerMap["Email"]] || ""
        const customerPhone = paddedRow[headerMap["customer_phone"]] || paddedRow[headerMap["Phone"]] || ""
        const businessName = paddedRow[headerMap["Business_Name"]] || ""
        const customer_id = paddedRow[headerMap["customer_id"]] || ""

        return {
          orderId: paddedRow[headerMap["Order_Code"]] || "",
          customerId: customer_id,
          customerName: customerName,
          customerEmail: customerEmail,
          orderDate: paddedRow[headerMap["Submission_Timestamp"]] || "",
          status: paddedRow[headerMap["Fulfillment_Status"]] || "",
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
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching active orders data:", error.message, error.stack);
      } else {
        console.error("Error fetching active orders data:", error);
      }
      return [];
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
          range: "Orders!A:BM",
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

        // Customer info (header-based)
        let customerName, customerEmail, customerPhone, businessName
        // For archived orders, use lowercase header names
        customerName = paddedRow[headerMap["customer_name"]] || paddedRow[headerMap["Customer_Name"]] || ""
        customerEmail = paddedRow[headerMap["customer_email"]] || paddedRow[headerMap["Email"]] || ""
        customerPhone = paddedRow[headerMap["customer_phone"]] || paddedRow[headerMap["Phone"]] || ""
        businessName = paddedRow[headerMap["Business_Name"]] || ""

        const customer_id = paddedRow[headerMap["customer_id"]] || ""

        return {
          orderId: paddedRow[headerMap["Order_Code"]] || "",
          customerId: customer_id,
          customerName: customerName,
          customerEmail: customerEmail,
          orderDate: paddedRow[headerMap["Submission_Timestamp"]] || "",
          status: paddedRow[headerMap["Fulfillment_Status"]] || "",
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

  async addNewOrder(order: Omit<OrderCustomer, "orderId">): Promise<string> {
    try {
      // Generate new order ID
      const orderId = `ORD-${Date.now()}`

      const values = [
        [
          orderId,
          order.customerId,
          order.customerName,
          order.customerEmail,
          order.orderDate,
          order.status,
          order.total,
          order.items,
          order.notes,
        ],
      ]

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:I",
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
    // Use email as customer_id
    // Clean the email to make it URL-safe and remove special characters
    const cleanEmail = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '').replace(/[^a-z0-9._-]/g, '_')
    return cleanEmail
  }

  async getCustomersData(): Promise<Customer[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Customers!A:W", // 23 columns (A-W) - now includes wix_contact_id
      })
      const rows = response.data.values || []
      if (rows.length === 0) return []
      // Skip header row
      const dataRows = rows.slice(1)
      return dataRows.map((row): Customer => ({
        customer_id: row[0]?.trim() || "",
        name: row[1]?.trim() || "",
        email: row[2]?.trim() || "",
        phone: row[3]?.trim() || "",
        company: row[4]?.trim() || "",
        address: row[5]?.trim() || "",
        first_order_date: row[6]?.trim() || "",
        last_order_date: row[7]?.trim() || "",
        total_orders: row[8]?.trim() || "",
        total_spent: row[9]?.trim() || "",
        customer_status: row[10]?.trim() || "",
        preferred_contact: row[11]?.trim() || "",
        customer_notes: row[12]?.trim() || "",
        tags: row[13]?.trim() || "",
        created_date: row[14]?.trim() || "",
        last_updated: row[15]?.trim() || "",
        referred_by: row[16]?.trim() || "",
        customer_class: row[17]?.trim() || "",
        square_reference_id: row[18]?.trim() || "",
        nickname: row[19]?.trim() || "",
        birthday: row[20]?.trim() || "",
        square_customer_id: row[21]?.trim() || "",
        wix_contact_id: row[22]?.trim() || "",
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
        range: "Orders!A:T", // Match the actual Orders sheet structure
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
          company: row[5] || "", // Business_Name (column F)
          contact: row[3] || "", // Customer_Name (column D)
          email: row[4] || "", // Email (column E)
          phone: row[6] || "", // Phone (column G)
          date: row[0] || "", // Submission_Timestamp (column A)
          status: row[18] || "", // Lifecycle_Stage (column S)
          requestType: row[13] || "", // Order_Type (column N)
          description: row[12] || "", // Special_Instructions (column M)
          estimatedValue: Number.parseFloat(row[11]) || 0, // Total_Amount (column L)
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
        range: "Sales!A:F", // Timestamp, Product Barcode, Quantity, Product, customer_id, Order_Code
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

  async addSale({ barcode, quantity, timestamp, product = "", customer_id = "", order_code = "" }: { barcode: string, quantity: number, timestamp: string, product?: string, customer_id?: string, order_code?: string }): Promise<boolean> {
    try {
      const values = [[timestamp, barcode, quantity, product, customer_id, order_code]]
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.inventorySheetId,
        range: "Sales!A:F",
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
        range: "Orders!A:BH", // Covers all columns
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

      // Update Invoice_Status column (column R, which is index 17)
      const updateRange = `Orders!R${actualRowNumber}`
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: updateRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [[invoiceStatus]]
        }
      })

      // Also update the Last_Updated column (column T, which is index 19)
      const lastUpdatedRange = `Orders!T${actualRowNumber}`
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
          range: "Orders!A:BM",
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
    // Get header for Archived Orders
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Archived Orders!A:BM',
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
      range: 'Archived Orders!A:BM',
      valueInputOption: 'RAW',
      requestBody: { values: [row] },
    });
  }

  async deleteOrderFromOrdersSheet(orderId: string): Promise<void> {
    // Get all orders
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Orders!A:BM',
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
}

export const googleSheetsService = new GoogleSheetsService()
