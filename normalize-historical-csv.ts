import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load product inventory from both locations for barcode and price matching
const productRaw1 = fs.readFileSync(path.join(__dirname, 'final app - Product.csv'), 'utf8');
const productRaw2 = fs.existsSync(path.join(__dirname, '../newpurchaseform/final app - Product.csv'))
  ? fs.readFileSync(path.join(__dirname, '../newpurchaseform/final app - Product.csv'), 'utf8')
  : '';
const productRecords1 = parse(productRaw1, { columns: true, skip_empty_lines: true });
const productRecords2 = productRaw2 ? parse(productRaw2, { columns: true, skip_empty_lines: true }) : [];
const allProductRecords = [...productRecords1, ...productRecords2];
const productList = allProductRecords.map((p: any) => ({
  barcode: p['Product Barcode'],
  name: (p['Product'] || '').toLowerCase().replace(/[-\s]+/g, ''),
  price: parseFloat((p['item.salePrice'] || p['item.salePrice_retail'] || p['item.costPrice'] || '').replace(/[^\d.]/g, '')),
})).filter((p: any) => p.barcode && p.name);

// Map of product keywords to normalized product names
const PRODUCT_KEYWORDS: { [key: string]: string } = {
  semaglutide: 'Semaglutide',
  tirzepatide: 'Tirzepatide',
  cagrilintide: 'Cagrilintide',
  retatrutide: 'Retatrutide',
  'pt 141': 'PT-141',
  'aod 9604': 'AOD 9604',
  motsc: 'MOTS-C',
  'mots-c': 'MOTS-C',
  supplies: 'Supplies',
  kit: 'Peptide Supplies Kit',
  'bacteriostatic water': 'Bacteriostatic Water',
  'medspa': 'Medspa Services',
  'custom amount': '', // Will be assigned by keyword matching or price
};

const INPUT_CSV = path.join(__dirname, 'historical data summary.csv');
const OUTPUT_CSV = path.join(__dirname, 'historical_data_normalized.csv');

// Load customer database for ID mapping
const customersRaw = fs.readFileSync(path.join(__dirname, 'Order Tracking - Customers.csv'), 'utf8');
const customerRecords = parse(customersRaw, { columns: true, skip_empty_lines: true });
// Build a map from customer name (and optionally email/phone) to customer_id
const nameToCustomerId: Record<string, string> = {};
customerRecords.forEach((cust: any) => {
  if (cust.name) {
    nameToCustomerId[cust.name.trim().toLowerCase()] = cust.customer_id;
  }
});

function normalizeProduct(item: string, notes: string, details: string): { product: string, variant: string } {
  let lower = (item || '').toLowerCase();
  let variant = '';
  let product = '';

  // Try direct match
  for (const key in PRODUCT_KEYWORDS) {
    if (lower.includes(key)) {
      product = PRODUCT_KEYWORDS[key];
      break;
    }
  }

  // If still not found, try notes/details
  if (!product) {
    const text = ((notes || '') + ' ' + (details || '')).toLowerCase();
    for (const key in PRODUCT_KEYWORDS) {
      if (text.includes(key)) {
        product = PRODUCT_KEYWORDS[key];
        break;
      }
    }
  }

  // If still not found, fallback to item
  if (!product && lower && lower !== 'custom amount') {
    product = item;
  }

  // Extract variant (e.g., 2mg, 5mg, 10mg, 30mg)
  const variantMatch = lower.match(/(\d+mg)/);
  if (variantMatch) {
    variant = variantMatch[1];
  } else {
    // Try to find variant in item string
    const altMatch = item.match(/(\d+mg)/i);
    if (altMatch) variant = altMatch[1];
  }

  return { product, variant };
}

function parsePrice(priceStr: string): number {
  if (!priceStr) return NaN;
  const cleaned = priceStr.replace(/[^\d.\-]/g, '');
  return parseFloat(cleaned);
}

function computeAveragePrices(records: any[]): Record<string, number> {
  const priceSums: Record<string, number> = {};
  const priceCounts: Record<string, number> = {};
  for (const row of records) {
    const { product } = normalizeProduct(row.Item, row.Notes, row.Details);
    if (product && product !== 'Unknown' && row.Item && row.Item.toLowerCase() !== 'custom amount') {
      const price = parsePrice(row['Net Sales'] || row['Gross Sales']);
      if (!isNaN(price)) {
        priceSums[product] = (priceSums[product] || 0) + price;
        priceCounts[product] = (priceCounts[product] || 0) + 1;
      }
    }
  }
  const averages: Record<string, number> = {};
  for (const product in priceSums) {
    averages[product] = priceSums[product] / priceCounts[product];
  }
  return averages;
}

