import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const NORMALIZED_CSV = path.join(__dirname, 'historical_data_normalized.csv');
const ORDER_TEMPLATE_CSV = path.join(__dirname, 'Order Tracking - Orders.csv');
const OUTPUT_CSV = path.join(__dirname, 'orders_generated_from_normalized.csv');

// Read template to get header
const templateRaw = fs.readFileSync(ORDER_TEMPLATE_CSV, 'utf8');
const [headerLine] = templateRaw.split(/\r?\n/);
const header = headerLine.split(',');

// Ensure 'customer_id' is in the header
if (!header.includes('customer_id')) {
  header.push('customer_id');
}

// Read normalized data
const normalizedRaw = fs.readFileSync(NORMALIZED_CSV, 'utf8');
const normalizedRecords = parse(normalizedRaw, { columns: true, skip_empty_lines: true });

const outputRows = [header];

normalizedRecords.forEach((row: any) => {
  const order: any = {};
  header.forEach((col: string) => order[col] = '');
  order['Submission_Timestamp'] = row.date || '';
  order['Customer_Name'] = row.customer_name || '';
  order['Email'] = row.email || '';
  order['Order_Code'] = row.order_code || '';
  order['Total_Amount'] = row.sales || '';
  order['Product_1_Name'] = row.product || '';
  order['Product_1_Barcode'] = row.barcode || '';
  order['Product_1_Quantity'] = row.quantity || '';
  order['Product_1_Price'] = row.sales || '';
  // Always set customer_id
  order['customer_id'] = row.customer_id || '';
  outputRows.push(header.map(col => order[col]));
});

const csvOut = stringify(outputRows, { header: false });
fs.writeFileSync(OUTPUT_CSV, csvOut);
console.log('Generated orders CSV at', OUTPUT_CSV); 