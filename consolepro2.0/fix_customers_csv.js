const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, 'Order Tracking Sheet - Customers.csv');
const OUTPUT = path.join(__dirname, 'Order Tracking Sheet - Customers.fixed.csv');

// Read the CSV file
const lines = fs.readFileSync(INPUT, 'utf8').split(/\r?\n/);
if (lines.length === 0) {
  console.error('CSV file is empty!');
  process.exit(1);
}

const header = lines[0];
const numColumns = header.split(',').length;

const fixedLines = [header];
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue; // skip empty lines
  const cols = lines[i].split(',');
  while (cols.length < numColumns) {
    cols.push('');
  }
  // Optionally, trim extra columns if any
  while (cols.length > numColumns) {
    cols.pop();
  }
  fixedLines.push(cols.join(','));
}

fs.writeFileSync(OUTPUT, fixedLines.join('\n'), 'utf8');
console.log(`Fixed CSV written to: ${OUTPUT}`); 