function findClosestProductByPrice(price: number, averages: Record<string, number>): string {
  let closestProduct = '';
  let minDiff = Infinity;
  for (const product in averages) {
    const diff = Math.abs(averages[product] - price);
    if (diff < minDiff) {
      minDiff = diff;
      closestProduct = product;
    }
  }
  return closestProduct;
}

function findBarcodeAndProduct(product: string, variant: string, price: number): { barcode: string, product: string } {
  const normalizedProduct = (product || '').toLowerCase().replace(/[-\s]+/g, '');
  const normalizedVariant = (variant || '').toLowerCase().replace(/[-\s]+/g, '');
  let combined = (normalizedProduct + normalizedVariant).replace(/[-\s]+/g, '');
  // Try to match combined product+variant to inventory
  for (const p of productList) {
    if (p.name === combined || p.name.includes(combined) || combined.includes(p.name)) {
      return { barcode: p.barcode, product: p.name };
    }
  }
  // If no match, try price-based matching
  if (!isNaN(price)) {
    let minDiff = Infinity;
    let bestMatch: any = null;
    for (const p of productList) {
      if (!isNaN(p.price)) {
        const diff = Math.abs(p.price - price);
        if (diff < minDiff) {
          minDiff = diff;
          bestMatch = p;
        }
      }
    }
    if (bestMatch) {
      return { barcode: bestMatch.barcode, product: bestMatch.name };
    }
  }
  // Fallback
  return { barcode: 'UNKNOWN', product };
}

function main() {
  const raw = fs.readFileSync(INPUT_CSV, 'utf8');
  const records = parse(raw, { columns: true, skip_empty_lines: true });

  // Compute average prices for labeled products
  const averagePrices = computeAveragePrices(records);

  const normalized = records.map((row: any) => {
    let { product, variant } = normalizeProduct(row.Item, row.Notes, row.Details);
    let finalProduct = product;
    const price = parsePrice(row['Net Sales'] || row['Gross Sales']);

    // For custom amount or ambiguous, try to assign product by notes/details, else by closest price
    if (
      (!finalProduct || finalProduct === '' || finalProduct === 'Unknown') &&
      row.Item && row.Item.toLowerCase() === 'custom amount'
    ) {
      const text = ((row.Notes || '') + ' ' + (row.Details || '')).toLowerCase();
      for (const key in PRODUCT_KEYWORDS) {
        if (text.includes(key)) {
          finalProduct = PRODUCT_KEYWORDS[key];
          break;
        }
      }
      if ((!finalProduct || finalProduct === '') && !isNaN(price)) {
        finalProduct = findClosestProductByPrice(price, computeAveragePrices(records)) || 'Unknown';
      }
    }
    if ((!finalProduct || finalProduct === '' || finalProduct === 'Unknown') && !isNaN(price)) {
      finalProduct = findClosestProductByPrice(price, computeAveragePrices(records)) || 'Unknown';
    }
    // Use improved barcode+product matching
    const { barcode, product: matchedProduct } = findBarcodeAndProduct(finalProduct, variant, price);
    const customer_name = row['Customer Name'] || row['customer_name'] || '';
    const customer_id = nameToCustomerId[customer_name.trim().toLowerCase()] || '';
    return {
      date: row.Date,
      barcode,
      product: matchedProduct || finalProduct || 'Unknown',
      variant,
      quantity: row.Qty || 1,
      customer_id,
      customer_name,
      order_code: row['Transaction ID'] || '',
      sales: price,
      category: row.Category || '',
      notes: row.Notes || row.Details || '',
    };
  });

  const output = stringify(normalized, {
    header: true,
    columns: ['date', 'barcode', 'product', 'variant', 'quantity', 'customer_id', 'customer_name', 'order_code', 'sales', 'category', 'notes'],
  });
  fs.writeFileSync(OUTPUT_CSV, output, 'utf8');
  console.log(`Normalized CSV written to ${OUTPUT_CSV}`);
}

main(); 