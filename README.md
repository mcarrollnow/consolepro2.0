# ConsolePro 2.0 Dashboard

A modern business management dashboard with Google Sheets integration and AI-powered insights.

## Features

- **Daily Overview**: AI-generated daily business intelligence with peptide research insights
- **Inventory Management**: Track stock levels, categories, and product information
- **Order Management**: Manage active and archived orders with detailed tracking
- **Customer Management**: Customer profiles with order history
- **AI Assistant**: Ask questions about your business data using Claude AI
- **Analytics**: Business insights and reporting
- **Real-time Updates**: Live data from Google Sheets
- **Scheduled Reports**: Automated daily overview generation

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
INVENTORY_SHEET_ID=your_inventory_sheet_id

# AI Integration (Claude API)
CLAUDE_API_KEY=your_claude_api_key

# Daily Overview & Scheduling (Optional)
CRON_SECRET=your_cron_secret_key
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Getting Your Claude API Key

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add it to your `.env.local` file

## AI Assistant

The AI assistant can help you with:

- **Inventory Questions**: "Show me low stock items", "What products are in the Electronics category?"
- **Order Analysis**: "What are my recent orders?", "How much revenue did I make this month?"
- **Customer Insights**: "Find customer John Smith", "Who are my top customers?"
- **Business Recommendations**: "What should I restock?", "Which products are selling best?"

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Google Sheets Setup

The dashboard expects the following sheets in your Google Spreadsheet:

- **Inventory**: Product catalog with stock levels
- **Orders**: Active orders
- **Archived Orders**: Completed orders
- **Customers**: Customer database
- **Purchases**: Stock purchases
- **Sales**: Product sales

## Daily Overview

The Daily Overview section provides:

- **Pending Orders Summary**: Orders that need attention
- **Invoice Tracking**: Orders requiring invoice generation
- **30-Day Revenue Analysis**: Financial performance insights
- **AI-Generated Insights**: Business recommendations and peptide product suggestions

The overview is automatically generated using your business data and Claude AI for intelligent analysis.

## Scheduled Daily Overview

To set up automated daily overview generation:

### Option 1: Vercel Cron (Recommended)
Add this to your `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-overview",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Option 2: GitHub Actions
Create `.github/workflows/daily-overview.yml`:
```yaml
name: Daily Overview
on:
  schedule:
    - cron: '0 9 * * *'
jobs:
  daily-overview:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Daily Overview
        run: |
          curl -X POST https://your-domain.com/api/cron/daily-overview \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option 3: External Cron Service
Use services like cron-job.org or EasyCron to call:
```
POST https://your-domain.com/api/cron/daily-overview
Authorization: Bearer your_cron_secret
```

## AI Chat Usage

The AI assistant is located at the top of the Inventory section. Simply type your question and get instant insights about your business data. The AI has access to your inventory, orders, and customer data to provide relevant answers.

## Contributing

This is a private project for business management. For questions or issues, please contact the development team. 