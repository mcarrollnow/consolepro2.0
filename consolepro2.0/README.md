# ConsolePro 2.0 Dashboard

A modern business management dashboard with Google Sheets integration and **deep AI-powered insights** using Anthropic's Claude.

## 🚀 Enhanced AI Features

### **AI Assistant (Geoffrey)**
Your intelligent business butler powered by Claude AI, capable of:

- **Natural Language Queries**: Ask questions about inventory, orders, customers, and business performance
- **Discount Code Management**: Analyze existing codes and create new ones based on business data
- **Action Execution**: Generate Stripe invoices, update order statuses, and perform console operations
- **Context-Aware Responses**: Understands your business data and provides personalized insights

### **AI-Powered Insights Widgets**

#### **Inventory Intelligence**
- **Stock Level Analysis**: AI identifies items needing restocking and overstocked products
- **Demand Forecasting**: Predicts which products will be in high demand
- **Cost Optimization**: Suggests pricing strategies and bulk purchase opportunities
- **Product Performance**: Identifies best/worst performing products and discontinuation candidates

#### **Customer Intelligence**
- **Customer Segmentation**: AI identifies VIP customers and at-risk customers
- **Lifetime Value Analysis**: Calculates CLV and suggests retention strategies
- **Purchase Behavior Analysis**: Identifies buying patterns and cross-selling opportunities
- **Predictive Analytics**: Forecasts customer churn and optimal re-engagement timing

#### **Business Analytics**
- **Revenue Analysis**: Monthly, quarterly, and annual trends with projections
- **Sales Performance**: Top-performing products and conversion rate analysis
- **Operational Efficiency**: Order fulfillment times and supply chain optimization
- **Strategic Recommendations**: Growth opportunities and risk assessment

## Features

- **Daily Overview**: AI-generated daily business intelligence with peptide research insights
- **Inventory Management**: Track stock levels, categories, and product information with AI insights
- **Order Management**: Manage active and archived orders with detailed tracking and AI-powered actions
- **Customer Management**: Customer profiles with order history and AI-driven intelligence
- **AI Assistant**: Ask questions about your business data using Claude AI
- **Analytics**: Business insights and reporting with predictive analytics
- **Real-time Updates**: Live data from Google Sheets
- **Scheduled Reports**: Automated daily overview generation
- **Discount Code Management**: AI-powered analysis and creation of promotional codes
- **Action Execution**: AI can perform console operations like generating invoices

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

## AI Assistant Capabilities

### **Natural Language Queries**
The AI assistant can help you with:

- **Inventory Questions**: "Show me low stock items", "What products are in the Electronics category?"
- **Order Analysis**: "What are my recent orders?", "How much revenue did I make this month?"
- **Customer Insights**: "Find customer John Smith", "Who are my top customers?"
- **Business Recommendations**: "What should I restock?", "Which products are selling best?"

### **Discount Code Management**
- **Analyze Codes**: "Analyze my discount codes" - Get performance insights and optimization suggestions
- **Create Codes**: "Create new discount codes for VIP customers" - AI generates strategic promotional codes
- **Code Performance**: Understand which codes work best and why

### **Action Execution**
- **Generate Invoices**: "Generate invoice for order ABC123" - AI creates Stripe invoices automatically
- **Update Orders**: "Update status for order XYZ789" - AI suggests and executes status updates
- **Customer Communication**: "Send follow-up to customer DEF456" - AI generates appropriate messages

### **Advanced AI Features**
- **Context-Aware Responses**: AI understands your business context and provides personalized advice
- **Predictive Insights**: Forecasts trends and identifies opportunities before they happen
- **Automated Actions**: AI can execute console operations based on your requests
- **Multi-Modal Analysis**: Combines data from multiple sources for comprehensive insights

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
- **Discount Codes**: Promotional codes and usage tracking

## AI Integration Examples

### **Inventory Management**
```
User: "Which items need restocking?"
AI: "Based on your inventory data, I've identified 5 items that need immediate restocking:
1. Product A - Current stock: 15, Restock level: 50
2. Product B - Current stock: 8, Restock level: 25
..."

User: "Create a restocking plan for next month"
AI: "I'll analyze your sales trends and create a comprehensive restocking plan..."
```

### **Customer Intelligence**
```
User: "Who are my VIP customers?"
AI: "I've identified 12 VIP customers based on spending patterns and loyalty:
1. John Smith - Total spent: $2,450, Orders: 8, Last order: 2 weeks ago
2. Jane Doe - Total spent: $1,890, Orders: 5, Last order: 1 week ago
..."

User: "Which customers are at risk of churning?"
AI: "Based on purchase patterns, 3 customers haven't ordered in 60+ days..."
```

### **Business Analytics**
```
User: "What's my revenue projection for next quarter?"
AI: "Based on current trends and seasonal patterns, I project Q2 revenue of $285,000, 
representing 8.2% growth over Q1. Key factors include..."

User: "Which products should I discontinue?"
AI: "Analysis shows 3 products with declining sales and low margins..."
```

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

### **Example AI Commands**
- "Analyze my discount codes"
- "Create new discount codes for VIP customers"
- "Generate invoice for order ABC123"
- "Which items need restocking?"
- "Who are my top customers?"
- "What's my revenue trend this month?"
- "Suggest products to discontinue"

## Contributing

This project uses Next.js 14 with TypeScript, Tailwind CSS, and the Anthropic Claude API for AI capabilities.

## License

MIT License - see LICENSE file for details. 