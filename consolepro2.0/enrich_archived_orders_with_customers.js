const fs = require('fs');
const parse = require('csv-parse/sync');
const stringify = require('csv-stringify/sync');

// 1. Read and parse the customers sheet
const customersCsv = fs.readFileSync('parse/Order Tracking Sheet - Customers.csv', 'utf8');
const customers = parse.parse(customersCsv, { columns: true });

// 2. Build a lookup map
const customerMap = {};
for (const cust of customers) {
  customerMap[cust.customer_id] = cust;
}

// 3. Read and parse the archived orders sheet
const ordersCsv = fs.readFileSync('parse/Order Tracking Sheet - Archived Orders.csv', 'utf8');
const orders = parse.parse(ordersCsv, { columns: true });

// 4. Attach customer info to each order
const enrichedOrders = orders.map(order => {
  const customer = customerMap[order.customer_id] || {};
  // Add desired customer fields to the order
  return {
    ...order,
    customer_name: customer.name || '',
    customer_email: customer.email || '',
    customer_phone: customer.phone || '',
    // Add more fields as needed
  };
});

// 5. Write to a new CSV
const outputCsv = stringify.stringify(enrichedOrders, { header: true });
fs.writeFileSync('parse/Order Tracking Sheet - Archived Orders.enriched.csv', outputCsv);

console.log('Enriched orders written to parse/Order Tracking Sheet - Archived Orders.enriched.csv'); 