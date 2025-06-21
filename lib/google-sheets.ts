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

class GoogleSheetsService {
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
    } catch (error) {
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

  async getOrdersData(): Promise<OrderCustomer[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Orders!A:BH", // Covers all columns
      })

      const rows = response.data.values || []
      if (rows.length === 0) return []

      // Skip header row
      const dataRows = rows.slice(1)

      return dataRows.map((row): OrderCustomer => {
        // Concatenate all product names (Product_1_Name at 20, Product_2_Name at 24, ... up to Product_10_Name at 56)
        const productNames = []
        for (let i = 20; i <= 56; i += 4) {
          if (row[i] && row[i].trim() !== "") productNames.push(row[i])
        }
        return {
          orderId: row[1] || "", // Order_Code
          customerId: "", // Not available in this sheet
          customerName: row[3] || "", // Customer_Name
          customerEmail: row[4] || "", // Email
          orderDate: row[0] || "", // Submission_Timestamp
          status: row[17] || "", // Fulfillment_Status (or change to another if preferred)
          total: parseFloat((row[11] || "0").replace(/[^0-9.]/g, "")), // Total_Amount
          items: productNames.join(", "),
          notes: row[12] || "", // Special_Instructions
          invoice_link: row[60] || "", // invoice_link
          payment_link: row[59] || "", // payment_link
        }
      })
    } catch (error) {
      console.error("Error fetching orders data:", error)
      return []
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
    // Check if customer already exists
    const orders = await this.getOrdersData()
    const existingCustomer = orders.find((order) => order.customerEmail.toLowerCase() === email.toLowerCase())

    if (existingCustomer) {
      return existingCustomer.customerId
    }

    // Generate new customer ID
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `CUST-${timestamp}-${random}`.toUpperCase()
  }

  async getCustomersData(): Promise<Customer[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: "Customers!A:V", // 22 columns (A-V)
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
}

export const googleSheetsService = new GoogleSheetsService()
