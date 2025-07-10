import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CUSTOMERS_CSV = path.join(__dirname, 'Order Tracking - Customers.csv');
const PRODUCTS_CSV = path.join(__dirname, 'final app - Product.csv');
const SALES_CSV = path.join(__dirname, 'historical_data_normalized.csv');
const OUTPUT_CSV = path.join(__dirname, 'customer_product_matrix.csv');

// 1. Read products and build barcode->name map
const productRaw = fs.readFileSync(PRODUCTS_CSV, 'utf8');
const productRecords = parse(productRaw, { columns: true, skip_empty_lines: true });
const productList = productRecords.map((p: any) => ({
  barcode: p['Product Barcode'],
  name: p['Product'],
})).filter((p: any) => p.barcode && p.name);
const productColumns = productList.map((p: any) => `${p.barcode} (${p.name})`);
const barcodeToName: Record<string, string> = {};
productList.forEach((p: any) => { barcodeToName[p.barcode] = p.name; });

// 2. Read customers
const customerRaw = fs.readFileSync(CUSTOMERS_CSV, 'utf8');
const customerRecords = parse(customerRaw, { columns: true, skip_empty_lines: true });

// 3. Read sales
const salesRaw = fs.readFileSync(SALES_CSV, 'utf8');
const salesRecords = parse(salesRaw, { columns: true, skip_empty_lines: true });

// Build a map from square_customer_id to customer_id for fast lookup
const squareToCustomerId: Record<string, string> = {};
customerRecords.forEach((cust: any) => {
  if (cust.square_customer_id) {
    squareToCustomerId[cust.square_customer_id.trim()] = cust.customer_id;
  }
});

// 4. Build a map: customer_id -> { barcode -> quantity }
const customerProductMap: Record<string, Record<string, number>> = {};
salesRecords.forEach((sale: any) => {
  // Match using square_customer_id from customer DB and customer_id from sales
  const squareId = sale.customer_id ? sale.customer_id.trim() : '';
  const customerId = squareToCustomerId[squareId];
  if (!customerId) return;
  const saleBarcode = sale.barcode;
  if (!saleBarcode || !barcodeToName[saleBarcode]) return;
  if (!customerProductMap[customerId]) customerProductMap[customerId] = {};
  customerProductMap[customerId][saleBarcode] = (customerProductMap[customerId][saleBarcode] || 0) + Number(sale.quantity || 1);
});

// 5. Prepare output
const customerHeaders = Object.keys(customerRecords[0]);
const outputHeaders = [...customerHeaders, ...productColumns];
const outputRows = customerRecords.map((cust: any) => {
  const row: any = { ...cust };
  const customerId = cust.customer_id;
  for (const p of productList) {
    const col = `${p.barcode} (${p.name})`;
    row[col] = (customerProductMap[customerId] && customerProductMap[customerId][p.barcode]) || 0;
  }
  return row;
});

const output = stringify(outputRows, { header: true, columns: outputHeaders });
fs.writeFileSync(OUTPUT_CSV, output, 'utf8');
console.log(`Customer-product matrix written to ${OUTPUT_CSV}`); 